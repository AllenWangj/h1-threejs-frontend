<template>
  <div ref="fullscreenContainer" class="w-[100%] h-[100%] ">
    <div style="    position: absolute;left: 220px; top: 10px;">    
      <el-button type="primary" @click="handleScenePane(false)">禁止拖动</el-button>
        <el-button type="primary" @click="handleScenePane(true)">允许拖动</el-button>
        <el-button type="primary" @click="handleSceneEnable(false)">关闭场景</el-button>
        <el-button type="primary" @click="handleSceneEnable(true)">开启场景</el-button>
        <el-button type="primary" @click="handleSceneScale(true)">允许缩放</el-button>
        <el-button type="primary"  @click="handleSceneScale(false)">禁止缩放</el-button></div>

    <div ref="threeContainer" class="three-container"></div>
    <div class="toolbar-container">

      <el-popover class="box-item" placement="left">
        <template #reference>
          <el-button class="w-[120px]" type="primary" @click="addCube('cube2')">物体2</el-button>
        </template>
        <img src="/assets/material2.png" />
      </el-popover>

      <el-popover class="box-item" placement="left">
        <template #reference>
          <el-button class="w-[120px]" type="primary" @click="addCube('cube3')">物体3</el-button>
        </template>
        <img src="/assets/material3.png" />
      </el-popover>

      <el-popover class="box-item" placement="left">
        <template #reference>
          <el-button class="w-[120px]" type="primary" @click="addCube('cube4')">物体4</el-button>

        </template>
        <img src="/assets/material4.png" />
      </el-popover>

      <el-popover class="box-item" placement="left">
        <template #reference>
          <el-button class="w-[120px]" type="primary" @click="addCube('cube6')">物体6</el-button>

        </template>
        <img src="/assets/material6.png" />
      </el-popover>

      <!-- <el-button class="w-[120px]" type="primary" @click="addCube('cube6')">物体6</el-button> -->

      <el-popover class="box-item" placement="left">
        <template #reference>
          <el-button class="w-[120px]" type="primary" @click="addCube('cube7')">物体7</el-button>


        </template>
        <img src="/assets/material7.png" />
      </el-popover>
      <el-popover class="box-item" placement="left">
        <template #reference>
          <el-button class="w-[120px]" type="primary" @click="addCube('cube8')">物体8</el-button>
        </template>
        <img src="/assets/material8.png" />
      </el-popover>
      <el-popover class="box-item" placement="left">
        <template #reference>
          <el-button class="w-[120px]" type="primary" @click="addCube('cube9')">物体9</el-button>
        </template>
        <img src="/assets/material9.png" />
      </el-popover>
      <el-popover class="box-item" placement="left">
        <template #reference>
          <el-button class="w-[120px]" type="primary" @click="addCube('cube10')">物体10</el-button>

        </template>
        <img src="/assets/material10.png" />
      </el-popover>
      <el-popover class="box-item" placement="left">
        <template #reference>
          <el-button class="w-[120px]" type="primary" @click="addCube('cube11')">物体11</el-button>
        </template>
        <img src="/assets/material11.png" />
      </el-popover>
      <!-- <el-popover class="box-item" placement="left">
        <template #reference>
          <el-button class="w-[120px]" type="primary" @click="addCube('cube12')">物体12</el-button>
        </template>
        <img src="/assets/material12.png" />
      </el-popover> -->

      <el-popover class="box-item" placement="left">
        <template #reference>
          <el-button class="w-[120px]" type="primary" @click="addCube('cube13')">物体13</el-button>
        </template>
        <img src="/assets/material13.png" />
      </el-popover>
      <el-popover class="box-item" placement="left">
        <template #reference>
          <el-button class="w-[120px]" type="primary" @click="addCube('cube15')">物体15</el-button>
        </template>
        <img src="/assets/material15.png" />
      </el-popover>
      <el-popover class="box-item" placement="left">
        <template #reference>
          <el-button class="w-[120px]" type="primary" @click="addCube('cube16')">物体16</el-button>

        </template>
        <img src="/assets/material16.png" />
      </el-popover>
      <el-popover class="box-item" placement="left">
        <template #reference>
          <el-button class="w-[120px]" type="primary" @click="addCube('cube17')">物体17</el-button>
        </template>
        <img src="/assets/material17.png" />
      </el-popover>

      <el-button class="w-[120px]" type="primary" :plain="rotateEnabled" @click="toggleRotate">
        {{ rotateEnabled ? '关闭场景旋转' : '开启场景旋转' }}
      </el-button>
    </div>
    <div class="plan-detail">
          <el-descriptions title="集装箱信息" :column="2" >
          <el-descriptions-item label="8x8梁" :span="1">100根</el-descriptions-item>
          <el-descriptions-item label="8x12梁" :span="1">20根</el-descriptions-item>
          <el-descriptions-item label="连接器" :span="1">100个</el-descriptions-item>
          <el-descriptions-item label="门" :span="1">3扇</el-descriptions-item>
          <el-descriptions-item label="窗" :span="1">3个</el-descriptions-item>
          <el-descriptions-item label="板材" :span="1">20个</el-descriptions-item>
          <el-descriptions-item label="钢材" :span="1">100根</el-descriptions-item>
          <el-descriptions-item label="柱" :span="1">120根</el-descriptions-item>
          <el-descriptions-item label="集装箱长度" :span="1">4米</el-descriptions-item>
          <el-descriptions-item label="集装箱宽度" :span="1">2米</el-descriptions-item>
          <el-descriptions-item label="集装箱高度" :span="1">3米</el-descriptions-item>

        </el-descriptions>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
