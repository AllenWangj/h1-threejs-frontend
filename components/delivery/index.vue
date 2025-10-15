<template>
  <div  class="w-[100%] h-[100%] " v-loading="loading">
    <div ref="container" class="w-[100%] h-[100%]"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

declare global {
  interface Window {
    compassGroup?: THREE.Group;
  }
}
import * as THREE from 'three'
import { fromArrayBuffer } from 'geotiff'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { getProjectSiteDetail, getProjectSitePlanDetail } from '@/apis/project'
const props = defineProps<{
 planId:any
}>()
const route = useRoute()
const projectId = ref('')
const gis = ref({
  url: '',
  demUrl: '',
  satelliteUrl: ''
})
// onMounted(() =>{
//      init()
// })
// 获取详情
watch(() =>props.planId,(newValue) =>{
    console.log("计划id:",newValue)
    fetchPlanDetail(newValue)
},{
    immediate:true
})
async function fetchPlanDetail(planId) {
  try {
    const { data: plan } = await getProjectSitePlanDetail({
      planId
    })
    gis.value = plan.gis || {}

    // 使用 nextTick 确保 DOM 已完全渲染
    nextTick(() => {
      // 延迟初始化,避免与其他 WebGL 上下文冲突
      setTimeout(() => {
        console.log('开始初始化 Three.js 场景...')
        init()
      }, 100)
    })

    console.log('获取方案详情', plan)
  } catch (error) {
    console.error('获取方案详情失败', error)
      gis.value = {
        url: 'https://support.maxtan.cn/geoserver/h1/wcs?' +
      'service=WCS&version=2.0.1&request=GetCoverage&coverageId=h1:dem_103651411094409222' +
      '&format=image/tiff&subset=Long(106,107)&subset=Lat(26,27)&resx=0.001&resy=0.001',
      demUrl: "",
    satelliteUrl: "",
      }
       setTimeout(() => {
        console.log('开始初始化 Three.js 场景...')
        init()
      }, 100)
  }
}




const container = ref(null)
let scene, camera, renderer, controls, animationId
let terrainMesh = null
let satelliteTexture = null
let raycaster, mouse
let pointMarkers = []
const selectedPoint = ref(null)

// 加载状态
const loading = ref(false)
const loadingText = ref('初始化场景...')
const loadingProgress = ref(0)

// 地形配置参数
const TERRAIN_SIZE = 8 // 地形尺寸 (世界坐标单位)
const DEM_BOUNDS = {
  lonMin: 106,
  lonMax: 107,
  latMin: 26,
  latMax: 27
}

// 示例点位数据 (EPSG:4326 坐标系统)
const pointsData = [
  {
    id: 1,
    name: '观测站A',
    lon: 106.1,
    lat: 26.1,
    type: '气象站',
    description: '主要观测温度、湿度、降雨量'
  },
  {
    id: 2,
    name: '观测站B',
    lon: 106.7,
    lat: 26.35,
    type: '水文站',
    description: '监测河流水位和流量'
  },
//   {
//     id: 3,
//     name: '观测站C',
//     lon: 106.5,
//     lat: 26.7,
//     description: '地质灾害监测点'
//   }
]

// 加载小范围 DEM
async function loadDEM(url) {
  const resp = await fetch(url)
  const buffer = await resp.arrayBuffer()
  const tiff = await fromArrayBuffer(buffer)
  const image = await tiff.getImage()
  const raster = await image.readRasters({ interleave: true })
  return { raster, width: image.getWidth(), height: image.getHeight() }
}

// 获取最小/最大值
function getMinMax(array) {
  let min = Infinity,
    max = -Infinity
  for (let i = 0; i < array.length; i++) {
    const v = array[i]
    if (v < min) min = v
    if (v > max) max = v
  }
  return { min, max }
}

// 处理窗口大小变化
function onWindowResize() {
  if (camera && renderer && container.value) {
    camera.aspect = container.value.clientWidth / container.value.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  }
}

