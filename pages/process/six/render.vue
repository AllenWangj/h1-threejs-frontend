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
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'

const threeContainer = ref(null)
let scene, containerScene, camera, renderer, orbitControls, dragControls
const containerSize = { x: 60, y: 20, z: 20 }
let rotateEnabled = ref(true)
let selectedObject = null // 当前选中的 mesh（wrapper）
const draggableObjects = [] // { mesh, size: THREE.Vector3, prevPosition, enteredContainer, initialPosition }

onMounted(() => {
  initScene()
  animate()
  initPreGeometries()
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('resize', onResize)
})

function loadMianModel() {
  const loader = new GLTFLoader()
  loader.load('/models/tool6/tool_6-Group_1.gltf', (gltf) => {
    const containerMesh = gltf.scene
    const boxGeo = new THREE.Box3().setFromObject(containerMesh)
    const size = new THREE.Vector3()
    boxGeo.getSize(size)
    const scale = new THREE.Vector3(containerSize.x / size.x, containerSize.y / size.y, containerSize.z / size.z)
    containerMesh.scale.set(scale.x, scale.y, scale.z)
    boxGeo.setFromObject(containerMesh)
    const center = new THREE.Vector3()
    boxGeo.getCenter(center)
    containerMesh.position.sub(center)
    scene.add(containerMesh)
  })
}

function initScene() {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87ceeb)

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

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(10, 20, 10)
  directionalLight.castShadow = true
  scene.add(directionalLight)

  // 容器边框可视化（透明盒子）
  const boxGeo = new THREE.BoxGeometry(containerSize.x, containerSize.y, containerSize.z)
  const boxMaterials = [
    new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.2, side: THREE.BackSide, depthWrite: false }),
    new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.2, side: THREE.BackSide, depthWrite: false }),
    new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.2, side: THREE.BackSide, depthWrite: false }),
    new THREE.MeshPhongMaterial({ color: 0x00ffff, transparent: true, opacity: 1, side: THREE.BackSide, depthWrite: false }),
    new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.2, side: THREE.BackSide, depthWrite: false }),
    new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.2, side: THREE.BackSide, depthWrite: false })
  ]
  const containerMesh = new THREE.Mesh(boxGeo, boxMaterials)
  scene.add(containerMesh)
  const edges = new THREE.EdgesGeometry(boxGeo)
  const lineMat = new THREE.LineBasicMaterial({ color: 0x000000 })
  const lineMesh = new THREE.LineSegments(edges, lineMat)
  containerMesh.add(lineMesh)

  // 地面
  const groundSize = containerSize.x * 3
  const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize)
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
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
  texture.repeat.set(4, 4)
  const groundMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true, opacity: 1 })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = Math.PI / 2
  ground.position.y = -containerSize.y / 2 - 1
  scene.add(ground)

  orbitControls = new OrbitControls(camera, renderer.domElement)
  orbitControls.maxPolarAngle = Math.PI / 2 - 0.1
  orbitControls.minDistance = 10
  orbitControls.maxDistance = 200

  const axesHelper = new THREE.AxesHelper(1000)
  scene.add(axesHelper)

  initDragControls()
}