// import SchemesList from '@/components/schemes-list/index.vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DragControls } from 'three/examples/jsm/controls/DragControls.js'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'
import { getPackingDetail, planDetail } from '@/apis/project'
const { getModelUrl, getModelMap } = useModelMap()
const props = defineProps<{
  planId: any
}>()
// 全屏相关
const fullscreenContainer = ref<HTMLElement | null>(null)
useFullScreenResize(fullscreenContainer, onResize)

const currentPlan =ref<any>({})
const route = useRoute()
const projectId = ref('')
const schemeList = ref<any[]>([])
// 当前激活得方案id
// const currentAcviteScheme = ref('')
watch(() => props.planId, (newValue) => {
  planDetail({ id: newValue,type:6 }).then(res => {
    const { data: { layouts } } = res
    handleLoadInitModel(layouts)
    // renderPlanLayout!.loadSceneModels(layouts)
  })
})
// const tapScheme = (item) => {
//   console.log('点击了运输保障方案', item)
//   planDetail({ planId:  item.id }).then(res => {
//     const { data: { layouts } } = res
//     handleLoadInitModel(layouts)
//     // renderPlanLayout!.loadSceneModels(layouts)
//   })
// }
// 获取详情
// async function fetchDetail() {
//   try {
//     const { data } = await getPackingDetail({
//       projectId: projectId.value
//     })
//     schemeList.value = data.plans || []
//     if (schemeList.value.length) {
//       currentAcviteScheme.value = schemeList.value[0].id
//       planDetail({ planId:  currentAcviteScheme.value }).then(res => {
//     const { data: { layouts } } = res
//     handleLoadInitModel(layouts)
//     // renderPlanLayout!.loadSceneModels(layouts)
//   })
//     }
//     console.log('获取运输保障详情', data)
//   } catch (error) {
//     console.error('获取运输保障详情失败', error)
//   } finally {
//   }
// }
const threeContainer = ref(null)
let scene, containerScene, camera, renderer, orbitControls, dragControls
const containerSize = { x: 96 * 0.025, y: 96 * 0.025, z: 480 * 0.025 }
let rotateEnabled = ref(true)
let selectedObject = null // 当前选中的 mesh（wrapper）
const draggableObjects = [] // { mesh, size: THREE.Vector3, prevPosition, enteredContainer, initialPosition }
onMounted(() => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
  }
  // fetchDetail();

  initScene()
  animate()
  initPreGeometries()

  // 窗口尺寸变化
  window.addEventListener('resize', onResize)

  window.addEventListener('keydown', onKeyDown)
  // 
  // const data = []
  // // for(let i = )
  // let x = 7.874015808105469
  // let y = 7.874015808105469
  // let z = 228.34645080566406
  // let xPos = -44.062992095947266
  // let yPos = -44.062992095947266
  // let zPos = -125.82677459716797

  // for (let i = 0; i < 12; i++) {
  //   for (let j = 0; j < 2; j++) {
  //     for (let k = 0; k < 3; k++) {
  //       data.push({
  //         x: xPos + i * x,
  //         y: yPos + k * y,
  //         z: zPos + z * j,
  //         code: '10664'
  //       })
  //     }
  //   }
  // }

  // let z1 = 110.23622131347656
  // let xPos1 = -44.062992095947266
  // let yPos1 = -20.25252802840201
  // let zPos1 = -185.17769140029236
  // for (let i = 0; i < 12; i++) {
  //   for (let j = 0; j < 3; j++) {
  //     for (let k = 0; k < 2; k++) {
  //       data.push({
  //         x: xPos1 + i * x,
  //         y: yPos1 + k * y,
  //         z: zPos1 + z1 * j,
  //         code: '10675'
  //       })
  //     }
  //   }
  // }

  // let z2 = 15.748031616210938
  // let xPos2 = -44.062992095947266
  // let yPos2 = -44.062992095947266
  // let zPos2 = 221.65679950905394

  // for (let i = 0; i < 12; i++) {
  //   for (let j = 0; j < 1; j++) {
  //     for (let k = 0; k < 2; k++) {
  //       data.push({
  //         x: xPos2 + i * x,
  //         y: yPos2 + k * y,
  //         z: zPos2 + z2 * j,
  //         code: '10662'
  //       })
  //     }
  //   }
  // }

  // /*
  // : 3.1496062278770296, y: 4.724409580230713, z: 110.23622131347656}
  // */

  // let x3 = 3.1496062278770296
  // let y3 = 4.724409580230713

  // let z3 = 110.23622131347656
  // let xPos3 = -46.425196886061485
  // let yPos3 = -21.842512493913432
  // let zPos3 = 145.6196798877915

  // for (let i = 0; i < 30; i++) {
  //   for (let j = 0; j < 1; j++) {
  //     for (let k = 0; k < 3; k++) {
  //       data.push({
  //         x: xPos3 + i * x3,
  //         y: yPos3 + k * y3,
  //         z: zPos3 + j * z3,
  //         code: '10629'
  //       })
  //     }
  //   }
  // }

  // let xPos4 = -46.425196886061485
  // let yPos4 = -6.0734851066986835
  // let zPos4 = -184.88188934326172
  // for (let i = 0; i < 15; i++) {
  //   for (let j = 0; j < 4; j++) {
  //     for (let k = 0; k < 3; k++) {
  //       data.push({
  //         x: xPos4 + i * x3,
  //         y: yPos4 + k * y3,
  //         z: zPos4 + j * z3,
  //         code: '10629'
  //       })
  //     }
  //   }
  // }

  // let xPos5 = 3.330709695783071
  // let yPos5 = -3.3753340537627423
  // let zPos5 = -185.17769140029236
  // for (let i = 0; i < 6; i++) {
  //   for (let j = 0; j < 3; j++) {
  //     for (let k = 0; k < 2; k++) {
  //       data.push({
  //         x: xPos5 + i * x,
  //         y: yPos5 + k * y,
  //         z: zPos5 + z1 * j,
  //         code: '10675'
  //       })
  //     }
  //   }
  // }
  // console.log("data",data)
  // handleLoadInitModel(data)
  //   /**
  //    * {
  //   "x": 7.874015808105469,
  //   "y": 7.874015808105469,
  //   "z": 110.23622131347656
  // }
  //    * */
  //   console.log('data', data)
  if (props.planId != -1) {
    planDetail({ planId: props.planId }).then(res => {
      const { data: { layouts } } = res
      handleLoadInitModel(layouts)
      // renderPlanLayout!.loadSceneModels(layouts)
    })
  }
})
let gltfModels: any[] = []

