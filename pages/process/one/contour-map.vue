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

    <!-- 颜色图例 -->
    <div v-if="!loading" class="legend-panel">
      <h4>高程图例 (米)</h4>
      <div class="legend-items">
        <div 
          v-for="(item, index) in legendItems" 
          :key="index" 
          class="legend-item"
        >
          <div class="legend-color" :style="{ background: item.color }"></div>
          <span class="legend-label">{{ item.label }}</span>
        </div>
      </div>
    </div>

    <!-- 地理标记信息面板 + 区域形状切换 -->
    <div v-if="!loading" class="area-info-wrapper">
      <!-- 区域形状切换按钮 -->
      <div class="shape-control-panel">
        <button 
          :class="['shape-btn', { active: areaShapeType === 'circle' }]"
          @click="areaShapeType = 'circle'"
        >
          ⭕ 圆形
        </button>
        <button 
          :class="['shape-btn', { active: areaShapeType === 'square' }]"
          @click="areaShapeType = 'square'"
        >
          ▢ 方形
        </button>
      </div>
      
      <!-- 信息面板 -->
      <div v-if="selectedArea" class="area-info-panel">
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
          <span class="info-label">描述：</span>
          <span class="info-value">{{ selectedArea.description }}</span>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import * as THREE from 'three'
import { fromArrayBuffer } from 'geotiff'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'

const props = defineProps<{
  demUrl: string
  demBounds: any
  analyzedAreas?: Array<{
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
  }>
}>()

const container = ref<HTMLElement | null>(null)
const loading = ref(true)
const loadingText = ref('正在加载...')
const loadingProgress = ref(0)
const selectedArea = ref<any>(null)
const areaShapeType = ref<'circle' | 'square'>('circle')

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let labelRenderer: CSS2DRenderer
let controls: OrbitControls
let animationId: number
let terrainMesh: THREE.Mesh
let contourLabels: CSS2DObject[] = []
let areaMarkers: CSS2DObject[] = []
let areaMeshes: THREE.Mesh[] = []
let cachedRaster: { data: Float32Array; width: number; height: number; min: number; max: number } | null = null

const TERRAIN_SIZE = 8
let demMinHeight = 0
let demMaxHeight = 0

const DEM_BOUNDS = computed(() => {
  return props.demBounds || {
    lonMin: 106.2,
    lonMax: 106.3,
    latMin: 26.1,
    latMax: 26.2
  }
})

// 选址区域数据
const areasData = [
  {
    id: 1,
    name: '选址区A',
    lon: 106.25,
    lat: 26.15,
    radius: 0.3,
    description: '适合建设主厂房',
    elevation: 0
  }
]

// 图例数据
const legendItems = ref<Array<{ color: string; label: string }>>([])

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
  let min = Infinity, max = -Infinity
  for (let i = 0; i < array.length; i++) {
    const v = array[i]
    if (v < min) min = v
    if (v > max) max = v
  }
  return { min, max }
}

// 地理坐标转世界坐标
function geoToWorld(lon: number, lat: number, raster: Float32Array, width: number, height: number, min: number, max: number) {
  const x = (lon - DEM_BOUNDS.value.lonMin) / (DEM_BOUNDS.value.lonMax - DEM_BOUNDS.value.lonMin)
  const y = (lat - DEM_BOUNDS.value.latMin) / (DEM_BOUNDS.value.latMax - DEM_BOUNDS.value.latMin)

  const worldX = (x - 0.5) * TERRAIN_SIZE
  const worldZ = (y - 0.5) * TERRAIN_SIZE
  
  // 获取该位置的高程
  const rasterX = Math.floor(x * (width - 1))
  const rasterY = Math.floor(y * (height - 1))
  const rasterIndex = rasterY * width + rasterX
  const elevation = raster[rasterIndex] || min
  
  return { x: worldX, z: worldZ, elevation }
}

