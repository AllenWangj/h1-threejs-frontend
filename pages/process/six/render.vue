<template>
  <div class="flex flex-shrink-0 w-[100%] h-[100%] relative">
    <schemes-list></schemes-list>
    <div class="flex-1 relative border border-[1px] border-[#adcdf7]">
      <div ref="threeContainer" class="three-container"></div>
      <div class="toolbar-container">
        <el-button class="w-[120px]" type="primary" @click="addCube('cube1')">物体1</el-button>
        <el-button class="w-[120px]" type="primary" @click="addCube('cube2')">物体2</el-button>
        <el-button class="w-[120px]" type="primary" @click="addCube('cube3')">物体3</el-button>
        <el-button class="w-[120px]" type="primary" @click="addCube('cube4')">物体4</el-button>
        <el-button class="w-[120px]" type="primary" @click="addCube('cube5')">物体5</el-button>
        <el-button class="w-[120px]" type="primary" :plain="rotateEnabled" @click="toggleRotate">
          {{ rotateEnabled ? '关闭场景旋转' : '开启场景旋转' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SchemesList from '@/components/schemes-list/index.vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DragControls } from 'three/examples/jsm/controls/DragControls.js'

const threeContainer = ref(null)
let scene, containerScene, camera, renderer, orbitControls, dragControls
const containerSize = { x: 60, y: 20, z: 20 }
let rotateEnabled = ref(true)
let selectedObject = null // 当前选中的物体

// 选中物体的函数
function selectObject(object) {
  console.log('Object selected:', object)
  // 如果之前有选中的物体，先取消其选中状态
  if (selectedObject) {
    selectedObject.material.emissive = new THREE.Color(0x000000)
  }

  // 设置新的选中物体
  selectedObject = object

  // 高亮新选中的物体
  if (selectedObject) {
    selectedObject.material.emissive = new THREE.Color(0x999999)
    console.log('Object selected:', selectedObject)
  }
}

const draggableObjects = [] // { mesh, size, prevPosition, enteredContainer }

onMounted(() => {
  initScene()
  animate()
  initPreGeometries()

  // 添加键盘事件监听
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  // 组件卸载时移除事件监听器
  window.removeEventListener('keydown', onKeyDown)
  // 移除窗口监听
  window.removeEventListener('resize', onResize)
})

function loadMianModel() {
  // ✅ 用 GLTFLoader 替换 BoxGeometry
  const loader = new GLTFLoader()
  loader.load('/models/tool6/tool_6-Group_1.gltf', (gltf) => {
    const containerMesh = gltf.scene

    // 缩放到和 containerSize 一致
    const boxGeo = new THREE.Box3().setFromObject(containerMesh)
    const size = new THREE.Vector3()
    boxGeo.getSize(size)

    const scale = new THREE.Vector3(containerSize.x / size.x, containerSize.y / size.y, containerSize.z / size.z)
    containerMesh.scale.set(scale.x, scale.y, scale.z)

    // 保持中心对齐
    boxGeo.setFromObject(containerMesh)
    const center = new THREE.Vector3()
    boxGeo.getCenter(center)
    containerMesh.position.sub(center) // 移动到原点

    scene.add(containerMesh)
  })
}

function initScene() {
  scene = new THREE.Scene()
  // 设置天空背景
  scene.background = new THREE.Color(0x87ceeb) // 天空蓝颜色

  // 创建独立的容器场景
  containerScene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(
    75,
    threeContainer.value.clientWidth / threeContainer.value.clientHeight,
    0.1,
    2000
  )
  camera.position.set(-57, 20, 15)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight)
  threeContainer.value.appendChild(renderer.domElement)

  // 全局光照只影响外部场景
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(10, 20, 10)
  directionalLight.castShadow = true
  scene.add(directionalLight)

  // 容器边框可视化
  const boxGeo = new THREE.BoxGeometry(containerSize.x, containerSize.y, containerSize.z)
  // 创建带有单独底部颜色的材质
  const boxMaterials = [
    new THREE.MeshPhongMaterial({
      // 右面
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
      depthWrite: false
    }),
    new THREE.MeshPhongMaterial({
      // 左面
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
      depthWrite: false
    }),
    new THREE.MeshPhongMaterial({
      // 上面
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
      depthWrite: false
    }),
    new THREE.MeshPhongMaterial({
      // 下面（底部）
      color: 0x00ffff, // 单独设置底部颜色为青色
      transparent: true,
      opacity: 1,
      side: THREE.BackSide,
      depthWrite: false
    }),
    new THREE.MeshPhongMaterial({
      // 前面
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
      depthWrite: false
    }),
    new THREE.MeshPhongMaterial({
      // 后面
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
      depthWrite: false
    })
  ]
  const containerMesh = new THREE.Mesh(boxGeo, boxMaterials)
  scene.add(containerMesh)
  // 轮廓线
  const edges = new THREE.EdgesGeometry(boxGeo)
  const lineMat = new THREE.LineBasicMaterial({ color: 0x000000 })
  const lineMesh = new THREE.LineSegments(edges, lineMat)
  containerMesh.add(lineMesh)

  // loadMianModel();

  // 添加底部地面 (比容器更大)
  const groundSize = containerSize.x * 3 // 让地面比容器大300%
  const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize)

  // 创建棋盘格纹理来模拟地面
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  // 绘制棋盘格纹理
  ctx.fillStyle = '#dddddd'
  ctx.fillRect(0, 0, 512, 512)
  ctx.fillStyle = '#aaaaaa'
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if ((i + j) % 2 === 0) {
        ctx.fillRect(i * 64, j * 64, 64, 64)
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 4) // 重复4次以适应更大的地面

  const groundMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1
  })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = Math.PI / 2 // 旋转至水平位置
  ground.position.y = -containerSize.y / 2 - 1 // 定位在容器底部
  scene.add(ground) // 将地面直接添加到场景中，而不是容器中

  orbitControls = new OrbitControls(camera, renderer.domElement)

  // 限制相机视角，防止移动到地面以下
  orbitControls.maxPolarAngle = Math.PI / 2 - 0.1 // 限制垂直旋转角度，防止从下方看
  orbitControls.minDistance = 10 // 最小距离
  orbitControls.maxDistance = 200 // 最大距离

  initDragControls()
}

