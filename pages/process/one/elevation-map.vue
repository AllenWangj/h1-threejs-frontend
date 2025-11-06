<template>
  <div ref="container" class="w-full h-full relative">
    <!-- 加载进度提示 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <h3>{{ loadingText }}</h3>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: loadingProgress + '%' }"></div>
        </div>
        <p class="progress-text">{{ loadingProgress }}%</p>
      </div>
    </div>
    <!-- 地理标记信息面板 -->
    <div v-if="!loading && selectedArea" class="area-info-panel">
      <div class="info-header">
        <h3>{{ selectedArea.name }}</h3>
        <button class="close-btn" @click="selectedArea = null">×</button>
      </div>
      <div class="info-content">
        <div class="info-item">
          <span class="info-label">海拔高度：</span>
          <span class="info-value">{{ selectedArea.elevation }}m</span>
        </div>
        <div class="info-item">
          <span class="info-label">经纬度：</span>
          <span class="info-value">{{ selectedArea.lon.toFixed(4) }}°E, {{ selectedArea.lat.toFixed(4) }}°N</span>
        </div>
        <div class="info-item">
          <span class="info-label">区域半径：</span>
          <span class="info-value">{{ (selectedArea.radius * 10).toFixed(1) }} km</span>
        </div>
        <div class="info-item">
          <span class="info-label">世界坐标：</span>
          <span class="info-value">
            X: {{ selectedArea.worldPos.x.toFixed(2) }}, Y: {{ selectedArea.worldPos.y.toFixed(2) }}, Z:
            {{ selectedArea.worldPos.z.toFixed(2) }}
          </span>
        </div>
        <div class="info-item">
          <span class="info-label">描述：</span>
          <span class="info-value">{{ selectedArea.description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { fromArrayBuffer } from 'geotiff'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const props = defineProps<{
  demUrl: string
  demBounds: any
  satelliteUrl: string
}>()

const container = ref<HTMLElement | null>(null)
const loading = ref(true)
const loadingText = ref('正在初始化...')
const loadingProgress = ref(0)
const selectedArea = ref<any>(null)
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let animationId: number
let terrainMesh: THREE.Mesh
let areaMarkers: THREE.Group[] = []

const TERRAIN_SIZE = 8
const DEM_BOUNDS = computed(() => {
  return (
    props.demBounds || {
      lonMin: 106.2,
      lonMax: 106.3,
      latMin: 26.1,
      latMax: 26.2
    }
  )
})

// 加载DEM数据
async function loadDEM(url: string) {
  const resp = await fetch(url)
  const buffer = await resp.arrayBuffer()
  const tiff = await fromArrayBuffer(buffer)
  const image = await tiff.getImage()
  const raster = await image.readRasters({ interleave: true })
  return { raster, width: image.getWidth(), height: image.getHeight() }
}

// 获取最小/最大值
function getMinMax(array: any) {
  let min = Infinity,
    max = -Infinity
  for (let i = 0; i < array.length; i++) {
    const v = array[i]
    if (v < min) min = v
    if (v > max) max = v
  }
  return { min, max }
}

// 地理坐标转世界坐标
function geoToWorld(
  lon: number,
  lat: number,
  raster: Float32Array,
  width: number,
  height: number,
  min: number,
  max: number
) {
  const x = (lon - DEM_BOUNDS.value.lonMin) / (DEM_BOUNDS.value.lonMax - DEM_BOUNDS.value.lonMin)
  const y = (lat - DEM_BOUNDS.value.latMin) / (DEM_BOUNDS.value.latMax - DEM_BOUNDS.value.latMin)

  const worldX = (x - 0.5) * TERRAIN_SIZE
  const worldZ = (y - 0.5) * TERRAIN_SIZE

  // 获取该位置的高程
  const rasterX = Math.floor(x * (width - 1))
  const rasterY = Math.floor(y * (height - 1))
  const rasterIndex = rasterY * width + rasterX
  const elevation = raster[rasterIndex] || min
  const normalizedHeight = (elevation - min) / (max - min)
  const worldY = normalizedHeight * 1.0

  return { x: worldX, y: worldY, z: worldZ, elevation }
}

// 计算地形坡度（梯度）
function calculateSlope(raster: Float32Array, width: number, height: number, x: number, y: number): number {
  if (x <= 0 || x >= width - 1 || y <= 0 || y >= height - 1) {
    return Infinity // 边界区域返回无穷大
  }

  const index = y * width + x
  const current = raster[index]

  // 计算周围8个方向的高度差
  const diffs = [
    Math.abs(current - raster[(y - 1) * width + (x - 1)]), // 左上
    Math.abs(current - raster[(y - 1) * width + x]), // 上
    Math.abs(current - raster[(y - 1) * width + (x + 1)]), // 右上
    Math.abs(current - raster[y * width + (x - 1)]), // 左
    Math.abs(current - raster[y * width + (x + 1)]), // 右
    Math.abs(current - raster[(y + 1) * width + (x - 1)]), // 左下
    Math.abs(current - raster[(y + 1) * width + x]), // 下
    Math.abs(current - raster[(y + 1) * width + (x + 1)]) // 右下
  ]

  // 返回平均坡度
  return diffs.reduce((a, b) => a + b, 0) / diffs.length
}

// 计算区域的平均坡度和平坦度
function calculateAreaSlope(
  raster: Float32Array,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  radius: number
): { slope: number; variance: number } {
  let totalSlope = 0
  let count = 0
  const heights: number[] = []

  const radiusPixels = Math.floor(radius)

  for (let dy = -radiusPixels; dy <= radiusPixels; dy++) {
    for (let dx = -radiusPixels; dx <= radiusPixels; dx++) {
      // 只计算圆形范围内的点
      if (dx * dx + dy * dy <= radiusPixels * radiusPixels) {
        const x = centerX + dx
        const y = centerY + dy

        if (x > 0 && x < width - 1 && y > 0 && y < height - 1) {
          const slope = calculateSlope(raster, width, height, x, y)
          totalSlope += slope

          // 收集高度值用于计算方差
          const index = y * width + x
          heights.push(raster[index])

          count++
        }
      }
    }
  }

  if (count === 0) return { slope: Infinity, variance: Infinity }

  const avgSlope = totalSlope / count

  // 计算高度方差（用于判断区域是否真正平坦）
  const avgHeight = heights.reduce((a, b) => a + b, 0) / heights.length
  const variance = heights.reduce((sum, h) => sum + Math.pow(h - avgHeight, 2), 0) / heights.length

  return { slope: avgSlope, variance: Math.sqrt(variance) }
}

// 自动分析并推荐平缓的选址区域
function analyzeFlatAreas(
  raster: Float32Array,
  width: number,
  height: number,
  min: number,
  max: number,
  options: {
    minRadius?: number
    maxSlope?: number
    maxVariance?: number
    numRecommendations?: number
  } = {}
): Array<{
  centerX: number
  centerY: number
  lon: number
  lat: number
  elevation: number
  slope: number
  variance: number
  radius: number
  score: number
  worldPos: { x: number; y: number; z: number; elevation: number }
}> {
  const {
    minRadius = Math.floor(width * 0.08), // 默认8%宽度
    maxSlope = (max - min) * 0.03, // 最大坡度3%
    maxVariance = (max - min) * 0.02, // 最大高度方差2%
    numRecommendations = 1 // 只推荐1个最佳位置
  } = options

  console.log('开始分析地形平缓区域...')
  console.log(`参数: 最小半径=${minRadius}像素, 最大坡度=${maxSlope.toFixed(2)}m, 最大方差=${maxVariance.toFixed(2)}m`)

  const candidates: Array<{
    x: number
    y: number
    slope: number
    variance: number
    elevation: number
    radius: number
  }> = []

  // 步长：每隔一定距离采样一个点
  const step = Math.max(Math.floor(minRadius / 3), 3)

  // 扫描整个地形，寻找平缓区域
  for (let y = minRadius + 5; y < height - minRadius - 5; y += step) {
    for (let x = minRadius + 5; x < width - minRadius - 5; x += step) {
      const { slope, variance } = calculateAreaSlope(raster, width, height, x, y, minRadius)

      // 同时满足：坡度小 + 高度方差小（真正平坦的区域）
      if (slope < maxSlope && variance < maxVariance) {
        const index = y * width + x
        const elevation = raster[index]

        candidates.push({
          x,
          y,
          slope,
          variance,
          elevation,
          radius: minRadius
        })
      }
    }
  }
  console.log(`找到 ${candidates.length} 个候选平缓区域`)

  if (candidates.length === 0) {
    console.warn('未找到符合条件的区域，尝试大幅放宽条件...')
    // 大幅放宽条件重新搜索
    for (let y = minRadius + 5; y < height - minRadius - 5; y += step) {
      for (let x = minRadius + 5; x < width - minRadius - 5; x += step) {
        const { slope, variance } = calculateAreaSlope(raster, width, height, x, y, minRadius)

        // 放宽到10倍
        if (slope < maxSlope * 10 && variance < maxVariance * 10) {
          const index = y * width + x
          const elevation = raster[index]

          candidates.push({
            x,
            y,
            slope,
            variance,
            elevation,
            radius: minRadius
          })
        }
      }
    }
    console.log(`大幅放宽条件后找到 ${candidates.length} 个候选区域`)
  }

  // 按综合评分排序
  candidates.forEach((c) => {
    // 评分 = 坡度分数(50%) + 方差分数(50%)
    const slopeScore = 1 - Math.min(c.slope / maxSlope, 1)
    const varianceScore = 1 - Math.min(c.variance / maxVariance, 1)
    c['score'] = slopeScore * 0.5 + varianceScore * 0.5
  })

  candidates.sort((a, b) => b['score'] - a['score'])

  // 只选择得分最高的一个
  const selectedAreas = candidates.slice(0, numRecommendations)

  console.log(`最终推荐 ${selectedAreas.length} 个选址区域`)

  // 转换为地理坐标和世界坐标
  return selectedAreas.map((area, index) => {
    const lonFraction = area.x / (width - 1)
    const latFraction = area.y / (height - 1)
    const lon = DEM_BOUNDS.value.lonMin + lonFraction * (DEM_BOUNDS.value.lonMax - DEM_BOUNDS.value.lonMin)
    const lat = DEM_BOUNDS.value.latMin + latFraction * (DEM_BOUNDS.value.latMax - DEM_BOUNDS.value.latMin)

    const worldPos = geoToWorld(lon, lat, raster, width, height, min, max)
    const radiusWorld = (area.radius / width) * TERRAIN_SIZE

    return {
      centerX: area.x,
      centerY: area.y,
      lon,
      lat,
      elevation: Math.round(area.elevation),
      slope: area.slope,
      variance: area.variance,
      radius: radiusWorld,
      score: area['score'],
      worldPos
    }
  })
}

// 创建区域标记（可点击）- 使用固定屏幕尺寸
function createAreaMarker(areaData: any) {
  const group = new THREE.Group()

  // 半透明圆盘（可交互）- 增大尺寸
  const circleGeometry = new THREE.CircleGeometry(0.35, 48)
  const circleMaterial = new THREE.MeshBasicMaterial({
    color: 0x4caf50,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: false
  })
  const circle = new THREE.Mesh(circleGeometry, circleMaterial)
  circle.rotation.x = -Math.PI / 2
  circle.userData = { clickable: true, areaData }
  group.add(circle)

  // 边界线 - 更明显
  const edgeGeometry = new THREE.RingGeometry(0.33, 0.35, 64)
  const edgeMaterial = new THREE.MeshBasicMaterial({
    color: 0x2e7d32,
    transparent: true,
    opacity: 1.0,
    side: THREE.DoubleSide,
    depthTest: false
  })
  const edge = new THREE.Mesh(edgeGeometry, edgeMaterial)
  edge.rotation.x = -Math.PI / 2
  edge.position.y = 0.01
  group.add(edge)

  // 文字标签 - 使用Sprite自动面向相机
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 64
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = 'rgba(255,255,255,0.95)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = '#2e7d32'
  ctx.lineWidth = 3
  ctx.strokeRect(0, 0, canvas.width, canvas.height)
  ctx.font = 'bold 32px Arial'
  ctx.fillStyle = '#2e7d32'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(areaData.name, canvas.width / 2, canvas.height / 2)

  const textTexture = new THREE.CanvasTexture(canvas)
  const spriteMaterial = new THREE.SpriteMaterial({
    map: textTexture,
    transparent: true,
    depthTest: false
  })
  const sprite = new THREE.Sprite(spriteMaterial)
  sprite.scale.set(0.6, 0.15, 1)
  sprite.position.set(0, 0.4, 0)
  group.add(sprite)

  group.userData = { ...areaData, isMarker: true, clickable: true }

  console.log(`创建标记: ${areaData.name}, 包含 ${group.children.length} 个子对象`)

  return group
}

async function init() {
  if (!container.value || !props.demUrl) return

  try {
    loading.value = true
    loadingProgress.value = 10
    loadingText.value = '初始化3D场景...'

    // 创建场景
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x87ceeb)

    // 创建相机
    camera = new THREE.PerspectiveCamera(60, container.value.clientWidth / container.value.clientHeight, 0.1, 1000)
    camera.position.set(0, 3, 5)
    camera.lookAt(0, 0, 0)

    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))
    container.value.appendChild(renderer.domElement)

    // 添加控制器
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    // 添加光照
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3)
    scene.add(ambientLight)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0)
    dirLight.position.set(10, 20, 10)
    scene.add(dirLight)

    loadingProgress.value = 30
    loadingText.value = '加载DEM高程数据...'

    // 加载DEM数据
    const dem = await loadDEM(props.demUrl)

    loadingProgress.value = 50
    loadingText.value = '处理地形数据...'

    const step = Math.ceil(Math.sqrt((dem.width * dem.height) / (150 * 150)))
    const width = Math.floor(dem.width / step)
    const height = Math.floor(dem.height / step)

    const raster = new Float32Array(width * height)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        raster[y * width + x] = dem.raster[y * step * dem.width + x * step] as number
      }
    }

    const { min, max } = getMinMax(raster)

    loadingProgress.value = 65
    loadingText.value = '生成3D地形模型...'

    // 创建地形几何体
    const geometry = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, width - 1, height - 1)
    const positions = geometry.attributes.position.array

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const index = j * width + i
        const normalizedHeight = (raster[index] - min) / (max - min)
        positions[index * 3 + 2] = normalizedHeight * 1.0
      }
    }

    geometry.attributes.position.needsUpdate = true
    geometry.computeVertexNormals()

    loadingProgress.value = 75
    loadingText.value = '加载卫星影像...'

    // 加载卫星纹理
    const textureLoader = new THREE.TextureLoader()
    const satelliteTexture = await new Promise<THREE.Texture>((resolve, reject) => {
      textureLoader.load(props.satelliteUrl, resolve, undefined, reject)
    })

    loadingProgress.value = 85
    loadingText.value = '渲染地形...'

    // 创建地形材质
    const material = new THREE.MeshStandardMaterial({
      map: satelliteTexture,
      flatShading: false,
      side: THREE.DoubleSide
    })

    terrainMesh = new THREE.Mesh(geometry, material)
    terrainMesh.rotation.x = -Math.PI / 2
    scene.add(terrainMesh)

    loadingProgress.value = 95
    loadingText.value = '添加选址区域标记...'

    console.log('地形高程范围:', { min, max, range: max - min }) // 自动分析平缓区域 - 只找一个最佳位置
    const recommendedAreas = analyzeFlatAreas(raster, width, height, min, max, {
      minRadius: Math.floor(width * 0.08), // 区域半径约8%宽度
      maxSlope: (max - min) * 0.05, // 最大坡度5%（放宽）
      maxVariance: (max - min) * 0.05, // 最大高度方差5%（放宽）
      numRecommendations: 1 // 只推荐1个最佳位置
    })

    console.log('推荐的选址区域:', recommendedAreas)

    if (recommendedAreas.length === 0) {
      console.warn('⚠️ 没有找到符合条件的平缓区域！')
      console.log('建议：地形可能整体较陡峭，尝试添加一个测试标记')

      // 如果没有找到推荐区域，只添加一个测试标记在中心位置
      const testPos = { x: 0, y: 0, z: 0 }
      const areaData = {
        id: 1,
        name: `测试选址`,
        lon: 106.25,
        lat: 26.15,
        radius: 0.3,
        description: '测试标记 - 未找到符合条件的平缓区域',
        elevation: 0,
        slope: 0,
        worldPos: { x: testPos.x, y: testPos.y, z: testPos.z, elevation: 0 }
      }

      const marker = createAreaMarker(areaData)
      marker.position.set(testPos.x, testPos.y + 0.1, testPos.z)
      marker.userData = { clickable: true, areaData }
      marker.renderOrder = 999

      scene.add(marker)
      areaMarkers.push(marker)
      console.log(`✅ 添加测试标记: 位置=(${testPos.x}, ${testPos.y}, ${testPos.z})`)
    } else {
      // 只添加第一个推荐位置
      const area = recommendedAreas[0]
      const areaData = {
        id: 1,
        name: `推荐选址`,
        lon: area.lon,
        lat: area.lat,
        radius: area.radius,
        description: `平均坡度: ${area.slope.toFixed(3)}m, 高度方差: ${area.variance.toFixed(3)}m`,
        elevation: area.elevation,
        slope: area.slope,
        variance: area.variance,
        worldPos: area.worldPos
      }

      console.log(`准备添加标记 ${areaData.name}:`, {
        栅格坐标: `(${area.centerX}, ${area.centerY})`,
        经纬度: `(${area.lon.toFixed(6)}, ${area.lat.toFixed(6)})`,
        世界坐标: `(${area.worldPos.x.toFixed(3)}, ${area.worldPos.y.toFixed(3)}, ${area.worldPos.z.toFixed(3)})`,
        海拔: `${area.elevation}m`,
        坡度: `${area.slope.toFixed(3)}m`,
        方差: `${area.variance.toFixed(3)}m`
      })

      const marker = createAreaMarker(areaData)
      marker.position.set(area.worldPos.x, area.worldPos.y + 0.05, area.worldPos.z)
      marker.userData = { clickable: true, areaData }
      marker.renderOrder = 999

      scene.add(marker)
      areaMarkers.push(marker)

      console.log(
        `✅ 已添加推荐选址: 海拔=${area.elevation}m, 经度=${area.lon.toFixed(6)}°E, 纬度=${area.lat.toFixed(6)}°N, 坡度=${area.slope.toFixed(3)}m, 方差=${area.variance.toFixed(3)}m`
      )
    }

    console.log(`总共添加了 ${areaMarkers.length} 个选址标记到场景中`)
    console.log('场景中的对象数量:', scene.children.length)

    loadingProgress.value = 100
    loadingText.value = '加载完成！'

    // 延迟隐藏加载提示
    setTimeout(() => {
      loading.value = false
    }, 300)

    // 添加点击事件监听
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    renderer.domElement.addEventListener('click', (event) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(scene.children, true)

      for (const intersect of intersects) {
        let obj = intersect.object
        while (obj.parent && !obj.userData.clickable) {
          obj = obj.parent as THREE.Object3D
        }
        if (obj.userData.clickable && obj.userData.areaData) {
          selectedArea.value = obj.userData.areaData
          break
        }
      }
    }) // 动画循环
    let needsRender = true

    // 更新标记大小以保持恒定的屏幕尺寸
    function updateMarkerScales() {
      const distance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0))
      // 反向缩放：距离越远，标记越大，这样在屏幕上看起来大小恒定
      const scaleFactor = Math.max(distance * 0.15, 0.5)

      areaMarkers.forEach((marker) => {
        marker.scale.set(scaleFactor, scaleFactor, scaleFactor)
      })
    }

    function render() {
      if (needsRender && renderer && scene && camera) {
        updateMarkerScales()
        renderer.render(scene, camera)
        needsRender = false
      }
    }

    function animate() {
      animationId = requestAnimationFrame(animate)
      if (controls.update()) {
        needsRender = true
      }
      render()
    }
    controls.addEventListener('change', () => {
      needsRender = true
    })

    animate()

    // 监听窗口大小变化
    window.addEventListener('resize', onWindowResize)
  } catch (error) {
    console.error('高程地图初始化失败:', error)
    loadingText.value = '加载失败，请重试'
  }
}