// 生成图例数据
function generateLegend(minHeight: number, maxHeight: number) {
  const lineCount = 9
  const heightRange = maxHeight - minHeight
  
  const colors = [
    '#1976d2', '#1e88e5', '#43a047', '#7cb342', 
    '#fdd835', '#ffb300', '#fb8c00', '#f4511e', '#e53935'
  ]
  
  const items = []
  for (let i = 1; i < lineCount; i++) {
    const elevation = minHeight + (i / lineCount) * heightRange
    const colorIndex = i - 1
    items.push({
      color: colors[colorIndex],
      label: `${Math.round(elevation)}m`
    })
  }
  
  legendItems.value = items
}

// 添加选址区域标记 - 支持圆形和方形
function addAreaMarkers(raster: Float32Array, width: number, height: number, min: number, max: number) {
  // 清除旧标记
  areaMarkers.forEach(marker => {
    if (marker.element && marker.element.parentNode) {
      marker.element.parentNode.removeChild(marker.element)
    }
    scene.remove(marker)
  })
  areaMarkers = []
  
  // 清除旧的几何体
  areaMeshes.forEach(mesh => {
    scene.remove(mesh)
    mesh.geometry.dispose()
    if (mesh.material instanceof THREE.Material) {
      mesh.material.dispose()
    }
  })
  areaMeshes = []
  
  // 如果有分析结果，使用分析结果；否则使用默认数据
  const areasToShow = props.analyzedAreas && props.analyzedAreas.length > 0 
    ? props.analyzedAreas.map((area, index) => ({
        id: index + 1,
        name: `推荐选址`,
        lon: area.lon,
        lat: area.lat,
        radius: area.radius,
        description: `平均坡度: ${area.slope.toFixed(3)}m, 高度方差: ${area.variance.toFixed(3)}m`,
        elevation: area.elevation
      }))
    : areasData
  
  areasToShow.forEach((area) => {
    const worldPos = geoToWorld(area.lon, area.lat, raster, width, height, min, max)
    area.elevation = Math.round(worldPos.elevation)

    const regionSize = 0.5
    
    if (areaShapeType.value === 'circle') {
      // 圆形区域
      const circleGeometry = new THREE.RingGeometry(regionSize - 0.02, regionSize, 64)
      const circleMaterial = new THREE.MeshBasicMaterial({
        color: 0xff5722,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        depthTest: false
      })
      const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial)
      circleMesh.rotation.x = -Math.PI / 2
      circleMesh.position.set(worldPos.x, 0.01, worldPos.z)
      circleMesh.renderOrder = 999
      scene.add(circleMesh)
      areaMeshes.push(circleMesh)
      
      // 添加半透明填充圆
      const fillGeometry = new THREE.CircleGeometry(regionSize - 0.02, 64)
      const fillMaterial = new THREE.MeshBasicMaterial({
        color: 0xff5722,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.15,
        depthTest: false
      })
      const fillMesh = new THREE.Mesh(fillGeometry, fillMaterial)
      fillMesh.rotation.x = -Math.PI / 2
      fillMesh.position.set(worldPos.x, 0.005, worldPos.z)
      fillMesh.renderOrder = 998
      scene.add(fillMesh)
      areaMeshes.push(fillMesh)
    } else {
      // 方形区域
      const squareGeometry = new THREE.PlaneGeometry(regionSize, regionSize)
      const squareMaterial = new THREE.MeshBasicMaterial({
        color: 0xff5722,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        depthTest: false
      })
      const squareMesh = new THREE.Mesh(squareGeometry, squareMaterial)
      squareMesh.rotation.x = -Math.PI / 2
      squareMesh.position.set(worldPos.x, 0.01, worldPos.z)
      squareMesh.renderOrder = 999
      scene.add(squareMesh)
      areaMeshes.push(squareMesh)
      
      // 添加半透明填充方形
      const fillGeometry = new THREE.PlaneGeometry(regionSize - 0.04, regionSize - 0.04)
      const fillMaterial = new THREE.MeshBasicMaterial({
        color: 0xff5722,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.15,
        depthTest: false
      })
      const fillMesh = new THREE.Mesh(fillGeometry, fillMaterial)
      fillMesh.rotation.x = -Math.PI / 2
      fillMesh.position.set(worldPos.x, 0.005, worldPos.z)
      fillMesh.renderOrder = 998
      scene.add(fillMesh)
      areaMeshes.push(fillMesh)
    }
    
    // 添加中心标记点
    const dotGeometry = new THREE.CircleGeometry(0.05, 32)
    const dotMaterial = new THREE.MeshBasicMaterial({
      color: 0xff5722,
      side: THREE.DoubleSide,
      depthTest: false
    })
    const dotMesh = new THREE.Mesh(dotGeometry, dotMaterial)
    dotMesh.rotation.x = -Math.PI / 2
    dotMesh.position.set(worldPos.x, 0.02, worldPos.z)
    dotMesh.renderOrder = 1000
    scene.add(dotMesh)
    areaMeshes.push(dotMesh)
    
    // 创建区域名称标签
    const nameDiv = document.createElement('div')
    nameDiv.style.cssText = `
      background: rgba(255, 255, 255, 0.95);
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 16px;
      font-weight: bold;
      color: #ff5722;
      border: 3px solid #ff5722;
      pointer-events: auto;
      white-space: nowrap;
      box-shadow: 0 3px 8px rgba(0,0,0,0.3);
      cursor: pointer;
      transition: all 0.3s;
    `
    nameDiv.textContent = `${area.name} (${area.elevation}m)`
    
    // 添加点击和悬停效果
    nameDiv.addEventListener('click', (e) => {
      e.stopPropagation()
      selectedArea.value = area
    })
    
    nameDiv.addEventListener('mouseenter', () => {
      nameDiv.style.background = '#ff5722'
      nameDiv.style.color = 'white'
      nameDiv.style.transform = 'scale(1.05)'
    })
    
    nameDiv.addEventListener('mouseleave', () => {
      nameDiv.style.background = 'rgba(255, 255, 255, 0.95)'
      nameDiv.style.color = '#ff5722'
      nameDiv.style.transform = 'scale(1)'
    })
    
    const nameLabel = new CSS2DObject(nameDiv)
    nameLabel.position.set(worldPos.x, 0, worldPos.z + regionSize + 0.3)
    scene.add(nameLabel)
    areaMarkers.push(nameLabel)
    
    console.log(`✅ 添加${areaShapeType.value === 'circle' ? '圆形' : '方形'}区域标记: ${area.name}, 位置=(${worldPos.x.toFixed(2)}, ${worldPos.z.toFixed(2)})`)
  })
}

