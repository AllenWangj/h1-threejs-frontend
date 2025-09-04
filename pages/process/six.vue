<template>
  <div v-loading="loading" class="w-[100%] h-[100%]">
    <div ref="threeContainer" class="three-container" />
    <div class="toolbar-container">
      <el-button class="w-[120px]" :type="hideModel.includes(1) ? 'info' : 'primary'" @click="playStep1Animation(1)">
        窗
      </el-button>
      <el-button class="w-[120px]" :type="hideModel.includes(2) ? 'info' : 'primary'" @click="playStep2Animation(2)">
        门
      </el-button>
      <el-button class="w-[120px]" :type="hideModel.includes(3) ? 'info' : 'primary'" @click="playStep3Animation(3)">
        屋面板
      </el-button>
      <el-button class="w-[120px]" :type="hideModel.includes(4) ? 'info' : 'primary'" @click="playStep4Animation(4)">
        屋顶
      </el-button>
      <el-button class="w-[120px]" :type="hideModel.includes(5) ? 'info' : 'primary'" @click="playStep5Animation(5)">
        墙壁
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
const loading = ref(false)
const hideModel = ref([])

const threeContainer = ref(null)
let scene, camera, renderer, controls, animationId

onMounted(() => {
  initThree()
  loadModel()
  animate()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  renderer.dispose()
})

function initThree() {
  scene = new THREE.Scene()
  // 设置天空背景
  scene.background = new THREE.Color(0x87ceeb); // 天空蓝颜色

  const width = threeContainer.value.clientWidth
  const height = threeContainer.value.clientHeight
  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000)
  camera.position.set(-10, 10, -30)

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    precision: 'highp',
    powerPreference: 'high-performance' // 优先 GPU 性能
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio * 1.5)
  threeContainer.value.appendChild(renderer.domElement)

  // 增强环境光
  const ambient = new THREE.AmbientLight(0xffffff, 2.0)
  scene.add(ambient)

  // 添加主方向光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
  directionalLight.position.set(5, 10, 7)
  directionalLight.castShadow = true
  scene.add(directionalLight)

  // 添加辅助方向光，减少阴影
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.0)
  directionalLight2.position.set(-5, -5, -5)
  scene.add(directionalLight2)

  // 添加半球光作为补光
  const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1.0)
  scene.add(hemisphereLight)

  // 创建一个坐标辅助器，长度为 5
  // const axesHelper = new THREE.AxesHelper(350)
  // 添加到场景
  // scene.add(axesHelper)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  // 限制相机视角，防止移动到地面以下
  controls.maxPolarAngle = Math.PI / 2 - 0.1 // 限制垂直旋转角度，防止从下方看
  controls.minDistance = 0 // 最小距离
  controls.maxDistance = 100 // 最大距离
}

// 加载模型并创建自定义动画
function loadModel() {
  loading.value = true
  const loader = new GLTFLoader()
  loader.load(
    '/models/tool5/scene.gltf', // 替换成你自己的路径
   async (gltf) =>  {
      const root = gltf.scene
      console.log('模型根节点:', root)
      scene.add(root)

      // === 关键：把整体移到中心 ===
      const box = new THREE.Box3().setFromObject(root) // 计算包围盒
      const center = new THREE.Vector3()
      box.getCenter(center)
      // 把 root 整体往反方向平移，使模型中心对齐到 (0,0,0)
      root.position.sub(center)


      await nextTick()
      loading.value = false
    },
    (xhr) => {
      if (xhr.total) console.log(`加载进度: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`)
    },
    (error) => {
      console.error('模型加载失败:', error)
    }
  )
}

async function playStep1Animation(value) {
  const names = [
    '<组件#66>',
    '<组件#66>_1',
    '<组件#66>_2',
    '<组件#66>_3',
    '<组件#66>_4',
    '<组件#66>_5',
    '<组件#66>_6',
    '<组件#66>_7',
    '<组件#66>_8',
    '<组件#66>_9',
    '<组件#66>_10',
    '<组件#66>_11',
    '<组件#66>_12',
    '<组件#66>_13',
    '<组件#66>_14',
    '<组件#66>_15',
    '<组件#66>_16',
    '<组件#66>_17',
    '<组件#66>_18',
    '<组件#66>_19',
    '<组件#66>_20',
    '<组件#66>_21',
    '<组件#66>_22'
  ]
  settingModelStatus(names, value)
}

async function playStep2Animation(value) {
  const names = new Array(19)
    .fill(0)
    .map((_, i) => `IfcDoor_-_单嵌板木门_14D-04455344<3ID151naX4SP9QZfy4vvW9#1>${i !== 0 ? '_' + i : ''}`)
  settingModelStatus(names, value)
}

