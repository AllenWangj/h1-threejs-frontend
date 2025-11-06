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
    <!-- 路线信息面板 -->
    <div v-if="!loading && routePoints.length > 0" class="route-info-panel">
      <div class="info-header">
        <h3>运输路线</h3>
        <div class="header-actions">
          <button class="action-btn" @click="toggleAnimation">{{ isAnimating ? '停止动画' : '播放动画' }}</button>
        </div>
      </div>
      <div class="info-content">
        <div class="info-item">
          <span class="info-label">总距离：</span>
          <span class="info-value">{{ totalDistance.toFixed(2) }} km</span>
        </div>
        <div class="info-item">
          <span class="info-label">海拔变化：</span>
          <span class="info-value">{{ minElevation }}m - {{ maxElevation }}m</span>
        </div>
      </div>
    </div>
    <!-- 绘制提示 -->
    <div v-if="!loading && !isAnimating && routePoints.length === 0" class="draw-hint">
      路线已自动生成，点击"播放动画"查看
    </div>

    <!-- 动画提示 -->
    <div v-if="isAnimating" class="animation-hint">🚚 运输中... {{ animationProgress }}%</div>
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

// 路线相关状态
const routePoints = ref<Array<{ x: number; y: number; z: number; elevation: number; lon: number; lat: number }>>([])
const totalDistance = ref(0)
const minElevation = ref(0)
const maxElevation = ref(0)
const isAnimating = ref(false)
const animationProgress = ref(0)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let animationId: number
let terrainMesh: THREE.Mesh
let routeLine: THREE.Line | null = null
let animatedLine: THREE.Line | null = null
let routeMarkers: THREE.Mesh[] = []
let movingMarker: THREE.Mesh | null = null
let demRaster: Float32Array
let demWidth: number
let demHeight: number
let demMin: number
let demMax: number
let routeAnimationProgress = 0
let routeAnimationSpeed = 0.001 // 动画速度（降低速度以配合500个点，让动画更流畅）

const TERRAIN_SIZE = 8
const DEM_BOUNDS = computed(() => props.demBounds)

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

// 世界坐标转地理坐标
function worldToGeo(worldX: number, worldZ: number) {
  const normX = worldX / TERRAIN_SIZE + 0.5
  const normZ = worldZ / TERRAIN_SIZE + 0.5
  const lon = DEM_BOUNDS.value.lonMin + normX * (DEM_BOUNDS.value.lonMax - DEM_BOUNDS.value.lonMin)
  const lat = DEM_BOUNDS.value.latMin + normZ * (DEM_BOUNDS.value.latMax - DEM_BOUNDS.value.latMin)
  return { lon, lat }
}

// 创建路线点标记
function createRouteMarker(index: number) {
  // 只在起点和终点创建标记，中间点太多就不显示了
  if (index !== 0 && index !== routePoints.value.length - 1) {
    return null
  }

  const geometry = new THREE.SphereGeometry(0.08, 16, 16)
  const material = new THREE.MeshBasicMaterial({
    color: index === 0 ? 0x00ff00 : 0xff0000,
    depthTest: false
  })
  const marker = new THREE.Mesh(geometry, material)
  marker.renderOrder = 1001
  return marker
}