async function init() {
  if (!container.value || !props.demUrl) return

  try {
    loading.value = true
    loadingProgress.value = 10
    loadingText.value = '初始化场景...'

    // 创建场景
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f5f5)
    
    // 创建相机
    camera = new THREE.PerspectiveCamera(
      60,
      container.value.clientWidth / container.value.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 5, 0)
    camera.lookAt(0, 0, 0)

    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))
    container.value.appendChild(renderer.domElement)    // 创建CSS2D渲染器
    labelRenderer = new CSS2DRenderer()
    labelRenderer.setSize(container.value.clientWidth, container.value.clientHeight)
    labelRenderer.domElement.style.position = 'absolute'
    labelRenderer.domElement.style.top = '0'
    labelRenderer.domElement.style.left = '0'
    labelRenderer.domElement.style.pointerEvents = 'none'
    container.value.appendChild(labelRenderer.domElement)
    
    // 添加控制器
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableRotate = true
    controls.enableZoom = true
    controls.enablePan = true
    controls.minDistance = 1
    controls.maxDistance = 20
    controls.maxPolarAngle = Math.PI / 2

    loadingProgress.value = 30
    loadingText.value = '加载DEM地形数据...'// 加载DEM数据
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
    demMinHeight = min
    demMaxHeight = max

    loadingProgress.value = 70
    loadingText.value = '生成等高线地形...'

    // 创建平面几何体
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

    // 获取高度范围用于shader
    let minHeight = Infinity
    let maxHeight = -Infinity
    for (let i = 0; i < positions.length; i += 3) {
      const h = positions[i + 2]
      if (h < minHeight) minHeight = h
      if (h > maxHeight) maxHeight = h
    }
    
    // 创建等高线材质 - 使用颜色渐变
    const material = new THREE.ShaderMaterial({
      uniforms: {
        minHeight: { value: minHeight },
        maxHeight: { value: maxHeight }
      },
      vertexShader: `
        varying float vHeight;
        void main() {
          vHeight = position.z;
          // 将地形压平为平面
          vec3 flatPos = vec3(position.x, position.y, 0.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(flatPos, 1.0);
        }
      `,
      fragmentShader: `
        varying float vHeight;
        uniform float minHeight;
        uniform float maxHeight;

        // 根据高度返回颜色
        vec3 getColorForHeight(float h) {
          // 定义颜色梯度：蓝色 → 绿色 → 黄色 → 橙色 → 红色
          if (h < 0.125) return mix(vec3(0.098, 0.463, 0.824), vec3(0.118, 0.533, 0.898), h / 0.125);
          else if (h < 0.25) return mix(vec3(0.118, 0.533, 0.898), vec3(0.263, 0.627, 0.278), (h - 0.125) / 0.125);
          else if (h < 0.375) return mix(vec3(0.263, 0.627, 0.278), vec3(0.486, 0.702, 0.259), (h - 0.25) / 0.125);
          else if (h < 0.5) return mix(vec3(0.486, 0.702, 0.259), vec3(0.992, 0.847, 0.208), (h - 0.375) / 0.125);
          else if (h < 0.625) return mix(vec3(0.992, 0.847, 0.208), vec3(1.0, 0.702, 0.0), (h - 0.5) / 0.125);
          else if (h < 0.75) return mix(vec3(1.0, 0.702, 0.0), vec3(0.984, 0.549, 0.0), (h - 0.625) / 0.125);
          else if (h < 0.875) return mix(vec3(0.984, 0.549, 0.0), vec3(0.957, 0.318, 0.118), (h - 0.75) / 0.125);
          else return mix(vec3(0.957, 0.318, 0.118), vec3(0.898, 0.224, 0.208), (h - 0.875) / 0.125);
        }

        void main() {
          float hNorm = (vHeight - minHeight) / (maxHeight - minHeight);
          
          // 浅色背景
          vec3 color = vec3(0.97, 0.97, 0.95);

          // 等高线: 9条线，使用颜色区分
          float lineCount = 9.0;
          float linePos = fract(hNorm * lineCount);
          float lineWidth = 0.025;
          
          if (linePos < lineWidth || linePos > 1.0 - lineWidth) {
            // 计算当前是第几条线
            float lineIndex = floor(hNorm * lineCount) / lineCount;
            color = getColorForHeight(lineIndex);
          }

          gl_FragColor = vec4(color, 1.0);
        }
      `
    })
    
    terrainMesh = new THREE.Mesh(geometry, material)
    terrainMesh.rotation.x = -Math.PI / 2
    scene.add(terrainMesh)
    
    loadingProgress.value = 85
    loadingText.value = '添加区域标记...'
    
    // 缓存raster数据用于后续切换形状
    cachedRaster = { data: raster, width, height, min, max }
    
    // 添加选址区域标记
    addAreaMarkers(raster, width, height, min, max)
    
    loadingProgress.value = 95
    loadingText.value = '生成图例...'
    
    // 生成图例
    generateLegend(demMinHeight, demMaxHeight)

    loadingProgress.value = 100
    loadingText.value = '加载完成！'
    // 延迟隐藏加载提示
    setTimeout(() => {
      loading.value = false
    }, 300)

    // 动画循环
    function animate() {
      animationId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
      labelRenderer.render(scene, camera)
    }

    animate()

    // 监听窗口大小变化
    window.addEventListener('resize', onWindowResize)
  } catch (error) {
    console.error('地形初始化失败:', error)
    loadingText.value = '加载失败，请重试'
  }
}

