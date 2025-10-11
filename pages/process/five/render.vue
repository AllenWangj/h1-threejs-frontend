<template>
  <div class="flex flex-shrink-0 w-[100%] h-[100%] relative">
    <schemes-list :list="schemeList" :current="currentAcviteScheme" @tap-scheme="tapScheme"></schemes-list>
    <div v-loading="loading" :element-loading-text="loadingText"
      class="flex-1 relative border border-[1px] border-[#adcdf7]">
      <div ref="threeContainer" class="three-container" />
      <div v-if="!loading" class="toolbar-container">
        <el-button class="w-[120px]" :type="hideModel.includes(1) ? 'info' : 'primary'" @click="playStepAnimation(1)">
          窗
        </el-button>
        <el-button class="w-[120px]" :type="hideModel.includes(2) ? 'info' : 'primary'" @click="playStepAnimation(2)">
          门
        </el-button>
        <el-button class="w-[120px]" :type="hideModel.includes(3) ? 'info' : 'primary'" @click="playStepAnimation(3)">
          屋面板
        </el-button>
        <el-button class="w-[120px]" :type="hideModel.includes(4) ? 'info' : 'primary'" @click="playStepAnimation(4)">
          屋顶
        </el-button>
        <el-button class="w-[120px]" :type="hideModel.includes(5) ? 'info' : 'primary'" @click="playStepAnimation(5)">
          墙壁
        </el-button>
        <el-button class="w-[120px]" :type="hideModel.includes(6) ? 'info' : 'primary'" @click="playStepAnimation(6)">
          地板
        </el-button>
        <el-button class="w-[120px]" :type="hideModel.includes(7) ? 'info' : 'primary'" @click="playStepAnimation(7)">
          顶板
        </el-button>
        <el-button class="w-[120px]" :type="hideModel.includes(8) ? 'info' : 'primary'" @click="playStepAnimation(8)">
          柱
        </el-button>
        <el-button class="w-[120px]" :type="hideModel.includes(9) ? 'info' : 'primary'" @click="playStepAnimation(9)">
          梁
        </el-button>
        <el-button class="w-[120px]" :type="hideModel.includes(10) ? 'info' : 'primary'" @click="playStepAnimation(10)">
          连接器
        </el-button>
      </div>
      <div v-if="!loading" class="toolbar-content">
        <BuildInfo v-for="n in 5" :key="n"></BuildInfo>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import SchemesList from '@/components/schemes-list/index.vue'
import BuildInfo from './components/build-info.vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { modeService } from './composables/mode-service'
import { getPartsProductionDetail } from '@/apis/project'

const route = useRoute()
const projectId = ref('')
const schemeList = ref < any[] > ([])
// 当前激活得方案id
const currentAcviteScheme = ref('')

const tapScheme = (item) => {
  console.log('点击了部件生产方案', item)
}

// 获取详情
async function fetchDetail() {
  try {
    const { data } = await getPartsProductionDetail({
      projectId: projectId.value
    })
    schemeList.value = data.plans || []
    if (schemeList.value.length) {
      currentAcviteScheme.value = schemeList.value[0].id
    }
    console.log('获取部件生产详情', data)
  } catch (error) {
    console.error('获取部件生产详情失败', error)
  } finally {
  }
}

// 模型数据服务
const serviceData = modeService()

const loading = ref(false)
const loadingText = ref('0%...')

const hideModel = ref([])

const threeContainer = ref(null)
let scene, camera, renderer, controls, animationId

onMounted(() => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
  }
  fetchDetail();
  
  initThree()
  loadModel()
  animate()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  renderer.dispose()
  window.removeEventListener('resize', onResize)
})

function initThree() {
  scene = new THREE.Scene()
  // 设置天空背景
  scene.background = new THREE.Color(0x87ceeb) // 天空蓝颜色

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
    async (gltf) => {
      const root = gltf.scene
      console.log('模型根节点:', root)
      scene.add(root)

      // === 关键：把整体移到中心 ===
      const box = new THREE.Box3().setFromObject(root) // 计算包围盒
      const center = new THREE.Vector3()
      box.getCenter(center)
      // 把 root 整体往反方向平移，使模型中心对齐到 (0,0,0)
      root.position.sub(center)

      setTimeout(() => {
        loading.value = false
      }, 1000)
    },
    (xhr) => {
      if (xhr.total) {
        console.log(`加载进度: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`)
        loadingText.value = `${((xhr.loaded / xhr.total) * 100).toFixed(2)}%...`
      }
    },
    (error) => {
      console.error('模型加载失败:', error)
    }
  )
}

// 步骤模型显示隐藏方案
async function playStepAnimation(value) {
  let models = []
  switch (value) {
    case 1: // 窗
      models = serviceData.windowData()
      break // 门
    case 2:
      models = serviceData.doorData()
      break
    case 3: // 屋面板
      models = serviceData.roofData()
      break
    case 4: // 屋顶
      models = serviceData.roofTopData()
      break
    case 5: // 墙壁
      models = serviceData.wallData()
      break
    case 6: //  地板
      models = serviceData.floorData()
      break
    case 7: // 顶板
      models = serviceData.floorTopData()
      break
    case 8: // 柱
      models = serviceData.pillarData()
      break
    case 9: // 梁
      models = serviceData.beamData()
      break
    case 10: // 连接器
      models = serviceData.connectorData()
      break
    default:
      break
  }

  settingModelStatus(models, value)
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
window.addEventListener('resize', onResize)
function onResize() {
  camera.aspect = threeContainer.value.clientWidth / threeContainer.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight)
}
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 100%;
  display: block;
}

.toolbar-container {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 270px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.1);
  padding: 10px 10px 0;
  border: 1px solid #ccc;
  border-radius: 8px;

  .el-button {
    margin: 0;
    width: 120px;
    margin-bottom: 10px;
  }
}

.toolbar-content {
  position: absolute;
  top: 250px;
  right: 20px;
  bottom: 20px;
  width: 270px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.3);
  padding: 10px 10px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