function onWindowResize() {
  if (!camera || !renderer || !container.value) return
  camera.aspect = container.value.clientWidth / container.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
}
watch(
  () => props.demUrl,
  (newUrl) => {
    if (newUrl) {
      init()
    }
  },
  { immediate: true }
)
onMounted(() => {
  init()
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onWindowResize)

  // 清理区域标记
  areaMarkers.forEach((marker) => {
    marker.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
        if (child.material instanceof THREE.Material) {
          child.material.dispose()
        }
      } else if (child instanceof THREE.Sprite) {
        if (child.material instanceof THREE.Material) {
          child.material.dispose()
        }
      }
    })
  })
  areaMarkers = []

  if (terrainMesh) {
    terrainMesh.geometry.dispose()
    if (terrainMesh.material instanceof THREE.Material) {
      terrainMesh.material.dispose()
    }
  }

  if (controls) controls.dispose()
  if (renderer) {
    renderer.dispose()
    renderer.forceContextLoss()
  }
  if (scene) scene.clear()
})
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.loading-content {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  text-align: center;
  min-width: 320px;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  border: 4px solid rgba(33, 150, 243, 0.2);
  border-top-color: #2196f3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-content h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(33, 150, 243, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin: 0 auto 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2196f3, #64b5f6);
  transition: width 0.3s ease;
  border-radius: 4px;
}

.progress-text {
  margin: 0;
  font-size: 14px;
  color: #2196f3;
  font-weight: bold;
}

.area-info-panel {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  min-width: 320px;
  max-width: 450px;
  overflow: hidden;
}

.info-header {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-header h3 {
  margin: 0;
  color: white;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 24px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.info-content {
  padding: 20px;
}

.info-item {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  font-size: 12px;
  color: #666;
  font-weight: 600;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}
</style>
