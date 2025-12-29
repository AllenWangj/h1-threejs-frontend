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
    
    <!-- 路线信息面板 - 修复显示条件 -->
    <div v-if="!loading" class="route-info-panel">
      <div class="info-header">
        <h3>运输路线</h3>
        <div class="header-actions">
          <button 
            v-if="routePoints.length >= 2" 
            class="action-btn" 
            @click="toggleAnimation"
          >
            {{ isAnimating ? '停止动画' : '播放动画' }}
          </button>
          <span v-else class="action-hint">正在生成路线...</span>
        </div>
      </div>
      <div v-if="routePoints.length > 0" class="info-content">
        <div class="info-label-header">{{ transportMode === 'ground' ? '陆运路线' : '空运路线' }}</div>
        <div class="info-item">
          <span class="info-label">总距离：</span>
          <span class="info-value">{{ totalDistance.toFixed(2) }} km</span>
        </div>
        <div v-if="transportMode === 'ground'" class="info-item">
          <span class="info-label">海拔变化：</span>
          <span class="info-value">{{ minElevation }}m - {{ maxElevation }}m</span>
        </div>
      </div>
      <div v-else class="info-content">
        <p class="loading-hint">路线生成中，请稍候...</p>
      </div>
    </div>

    <!-- 运输方式选择 -->
    <div v-if="!loading" class="mode-selector">
      <button 
        :class="['mode-btn', { active: transportMode === 'ground' }]"
        @click="switchTransportMode('ground')"
      >
        🚚 陆运
      </button>
      <button 
        :class="['mode-btn', { active: transportMode === 'air' }]"
        @click="switchTransportMode('air')"
      >
        ✈️ 空运
      </button>
      <button 
        :class="['mode-btn']"
        @click="showUnsupportedMessage('铁路')"
      >
        🚂 铁路
      </button>
      <button 
        :class="['mode-btn']"
        @click="showUnsupportedMessage('水运')"
      >
        🚢 水运
      </button>
    </div>

    <!-- 动画提示 -->
    <div v-if="isAnimating" class="animation-hint">{{ transportMode === 'air' ? '✈️' : '🚚' }} 运输中...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
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
const routePoints = ref<Array<{ x: number; y: number; z: number; elevation: number; lon: number; lat: number }>>([]);
const airRoutePoints = ref<Array<{ x: number; y: number; z: number; elevation: number; lon: number; lat: number }>>([]);
const totalDistance = ref(0)
const minElevation = ref(0)
const maxElevation = ref(0)
const isAnimating = ref(false)
const transportMode = ref<'ground' | 'air'>('ground') // 陆运或空运

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
  const lonMin = Number(DEM_BOUNDS.value.lonMin)
  const lonMax = Number(DEM_BOUNDS.value.lonMax)
  const latMin = Number(DEM_BOUNDS.value.latMin)
  const latMax = Number(DEM_BOUNDS.value.latMax)

  const x = (lon - lonMin) / (lonMax - lonMin)
  const y = (lat - latMin) / (latMax - latMin)

  const worldX = (x - 0.5) * TERRAIN_SIZE
  const worldZ = (y - 0.5) * TERRAIN_SIZE

  // 获取该位置的高程
  const rasterX = Math.max(0, Math.min(width - 1, Math.floor(x * width)))
  const rasterY = Math.max(0, Math.min(height - 1, Math.floor(y * height)))
  const rasterIndex = rasterY * width + rasterX
  const elevation = raster[rasterIndex] || min
  const normalizedHeight = (elevation - min) / (max - min)
  const worldY = normalizedHeight * 1.0

  return { x: worldX, y: worldY, z: worldZ, elevation }
}

// 世界坐标转地理坐标
function worldToGeo(worldX: number, worldZ: number) {
  const lonMin = Number(DEM_BOUNDS.value.lonMin)
  const lonMax = Number(DEM_BOUNDS.value.lonMax)
  const latMin = Number(DEM_BOUNDS.value.latMin)
  const latMax = Number(DEM_BOUNDS.value.latMax)

  const normX = worldX / TERRAIN_SIZE + 0.5
  const normZ = worldZ / TERRAIN_SIZE + 0.5
  const lon = lonMin + normX * (lonMax - lonMin)
  const lat = latMin + normZ * (latMax - latMin)
  return { lon, lat }
}