function initDragControls() {
  if (dragControls) dragControls.dispose()
  const meshes = draggableObjects.map((o) => o.mesh)
  dragControls = new DragControls(meshes, camera, renderer.domElement)

  dragControls.addEventListener('dragstart', (event) => {
    orbitControls.enabled = false
    const obj = draggableObjects.find((o) => o.mesh === event.object)
    if (obj) obj.prevPosition = event.object.position.clone()
  })

  dragControls.addEventListener('drag', (event) => {
    const obj = draggableObjects.find((o) => o.mesh === event.object)
    if (!obj) return

    const halfSize = {
      x: obj.size.x / 2,
      y: obj.size.y / 2,
      z: obj.size.z / 2
    }
    let targetPos = event.object.position.clone()

    // 限制物体不能低于地面
    const groundLevel = -containerSize.y / 2 + halfSize.y
    targetPos.y = Math.max(groundLevel, targetPos.y)

    // 判断是否已经进入容器
    const insideContainer =
      targetPos.x - halfSize.x >= -containerSize.x / 2 &&
      targetPos.x + halfSize.x <= containerSize.x / 2 &&
      targetPos.y - halfSize.y >= -containerSize.y / 2 &&
      targetPos.y + halfSize.y <= containerSize.y / 2 &&
      targetPos.z - halfSize.z >= -containerSize.z / 2 &&
      targetPos.z + halfSize.z <= containerSize.z / 2

    if (insideContainer) obj.enteredContainer = true

    // 如果已经进入过容器，限制在容器内，否则允许在外面拖动
    if (obj.enteredContainer) {
      targetPos.x = Math.max(-containerSize.x / 2 + halfSize.x, Math.min(containerSize.x / 2 - halfSize.x, targetPos.x))
      targetPos.y = Math.min(containerSize.y / 2 - halfSize.y, Math.max(-containerSize.y / 2 + halfSize.y, targetPos.y))
      targetPos.z = Math.max(-containerSize.z / 2 + halfSize.z, Math.min(containerSize.z / 2 - halfSize.z, targetPos.z))
    }

    // 碰撞检测
    const minA = new THREE.Vector3(targetPos.x - halfSize.x, targetPos.y - halfSize.y, targetPos.z - halfSize.z)
    const maxA = new THREE.Vector3(targetPos.x + halfSize.x, targetPos.y + halfSize.y, targetPos.z + halfSize.z)

    let overlap = false
    for (let other of draggableObjects) {
      if (other.mesh === obj.mesh) continue
      const halfOther = {
        x: other.size.x / 2,
        y: other.size.y / 2,
        z: other.size.z / 2
      }
      const minB = new THREE.Vector3(
        other.mesh.position.x - halfOther.x,
        other.mesh.position.y - halfOther.y,
        other.mesh.position.z - halfOther.z
      )
      const maxB = new THREE.Vector3(
        other.mesh.position.x + halfOther.x,
        other.mesh.position.y + halfOther.y,
        other.mesh.position.z + halfOther.z
      )

      if (
        minA.x < maxB.x &&
        maxA.x > minB.x &&
        minA.y < maxB.y &&
        maxA.y > minB.y &&
        minA.z < maxB.z &&
        maxA.z > minB.z
      ) {
        overlap = true
        break
      }
    }

    // 根据物体位置调整材质亮度
    if (obj.enteredContainer) {
      // 在容器内部，使用较暗的材质
      obj.mesh.material.emissive = new THREE.Color(0x607897)
    } else {
      // 在容器外部，使用较亮的材质
      obj.mesh.material.emissive = new THREE.Color(0x000000)
    }

    if (overlap) {
      event.object.position.copy(obj.prevPosition)
    } else {
      obj.prevPosition.copy(targetPos)
      event.object.position.copy(targetPos)
    }
  })

  dragControls.addEventListener('dragend', () => {
    orbitControls.enabled = rotateEnabled.value

    // 拖拽完成后，检查是否所有物体都在容器内
    const allInside = draggableObjects.every((obj) => obj.enteredContainer)

    if (!allInside) {
      // 有物体不在容器内，则回到初始位置
      draggableObjects.forEach((obj) => {
        if (!obj.enteredContainer) {
          obj.mesh.position.copy(obj.initialPosition)
          obj.prevPosition.copy(obj.initialPosition)
        }
      })
    }
  })

  // 添加点击选择物体的功能
  dragControls.addEventListener('hoveron', (event) => {
    selectedObject = event.object
    // 高亮选中物体
    selectObject(selectedObject)
  })

  dragControls.addEventListener('hoveroff', (event) => {
    if (selectedObject === event.object) {
      selectedObject.material.emissive = new THREE.Color(0x000000)
      selectedObject = null
    }
  })
}