async function handleLoadInitModel(position: any) {
  for (let index = 0; index < gltfModels.length; index++) {
    const element = gltfModels[index];
    handleClearnJunk(element)
    element.parent.remove(element)
  }
  const modelCodes = position.map(config => config.code)
  await getModelMap(modelCodes)

  gltfModels = []
  position.forEach((ele) => {
    const loader = new GLTFLoader()
    // 2. 获取场景模型 URL
    const scenePath = getModelUrl(ele.code)
    // loader.load(`/gltf/six/${ele.code}.gltf`, (gltf) => {
    loader.load(scenePath, (gltf) => {
      let originalModel = gltf.scene
      if (gltf.scene) originalModel = gltf.scene
      const model = SkeletonUtils.clone(originalModel)
      const scale = 0.025
      model.scale.setScalar(scale)
      model.traverse((child: any) => {
        if (child.isMesh) {
          // 禁止拾取
          child.raycast = () => null

          // 防止事件干扰
          child.userData.isDraggable = false
        }
      })
      const box = new THREE.Box3().setFromObject(model)
      const size = new THREE.Vector3()
      box.getSize(size)
      const modelClone = SkeletonUtils.clone(model)
      const wrappedModel = createTransparentWrapper(modelClone, size.clone())
      wrappedModel.position.copy(getNonOverlappingPosition(size.clone()))
      wrappedModel.position.set(ele.x * 0.025, ele.y * 0.025, ele.z * 0.025)
      scene.add(wrappedModel)
      gltfModels.push(wrappedModel)
      draggableObjects.push({
        code: ele.code,
        mesh: wrappedModel,
        size: size.clone(),
        originalSize: size.clone(), // 原始尺寸，永远不变
        prevPosition: wrappedModel.position.clone(),
        enteredContainer: true,
        initialPosition: wrappedModel.position.clone()
      })
      initDragControls()
    }, (err) => {
      console.log("err---", `《${ele.code}》`)
    })
  })
}
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
  camera.position.set(10, 0, 0)

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
    new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
      depthWrite: false
    }),
    new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
      depthWrite: false
    }),
    new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
      depthWrite: false
    }),
    new THREE.MeshPhongMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 1,
      side: THREE.BackSide,
      depthWrite: false
    }),
    new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
      depthWrite: false
    }),
    new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
      depthWrite: false
    })
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
  const groundMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1
  })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = Math.PI / 2
  ground.position.y = -containerSize.y / 2 - 1
  // scene.add(ground)

  orbitControls = new OrbitControls(camera, renderer.domElement)
  orbitControls.maxPolarAngle = Math.PI / 2 - 0.1
  orbitControls.minDistance = 0
  orbitControls.maxDistance = 300

  const axesHelper = new THREE.AxesHelper(1000)
  // scene.add(axesHelper)

  initDragControls()
}

