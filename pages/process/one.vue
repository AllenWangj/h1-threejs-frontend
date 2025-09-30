<template>
  <div ref="container" class="w-full h-full"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { fromArrayBuffer } from 'geotiff'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const container = ref(null)
let scene, camera, renderer, controls, animationId

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
  let min = Infinity, max = -Infinity
  for (let i = 0; i < array.length; i++) {
    const v = array[i]
    if (v < min) min = v
    if (v > max) max = v
  }
  return { min, max }
}

async function init() {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87CEEB) // 天蓝色背景
  scene.fog = new THREE.Fog(0x87CEEB, 1, 100) // 添加雾效果

  camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000)
  camera.position.set(0, 3, 5)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  container.value.appendChild(renderer.domElement)

  // 添加轨道控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.screenSpacePanning = false
  controls.minDistance = 0.5
  controls.maxDistance = 50
  controls.maxPolarAngle = Math.PI / 2

  // 改进的光照系统
  const ambientLight = new THREE.AmbientLight(0x404040, 0.3) // 降低环境光
  scene.add(ambientLight)

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.0)
  dirLight.position.set(10, 20, 10)
  dirLight.castShadow = true
  dirLight.shadow.mapSize.width = 2048
  dirLight.shadow.mapSize.height = 2048
  dirLight.shadow.camera.near = 0.5
  dirLight.shadow.camera.far = 500
  dirLight.shadow.camera.left = -20
  dirLight.shadow.camera.right = 20
  dirLight.shadow.camera.top = 20
  dirLight.shadow.camera.bottom = -20
  scene.add(dirLight)

  // 添加天光
  const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x362d1b, 0.5)
  scene.add(hemiLight)

  // 加载 DEM 小片
  const dem = await loadDEM(
    'https://geoserver.spic.cc/geoserver/h1/wcs?' +
    'service=WCS&version=2.0.1&request=GetCoverage&coverageId=h1:my3dlayer' +
    '&format=image/tiff&subset=Long(106,107)&subset=Lat(26,27)&resx=0.001&resy=0.001'
  )

  // 降采样（减少降采样步长获得更高分辨率）
  const step = 2 // 减少从5到2
  const width = Math.floor(dem.width / step)
  const height = Math.floor(dem.height / step)
  const raster = new Float32Array(width * height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      raster[y * width + x] = dem.raster[(y * step) * dem.width + (x * step)]
    }
  }

  const { min, max } = getMinMax(raster)
  const scale = 1.0 // 增强高度差异
  
  // 添加高度数据统计信息
  console.log(`DEM 数据统计:`)
  console.log(`最小高度: ${min}m`)
  console.log(`最大高度: ${max}m`) 
  console.log(`高度差: ${max - min}m`)
  console.log(`网格大小: ${width} x ${height}`)

  // 创建PlaneGeometry并设置高度
  const geometry = new THREE.PlaneGeometry(8, 8, width - 1, height - 1) // 增加地形尺寸
  const positions = geometry.attributes.position.array
  
  // 优化高度映射算法
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const index = j * width + i
      const normalizedHeight = (raster[index] - min) / (max - min)
      // 使用平滑曲线增强地形起伏
      const heightValue = Math.pow(normalizedHeight, 0.8) * scale
      positions[index * 3 + 2] = heightValue
    }
  }
  
  geometry.attributes.position.needsUpdate = true
  geometry.computeVertexNormals()

  // 创建增强的高度颜色映射材质
  function createEnhancedHeightMaterial(width, height, raster, min, max) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    const imageData = ctx.createImageData(width, height)
    
    // 定义高度色带
    const colorStops = [
      { ratio: 0.0, color: [0, 100, 200] },   // 深蓝 - 低海拔
      { ratio: 0.2, color: [0, 150, 255] },   // 浅蓝
      { ratio: 0.3, color: [100, 200, 100] }, // 绿色 - 平原
      { ratio: 0.5, color: [150, 220, 100] }, // 浅绿
      { ratio: 0.7, color: [200, 180, 100] }, // 黄绿 - 丘陵
      { ratio: 0.85, color: [180, 120, 80] }, // 棕色 - 山地
      { ratio: 1.0, color: [255, 255, 255] }  // 白色 - 高山
    ]
    
    for (let i = 0; i < raster.length; i++) {
      const normalized = (raster[i] - min) / (max - min)
      
      // 找到对应的颜色区间
      let color = [100, 150, 100] // 默认颜色
      for (let j = 0; j < colorStops.length - 1; j++) {
        if (normalized >= colorStops[j].ratio && normalized <= colorStops[j + 1].ratio) {
          const t = (normalized - colorStops[j].ratio) / (colorStops[j + 1].ratio - colorStops[j].ratio)
          color = [
            Math.floor(colorStops[j].color[0] + t * (colorStops[j + 1].color[0] - colorStops[j].color[0])),
            Math.floor(colorStops[j].color[1] + t * (colorStops[j + 1].color[1] - colorStops[j].color[1])),
            Math.floor(colorStops[j].color[2] + t * (colorStops[j + 1].color[2] - colorStops[j].color[2]))
          ]
          break
        }
      }
      
      imageData.data[i * 4] = color[0]
      imageData.data[i * 4 + 1] = color[1]
      imageData.data[i * 4 + 2] = color[2]
      imageData.data[i * 4 + 3] = 255
    }
    
    ctx.putImageData(imageData, 0, 0)
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    
    // 使用 MeshPhongMaterial 获得更好的光照效果
    return new THREE.MeshPhongMaterial({
      map: texture,
      transparent: false,
      wireframe: false,
      shininess: 30,
      specular: 0x222222
    })
  }

  // 使用增强的高度颜色映射材质
  const material = createEnhancedHeightMaterial(width, height, raster, min, max)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = -Math.PI / 2
  mesh.receiveShadow = true
  mesh.castShadow = true
  scene.add(mesh)

  // 渲染循环
  function animate() {
    animationId = requestAnimationFrame(animate)
    controls.update() // 更新控制器
    renderer.render(scene, camera)
  }
  animate()

  // 处理窗口大小变化
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  
  window.addEventListener('resize', onWindowResize)
}

onMounted(() => { 
  init() 
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', onWindowResize)
  if (renderer) {
    renderer.dispose()
  }
})
</script>

<style>
html, body, #app, .w-full, .h-full { margin: 0; padding: 0; width: 100%; height: 100%; }
</style>