// 创建路线点标记
function createRouteMarker(index: number, totalPoints: number) {
  // 只在起点和终点创建标记
  if (index !== 0 && index !== totalPoints - 1) {
    return null
  }

  const geometry = new THREE.SphereGeometry(0.12, 16, 16)
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
  console.log('🎨 开始绘制路线，点数:', routePoints.value.length)
  
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
    if (marker.geometry) marker.geometry.dispose()
    if (marker.material instanceof THREE.Material) {
      marker.material.dispose()
    }
  })
  routeMarkers = []

  const points = transportMode.value === 'ground' ? routePoints.value : airRoutePoints.value
  if (points.length === 0) return
  
  // 根据运输模式确定高度偏移
  const heightOffset = transportMode.value === 'air' ? 0.3 : 0.05
  
  // 绘制路线点标记（起始点）
  const startMarker = createRouteMarker(0, points.length)
  if (startMarker) {
    const startPoint = points[0]
    startMarker.position.set(startPoint.x, startPoint.y + 0.05, startPoint.z)
    scene.add(startMarker)
    routeMarkers.push(startMarker)
  }
  
  const endMarker = createRouteMarker(points.length - 1, points.length)
  if (endMarker) {
    const endPoint = points[points.length - 1]
    endMarker.position.set(endPoint.x, endPoint.y + 0.05, endPoint.z)
    scene.add(endMarker)
    routeMarkers.push(endMarker)
  }

  if (points.length < 2) return

  // 创建完整路线（半透明背景）
  const allPoints: THREE.Vector3[] = []
  points.forEach((point) => {
    allPoints.push(new THREE.Vector3(point.x, point.y + 0.05, point.z))
  })

  const bgGeometry = new THREE.BufferGeometry().setFromPoints(allPoints)
  const lineColor = transportMode.value === 'ground' ? 0xffff00 : 0xff0000 // 陆运黄色，空运红色
  const opacity = transportMode.value === 'air' ? 1.0 : 0.6 // 空运更不透明
  
  // 为空运线条创建更粗的线条效果（使用双线或增加透明度）
  const bgMaterial = new THREE.LineBasicMaterial({
    color: lineColor,
    transparent: true,
    opacity: opacity,
    depthTest: true,
    depthWrite: false,
    fog: false,
    linewidth: transportMode.value === 'air' ? 3 : 1 // 尝试增加线条宽度
  })

  routeLine = new THREE.Line(bgGeometry, bgMaterial)
  routeLine.renderOrder = 999
  scene.add(routeLine)
  
  console.log(`✅ 路线绘制完成 (${transportMode.value === 'ground' ? '陆运' : '空运'}，点数: ${points.length})`, {
    mostHighPoint: Math.max(...points.map(p => p.y)),
    mostLowPoint: Math.min(...points.map(p => p.y))
  })

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

  const points = transportMode.value === 'ground' ? routePoints.value : airRoutePoints.value
  if (points.length < 2) return

  // 清除旧的动画线
  if (animatedLine) {
    scene.remove(animatedLine)
    animatedLine.geometry.dispose()
    if (animatedLine.material instanceof THREE.Material) {
      animatedLine.material.dispose()
    }
  }

  // 计算当前应该绘制到哪个点
  const totalPoints = points.length
  const currentPointIndex = Math.floor(routeAnimationProgress * (totalPoints - 1))
  const segmentProgress = routeAnimationProgress * (totalPoints - 1) - currentPointIndex

  if (currentPointIndex >= totalPoints - 1) {
    // 动画完成
    isAnimating.value = false

    // 移除移动标记
    if (movingMarker) {
      scene.remove(movingMarker)
      movingMarker = null
    }
    return
  }

  // 创建动画路线点
  const animPoints: THREE.Vector3[] = []

  // 根据运输模式确定高度偏移
  const heightOffset = transportMode.value === 'air' ? 0.3 : 0.05
  
  // 添加已完成的点
  for (let i = 0; i <= currentPointIndex; i++) {
    const p = points[i]
    animPoints.push(new THREE.Vector3(p.x, p.y + heightOffset, p.z))
  }

  // 添加当前段的插值点
  if (currentPointIndex < totalPoints - 1) {
    const p1 = points[currentPointIndex]
    const p2 = points[currentPointIndex + 1]

    const interpolatedPoint = new THREE.Vector3(
      p1.x + (p2.x - p1.x) * segmentProgress,
      p1.y + (p2.y - p1.y) * segmentProgress + heightOffset,
      p1.z + (p2.z - p1.z) * segmentProgress
    )
    animPoints.push(interpolatedPoint)
    
    // 更新或创建移动标记
    if (!movingMarker) {
      const geometry = new THREE.SphereGeometry(0.1, 16, 16)
      const markerColor = transportMode.value === 'ground' ? 0x00ffff : 0xff6600
      const material = new THREE.MeshBasicMaterial({
        color: markerColor,
        depthTest: true
      })
      movingMarker = new THREE.Mesh(geometry, material)
      movingMarker.renderOrder = 1002
      scene.add(movingMarker)
    }
    movingMarker.position.copy(interpolatedPoint)
    movingMarker.position.y += 0.12
  }

  // 创建动画线
  const animGeometry = new THREE.BufferGeometry().setFromPoints(animPoints)
  const lineColor = transportMode.value === 'ground' ? 0xff0000 : 0xff6600
  const animOpacity = transportMode.value === 'air' ? 1.0 : 1.0
  const animMaterial = new THREE.LineBasicMaterial({
    color: lineColor,
    transparent: true,
    opacity: animOpacity,
    depthTest: true,
    depthWrite: false,
    fog: false
  })

  animatedLine = new THREE.Line(animGeometry, animMaterial)
  animatedLine.renderOrder = 1000
  scene.add(animatedLine)
}