function handleClearnJunk(group: any): void {
  if (!group || !group.parent) {
    console.warn('⚠️ 尝试释放无效的组')
    return
  }
  // 递归释放所有资源
  group.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      // 释放几何体
      object.geometry?.dispose()
    }
  })

  // 清空引用
  group.clear()
  // group.parent = null
}
function initDragControls() {
  // 重新创建 DragControls（会解绑旧事件）
  if (dragControls) {
    try {
      dragControls.dispose()
    } catch (e) {
      /* ignore */
    }
  }

  // ✅ 只允许拖拽 wrapper（即透明盒子）
  const wrapperMeshes = draggableObjects.filter((o) => o.mesh.userData?.isWrapper).map((o) => o.mesh)
  dragControls = new DragControls(wrapperMeshes, camera, renderer.domElement)

  // 🔹 禁用 wrapper 内部模型 raycast（保留 wrapper 可拖拽）
  wrapperMeshes.forEach((wrapper) => {
    wrapper.children.forEach((child) => {
      child.traverse((mesh) => {
        if (mesh.isMesh || mesh.isLine) {
          // 禁止内部模型被射线检测
          mesh.raycast = () => { }
          // 可以标记为不可拖拽
          mesh.userData.isDraggable = false
        }
      })
    })
  })
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
      targetPos.x - halfSize.x >= -containerSize.x / 2 &&
      targetPos.x + halfSize.x <= containerSize.x / 2 &&
      targetPos.y - halfSize.y >= -containerSize.y / 2 &&
      targetPos.y + halfSize.y <= containerSize.y / 2 &&
      targetPos.z - halfSize.z >= -containerSize.z / 2 &&
      targetPos.z + halfSize.z <= containerSize.z / 2

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
    const data = []
    draggableObjects.forEach((ele) => {
      const position = ele.mesh.position.clone()
      data.push({
        x: position.x,
        y: position.y,
        z: position.z,
        code: ele.code
      })
    })
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

  // ======================================
  // 🌀 右键旋转逻辑（仅旋转选中 wrapper）
  // ======================================
  let rotatingWrapper = null
  let isRotating = false
  let lastMouseX = 0

  // 右键按下 → 判断是否选中了 wrapper
  renderer.domElement.addEventListener('mousedown', (e) => {
    if (e.button === 2 && selectedObject?.userData?.isWrapper) {
      // 禁用默认右键菜单
      e.preventDefault()
      rotatingWrapper = selectedObject
      isRotating = true
      lastMouseX = e.clientX
      orbitControls.enabled = false // 禁止相机旋转
    }
  })

  // 鼠标移动 → 旋转当前选中 wrapper
  renderer.domElement.addEventListener('mousemove', (e) => {
    if (isRotating && rotatingWrapper) {
      const deltaX = e.clientX - lastMouseX
      lastMouseX = e.clientX
      rotatingWrapper.rotation.y += 0 // 控制旋转灵敏度
      // 保持 X、Z 不变
      rotatingWrapper.rotation.x += deltaX * 0.0005
      rotatingWrapper.rotation.z = 0
    }
  })

  // 松开右键 → 自动对齐最近的 90 度
  renderer.domElement.addEventListener('mouseup', (e) => {
    if (e.button === 2 && rotatingWrapper) {
      // 自动吸附到最近的 90°倍数
      const snappedY = Math.round(rotatingWrapper.rotation.y / (Math.PI / 2)) * (Math.PI / 2)
      rotatingWrapper.rotation.y = snappedY

      // 修正 size
      const obj = draggableObjects.find((o) => o.mesh === rotatingWrapper)
      if (obj) fixSizeAfterRotation(obj)

      rotatingWrapper = null
      isRotating = false
      orbitControls.enabled = true
    }
  })

  // =====================
  // Y 轴旋转修正 size
  // =====================
  function fixSizeAfterRotation(obj) {
    const yRotDeg = THREE.MathUtils.radToDeg(obj.mesh.rotation.y) % 360
    if (Math.abs(yRotDeg) === 90 || Math.abs(yRotDeg) === 270) {
      // X、Z 互换
      const tmp = obj.originalSize.x
      obj.size.x = obj.originalSize.z
      obj.size.z = tmp
      obj.size.y = obj.originalSize.y
    } else {
      // 恢复原始尺寸
      console.log("obj.originalSize", obj.originalSize)
      if (obj.originalSize) {
        obj.size = obj.originalSize.clone()

      }
    }
  }
}