// 绘制路线
function drawRoute() {
  // 清除旧路线
  if (routeLine) {
    scene.remove(routeLine)
    routeLine.geometry.dispose()
    if (routeLine.material instanceof THREE.Material) {
      routeLine.material.dispose()
    }
  }

  if (animatedLine) {
    scene.remove(animatedLine)
    animatedLine.geometry.dispose()
    if (animatedLine.material instanceof THREE.Material) {
      animatedLine.material.dispose()
    }
  }

  // 清除旧标记
  routeMarkers.forEach((marker) => {
    scene.remove(marker)
    marker.geometry.dispose()
    if (marker.material instanceof THREE.Material) {
      marker.material.dispose()
    }
  })
  routeMarkers = []

  if (routePoints.value.length === 0) return
  // 绘制路线点标记
  routePoints.value.forEach((point, index) => {
    const marker = createRouteMarker(index)
    if (marker) {
      marker.position.set(point.x, point.y + 0.03, point.z)
      scene.add(marker)
      routeMarkers.push(marker)
    }
  })

  if (routePoints.value.length < 2) return

  // 创建完整路线（半透明背景）
  const allPoints: THREE.Vector3[] = []
  routePoints.value.forEach((point) => {
    allPoints.push(new THREE.Vector3(point.x, point.y + 0.02, point.z))
  })

  const bgGeometry = new THREE.BufferGeometry().setFromPoints(allPoints)
  const bgMaterial = new THREE.LineBasicMaterial({
    color: 0x999999,
    linewidth: 2,
    transparent: true,
    opacity: 0.3,
    depthTest: false
  })

  routeLine = new THREE.Line(bgGeometry, bgMaterial)
  routeLine.renderOrder = 999
  scene.add(routeLine)

  // 计算统计信息
  calculateRouteStats()

  // 如果正在播放动画，重新开始
  if (isAnimating.value) {
    routeAnimationProgress = 0
  }
}

// 更新动画路线
function updateAnimatedLine() {
  if (!isAnimating.value || routePoints.value.length < 2) return

  // 清除旧的动画线
  if (animatedLine) {
    scene.remove(animatedLine)
    animatedLine.geometry.dispose()
    if (animatedLine.material instanceof THREE.Material) {
      animatedLine.material.dispose()
    }
  }

  // 计算当前应该绘制到哪个点
  const totalPoints = routePoints.value.length
  const currentPointIndex = Math.floor(routeAnimationProgress * (totalPoints - 1))
  const segmentProgress = routeAnimationProgress * (totalPoints - 1) - currentPointIndex

  if (currentPointIndex >= totalPoints - 1) {
    // 动画完成
    isAnimating.value = false
    animationProgress.value = 100

    // 移除移动标记
    if (movingMarker) {
      scene.remove(movingMarker)
      movingMarker = null
    }
    return
  }

  // 创建动画路线点
  const animPoints: THREE.Vector3[] = []

  // 添加已完成的点
  for (let i = 0; i <= currentPointIndex; i++) {
    const p = routePoints.value[i]
    animPoints.push(new THREE.Vector3(p.x, p.y + 0.02, p.z))
  }

  // 添加当前段的插值点
  if (currentPointIndex < totalPoints - 1) {
    const p1 = routePoints.value[currentPointIndex]
    const p2 = routePoints.value[currentPointIndex + 1]

    const interpolatedPoint = new THREE.Vector3(
      p1.x + (p2.x - p1.x) * segmentProgress,
      p1.y + (p2.y - p1.y) * segmentProgress + 0.02,
      p1.z + (p2.z - p1.z) * segmentProgress
    )
    animPoints.push(interpolatedPoint)
    // 更新或创建移动标记
    if (!movingMarker) {
      const geometry = new THREE.SphereGeometry(0.08, 16, 16)
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        depthTest: false
      })
      movingMarker = new THREE.Mesh(geometry, material)
      movingMarker.renderOrder = 1002
      scene.add(movingMarker)
    }
    movingMarker.position.copy(interpolatedPoint)
    movingMarker.position.y += 0.05
  }

  // 创建动画线
  const animGeometry = new THREE.BufferGeometry().setFromPoints(animPoints)
  const animMaterial = new THREE.LineBasicMaterial({
    color: 0xff6600,
    linewidth: 4,
    depthTest: false
  })

  animatedLine = new THREE.Line(animGeometry, animMaterial)
  animatedLine.renderOrder = 1000
  scene.add(animatedLine)

  // 更新进度
  animationProgress.value = Math.round(routeAnimationProgress * 100)
}