const preGeometries = [] // 预生成的几何体
function initPreGeometries() {
  const sizes = [
    { name: 'cube1', color: 0xff0000, x: 3, y: 3, z: 3 },
    { name: 'cube2', color: 0x00ff00, x: 4, y: 2, z: 5 },
    { name: 'cube3', color: 0x0000ff, x: 2, y: 6, z: 2 },
    { name: 'cube4', color: 0xffff00, x: 5, y: 3, z: 3 },
    { name: 'cube5', color: 0xff00ff, x: 6, y: 2, z: 4 }
  ]

  sizes.forEach((size) => {
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z)
    geometry.name = size.name // 给几何体命名
    preGeometries.push({ geometry, size: { x: size.x, y: size.y, z: size.z }, name: size.name, color: size.color })
  })
}

function addCube(name = 'cube1') {
  const allInside = draggableObjects.every((obj) => obj.enteredContainer)
  if (!allInside) {
    ElMessage({
      message: '请先将所有物体放入容器内，再添加新物体！',
      type: 'warning'
    })
    return
  }
  const geomData = preGeometries.find((g) => g.name === name)
  if (!geomData) return

  const material = new THREE.MeshPhongMaterial({
    color: geomData.color
  })
  const mesh = new THREE.Mesh(geomData.geometry.clone(), material)

  // 生成容器外位置
  mesh.position.copy(getNonOverlappingPosition(geomData.size))

  scene.add(mesh)
  draggableObjects.push({
    mesh,
    size: geomData.size,
    prevPosition: mesh.position.clone(),
    enteredContainer: false, // 新增标记
    initialPosition: mesh.position.clone() // 新增
  })

  if (dragControls) {
    dragControls.objects.push(mesh)
  } else {
    initDragControls()
  }
}

// 生成容器外随机位置
function getNonOverlappingPosition(size) {
  // const distance = 15 // 容器外距离
  // let pos = new THREE.Vector3()
  // pos.z = containerSize.z / 2 + size.z / 2 + distance
  // pos.x = Math.random() * containerSize.x - containerSize.x / 2
  // pos.y = Math.random() * containerSize.y - containerSize.y / 2

  return new THREE.Vector3(0, 0, 30)
}

function toggleRotate() {
  // 打印场景中所有部件的位置
  draggableObjects.forEach((obj) => {
    console.log('Object position:', obj.mesh)
  })
  rotateEnabled.value = !rotateEnabled.value
  orbitControls.enabled = rotateEnabled.value
}

function animate() {
  requestAnimationFrame(animate)

  // 渲染外部场景
  renderer.render(scene, camera)
}