function initDragControls() {
  // 重新创建 DragControls（会解绑旧事件）
  if (dragControls) {
    try { dragControls.dispose() } catch (e) { /* ignore */ }
  }

  // ✅ 只允许拖拽 wrapper（即透明盒子）
  const wrapperMeshes = draggableObjects
    .filter(o => o.mesh.userData?.isWrapper)
    .map(o => o.mesh)

  dragControls = new DragControls(wrapperMeshes, camera, renderer.domElement)

  // drag start
  dragControls.addEventListener('dragstart', (event) => {
    const obj = draggableObjects.find((o) => o.mesh === event.object)
    if (!obj) return
    orbitControls.enabled = false
    obj.prevPosition = event.object.position.clone()
  })

  // drag
  dragControls.addEventListener('drag', (event) => {
    const obj = draggableObjects.find((o) => o.mesh === event.object)
    if (!obj) return

    // ✅ 防止不是 wrapper 的对象被拖动（多重保险）
    if (!event.object.userData?.isWrapper) return

    const halfSize = {
      x: obj.size.x / 2,
      y: obj.size.y / 2,
      z: obj.size.z / 2
    }
    let targetPos = event.object.position.clone()

    // 限制不能低于地面
    const groundLevel = -containerSize.y / 2 + halfSize.y
    targetPos.y = Math.max(groundLevel, targetPos.y)

    // 判断是否进入容器
    const insideContainer =
      (targetPos.x - halfSize.x) >= -containerSize.x / 2 &&
      (targetPos.x + halfSize.x) <= containerSize.x / 2 &&
      (targetPos.y - halfSize.y) >= -containerSize.y / 2 &&
      (targetPos.y + halfSize.y) <= containerSize.y / 2 &&
      (targetPos.z - halfSize.z) >= -containerSize.z / 2 &&
      (targetPos.z + halfSize.z) <= containerSize.z / 2

    if (insideContainer) obj.enteredContainer = true

    // 已进入容器 → 限制在容器内
    if (obj.enteredContainer) {
      const minX = -containerSize.x / 2 + halfSize.x
      const maxX = containerSize.x / 2 - halfSize.x
      const minY = -containerSize.y / 2 + halfSize.y
      const maxY = containerSize.y / 2 - halfSize.y
      const minZ = -containerSize.z / 2 + halfSize.z
      const maxZ = containerSize.z / 2 - halfSize.z

      targetPos.x = Math.max(minX, Math.min(maxX, targetPos.x))
      targetPos.y = Math.max(minY, Math.min(maxY, targetPos.y))
      targetPos.z = Math.max(minZ, Math.min(maxZ, targetPos.z))
    }

    // 构建当前模型的 AABB
    const sizeA = new THREE.Vector3(obj.size.x, obj.size.y, obj.size.z)
    const boxA = new THREE.Box3().setFromCenterAndSize(targetPos.clone(), sizeA)

    let overlap = false
    for (let other of draggableObjects) {
      if (other.mesh === obj.mesh) continue
      const otherPos = other.mesh.position.clone()
      const sizeB = new THREE.Vector3(other.size.x, other.size.y, other.size.z)
      const boxB = new THREE.Box3().setFromCenterAndSize(otherPos, sizeB)
      if (boxA.intersectsBox(boxB)) {
        overlap = true
        break
      }
    }

    // 根据位置调整材质亮度
    if (obj.enteredContainer) setMeshDim(obj.mesh)
    else restoreMeshAppearance(obj.mesh)

    if (overlap) {
      event.object.position.copy(obj.prevPosition)
    } else {
      obj.prevPosition.copy(targetPos)
      event.object.position.copy(targetPos)
    }
  })

  // drag end
  dragControls.addEventListener('dragend', () => {
    orbitControls.enabled = rotateEnabled.value
    const allInside = draggableObjects.every((obj) => obj.enteredContainer)
    if (!allInside) {
      draggableObjects.forEach((obj) => {
        if (!obj.enteredContainer) {
          obj.mesh.position.copy(obj.initialPosition)
          obj.prevPosition.copy(obj.initialPosition)
          restoreMeshAppearance(obj.mesh)
        }
      })
    }
  })

  // hover on
  dragControls.addEventListener('hoveron', (event) => {
    if (!event.object.userData?.isWrapper) return
    selectedObject = event.object
    highlightMesh(selectedObject)
  })

  // hover off
  dragControls.addEventListener('hoveroff', (event) => {
    if (!event.object.userData?.isWrapper) return
    if (selectedObject === event.object) {
      restoreMeshAppearance(selectedObject)
      selectedObject = null
    }
  })
}