// 切换动画
function toggleAnimation() {
  const points = transportMode.value === 'ground' ? routePoints.value : airRoutePoints.value
  if (points.length < 2) return

  isAnimating.value = !isAnimating.value

  if (isAnimating.value) {
    routeAnimationProgress = 0
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
  const points = transportMode.value === 'ground' ? routePoints.value : airRoutePoints.value
  if (points.length < 2) {
    totalDistance.value = 0
    minElevation.value = 0
    maxElevation.value = 0
    return
  }

  let distance = 0
  let minElev = Infinity
  let maxElev = -Infinity

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i]
    const p2 = points[i + 1]

    // 计算地理距离（使用经纬度）
    const lat1 = p1.lat
    const lon1 = p1.lon
    const lat2 = p2.lat
    const lon2 = p2.lon

    // 使用 Haversine 公式计算球面距离
    const R = 6371 // 地球半径（公里）
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const segmentDistance = R * c

    distance += segmentDistance

    minElev = Math.min(minElev, p1.elevation, p2.elevation)
    maxElev = Math.max(maxElev, p1.elevation, p2.elevation)
  }

  totalDistance.value = distance
  minElevation.value = Math.round(minElev)
  maxElevation.value = Math.round(maxElev)

  console.log('📊 路线统计:', {
    总距离: distance.toFixed(2) + ' km',
    最小海拔: minElevation.value + ' m',
    最大海拔: maxElevation.value + ' m'
  })
}