// 添加键盘事件监听
function onKeyDown(event) {
  if (!selectedObject) return
  const obj = draggableObjects.find((o) => o.mesh === selectedObject)
  if (!obj) return

  const moveDistance = 1 // 基础步长
  let direction = new THREE.Vector3()

  switch (event.key) {
    case 'ArrowUp':
      direction.set(0, 0, -1)
      break
    case 'ArrowDown':
      direction.set(0, 0, 1)
      break
    case 'ArrowLeft':
      direction.set(-1, 0, 0)
      break
    case 'ArrowRight':
      direction.set(1, 0, 0)
      break
    case 'w':
    case 'W':
      direction.set(0, 1, 0)
      break
    case 's':
    case 'S':
      direction.set(0, -1, 0)
      break
    default:
      return
  }

  const halfSize = {
    x: obj.size.x / 2,
    y: obj.size.y / 2,
    z: obj.size.z / 2
  }

  let allowedMove = moveDistance

  // === 1. 检查容器边界 ===
  if (direction.x !== 0) {
    if (direction.x > 0) {
      const dist = containerSize.x / 2 - halfSize.x - selectedObject.position.x
      allowedMove = Math.min(allowedMove, dist)
    } else {
      const dist = -containerSize.x / 2 + halfSize.x - selectedObject.position.x
      allowedMove = Math.min(allowedMove, -dist)
    }
  }
  if (direction.y !== 0) {
    if (direction.y > 0) {
      const dist = containerSize.y / 2 - halfSize.y - selectedObject.position.y
      allowedMove = Math.min(allowedMove, dist)
    } else {
      const dist = -containerSize.y / 2 + halfSize.y - selectedObject.position.y
      allowedMove = Math.min(allowedMove, -dist)
    }
  }
  if (direction.z !== 0) {
    if (direction.z > 0) {
      const dist = containerSize.z / 2 - halfSize.z - selectedObject.position.z
      allowedMove = Math.min(allowedMove, dist)
    } else {
      const dist = -containerSize.z / 2 + halfSize.z - selectedObject.position.z
      allowedMove = Math.min(allowedMove, -dist)
    }
  }

  // === 2. 检查与其他物体的距离 ===
  for (let other of draggableObjects) {
    if (other.mesh === obj.mesh) continue
    const halfOther = {
      x: other.size.x / 2,
      y: other.size.y / 2,
      z: other.size.z / 2
    }

    // 方向 x
    if (
      direction.x !== 0 &&
      Math.abs(selectedObject.position.y - other.mesh.position.y) < halfSize.y + halfOther.y &&
      Math.abs(selectedObject.position.z - other.mesh.position.z) < halfSize.z + halfOther.z
    ) {
      if (direction.x > 0 && selectedObject.position.x < other.mesh.position.x) {
        const dist = other.mesh.position.x - halfOther.x - (selectedObject.position.x + halfSize.x)
        if (dist >= 0) allowedMove = Math.min(allowedMove, dist)
      }
      if (direction.x < 0 && selectedObject.position.x > other.mesh.position.x) {
        const dist = selectedObject.position.x - halfSize.x - (other.mesh.position.x + halfOther.x)
        if (dist >= 0) allowedMove = Math.min(allowedMove, dist)
      }
    }

    // 方向 y
    if (
      direction.y !== 0 &&
      Math.abs(selectedObject.position.x - other.mesh.position.x) < halfSize.x + halfOther.x &&
      Math.abs(selectedObject.position.z - other.mesh.position.z) < halfSize.z + halfOther.z
    ) {
      if (direction.y > 0 && selectedObject.position.y < other.mesh.position.y) {
        const dist = other.mesh.position.y - halfOther.y - (selectedObject.position.y + halfSize.y)
        if (dist >= 0) allowedMove = Math.min(allowedMove, dist)
      }
      if (direction.y < 0 && selectedObject.position.y > other.mesh.position.y) {
        const dist = selectedObject.position.y - halfSize.y - (other.mesh.position.y + halfOther.y)
        if (dist >= 0) allowedMove = Math.min(allowedMove, dist)
      }
    }

    // 方向 z
    if (
      direction.z !== 0 &&
      Math.abs(selectedObject.position.x - other.mesh.position.x) < halfSize.x + halfOther.x &&
      Math.abs(selectedObject.position.y - other.mesh.position.y) < halfSize.y + halfOther.y
    ) {
      if (direction.z > 0 && selectedObject.position.z < other.mesh.position.z) {
        const dist = other.mesh.position.z - halfOther.z - (selectedObject.position.z + halfSize.z)
        if (dist >= 0) allowedMove = Math.min(allowedMove, dist)
      }
      if (direction.z < 0 && selectedObject.position.z > other.mesh.position.z) {
        const dist = selectedObject.position.z - halfSize.z - (other.mesh.position.z + halfOther.z)
        if (dist >= 0) allowedMove = Math.min(allowedMove, dist)
      }
    }
  }

  // === 3. 应用移动 ===
  if (allowedMove > 0) {
    selectedObject.position.addScaledVector(direction, allowedMove)
  }
}

// 窗口变化刷新
window.addEventListener('resize', onResize)
function onResize() {
  camera.aspect = threeContainer.value.clientWidth / threeContainer.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight)
}
</script>

<style>
.three-container {
  width: 100%;
  height: 100%;
  background: #000;
}

.toolbar-container {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 999;
  background: transparent;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;

  .el-button {
    margin: 0;
    margin-bottom: 10px;
  }
}
</style>