// 预加载几何 / 模型
const preGeometries = []
function initPreGeometries() {
  const sizes = [
    { name: 'cube1', color: 0xff0000, x: 3, y: 3, z: 3 },
    { name: 'cube2', color: 0x00ff00, x: 4, y: 2, z: 5 },
    { name: 'cube3', color: 0x0000ff, x: 2, y: 6, z: 2 },
    { name: 'cube4', color: 0xffff00, x: 5, y: 3, z: 3 },
    { name: 'cube5', color: 0xff00ff, x: 6, y: 2, z: 4 }
  ]
  const loader = new GLTFLoader()
  sizes.forEach((item) => {
    loader.load(`/models/tool6/model7.gltf`, (gltf) => {
      // 尽量从 gltf 找到实际的 mesh 节点（你项目中可能需要调整索引）
      // 我保留你原本的索引路径（children[0].children[1]），如果 structure 不同请改这里
      let originalModel = gltf.scene
      if (gltf.scene) originalModel = gltf.scene

      const model = SkeletonUtils.clone(originalModel)
      const scale = 0.1
      model.scale.setScalar(scale)

      model.traverse((child) => {
        if (child.isMesh) {
          // 禁止拾取
          child.raycast = () => null;

           // 防止事件干扰
          child.userData.isDraggable = false;
        }
      });


      // 计算包围盒与尺寸（此处会拿到缩放后的尺寸）
      const box = new THREE.Box3().setFromObject(model)
      const size = new THREE.Vector3()
      box.getSize(size)

      // 保存 model 原型（我们在 addCube 时再 clone）
      preGeometries.push({ name: item.name, modelPrototype: model, size: size.clone() })
    })
  })
}

// 将模型包到透明盒子里，并居中模型
function createTransparentWrapper(model, size) {
  // 让 model 居中（计算包围中心并偏移）
  const box = new THREE.Box3().setFromObject(model)
  const center = new THREE.Vector3()
  box.getCenter(center)
  model.position.sub(center)

  // 创建半透明盒子（以 size 为长宽高）
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 0,
    depthTest: true
  })
  const geometry = new THREE.BoxGeometry(size.x * 1.001, size.y * 1.001, size.z * 1.001)
  const wrapper = new THREE.Mesh(geometry, material)
  wrapper.add(model) // 将模型作为子节点放入 wrapper

  // ✅ 确保 wrapper 在 layer 0
  wrapper.layers.set(0);

  // userData 用于拖拽识别与恢复材质
  wrapper.userData = {
    isWrapper: true,
    wrappedModel: model,
    size: size.clone()
  }

  // 允许阴影（如果需要）
  wrapper.castShadow = true
  wrapper.receiveShadow = true

  return wrapper
}

function addCube(name = 'cube1') {
  const allInside = draggableObjects.every((obj) => obj.enteredContainer)
  if (!allInside) {
    ElMessage({ message: '请先将所有物体放入容器内，再添加新物体！', type: 'warning' })
    return
  }
  const modelData = preGeometries.find((g) => g.name === name)
  if (!modelData) {
    ElMessage({ message: '模型尚未加载完成，请稍候再试。', type: 'warning' })
    return
  }

  // 克隆原型 model 并包裹
  const modelClone = SkeletonUtils.clone(modelData.modelPrototype)
  // 注意：modelClone 的 bbox 可能与 modelData.size 略有差异（如果模型内部有动态变化），
  // createTransparentWrapper 内部会再次计算并居中 modelClone
  const wrappedModel = createTransparentWrapper(modelClone, modelData.size)
  wrappedModel.position.copy(getNonOverlappingPosition(modelData.size))

  scene.add(wrappedModel)

  // 注册 wrapper 到 draggableObjects —— 使用 size 的 clone，确保数据不被共享修改
  draggableObjects.push({
    mesh: wrappedModel,
    size: modelData.size.clone(),
    prevPosition: wrappedModel.position.clone(),
    enteredContainer: false,
    initialPosition: wrappedModel.position.clone()
  })

  // 重新初始化 DragControls（确保事件绑定正确）
  initDragControls()
}

// 生成容器外初始位置（可改为随机且不重叠的逻辑）
function getNonOverlappingPosition(size) {
  // 简化：把新物体放在容器正前方 30 单位处
  return new THREE.Vector3(0, 0, 30)
}

function toggleRotate() {
  draggableObjects.forEach((obj) => {
    console.log('Object position:', obj.mesh.position)
  })
  rotateEnabled.value = !rotateEnabled.value
  orbitControls.enabled = rotateEnabled.value
}

function animate() {
  requestAnimationFrame(animate)
  if (orbitControls) orbitControls.update()
  if (renderer && camera) renderer.render(scene, camera)
}

