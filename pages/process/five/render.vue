<template>
  <div class="flex flex-shrink-0 w-[100%] h-[100%] relative">
    <schemes-list :list="schemeList" :current="currentAcviteScheme" @tap-scheme="tapScheme"></schemes-list>
    <div ref="fullscreenContainer" v-loading="loading" :element-loading-text="loadingText"
      class="flex-1 relative border border-[1px] border-[#adcdf7]">
      <div ref="threeContainer" class="three-container" />
      <div v-if="!loading && currentAcviteScheme" class="toolbar-container">
        <ModelWrapper v-for="item in materialDataList" :key="item.value">
          <p style="color: #fff;text-align: center;"> {{ item.name }}</p>

          <p style="color: #fff;text-align: center;width: 100%;"> <el-switch v-model="item.state"
              @change="playStepAnimation(item.value)"></el-switch></p>
        </ModelWrapper>
        <!-- <el-button v-for="item in materialDataList" :key="item.value"
          :type="hideModel.includes(item.value) ? 'info' : 'primary'" @click="playStepAnimation(item.value)">
        <el-button v-for="item in materialDataList" :key="item.value"
          :source="hideModel.includes(item.value) ? 'info' : 'primary'" @click="playStepAnimation(item.value)">
          {{ item.name }}
        </el-button> -->
      </div>
      <div v-if="!loading && currentAcviteScheme" class="toolbar-content">
        <BuildInfo v-for="item in materialDataList" :key="item.value" :name="item.name" :list="item.infoList">
        </BuildInfo>
      </div>

      <div v-if="!loading && currentAcviteScheme" class="absolute top-[10px] left-[10px] z-10" style="width: 100%;">
        <!-- 下载方案 -->
        <!-- <el-button @click="downloadSolution" type="primary">导出方案</el-button>
       <el-button @click="downloadSolution" type="primary">导出设计</el-button>
       <el-button type="primary" @click="handleScenePane(false)">禁止拖动</el-button>
        <el-button type="primary" @click="handleScenePane(true)">允许拖动</el-button>
        <el-button type="primary" @click="handleSceneEnable(false)">关闭场景</el-button>
        <el-button type="primary" @click="handleSceneEnable(true)">开启场景</el-button>
        <el-button type="primary" @click="handleSceneScale(true)">允许缩放</el-button>
        <el-button type="primary"  @click="handleSceneScale(false)">禁止缩放</el-button> -->
        <div class="opt">
          <div class="opt-content">
            <p class="opt-btn" @click="handleScenePane(false)">
              <img src="./svg/stop-o.svg"
                style="width: 30px; position: relative; margin-right: 3px; display: inline-block;" />
              <span>禁止拖动</span>
            </p>
            <p class="opt-btn" @click="handleScenePane(true)">
              <img src="./svg/drag.svg"
                style="width: 30px;position: relative;  margin-right: 3px;display: inline-block;" />
              <span>允许拖动</span>
            </p>
            <p class="opt-btn" @click="handleSceneEnable(false)">
              <img src="./svg/closescene.svg"
                style="width: 30px;position: relative;  margin-right: 3px; display: inline-block;" />
              <span>关闭场景</span>
            </p>
            <p class="opt-btn" @click="handleSceneEnable(true)">
              <img src="./svg/openscene.svg"
                style="width: 30px; position: relative;  margin-right: 3px; display: inline-block;" />
              <span>开启场景</span>
            </p>
            <p class="opt-btn" @click="handleSceneScale(true)">
              <img src="./svg/okscale.svg"
                style="width: 30px;position: relative;  margin-right: 3px;  display: inline-block;" />
              <span>允许缩放</span>
            </p>
            <p class="opt-btn" @click="handleSceneScale(false)">
              <img src="./svg/hide.svg"
                style="width: 30px; position: relative; margin-right: 3px; display: inline-block;" />
              <span>禁止缩放</span>
            </p>
          </div>
          <el-button
            style="background-color: #3A78C0;width: 110px;border-radius: 30px;background: linear-gradient( 180deg, #C7EEFF 0%, #4FF396 100%);color:#09488A"
            type="primary" @click="downloadSolution" size="large">导出方案</el-button>
        </div>
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
import { materialInfoService } from './composables/material-info-service'
import { getPartsProductionDetail, planExport ,downProjectCreate,design} from '@/apis/project'
import ModelWrapper from "@/components/model-wrapper/index.vue"