function onWindowResize() {
  if (!camera || !renderer || !labelRenderer || !container.value) return
  camera.aspect = container.value.clientWidth / container.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  labelRenderer.setSize(container.value.clientWidth, container.value.clientHeight)
}

// 监听区域形状切换 - 只更新区域标记，不重新初始化整个场景
watch(areaShapeType, async () => {
  if (scene && terrainMesh && cachedRaster && props.demUrl) {
    console.log(`\n🔄 切换区域形状为: ${areaShapeType.value === 'circle' ? '圆形' : '方形'}`)
    
    // 使用 nextTick 延迟执行，不阻塞主线程
    await nextTick()
    
    // 清除旧标记
    areaMarkers.forEach(marker => {
      if (marker.element && marker.element.parentNode) {
        marker.element.parentNode.removeChild(marker.element)
      }
      scene.remove(marker)
    })
    areaMarkers = []
    
    // 清除旧的几何体
    areaMeshes.forEach(mesh => {
      scene.remove(mesh)
      mesh.geometry.dispose()
      if (mesh.material instanceof THREE.Material) {
        mesh.material.dispose()
      }
    })
    areaMeshes = []
    
    // 使用缓存的raster数据直接重新添加区域标记
    addAreaMarkers(cachedRaster.data, cachedRaster.width, cachedRaster.height, cachedRaster.min, cachedRaster.max)
    console.log(`✅ 区域标记已切换为${areaShapeType.value === 'circle' ? '圆形' : '方形'}`)
    
    // 立即触发一次渲染更新
    if (renderer && labelRenderer) {
      renderer.render(scene, camera)
      labelRenderer.render(scene, camera)
    }
  }
}, { flush: 'sync' })