// 关闭点位信息面板
function closePointInfo() {
  selectedPoint.value = null
}

// 将地理坐标转换为 3D 空间坐标
function geoToWorld(lon, lat, demBounds, terrainSize, rasterData, rasterWidth, rasterHeight, minElevation, maxElevation) {
  // 归一化到 0-1 范围
  const x = (lon - demBounds.lonMin) / (demBounds.lonMax - demBounds.lonMin)
  const y = (lat - demBounds.latMin) / (demBounds.latMax - demBounds.latMin)

  // 从 DEM 栅格数据中查询该位置的高程
  const rasterX = Math.floor(x * (rasterWidth - 1))
  const rasterY = Math.floor(y * (rasterHeight - 1))
  const rasterIndex = rasterY * rasterWidth + rasterX
  const elevation = rasterData[rasterIndex] || minElevation

  // 归一化高程
  const normalizedHeight = (elevation - minElevation) / (maxElevation - minElevation)
  const heightValue = normalizedHeight * 1.0 // 与地形的 scale 一致

  // 转换到世界坐标 (考虑地形旋转)
  return {
    x: (x - 0.5) * terrainSize,
    y: heightValue + 0.15, // DEM 高程 + 0.15 偏移,让标记浮在地形上
    z: -(y - 0.5) * terrainSize // 负号因为地形旋转了
  }
}

// 创建点位标记 - 改为地图标记样式
function createPointMarker(pointData, worldPos) {
  const group = new THREE.Group()

  // 创建标记底座 (圆锥形,尖端朝下)
  const coneGeometry = new THREE.ConeGeometry(0.08, 0.25, 8)
  const coneMaterial = new THREE.MeshStandardMaterial({
    color: 0xff4444,
    emissive: 0xff0000,
    emissiveIntensity: 0.3,
    metalness: 0.3,
    roughness: 0.7
  })
  const cone = new THREE.Mesh(coneGeometry, coneMaterial)
  cone.rotation.x = Math.PI // 翻转使尖端朝下
  cone.position.y = 0.125 // 调整位置
  group.add(cone)

  // 创建顶部圆球 (标记点)
  const sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16)
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xff5555,
    emissive: 0xff3333,
    emissiveIntensity: 0.5,
    metalness: 0.1,
    roughness: 0.4
  })
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.position.y = 0.25
  group.add(sphere)

  // 添加内部白色圆点
  const dotGeometry = new THREE.SphereGeometry(0.04, 12, 12)
  const dotMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff
  })
  const dot = new THREE.Mesh(dotGeometry, dotMaterial)
  dot.position.y = 0.25
  group.add(dot)

  // 添加光晕效果 (可选)
  const glowGeometry = new THREE.RingGeometry(0.08, 0.12, 16)
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xff4444,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
  })
  const glow = new THREE.Mesh(glowGeometry, glowMaterial)
  glow.rotation.x = -Math.PI / 2
  glow.position.y = 0.01
  group.add(glow)

  // 设置整体位置
  group.position.set(worldPos.x, worldPos.y, worldPos.z)

  // 保存点位数据
  group.userData = pointData

  return group
}