// 预加载几何 / 模型
const preGeometries = []
async function initPreGeometries() {
  const sizes = [
    // { name: 'cube1', color: 0xff0000, x: 3, y: 3, z: 3 ,code:"10605"},
    { name: 'cube2', color: 0x00ff00, x: 4, y: 2, z: 5, code: '06_01_10607' },
    { name: 'cube3', color: 0x0000ff, x: 2, y: 6, z: 2, code: '06_01_10609' },
    { name: 'cube4', color: 0xffff00, x: 5, y: 3, z: 3, code: '06_01_10629' },
    { name: 'cube5', color: 0xff00ff, x: 6, y: 2, z: 4, code: '06_01_10637' },
    { name: 'cube6', color: 0xff00ff, x: 6, y: 2, z: 4, code: '06_01_10660' },
    { name: 'cube7', color: 0xff00ff, x: 6, y: 2, z: 4, code: '06_01_10661' },
    { name: 'cube8', color: 0xff00ff, x: 6, y: 2, z: 4, code: '06_01_10662' },
    { name: 'cube9', color: 0xff00ff, x: 6, y: 2, z: 4, code: '06_01_10664' },
    { name: 'cube10', color: 0xff00ff, x: 6, y: 2, z: 4, code: '06_01_10675' },
    { name: 'cube11', color: 0xff00ff, x: 6, y: 2, z: 4, code: '06_01_10677' },
    { name: 'cube13', color: 0xff00ff, x: 6, y: 2, z: 4, code: '06_01_10678' },
    { name: 'cube14', color: 0xff00ff, x: 6, y: 2, z: 4, code: '06_01_10679' },
    { name: 'cube15', color: 0xff00ff, x: 6, y: 2, z: 4, code: '06_01_10680' },
    { name: 'cube16', color: 0xff00ff, x: 6, y: 2, z: 4, code: '06_01_10690' },
    { name: 'cube17', color: 0xff00ff, x: 6, y: 2, z: 4, code: '06_01_10691' }
  ]
  const loader = new GLTFLoader()
  // getModelMap
  const modelCodes = sizes.map(ele => ele.code)
  await getModelMap(modelCodes)
  sizes.forEach((item) => {
    const url = getModelUrl(item.code)
    // loader.load(`/models/tool6/model7.gltf`, (gltf) => {
    loader.load(url, (gltf) => {
      // 尽量从 gltf 找到实际的 mesh 节点（你项目中可能需要调整索引）
      // 我保留你原本的索引路径（children[0].children[1]），如果 structure 不同请改这里
      let originalModel = gltf.scene
      if (gltf.scene) originalModel = gltf.scene

      const model = SkeletonUtils.clone(originalModel)
      const scale = 0.025
      model.scale.setScalar(scale)

      model.traverse((child: any) => {
        if (child.isMesh || child.isLine) {
          // 禁止拾取
          child.raycast = () => null

          // 防止事件干扰
          child.userData.isDraggable = false
        }
      })

      // 计算包围盒与尺寸（此处会拿到缩放后的尺寸）
      const box = new THREE.Box3().setFromObject(model)
      const size = new THREE.Vector3()
      box.getSize(size)
      // 保存 model 原型（我们在 addCube 时再 clone）
      preGeometries.push({ name: item.name, modelPrototype: model, size: size.clone(), code: item.code })
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
  const geometry = new THREE.BoxGeometry(size.x, size.y, size.z)
  const wrapper = new THREE.Mesh(geometry, material)
  wrapper.add(model) // 将模型作为子节点放入 wrapper

  // ✅ 确保 wrapper 在 layer 0
  wrapper.layers.set(0)

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
  gltfModels.push(wrappedModel)
  // 注册 wrapper 到 draggableObjects —— 使用 size 的 clone，确保数据不被共享修改
  draggableObjects.push({
    code: modelData.code,
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
  return new THREE.Vector3(5, 0, 0)
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

  const halfSize = { x: objEntry.size.x / 2, y: objEntry.size.y / 2, z: objEntry.size.z / 2 }
  let allowedMove = moveDistance

  // 计算 candidate position 并检测边界 + 碰撞（更直观）
  const candidate = selectedObject.position.clone().addScaledVector(direction, moveDistance)

  // 边界限制（center 方式）
  const min = new THREE.Vector3(
    -containerSize.x / 2 + halfSize.x,
    -containerSize.y / 2 + halfSize.y,
    -containerSize.z / 2 + halfSize.z
  )
  const max = new THREE.Vector3(
    containerSize.x / 2 - halfSize.x,
    containerSize.y / 2 - halfSize.y,
    containerSize.z / 2 - halfSize.z
  )

  // clamp candidate to bounds
  candidate.x = Math.max(min.x, Math.min(max.x, candidate.x))
  candidate.y = Math.max(min.y, Math.min(max.y, candidate.y))
  candidate.z = Math.max(min.z, Math.min(max.z, candidate.z))

  // 检查与其他物体碰撞
  const boxA = new THREE.Box3().setFromCenterAndSize(
    candidate.clone(),
    new THREE.Vector3(objEntry.size.x, objEntry.size.y, objEntry.size.z)
  )
  let blocked = false
  for (let other of draggableObjects) {
    if (other.mesh === objEntry.mesh) continue
    const boxB = new THREE.Box3().setFromCenterAndSize(
      other.mesh.position.clone(),
      new THREE.Vector3(other.size.x, other.size.y, other.size.z)
    )
    if (boxA.intersectsBox(boxB)) {
      blocked = true
      break
    }
  }

  if (!blocked) {
    selectedObject.position.copy(candidate)
  }
}

function onResize() {
  camera.aspect = threeContainer.value.clientWidth / threeContainer.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight)
}

// ---------- 材质高亮 / 恢复 辅助函数 ----------
function saveMaterialState(mat) {
  if (!mat) return null
  return {
    hasEmissive: 'emissive' in mat,
    emissive: 'emissive' in mat && mat.emissive ? mat.emissive.clone() : null,
    opacity: mat.opacity !== undefined ? mat.opacity : null,
    transparent: mat.transparent !== undefined ? mat.transparent : null,
    color: mat.color ? mat.color.clone() : null
  }
}
function saveMeshMaterialsState(mesh) {
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
  return mats.map((m) => saveMaterialState(m))
}
function restoreMeshAppearance(mesh) {
  if (!mesh || !mesh.userData._matBackup) return
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
  const backups = mesh.userData._matBackup
  mats.forEach((m, i) => {
    const b = backups[i]
    if (!b) return
    if (b.hasEmissive && 'emissive' in m && b.emissive) m.emissive.copy(b.emissive)
    if (b.opacity !== null && b.opacity !== undefined) {
      m.opacity = b.opacity
      m.transparent = !!b.transparent
    }
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
function handleScenePane(state:boolean) {
  orbitControls!.enablePan = state
}
function handleSceneEnable(state:boolean) {
  // processFour!.handleSceneEnable(state)
  orbitControls!.enabled = state

}
function handleSceneScale(state:boolean) {
  orbitControls!.enableZoom =state

}
</script>

<style lang="less" scoped>
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
  overflow: auto;
  height: 100%;
  .el-button {
    margin: 0;
    margin-bottom: 10px;
  }
}
.plan-detail {
  position: absolute;
  // top: 30px;
  left: 20px;
  bottom: 20px;
  width: 380px;
  max-height: calc(100% - 70px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.3);
  padding: 10px 10px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
    & ::v-deep {
    .el-descriptions__body {
      background: transparent !important;
    }
    .el-descriptions__label,
    .el-descriptions__content,.el-descriptions__title {
      color: #fff;
    }
  }
}
</style>