watch(
  () => props.demUrl,
  (newUrl) => {
    if (newUrl && props.analyzedAreas) {
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

  // 清理等高线标签
  contourLabels.forEach(label => {
    if (label.element && label.element.parentNode) {
      label.element.parentNode.removeChild(label.element)
    }
  })
  contourLabels = []

  // 清理区域标记
  areaMarkers.forEach(marker => {
    if (marker.element && marker.element.parentNode) {
      marker.element.parentNode.removeChild(marker.element)
    }
  })
  areaMarkers = []
  
  // 清理区域几何体
  areaMeshes.forEach(mesh => {
    scene.remove(mesh)
    mesh.geometry.dispose()
    if (mesh.material instanceof THREE.Material) {
      mesh.material.dispose()
    }
  })
  areaMeshes = []

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
  if (labelRenderer && labelRenderer.domElement.parentNode) {
    labelRenderer.domElement.parentNode.removeChild(labelRenderer.domElement)
  }
  if (scene) scene.clear()
})
</script>

<style scoped>
.area-info-wrapper {
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
}

.shape-control-panel {
  background: rgba(255, 255, 255, 0.95);
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  gap: 10px;
}

.shape-btn {
  padding: 8px 16px;
  border: 2px solid #ff5722;
  background: white;
  color: #ff5722;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  font-size: 14px;
}

.shape-btn:hover {
  background: rgba(255, 87, 34, 0.1);
  transform: translateY(-2px);
}

.shape-btn.active {
  background: #ff5722;
  color: white;
  box-shadow: 0 2px 8px rgba(255, 87, 34, 0.4);
}

.legend-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  min-width: 150px;
}

.legend-panel h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  border-bottom: 2px solid #ddd;
  padding-bottom: 8px;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-color {
  width: 40px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.legend-label {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  min-width: 60px;
}

.area-info-panel {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  min-width: 320px;
  max-width: 450px;
  overflow: hidden;
}

.info-header {
  background: linear-gradient(135deg, #ff5722 0%, #e64a19 100%);
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
  border: 4px solid rgba(255, 87, 34, 0.2);
  border-top-color: #ff5722;
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
  background: rgba(255, 87, 34, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin: 0 auto 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff5722, #ff7043);
  transition: width 0.3s ease;
  border-radius: 4px;
}

.progress-text {
  margin: 0;
  font-size: 14px;
  color: #ff5722;
  font-weight: bold;
}
</style>