// 创建方位指示器 (指南针)
function createCompass() {
  const compassGroup = new THREE.Group()

  // 创建圆盘底座
  const circleGeometry = new THREE.CircleGeometry(0.15, 32)
  const circleMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
  })
  const circle = new THREE.Mesh(circleGeometry, circleMaterial)
  circle.rotation.x = -Math.PI / 2
  compassGroup.add(circle)

  // 创建北向箭头 (红色)
  const arrowNorthGeometry = new THREE.ConeGeometry(0.05, 0.15, 8)
  const arrowNorthMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  const arrowNorth = new THREE.Mesh(arrowNorthGeometry, arrowNorthMaterial)
  arrowNorth.rotation.x = -Math.PI / 2
  arrowNorth.position.z = 0.075
  compassGroup.add(arrowNorth)

  // 创建南向箭头 (白色)
  const arrowSouthGeometry = new THREE.ConeGeometry(0.05, 0.15, 8)
  const arrowSouthMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc })
  const arrowSouth = new THREE.Mesh(arrowSouthGeometry, arrowSouthMaterial)
  arrowSouth.rotation.x = Math.PI / 2
  arrowSouth.position.z = -0.075
  compassGroup.add(arrowSouth)

  // 添加 N 标记 (使用文字精灵)
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#000000'
  ctx.font = 'bold 48px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('N', 32, 32)

  const texture = new THREE.CanvasTexture(canvas)
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture })
  const sprite = new THREE.Sprite(spriteMaterial)
  sprite.scale.set(0.12, 0.12, 1)
  sprite.position.z = 0.15
  sprite.position.y = 0.05
  compassGroup.add(sprite)

  // 放置在地形右下角
  compassGroup.position.set(3.5, 0.05, -3.5)
  scene.add(compassGroup)

  // 保存引用以便后续更新
  window.compassGroup = compassGroup
}

// 处理鼠标点击事件
function onMouseClick(event) {
  if (!camera || !renderer) return

  // 计算鼠标在归一化设备坐标中的位置
  const rect = renderer.domElement.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  // 更新射线
  raycaster.setFromCamera(mouse, camera)

  // 检测与点位标记的交互
  const intersects = raycaster.intersectObjects(pointMarkers, true)

  if (intersects.length > 0) {
    // 找到最近的标记
    let markerObj = intersects[0].object
    while (markerObj.parent && !markerObj.userData.id) {
      markerObj = markerObj.parent
    }

    if (markerObj.userData.id) {
      selectedPoint.value = markerObj.userData
      console.log('选中点位:', markerObj.userData)
    }
  }
}
function createArrowLine(p1, p2, options = {color : 0x00ffff,
        lineWidth :2,
        arrowSize :0.1 }) {
    // 默认参数
    const {
        color = 0x00ffff,
        lineWidth = 2,
        arrowSize = 0.1 // 箭头大小比例
    } = options;

    // 创建组来包含线和箭头
    const group = new THREE.Group();

    // 1. 绘制线段
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([p1, p2]);
    const lineMaterial = new THREE.LineBasicMaterial({
        color: color,
        linewidth: lineWidth
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    group.add(line);

    // 2. 计算箭头方向和位置（箭头放在终点）
    const direction = new THREE.Vector3().subVectors(p2, p1).normalize();
    
    // 计算箭头长度（根据线段长度的一定比例）
    const lineLength = new THREE.Vector3().subVectors(p2, p1).length();
    const arrowLength = Math.max(lineLength * 0.1, arrowSize); // 至少保证最小箭头大小

    // 创建箭头几何体
    const arrowGeometry = new THREE.ConeGeometry(arrowLength * 0.3, arrowLength, 12);
    const arrowMaterial = new THREE.MeshBasicMaterial({ color: color });
    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);

    // 设置箭头位置（终点位置）
    arrow.position.copy(p2);

    // 计算箭头旋转（让箭头指向线段方向）
    // 箭头默认指向Y轴，需要旋转使其指向线段方向
    const axis = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), direction);
    const angle = new THREE.Vector3(0, 1, 0).angleTo(direction);
    arrow.quaternion.setFromAxisAngle(axis, angle);

    // 箭头底部对齐到终点
    arrow.position.sub(direction.clone().multiplyScalar(arrowLength));
    
    group.add(arrow);

    return group;
}

