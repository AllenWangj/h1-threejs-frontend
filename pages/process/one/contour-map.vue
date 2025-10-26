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
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'

const props = defineProps<{
  demUrl: string
}>()

const container = ref<HTMLElement | null>(null)
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let labelRenderer: CSS2DRenderer
let controls: OrbitControls
let animationId: number
let terrainMesh: THREE.Mesh
let contourLabels: CSS2DObject[] = []

const TERRAIN_SIZE = 8
let demMinHeight = 0
let demMaxHeight = 0

const DEM_BOUNDS = {
  lonMin: 106.2,
  lonMax: 106.3,
  latMin: 26.1,
  latMax: 26.2
}

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
  },
  {
    id: 2,
    name: '选址区B',
    lon: 106.26,
    lat: 26.13,
    radius: 0.25,
    description: '备选厂址',
    elevation: 0
  }
]

let areaMarkers: CSS2DObject[] = []

// 图例数据
const legendItems = ref<Array<{ color: string; label: string }>>([])

// 加载状态
const loading = ref(true)
const loadingText = ref('正在加载地形数据...')
const loadingProgress = ref(0)

// 选中的区域
const selectedArea = ref<any>(null)

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
  const x = (lon - DEM_BOUNDS.lonMin) / (DEM_BOUNDS.lonMax - DEM_BOUNDS.lonMin)
  const y = (lat - DEM_BOUNDS.latMin) / (DEM_BOUNDS.latMax - DEM_BOUNDS.latMin)
  
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

// 添加选址区域标记
function addAreaMarkers(raster: Float32Array, width: number, height: number, min: number, max: number) {
  // 清除旧标记
  areaMarkers.forEach(marker => {
    if (marker.element && marker.element.parentNode) {
      marker.element.parentNode.removeChild(marker.element)
    }
    scene.remove(marker)
  })
  areaMarkers = []
  
  areasData.forEach((area) => {
    const worldPos = geoToWorld(area.lon, area.lat, raster, width, height, min, max)
    area.elevation = Math.round(worldPos.elevation)
    
    // 创建区域圆形边界
    const circleDiv = document.createElement('div')
    circleDiv.className = 'area-marker-circle'    
    circleDiv.style.cssText = `
      width: ${area.radius * 200}px;
      height: ${area.radius * 200}px;
      border: 3px solid #2e7d32;
      border-radius: 50%;
      background: rgba(76, 175, 80, 0.15);
      pointer-events: auto;
      position: relative;
      cursor: pointer;
      transition: all 0.3s;
    `
    
    // 添加点击事件
    circleDiv.addEventListener('click', (e) => {
      e.stopPropagation()
      selectedArea.value = area
    })
    
    circleDiv.addEventListener('mouseenter', () => {
      circleDiv.style.background = 'rgba(76, 175, 80, 0.35)'
      circleDiv.style.borderWidth = '4px'
    })
    
    circleDiv.addEventListener('mouseleave', () => {
      circleDiv.style.background = 'rgba(76, 175, 80, 0.15)'
      circleDiv.style.borderWidth = '3px'
    })
    
    const circleLabel = new CSS2DObject(circleDiv)
    circleLabel.position.set(worldPos.x, 0, worldPos.z)
    scene.add(circleLabel)
    areaMarkers.push(circleLabel)
    
    // 创建区域名称标签
    const nameDiv = document.createElement('div')
    nameDiv.style.cssText = `
      background: rgba(255, 255, 255, 0.95);
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: bold;
      color: #2e7d32;
      border: 2px solid #2e7d32;
      pointer-events: none;
      white-space: nowrap;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    `
    nameDiv.textContent = `${area.name} (${area.elevation}m)`
    
    const nameLabel = new CSS2DObject(nameDiv)
    nameLabel.position.set(worldPos.x, 0, worldPos.z + area.radius + 0.2)
    scene.add(nameLabel)
    areaMarkers.push(nameLabel)
      console.log(`选址区域: ${area.name}, 海拔: ${area.elevation}m, 坐标: (${worldPos.x.toFixed(2)}, ${worldPos.z.toFixed(2)})`)
  })
}

async function init() {
  if (!container.value) return

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
    const minHeight = positions.reduce((a, _, i) => (i % 3 === 2 ? Math.min(a, positions[i]) : a), Infinity)
    const maxHeight = positions.reduce((a, _, i) => (i % 3 === 2 ? Math.max(a, positions[i]) : a), -Infinity)
    
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
    let needsRender = true
    
    function render() {
      if (needsRender && renderer && labelRenderer && scene && camera) {
        renderer.render(scene, camera)
        labelRenderer.render(scene, camera)
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

onMounted(() => {
  init()
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onWindowResize)
  
  // 清理区域标记
  areaMarkers.forEach(marker => {
    if (marker.element && marker.element.parentNode) {
      marker.element.parentNode.removeChild(marker.element)
    }
  })
  areaMarkers = []
  
  if (terrainMesh) {
    terrainMesh.geometry.dispose()
    if (terrainMesh.material instanceof THREE.Material) {
      terrainMesh.material.dispose()
    }
  }
    if (controls) controls.dispose()
  
  if (labelRenderer && labelRenderer.domElement && labelRenderer.domElement.parentNode) {
    labelRenderer.domElement.parentNode.removeChild(labelRenderer.domElement)
  }
  
  if (renderer) {
    renderer.dispose()
    renderer.forceContextLoss()
  }
  
  if (scene) scene.clear()
})
</script>

<style scoped>
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
</style>