async function playStep3Animation(value) {
  const names12 = new Array(32).fill(0).map((_, i) => `<组件#10>${i !== 0 ? '_' + i : ''}`)
  const names1 = new Array(19).fill(0).map((_, i) => `<组件#12>${i !== 0 ? '_' + i : ''}`)
  const names2 = [
    '<组件#19>',
    '<组件#8>',
    '<组件#107>',
    '<组件#107>_1',
    '<组件#107>_2',
    '<组件#77>',
    '<组件#77>_1',
    '<组件#77>_2',
    '<组件#77>_3',
    '<组件#79>',
    '<组件#79>_1',
    '<组件#79>_2',
    '<组件#79>_3',
    '<组件#105>',
    '<组件#105>_1',
    '<组件#109>',
    '<组件#109>_1',
    '<组件#111>',
    '<组件#58>',
    '<组件#45>',
    '<组件#47>',
    '<组件#21>',
    '<组件#25>',
    '<组件#75>',
    '<组件#64>',
    '<组件#67>',
    '<组件#11>',
    '<组件#69>',
    '<组件#71>',
    '<组件#73>'
  ]
  const names3 = new Array(12).fill(0).map((_, i) => `<组件#42>${i !== 0 ? '_' + i : ''}`)
  const names4 = new Array(6).fill(0).map((_, i) => `<组件#95>${i !== 0 ? '_' + i : ''}`)
  const names5 = new Array(9).fill(0).map((_, i) => `<组件#90>${i !== 0 ? '_' + i : ''}`)
  const names6 = new Array(9).fill(0).map((_, i) => `<组件#92>${i !== 0 ? '_' + i : ''}`)
  const names7 = new Array(9).fill(0).map((_, i) => `<组件#88>${i !== 0 ? '_' + i : ''}`)
  // 柱子的面板
  const names8 = ['<组件#113>', ...new Array(4).fill(0).map((_, i) => `<组件#83>${i !== 0 ? '_' + i : ''}`)]

  // 内部
  const names9 = new Array(19).fill(0).map((_, i) => `<组件#45>${i !== 0 ? '_' + i : ''}`)
  const names10 = new Array(18).fill(0).map((_, i) => `<组件#46>${i !== 0 ? '_' + i : ''}`)
  const names11 = new Array(19).fill(0).map((_, i) => `<组件#47>${i !== 0 ? '_' + i : ''}`)

  const names = [
    ...names1,
    ...names2,
    ...names3,
    ...names4,
    ...names5,
    ...names6,
    ...names7,
    ...names8,
    ...names9,
    ...names10,
    ...names11,
    ...names12
  ]

  settingModelStatus(names, value)
}

async function playStep4Animation(value) {
  const names = ['Group_821']
  settingModelStatus(names, value)
}

async function playStep5Animation(value) {
  const names1 = new Array(48).fill(0).map((_, i) => `<组件#40>${i !== 0 ? '_' + i : ''}`)
  const names2 = new Array(10).fill(0).map((_, i) => `<组件#44>${i !== 0 ? '_' + i : ''}`)
  const names3 = new Array(14).fill(0).map((_, i) => `<组件#41>${i !== 0 ? '_' + i : ''}`)
  const names4 = new Array(144).fill(0).map((_, i) => `<组件#37>${i !== 0 ? '_' + i : ''}`)
  const names5 = new Array(36).fill(0).map((_, i) => `<组件#39>${i !== 0 ? '_' + i : ''}`)
  const names6 = [
    'Group_110',
    'Group_41',
    'Group_621',
    'Group_591',
    'Group_168',
    'Group_237',
    'Group_487',
    'Group_419',
    'Group_548',
    'Group_518',
    'Group_294',
    'Group_363',
    'Group_694',
    'Group_705',
    'Group_768',
    'Group_816',
    'Group_883',
    'Group_673'
  ]
  const names = [...names1, ...names2, ...names3, ...names4, ...names5, ...names6]

  settingModelStatus(names, value)
}

function settingModelStatus(names = [], value) {
  if (hideModel.value.includes(value)) {
    hideModel.value = hideModel.value.filter((item) => item !== value)
    showModel(names)
  } else {
    hideModel.value.push(value)
    hiddenModel(names)
  }
}

// 隐藏模型
function hiddenModel(names = []) {
  names.forEach((name) => {
    const part = scene.getObjectByName(name)
    if (part) {
      part.visible = false
    } else {
      console.log(`模型不存在: ${name}`)
    }
  })
}

// 显示模型
function showModel(names = []) {
  names.forEach((name) => {
    const part = scene.getObjectByName(name)
    if (part) {
      part.visible = true
    } else {
      console.log(`模型不存在: ${name}`)
    }
  })
}
// 渲染循环
function animate() {
  animationId = requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

// 窗口变化刷新
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 100%;
  display: block;
}

.toolbar-container {
  position: fixed;
  top: 60px;
  right: 20px;
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