async function init() {
  try {
    loading.value = true
    loadingProgress.value = 0
    loadingText.value = '初始化场景...'

    // 确保容器已经挂载
    if (!container.value) {
      console.error('容器元素未挂载')
      loading.value = false
      return
    }

    // 检查 WebGL 支持
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

    if (!gl) {
      console.error('浏览器不支持 WebGL 或 WebGL 已被禁用')
      alert('您的浏览器不支持 WebGL,无法加载 3D 地形。请使用 Chrome、Firefox 或 Edge 浏览器。')
      loading.value = false
      return
    }

    // 清理测试 canvas
    canvas.remove()

    loadingProgress.value = 10
    loadingText.value = '创建 WebGL 渲染器...'

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x87ceeb) // 天蓝色背景
    scene.fog = new THREE.Fog(0x87ceeb, 1, 100) // 添加雾效果
    camera = new THREE.PerspectiveCamera(60, container.value.clientWidth / container.value.clientHeight, 0.1, 1000)
    camera.position.set(0, 3, 5)
    camera.lookAt(0, 0, 0)

    // 创建 WebGL 渲染器,添加上下文丢失处理
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false
      })
    } catch (error) {
      console.error('创建 WebGL 渲染器失败:', error)
      alert('创建 3D 渲染器失败,请刷新页面重试或关闭其他占用 GPU 的网页。')
      loading.value = false
      return
    }

    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1)) // 降低像素比到 1,大幅减少渲染负担
    renderer.shadowMap.enabled = false // 关闭阴影
    renderer.toneMapping = THREE.NoToneMapping // 关闭色调映射,减少计算
    renderer.toneMappingExposure = 1.0

    loadingProgress.value = 20
    loadingText.value = '设置光照和控制器...'

    // 添加 WebGL 上下文丢失/恢复事件监听
    const rendererCanvas = renderer.domElement
    rendererCanvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault()
      console.warn('WebGL 上下文丢失,停止渲染')
      if (animationId) {
        cancelAnimationFrame(animationId)
        animationId = null
      }
    })

    rendererCanvas.addEventListener('webglcontextrestored', () => {
      console.log('WebGL 上下文已恢复,重新初始化')
      setTimeout(() => init(), 100)
    })

    container.value.appendChild(renderer.domElement)
    // 添加轨道控制器
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.screenSpacePanning = false
    controls.minDistance = 0.5
    controls.maxDistance = 50
    controls.maxPolarAngle = Math.PI / 2
    controls.enableRotate = true
    controls.enableZoom = true
    controls.enablePan = true

    // 改进的光照系统
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3) // 降低环境光
    scene.add(ambientLight)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0)
    dirLight.position.set(10, 20, 10)
    scene.add(dirLight)
    // 添加天光
    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x362d1b, 0.5)
    scene.add(hemiLight)

    loadingProgress.value = 30
    loadingText.value = '加载 DEM 高程数据...'

    // 加载 DEM 小片
    const dem = await loadDEM(gis.value.url ||
      'https://support.maxtan.cn/geoserver/h1/wcs?' +
      'service=WCS&version=2.0.1&request=GetCoverage&coverageId=h1:dem_103651411094409222' +
      '&format=image/tiff&subset=Long(106,107)&subset=Lat(26,27)&resx=0.001&resy=0.001'
    )  // 降采样（减少降采样步长获得更高分辨率）
    const step = 8 // 大幅增加降采样,减少顶点数量避免 CPU 过载 (原来是 4)
    const width = Math.floor(dem.width / step)
    const height = Math.floor(dem.height / step)

    // 限制最大网格尺寸,防止 CPU 过载
    const maxGridSize = 150 // 降低到 150x150 网格
    if (width > maxGridSize || height > maxGridSize) {
      console.warn(`网格过大 (${width}x${height}),强制限制`)
      alert(`为优化性能,自动调整网格尺寸`)
    }

    const raster = new Float32Array(Math.min(width, maxGridSize) * Math.min(height, maxGridSize))
    const finalWidth = Math.min(width, maxGridSize)
    const finalHeight = Math.min(height, maxGridSize)

    for (let y = 0; y < finalHeight; y++) {
      for (let x = 0; x < finalWidth; x++) {
        raster[y * finalWidth + x] = dem.raster[y * step * dem.width + x * step] as number
      }
    }
    const { min, max } = getMinMax(raster)
    const scale = 1.0 // 增强高度差异

    loadingProgress.value = 50
    loadingText.value = '生成地形网格...'
    // 添加高度数据统计信息
    console.log(`DEM 数据统计:`)
    console.log(`最小高度: ${min}m`)
    console.log(`最大高度: ${max}m`)
    console.log(`高度差: ${max - min}m`)
    console.log(`网格大小: ${finalWidth} x ${finalHeight}`)
    console.log(`总顶点数: ${(finalWidth * finalHeight).toLocaleString()}`)

    // 创建PlaneGeometry并设置高度
    const geometry = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, finalWidth - 1, finalHeight - 1)
    const positions = geometry.attributes.position.array

    // 优化高度映射算法 - 简化计算
    for (let i = 0; i < finalWidth; i++) {
      for (let j = 0; j < finalHeight; j++) {
        const index = j * finalWidth + i
        const normalizedHeight = (raster[index] - min) / (max - min)
        // 简化高度计算,减少 CPU 负担
        const heightValue = normalizedHeight * scale
        positions[index * 3 + 2] = heightValue
      }
    }

    geometry.attributes.position.needsUpdate = true
    geometry.computeVertexNormals()

    loadingProgress.value = 70
    loadingText.value = '加载卫星影像...'

    // 加载离线卫星影像纹理
    async function loadOfflineSatelliteTexture(imagePath) {
      return new Promise((resolve, reject) => {
        const loader = new THREE.TextureLoader()
        loader.load(
          imagePath,
          (texture) => {
            texture.wrapS = THREE.ClampToEdgeWrapping
            texture.wrapT = THREE.ClampToEdgeWrapping
            texture.minFilter = THREE.LinearFilter
            texture.magFilter = THREE.LinearFilter
            console.log('✅ 离线卫星影像加载成功')
            resolve(texture)
          },
          undefined,
          (error) => {
            console.error('❌ 离线卫星影像加载失败')
            alert('请将 satellite.jpg 文件放到 public 目录下!')
            reject(error)
          }
        )
      })
    }
    // 加载离线卫星纹理
    satelliteTexture = await loadOfflineSatelliteTexture(gis.value.satelliteUrl || 'https://static.maxtan.cn/h1-static/uploads/20251014/486dbfda30c535f25d8404c0.jpg')

    loadingProgress.value = 80
    loadingText.value = '创建地形模型...'

    // 创建地形材质 - 直接使用卫星图 + 高程地形
    const material = new THREE.MeshStandardMaterial({
      map: satelliteTexture,
      flatShading: false,
      side: THREE.DoubleSide
    })
    // 使用带高程的地形几何体 + 卫星图纹理
    terrainMesh = new THREE.Mesh(geometry, material)
    terrainMesh.rotation.x = -Math.PI / 2
    scene.add(terrainMesh)

    loadingProgress.value = 90
    loadingText.value = '添加点位标记...'
    // 初始化射线投射器用于点击检测
    raycaster = new THREE.Raycaster()
    mouse = new THREE.Vector2()
    const lineData :any[]= [] 
    // 添加点位标记
    pointsData.forEach((point: any) => {
      const worldPos = geoToWorld(
        point.lon,
        point.lat,
        DEM_BOUNDS,
        TERRAIN_SIZE,
        raster, // DEM 栅格数据
        finalWidth,
        finalHeight,
        min,
        max
      )
        lineData.push(worldPos)
      // 计算该点的实际海拔高度(米)
      const x = (point.lon - DEM_BOUNDS.lonMin) / (DEM_BOUNDS.lonMax - DEM_BOUNDS.lonMin)
      const y = (point.lat - DEM_BOUNDS.latMin) / (DEM_BOUNDS.latMax - DEM_BOUNDS.latMin)
      const rasterX = Math.floor(x * (finalWidth - 1))
      const rasterY = Math.floor(y * (finalHeight - 1))
      const rasterIndex = rasterY * finalWidth + rasterX
      const elevation = Math.round(raster[rasterIndex] || min) // 实际海拔(米)

      // 将海拔数据保存到点位信息中
      point.elevation = elevation

      const marker = createPointMarker(point, worldPos)
      scene.add(marker)
      pointMarkers.push(marker)

      console.log(`添加点位: ${point.name} at (${point.lon}, ${point.lat}), DEM海拔: ${elevation}m, 世界坐标: (${worldPos.x.toFixed(2)}, ${worldPos.y.toFixed(2)}, ${worldPos.z.toFixed(2)})`)
    })
    // 添加鼠标点击事件监听
   const group =  createArrowLine(lineData[0],lineData[1])
    // renderer.domElement.addEventListener('click', onMouseClick)
    // 添加方位指示器 (指南针)
    scene.add(group)
    createCompass()

    loadingProgress.value = 100
    loadingText.value = '加载完成!'

    // 延迟隐藏加载提示
    setTimeout(() => {
      loading.value = false
    }, 500)
    // 渲染循环 - 优化性能,按需渲染
    let needsRender = true

    function render() {
      if (needsRender && renderer && scene && camera) {
        renderer.render(scene, camera)
        needsRender = false
      }
    }

    function animate() {
      if (!renderer || !scene || !camera) return

      animationId = requestAnimationFrame(animate)

      // 只在控制器有变化时才渲染
      if (controls.enabled && controls.update()) {
        needsRender = true
      }

      render()
    }

    // 监听控制器变化
    controls.addEventListener('change', () => {
      needsRender = true
    })

    animate()

    window.addEventListener('resize', onWindowResize)
  } catch (error) {
    console.error('初始化失败:', error)
    ElMessage.error('3D 场景初始化失败: ' + error.message)
    loading.value = false
  }
}