// 切换动画
function toggleAnimation() {
  if (routePoints.value.length < 2) return

  isAnimating.value = !isAnimating.value

  if (isAnimating.value) {
    routeAnimationProgress = 0
    animationProgress.value = 0
  } else {
    // 停止动画，移除移动标记
    if (movingMarker) {
      scene.remove(movingMarker)
      movingMarker = null
    }
    if (animatedLine) {
      scene.remove(animatedLine)
      animatedLine.geometry.dispose()
      if (animatedLine.material instanceof THREE.Material) {
        animatedLine.material.dispose()
      }
      animatedLine = null
    }
  }
}

// 计算路线统计信息
function calculateRouteStats() {
  if (routePoints.value.length < 2) {
    totalDistance.value = 0
    minElevation.value = 0
    maxElevation.value = 0
    return
  }

  let distance = 0
  let minElev = Infinity
  let maxElev = -Infinity

  for (let i = 0; i < routePoints.value.length - 1; i++) {
    const p1 = routePoints.value[i]
    const p2 = routePoints.value[i + 1]

    const dx = p2.x - p1.x
    const dz = p2.z - p1.z
    distance += Math.sqrt(dx * dx + dz * dz) * 10 // 转换为km（假设TERRAIN_SIZE=8对应80km）

    minElev = Math.min(minElev, p1.elevation, p2.elevation)
    maxElev = Math.max(maxElev, p1.elevation, p2.elevation)
  }

  totalDistance.value = distance
  minElevation.value = Math.round(minElev)
  maxElevation.value = Math.round(maxElev)
}

// 自动生成路线（基于地形分析）
function generateAutoRoute() {
  console.log('开始自动生成运输路线...')

  // 定义起点和终点（基于DEM范围）
  const startLon = DEM_BOUNDS.value.lonMin + (DEM_BOUNDS.value.lonMax - DEM_BOUNDS.value.lonMin) * 0.2
  const startLat = DEM_BOUNDS.value.latMin + (DEM_BOUNDS.value.latMax - DEM_BOUNDS.value.latMin) * 0.3

  const endLon = DEM_BOUNDS.value.lonMin + (DEM_BOUNDS.value.lonMax - DEM_BOUNDS.value.lonMin) * 0.8
  const endLat = DEM_BOUNDS.value.latMin + (DEM_BOUNDS.value.latMax - DEM_BOUNDS.value.latMin) * 0.7

  // 获取起点和终点的世界坐标
  const startPos = geoToWorld(startLon, startLat, demRaster, demWidth, demHeight, demMin, demMax)
  const endPos = geoToWorld(endLon, endLat, demRaster, demWidth, demHeight, demMin, demMax)

  // 先生成关键控制点（用于构建曲线）
  const numControlPoints = 6 // 控制点数量
  const controlPoints: Array<{ lon: number; lat: number }> = []

  // 添加起点
  controlPoints.push({ lon: startLon, lat: startLat })

  // 生成中间控制点（带随机偏移）
  for (let i = 1; i < numControlPoints; i++) {
    const t = i / numControlPoints
    const interpLon = startLon + (endLon - startLon) * t
    const interpLat = startLat + (endLat - startLat) * t

    // 添加随机偏移使路线更自然
    const randomOffset = 0.015
    const offsetLon = interpLon + (Math.random() - 0.5) * randomOffset
    const offsetLat = interpLat + (Math.random() - 0.5) * randomOffset

    const clampedLon = Math.max(DEM_BOUNDS.value.lonMin, Math.min(DEM_BOUNDS.value.lonMax, offsetLon))
    const clampedLat = Math.max(DEM_BOUNDS.value.latMin, Math.min(DEM_BOUNDS.value.latMax, offsetLat))

    controlPoints.push({ lon: clampedLon, lat: clampedLat })
  }
  // 添加终点
  controlPoints.push({ lon: endLon, lat: endLat })

  // 使用 Catmull-Rom 样条插值生成平滑路径点
  const numInterpolatedPoints = 500 // 插值后的总点数（更多点 = 更平滑）
  const points: Array<{ x: number; y: number; z: number; elevation: number; lon: number; lat: number }> = []

  for (let i = 0; i < numInterpolatedPoints; i++) {
    const t = i / (numInterpolatedPoints - 1)

    // Catmull-Rom 插值
    const segmentCount = controlPoints.length - 1
    const segmentT = t * segmentCount
    const segmentIndex = Math.min(Math.floor(segmentT), segmentCount - 1)
    const localT = segmentT - segmentIndex

    // 获取4个控制点用于Catmull-Rom插值
    const p0 = controlPoints[Math.max(0, segmentIndex - 1)]
    const p1 = controlPoints[segmentIndex]
    const p2 = controlPoints[Math.min(controlPoints.length - 1, segmentIndex + 1)]
    const p3 = controlPoints[Math.min(controlPoints.length - 1, segmentIndex + 2)]

    // Catmull-Rom 插值公式
    const lon = catmullRom(localT, p0.lon, p1.lon, p2.lon, p3.lon)
    const lat = catmullRom(localT, p0.lat, p1.lat, p2.lat, p3.lat)

    const pointPos = geoToWorld(lon, lat, demRaster, demWidth, demHeight, demMin, demMax)

    points.push({
      x: pointPos.x,
      y: pointPos.y,
      z: pointPos.z,
      elevation: Math.round(pointPos.elevation),
      lon: lon,
      lat: lat
    })
  }

  routePoints.value = points
  drawRoute()

  console.log(`✅ 自动生成平滑路线完成，共 ${points.length} 个路径点`)
  console.log('起点:', { lon: startLon.toFixed(6), lat: startLat.toFixed(6), elevation: points[0].elevation })
  console.log('终点:', {
    lon: endLon.toFixed(6),
    lat: endLat.toFixed(6),
    elevation: points[points.length - 1].elevation
  })

  // 自动开始播放动画
  setTimeout(() => {
    if (routePoints.value.length >= 2) {
      toggleAnimation()
    }
  }, 500)
}