// 全屏相关
const fullscreenContainer = ref<HTMLElement | null>(null)
useFullScreenResize(fullscreenContainer, onResize)

const route = useRoute()
const projectId = ref('')
const schemeList = ref<any[]>([])
// 当前激活得方案id
const currentAcviteScheme = ref('')

const tapScheme = (item) => {
  currentAcviteScheme.value = item.id
  loadModel()
  console.log('点击了部件生成方案', item)
}

// 下载方案
const downloadSolution = async () => {
  // try {
    const url = downProjectCreate({
      id: currentAcviteScheme.value ,
      // source: 5
    })
    design({id:currentAcviteScheme.value }).then(async (response:any)=>{
        const fileBlob = response;
        const blobUrl =fileBlob;
        debugger
    // 创建 a 标签用于下载
    const aTag = document.createElement("a");
    aTag.href = blobUrl;
    // 设置下载文件名（可自定义）
    aTag.download = "生产部件.zip";
    // 触发点击下载
    aTag.click();
    // 释放 Blob URL 资源（避免内存泄漏）
    URL.revokeObjectURL(blobUrl);
    })
    // debugger
    // const a = document.createElement('a')
    // a.href = url
    // a.download = `部件生成方案.zip`
    // document.body.appendChild(a)
    // a.click()
    // document.body.removeChild(a)
  // }
  
  // catch (error) {
  //   console.error('下载方案失败', error)
  // }
}

// 获取详情
async function fetchDetail() {
  try {
    const { data } = await getPartsProductionDetail({
      projectId: projectId.value,
      source: 5
    })
    schemeList.value = data || []
    if (schemeList.value.length > 0) {
      currentAcviteScheme.value = schemeList.value[0].id
      loadModel()
    }
    console.log('获取部件生产详情', data)
  } catch (error) {
    console.error('获取部件生产详情失败', error)
  } finally {
  }
}

// 模型数据服务
const materialDataList = ref(materialInfoService())
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
  // loadModel()
  animate()

  // 窗口变化刷新
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  if (renderer) {
    renderer.dispose()

  }
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
let lastMesh: any = null
function loadModel() {
  loading.value = true
  const loader = new GLTFLoader()
  loader.load(
    '/models/tool5/scene.gltf', // 替换成你自己的路径
    async (gltf) => {
      if (lastMesh) {
        lastMesh.traverse((object) => {
          object.geometry?.dispose()
          object.material?.dispose()
        })
        lastMesh.parent.remove(lastMesh)

      }
      const root = gltf.scene
      lastMesh = root
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
function onResize() {
  const el = threeContainer.value
  console.log('窗口变化刷新', threeContainer.value.clientWidth, threeContainer.value.clientHeight)
  camera.aspect = el.clientWidth / el.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(el.clientWidth, el.clientHeight)
}
function handleScenePane(state: boolean) {
  controls!.enablePan = state
}
function handleSceneEnable(state: boolean) {
  // processFour!.handleSceneEnable(state)
  controls!.enabled = state

}
function handleSceneScale(state: boolean) {
  controls!.enableZoom = state

}

</script>

<style scoped lang="less">
.three-container {
  width: 100%;
  height: 100%;
  display: block;
}

.toolbar-container {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 100px;
  // max-height: 200px;
  // overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  // background: rgba(0, 0, 0, 0.1);
  padding: 20px 10px 10px;
  // border: 1px solid #ccc;
  border-radius: 8px;


  .el-button {
    margin: 0;
    width: 150px;
    margin: 0 10px 10px;
  }
}

.toolbar-content {
  position: absolute;
  bottom: 20px;
  height: 630px;
  left: 10px;
  width: 508px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  // background: rgba(0, 0, 0, 0.3);
  padding: 10px 10px 0;
  border: 1px solid #ccc;
  border-radius: 8px;

  background: #568FCC;
  border-radius: 8px;
  border: 1px solid #3A78C0;
}

.opt {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  width: 100%;

  .opt-content {
    width: 800px;
    height: 40px;

    border-radius: 8px;
    border: 1px solid #3A78C0;
    display: flex;
    flex-direction: row;
    overflow: hidden;

    .opt-btn {
      flex: 1;
      text-align: center;
      color: #fff;
      line-height: 38px;
      height: 38px;
      cursor: pointer;
      background: #568FCC;

      &:hover {
        background: #568FCC90
      }
    }

  }

}
</style>