onMounted(() => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
  }
 
})

onUnmounted(() => {
  // 停止动画循环
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }

  // 移除事件监听
  window.removeEventListener('resize', onWindowResize)
  if (renderer && renderer.domElement) {
    renderer.domElement.removeEventListener('click', onMouseClick)
  }

  // 清理 Three.js 资源
  if (terrainMesh) {
    terrainMesh.geometry.dispose()
    terrainMesh.material.dispose()
  }

  if (satelliteTexture) satelliteTexture.dispose()

  // 清理点位标记
  pointMarkers.forEach(marker => {
    if (marker.geometry) marker.geometry.dispose()
    if (marker.material) marker.material.dispose()
  })
  pointMarkers = []

  if (controls) controls.dispose()

  if (renderer) {
    renderer.dispose()
    renderer.forceContextLoss()
    renderer = null
  }

  if (scene) {
    scene.clear()
    scene = null
  }

  console.log('Three.js 资源已清理')
})
</script>

<style scoped>
.info-panel {
  position: fixed;
  bottom: 10px;
  left: 10px;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.9);
  padding: 12px 16px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.info-panel p {
  margin: 4px 0;
  font-size: 12px;
  color: #666;
}

.point-info-panel {
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  background: white;
  padding: 0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  width: 300px;
  z-index: 10000;
  overflow: hidden;
}

.point-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.point-header h3 {
  margin: 0;
  color: white;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 20px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.point-content {
  padding: 20px;
}

.point-content p {
  margin: 10px 0;
  font-size: 14px;
  color: #333;
  line-height: 1.6;
}

.point-content strong {
  color: #667eea;
  display: inline-block;
  min-width: 60px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  pointer-events: none;
}

.loading-content {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  text-align: center;
  min-width: 320px;
  pointer-events: auto;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  border: 4px solid rgba(76, 175, 80, 0.2);
  border-top-color: #4CAF50;
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
  background: rgba(76, 175, 80, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin: 0 auto 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  transition: width 0.3s ease;
  border-radius: 4px;
}

.progress-text {
  margin: 0;
  font-size: 14px;
  color: #4CAF50;
  font-weight: bold;
}
</style>