// Catmull-Rom 样条插值函数
function catmullRom(t: number, p0: number, p1: number, p2: number, p3: number): number {
  const t2 = t * t
  const t3 = t2 * t

  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
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

    // 保存DEM数据供后续使用
    demRaster = raster
    demWidth = width
    demHeight = height
    demMin = min
    demMax = max

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
    loadingProgress.value = 100
    loadingText.value = '加载完成！'

    // 延迟隐藏加载提示
    setTimeout(() => {
      loading.value = false
      // 自动生成路线
      generateAutoRoute()
    }, 300)

    // 动画循环
    let needsRender = true

    function render() {
      if (needsRender && renderer && scene && camera) {
        // 更新路线动画
        if (isAnimating.value && routePoints.value.length >= 2) {
          routeAnimationProgress += routeAnimationSpeed
          if (routeAnimationProgress > 1) {
            routeAnimationProgress = 1
          }
          updateAnimatedLine()
          needsRender = true
        }

        renderer.render(scene, camera)
        needsRender = false
      }
    }

    function animate() {
      animationId = requestAnimationFrame(animate)
      if (controls.update() || isAnimating.value) {
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

onMounted(() => {
  init()
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onWindowResize)

  // 清理路线
  if (routeLine) {
    scene.remove(routeLine)
    routeLine.geometry.dispose()
    if (routeLine.material instanceof THREE.Material) {
      routeLine.material.dispose()
    }
  }

  // 清理路线标记
  routeMarkers.forEach((marker) => {
    scene.remove(marker)
    marker.geometry.dispose()
    if (marker.material instanceof THREE.Material) {
      marker.material.dispose()
    }
  })
  routeMarkers = []

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

.route-info-panel {
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

.draw-hint {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 102, 0, 0.9);
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.9;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) scale(1.05);
  }
}

.animation-hint {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(33, 150, 243, 0.95);
  color: white;
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  animation: glow 1.5s infinite;
}

@keyframes glow {
  0%,
  100% {
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
  }
  50% {
    box-shadow: 0 4px 20px rgba(33, 150, 243, 0.8);
  }
}

.clear-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 14px;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.clear-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  white-space: nowrap;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
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