// --- 键盘微调移动（以 center 为基准） ---
function onKeyDown(event) {
  if (!selectedObject) return
  const objEntry = draggableObjects.find((o) => o.mesh === selectedObject)
  if (!objEntry) return

  const moveDistance = 1
  let direction = new THREE.Vector3()
  switch (event.key) {
    case 'ArrowUp': direction.set(0, 0, -1); break
    case 'ArrowDown': direction.set(0, 0, 1); break
    case 'ArrowLeft': direction.set(-1, 0, 0); break
    case 'ArrowRight': direction.set(1, 0, 0); break
    case 'w': case 'W': direction.set(0, 1, 0); break
    case 's': case 'S': direction.set(0, -1, 0); break
    default: return
  }

  const halfSize = { x: objEntry.size.x / 2, y: objEntry.size.y / 2, z: objEntry.size.z / 2 }
  let allowedMove = moveDistance

  // 计算 candidate position 并检测边界 + 碰撞（更直观）
  const candidate = selectedObject.position.clone().addScaledVector(direction, moveDistance)

  // 边界限制（center 方式）
  const min = new THREE.Vector3(-containerSize.x / 2 + halfSize.x, -containerSize.y / 2 + halfSize.y, -containerSize.z / 2 + halfSize.z)
  const max = new THREE.Vector3(containerSize.x / 2 - halfSize.x, containerSize.y / 2 - halfSize.y, containerSize.z / 2 - halfSize.z)

  // clamp candidate to bounds
  candidate.x = Math.max(min.x, Math.min(max.x, candidate.x))
  candidate.y = Math.max(min.y, Math.min(max.y, candidate.y))
  candidate.z = Math.max(min.z, Math.min(max.z, candidate.z))

  // 检查与其他物体碰撞
  const boxA = new THREE.Box3().setFromCenterAndSize(candidate.clone(), new THREE.Vector3(objEntry.size.x, objEntry.size.y, objEntry.size.z))
  let blocked = false
  for (let other of draggableObjects) {
    if (other.mesh === objEntry.mesh) continue
    const boxB = new THREE.Box3().setFromCenterAndSize(other.mesh.position.clone(), new THREE.Vector3(other.size.x, other.size.y, other.size.z))
    if (boxA.intersectsBox(boxB)) { blocked = true; break }
  }

  if (!blocked) {
    selectedObject.position.copy(candidate)
  }
}

// 窗口尺寸变化
window.addEventListener('resize', onResize)
function onResize() {
  camera.aspect = threeContainer.value.clientWidth / threeContainer.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight)
}

// ---------- 材质高亮 / 恢复 辅助函数 ----------
function saveMaterialState(mat) {
  if (!mat) return null
  return {
    hasEmissive: ('emissive' in mat),
    emissive: ('emissive' in mat && mat.emissive) ? mat.emissive.clone() : null,
    opacity: (mat.opacity !== undefined) ? mat.opacity : null,
    transparent: (mat.transparent !== undefined) ? mat.transparent : null,
    color: (mat.color) ? mat.color.clone() : null
  }
}
function saveMeshMaterialsState(mesh) {
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
  return mats.map(m => saveMaterialState(m))
}
function restoreMeshAppearance(mesh) {
  if (!mesh || !mesh.userData._matBackup) return
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
  const backups = mesh.userData._matBackup
  mats.forEach((m, i) => {
    const b = backups[i]
    if (!b) return
    if (b.hasEmissive && 'emissive' in m && b.emissive) m.emissive.copy(b.emissive)
    if (b.opacity !== null && b.opacity !== undefined) { m.opacity = b.opacity; m.transparent = !!b.transparent }
    if (b.color && m.color) m.color.copy(b.color)
  })
  delete mesh.userData._matBackup
}
function setMeshDim(mesh) {
  if (!mesh) return
  if (!mesh.userData._matBackup) mesh.userData._matBackup = saveMeshMaterialsState(mesh)
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
  mats.forEach((m) => {
    if ('emissive' in m) {
      m.emissive = new THREE.Color(0x607897)
    } else {
      m.transparent = true
      m.opacity = Math.max(0.05, (m.opacity || 1) * 0.5)
    }
  })
}
function highlightMesh(mesh) {
  if (!mesh) return
  if (!mesh.userData._matBackup) mesh.userData._matBackup = saveMeshMaterialsState(mesh)
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
  mats.forEach((m) => {
    if ('emissive' in m) {
      m.emissive = new THREE.Color(0x999999)
    } else {
      m.transparent = true
      m.opacity = Math.max(0.15, (m.opacity || 1) * 0.4)
    }
  })
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