// 自动生成路线（基于地形分析）
function generateAutoRoute() {
  console.log('🚀 开始自动生成运输路线...')
  console.log('DEM范围:', DEM_BOUNDS.value)
  console.log('DEM尺寸:', demWidth, 'x', demHeight)

  // 确保 DEM 边界值是数字类型
  const lonMin = Number(DEM_BOUNDS.value.lonMin)
  const lonMax = Number(DEM_BOUNDS.value.lonMax)
  const latMin = Number(DEM_BOUNDS.value.latMin)
  const latMax = Number(DEM_BOUNDS.value.latMax)

  // 定义起点和终点（基于DEM范围）
  const lonRange = lonMax - lonMin
  const latRange = latMax - latMin
  
  const startLon = lonMin + lonRange * 0.2
  const startLat = latMin + latRange * 0.3

  const endLon = lonMin + lonRange * 0.8
  const endLat = latMin + latRange * 0.7

  console.log('起点经纬度:', { lon: startLon.toFixed(6), lat: startLat.toFixed(6) })
  console.log('终点经纬度:', { lon: endLon.toFixed(6), lat: endLat.toFixed(6) })

  // 获取起点和终点的世界坐标
  const startPos = geoToWorld(startLon, startLat, demRaster, demWidth, demHeight, demMin, demMax)
  const endPos = geoToWorld(endLon, endLat, demRaster, demWidth, demHeight, demMin, demMax)

  console.log('起点世界坐标:', startPos)
  console.log('终点世界坐标:', endPos)

  // 先生成关键控制点（用于构建曲线）
  const numControlPoints = 6
  const controlPoints: Array<{ lon: number; lat: number }> = []

  // 添加起点
  controlPoints.push({ lon: startLon, lat: startLat })

  // 生成中间控制点（带随机偏移）
  for (let i = 1; i < numControlPoints; i++) {
    const t = i / numControlPoints
    const interpLon = startLon + (endLon - startLon) * t
    const interpLat = startLat + (endLat - startLat) * t

    // 添加随机偏移使路线更自然
    const randomOffset = lonRange * 0.05
    const offsetLon = interpLon + (Math.random() - 0.5) * randomOffset
    const offsetLat = interpLat + (Math.random() - 0.5) * randomOffset

    const clampedLon = Math.max(lonMin, Math.min(lonMax, offsetLon))
    const clampedLat = Math.max(latMin, Math.min(latMax, offsetLat))

    controlPoints.push({ lon: clampedLon, lat: clampedLat })
  }
  
  // 添加终点
  controlPoints.push({ lon: endLon, lat: endLat })

  console.log('控制点数量:', controlPoints.length)

  // 使用 Catmull-Rom 样条插值生成平滑路径点
  const numInterpolatedPoints = 200
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
      elevation: pointPos.elevation,
      lon: lon,
      lat: lat
    })
  }

  routePoints.value = points
  
  // 生成空运路线（和陆运相同路径，但高度更高）
  generateAirRoute(points)
  
  drawRoute()

  console.log(`✅ 自动生成平滑路线完成，共 ${points.length} 个路径点`)

  // 自动开始播放动画
  setTimeout(() => {
    const currentPoints = transportMode.value === 'ground' ? routePoints.value : airRoutePoints.value
    if (currentPoints.length >= 2) {
      toggleAnimation()
    }
  }, 1000)
}

// 生成空运路线（和陆运相同路径，但有起飞降落弧度）
function generateAirRoute(groundPoints: Array<{ x: number; y: number; z: number; elevation: number; lon: number; lat: number }>) {
  const airPoints: Array<{ x: number; y: number; z: number; elevation: number; lon: number; lat: number }> = []
  
  // 找到陆运路线的最高点
  let maxGroundY = -Infinity
  groundPoints.forEach(p => {
    if (p.y > maxGroundY) maxGroundY = p.y
  })
  
  // 空运巡航高度（在最高点基础上抬高）
  const cruiseHeight = maxGroundY + 0.5
  const totalPoints = groundPoints.length
  
  groundPoints.forEach((point, i) => {
    const progress = i / (totalPoints - 1)
    
    // 使用正弦函数生成起飞降落弧度
    // 起点和终点高度为地面高度，中间达到巡航高度
    const arcProgress = Math.sin(progress * Math.PI)
    const currentHeight = point.y + arcProgress * (cruiseHeight - point.y)
    
    airPoints.push({
      x: point.x,
      y: currentHeight,
      z: point.z,
      elevation: currentHeight,
      lon: point.lon,
      lat: point.lat
    })
  })
  
  airRoutePoints.value = airPoints
  console.log(`✅ 空运路线生成完成，共 ${airPoints.length} 个路径点，巡航高度: ${cruiseHeight.toFixed(3)}`)
}

// 切换运输模式
function switchTransportMode(mode: 'ground' | 'air') {
  if (transportMode.value === mode) return
  
  isAnimating.value = false
  
  // 清除旧的动画
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
  
  // 切换模式
  transportMode.value = mode
  
  // 重新绘制路线
  routeAnimationProgress = 0
  drawRoute()
  
  console.log(`🖄 切换运输模式为: ${mode === 'ground' ? '陆运' : '空运'}`)
}

// 显示不支持的运输模式提示
function showUnsupportedMessage(transportType: string) {
  ElMessage.warning(`当前地块不满足${transportType}运输条件`)
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

.action-hint {
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  font-style: italic;
}

.loading-hint {
  margin: 0;
  padding: 10px 0;
  text-align: center;
  color: #999;
  font-size: 14px;
  font-style: italic;
}

.mode-selector {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  z-index: 1000;
}

.mode-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.mode-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.mode-btn.active {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  border-color: #1976d2;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
}

.info-label-header {
  font-size: 13px;
  color: #2196f3;
  font-weight: bold;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}
</style>
