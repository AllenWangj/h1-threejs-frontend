<template>
  <div class="flex flex-shrink-0 w-[100%] h-[100%] relative">
    <schemes-list :list="schemeList" :current="currentAcviteScheme" @tap-scheme="tapScheme"></schemes-list>
    <div ref="fullscreenContainer" class="flex-1 relative border border-[1px] border-[#adcdf7]">
      <div ref="threeContainer" class="three-container"></div>
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
      <div class="toolbar-container">
        <ModelWrapper @click="playStep1Animation">
          <p style="width: 100%;text-align: center;color:#fff"> 步骤1</p>
          <p style="width: 100%;text-align: center;color:#fff;font-size: 12px;"> 需要20人/天</p>
        </ModelWrapper>

        <ModelWrapper @click="playStepNew2Animation">
          <p style="width: 100%;text-align: center;color:#fff"> 步骤2</p>
          <p style="width: 100%;text-align: center;color:#fff;font-size: 12px;"> 需要10人/天</p>
        </ModelWrapper>

        <ModelWrapper @click="playStepNew221Animation">
          <p style="width: 100%;text-align: center;color:#fff"> 步骤3</p>
          <p style="width: 100%;text-align: center;color:#fff;font-size: 12px;"> 需要10人/天</p>
        </ModelWrapper>

        <ModelWrapper @click="playStep2Animation">
          <p style="width: 100%;text-align: center;color:#fff"> 步骤4</p>
          <p style="width: 100%;text-align: center;color:#fff;font-size: 12px;"> 需要5人/天</p>
        </ModelWrapper>

        <ModelWrapper @click="playStepNew21Animation">
          <p style="width: 100%;text-align: center;color:#fff"> 步骤5</p>
          <p style="width: 100%;text-align: center;color:#fff;font-size: 12px;"> 需要15人/天</p>
        </ModelWrapper>



        <ModelWrapper @click="playStepNew22Animation">
          <p style="width: 100%;text-align: center;color:#fff"> 步骤6</p>
          <p style="width: 100%;text-align: center;color:#fff;font-size: 12px;"> 需要10人/天</p>
        </ModelWrapper>


        <ModelWrapper @click="playStep3Animation">
          <p style="width: 100%;text-align: center;color:#fff"> 步骤7</p>
          <p style="width: 100%;text-align: center;color:#fff;font-size: 12px;"> 需要5人/天</p>
        </ModelWrapper>


        <ModelWrapper @click="playStep41Animation">
          <p style="width: 100%;text-align: center;color:#fff"> 步骤8</p>
          <p style="width: 100%;text-align: center;color:#fff;font-size: 12px;"> 需要6人/天</p>
        </ModelWrapper>

        <ModelWrapper @click="playStep42Animation">
          <p style="width: 100%;text-align: center;color:#fff"> 步骤9</p>
          <p style="width: 100%;text-align: center;color:#fff;font-size: 12px;"> 需要7人/天</p>
        </ModelWrapper>


        <ModelWrapper @click="playStep43Animation">
          <p style="width: 100%;text-align: center;color:#fff"> 步骤10</p>
          <p style="width: 100%;text-align: center;color:#fff;font-size: 12px;"> 需要3人/天</p>
        </ModelWrapper>


        <ModelWrapper @click="playStep44Animation">
          <p style="width: 100%;text-align: center;color:#fff"> 步骤11</p>
          <p style="width: 100%;text-align: center;color:#fff;font-size: 12px;"> 需要2人/天</p>
        </ModelWrapper>

        <ModelWrapper @click="playStep51Animation">
          <p style="width: 100%;text-align: center;color:#fff"> 步骤12</p>
          <p style="width: 100%;text-align: center;color:#fff;font-size: 12px;"> 需要1人/天</p>
        </ModelWrapper>

        <ModelWrapper @click="playStep52Animation">
          <p style="width: 100%;text-align: center;color:#fff"> 步骤13</p>
          <p style="width: 100%;text-align: center;color:#fff;font-size: 12px;"> 需要4人/天</p>
        </ModelWrapper>
        <ModelWrapper @click="playStep53Animation">
          <p style="width: 100%;text-align: center;color:#fff"> 步骤14</p>
          <p style="width: 100%;text-align: center;color:#fff;font-size: 12px;"> 需要5人/天</p>
        </ModelWrapper>


        <ModelWrapper @click="playStep53Animation1">
          <p style="width: 100%;text-align: center;color:#fff"> 步骤15</p>
          <p style="width: 100%;text-align: center;color:#fff;font-size: 12px;"> 需要7人/天</p>
        </ModelWrapper>

        <ModelWrapper @click="playStep53Animation2">
          <p style="width: 100%;text-align: center;color:#fff"> 步骤16</p>
          <p style="width: 100%;text-align: center;color:#fff;font-size: 12px;"> 需要2人/天</p>
        </ModelWrapper>

        <ModelWrapper @click="playStep54Animation">
          <p style="width: 100%;text-align: center;color:#fff"> 步骤17</p>
          <p style="width: 100%;text-align: center;color:#fff;font-size: 12px;"> 需要3人/天</p>
        </ModelWrapper>


        <ModelWrapper @click="playStep55Animation">
          <p style="width: 100%;text-align: center;color:#fff"> 步骤18</p>
          <p style="width: 100%;text-align: center;color:#fff;font-size: 12px;"> 需要5人/天</p>
        </ModelWrapper>

        <ModelWrapper @click="playStep55Animation1">
          <p style="width: 100%;text-align: center;color:#fff"> 步骤19</p>
          <p style="width: 100%;text-align: center;color:#fff;font-size: 12px;"> 需要7人/天</p>
        </ModelWrapper>

        <ModelWrapper @click="playStep55Animation2">
          <p style="width: 100%;text-align: center;color:#fff"> 步骤20</p>
          <p style="width: 100%;text-align: center;color:#fff;font-size: 12px;"> 需要3人/天</p>
        </ModelWrapper>

        <ModelWrapper @click="playStep55Animation3">
          <p style="width: 100%;text-align: center;color:#fff"> 步骤21</p>
          <p style="width: 100%;text-align: center;color:#fff;font-size: 12px;"> 需要4人/天</p>
        </ModelWrapper>


        <ModelWrapper @click="playStep55Animation4">
          <p style="width: 100%;text-align: center;color:#fff"> 步骤22</p>
          <p style="width: 100%;text-align: center;color:#fff;font-size: 12px;"> 需要5人/天</p>
        </ModelWrapper>
      </div>
      <div v-if="currentAcviteScheme" class="absolute top-[10px] left-[10px] z-10">
        <!-- 下载方案 -->
        <!-- <el-button @click="downloadSolution" type="primary">导出方案</el-button>
          <el-button type="primary" @click="handleScenePane(false)">禁止拖动</el-button>
        <el-button type="primary" @click="handleScenePane(true)">允许拖动</el-button>
        <el-button type="primary" @click="handleSceneEnable(false)">关闭场景</el-button>
        <el-button type="primary" @click="handleSceneEnable(true)">开启场景</el-button>
        <el-button type="primary" @click="handleSceneScale(true)">允许缩放</el-button>
        <el-button type="primary"  @click="handleSceneScale(false)">禁止缩放</el-button> -->
      </div>
      <div class="toolbar-content">
        <BuildInfo v-for="item in materialDataList" :key="item.value" :name="item.name" :list="item.infoList">
        </BuildInfo>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import SchemesList from '@/components/schemes-list/index.vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { getAssembleDetail, planExport } from '@/apis/project'
import BuildInfo from './components/build-info.vue'
import { materialInfoService } from './composables/material-info-service'
import ModelWrapper from "@/components/model-wrapper/index.vue"

// 全屏相关
const fullscreenContainer = ref<HTMLElement | null>(null)
useFullScreenResize(fullscreenContainer, onResize)
const materialDataList = ref(materialInfoService())
const route = useRoute()
const projectId = ref('')
const schemeList = ref<any[]>([])
// 当前激活得方案id
const currentAcviteScheme = ref('')
const tapScheme = (item) => {
  console.log('点击了现场组装方案', item)
  currentAcviteScheme.value = item.id
  loadModel()
}

// 下载方案
const downloadSolution = async () => {
  try {
    const url = planExport({
      projectId: projectId.value,
      type: 7
    })
    const a = document.createElement('a')
    a.href = url
    a.download = `现场组装方案.docx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } catch (error) {
    console.error('下载方案失败', error)
  }
}

// 获取详情
async function fetchDetail() {
  try {
    const { data } = await getAssembleDetail({
      projectId: projectId.value,
      type: 7
    })
    schemeList.value = data || []
    if (schemeList.value.length > 0) {
      currentAcviteScheme.value = schemeList.value[0].id
      loadModel()
    }
    console.log('获取现场组装详情', data)
  } catch (error) {
    console.error('获取现场组装详情失败', error)
  } finally {
  }
}

const threeContainer = ref(null)
let scene, camera, renderer, controls, animationId

onMounted(() => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
  }
  fetchDetail()

  initThree()
  animate()

  // 窗口变化刷新
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  renderer.dispose()
  // 移除窗口监听
  window.removeEventListener('resize', onResize)
})

function initThree() {
  scene = new THREE.Scene()
  // 设置天空背景
  scene.background = new THREE.Color(0x87ceeb) // 天空蓝颜色

  const width = threeContainer.value.clientWidth
  const height = threeContainer.value.clientHeight
  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000)
  camera.position.set(150, 150, 450)
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
  const axesHelper = new THREE.AxesHelper(350)

  // 添加到场景
  // scene.add(axesHelper)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
}

// 防闪烁材质处理
function fixMaterial(child) {
  if (child.isMesh) {
    const mats = Array.isArray(child.material) ? child.material : [child.material]
    mats.forEach((m) => {
      // 保留原始透明属性
      if (m.transparent) {
        // 半透明材质保持原样
        m.depthTest = true
        m.depthWrite = true
      } else {
        // 不透明材质加 polygonOffset 防闪烁
        m.polygonOffset = true
        m.polygonOffsetFactor = 1
        m.polygonOffsetUnits = 1
        m.depthTest = true
        m.depthWrite = true
      }
      m.needsUpdate = true
    })
  } else if (child.isLine || child.isLineSegments) {
    child.material.depthTest = true
    child.renderOrder = 999 // 优先渲染线条，避免Z-fighting
  }
}
let lastMesh: any = null
// 加载模型并创建自定义动画
function loadModel() {
  btnLoading.value = true
  const loader = new GLTFLoader()
  loader.load(
    '/models/tool7/scene.gltf', // 替换成你自己的路径
    (gltf) => {
      if (lastMesh) {
        lastMesh.traverse((object) => {
          object.geometry?.dispose()
          object.material?.dispose()
        })
        lastMesh.parent.remove(lastMesh)
      }
      const root = gltf.scene
      console.log('模型根节点:', root)
      btnLoading.value = false

      // 创建一个 wrapper，把 root 的 TRS 复制过来
      root.updateMatrixWorld(true)
      const wrapper = new THREE.Group()
      wrapper.position.copy(root.position)
      wrapper.quaternion.copy(root.quaternion)
      wrapper.scale.copy(root.scale)
      wrapper.rotation.x = -Math.PI / 2 // 旋转 90 度
      scene.add(wrapper)

      // 找到部件
      const parts = root.children[0].children[0].children
      for (const part of parts) {
        const clone = part.clone(true)
        clone.visible = true
        clone.traverse(fixMaterial)
        wrapper.add(clone)
      }

      // === 关键：把整体移到中心 ===
      const box = new THREE.Box3().setFromObject(wrapper) // 计算包围盒
      const center = new THREE.Vector3()
      box.getCenter(center)

      // 把 wrapper 整体往反方向平移，使模型中心对齐到 (0,0,0)
      wrapper.position.sub(center)
    },
    (xhr) => {
      if (xhr.total) console.log(`加载进度: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`)
    },
    (error) => {
      console.error('模型加载失败:', error)
    }
  )
}

const btnLoading = ref(false)

async function playStep1Animation() {
  btnLoading.value = true
  hiddenModel([
    '底柱',
    '地板托架',
    '次梁',
    '密封钢板',
    '地板',
    '柱',
    '角件',
    '梁',
    '地板托架（顶）',
    '次梁（顶）',
    '密封钢板（顶）',
    '吊顶板',
    '地板(顶）',
    '屋架',
    '内装饰墙板',
    '门窗',
    '外墙板檩条',
    '外墙面板',
    '柱装饰板',
    '屋面板'
  ])
  await animateObjects(['底柱'])
  btnLoading.value = false
}

// function animateObjects1(names, startZ = 500, duration = 1,number=2) {
//   const promises = names.map((name) => {
//     const obj = scene.getObjectByName(name)
//     debugger
//     if (!obj || obj.visible) return Promise.resolve()
//     const endPos = obj.position.clone()
//     return animateObject(obj, endPos, startZ, duration)
//   })

//   return Promise.all(promises)
// }

async function playStep2Animation() {
  // btnLoading.value = true
  // hiddenModel([
  //   '地板托架',
  //   '次梁',
  //   '密封钢板',
  //   '地板',
  //   // '柱',
  //   // '角件',
  //   '梁',
  //   '地板托架（顶）',
  //   '次梁（顶）',
  //   '密封钢板（顶）',
  //   '吊顶板',
  //   '地板(顶）',
  //   '屋架',
  //   '内装饰墙板',
  //   '门窗',
  //   '外墙板檩条',
  //   '外墙面板',
  //   '柱装饰板',
  //   '屋面板'
  // ])
  // // 需要先显示上一步的部件以免未执行第上一步
  // await animateObjects(['底柱'], 0)
  // // 执行当前步骤的动画
  // await animateObjects(['地板托架'])
  // // await animateObjects(['次梁'])
  // // await animateObjects(['密封钢板', '地板'])
  // btnLoading.value = false
  btnLoading.value = true
  hiddenModel([
    // '底柱',
    // '地板托架',
    // '次梁',
    // '密封钢板',
    '地板',
    '柱',
    '角件',
    '梁',
    '地板托架（顶）',
    '次梁（顶）',
    '密封钢板（顶）',
    '吊顶板',
    '地板(顶）',
    '屋架',
    '内装饰墙板',
    '门窗',
    '外墙板檩条',
    '外墙面板',
    '柱装饰板',
    '屋面板'
  ])
  await animateObjects(['密封钢板'])
  btnLoading.value = false
}
async function playStepNew21Animation() {
  // btnLoading.value = true
  // hiddenModel([
  //   // '地板托架',
  //   '次梁',
  //   '密封钢板',
  //   '地板',
  //   // '柱',
  //   // '角件',
  //   '梁',
  //   '地板托架（顶）',
  //   '次梁（顶）',
  //   '密封钢板（顶）',
  //   '吊顶板',
  //   '地板(顶）',
  //   '屋架',
  //   '内装饰墙板',
  //   '门窗',
  //   '外墙板檩条',
  //   '外墙面板',
  //   '柱装饰板',
  //   '屋面板'
  // ])
  // // 需要先显示上一步的部件以免未执行第上一步
  // await animateObjects(['底柱'], 0)
  // // 执行当前步骤的动画
  // await animateObjects(['地板托架'], 0)
  // await animateObjects(['次梁'])
  // // await animateObjects(['密封钢板', '地板'])
  // btnLoading.value = false
  btnLoading.value = true
  hiddenModel([
    // '底柱',
    // '地板托架',
    // '次梁',
    // '密封钢板',
    // '地板' ,
    '柱',
    '角件',
    '梁',
    '地板托架（顶）',
    '次梁（顶）',
    '密封钢板（顶）',
    '吊顶板',
    '地板(顶）',
    '屋架',
    '内装饰墙板',
    '门窗',
    '外墙板檩条',
    '外墙面板',
    '柱装饰板',
    '屋面板'
  ])
  await animateObjects(['地板'])
  btnLoading.value = false
}
async function playStepNew22Animation() {
  // btnLoading.value = true
  // hiddenModel([
  //   // '地板托架',
  //   // '次梁',
  //   '密封钢板',
  //   '地板',
  //   // '柱',
  //   // '角件',
  //   '梁',
  //   '地板托架（顶）',
  //   '次梁（顶）',
  //   '密封钢板（顶）',
  //   '吊顶板',
  //   '地板(顶）',
  //   '屋架',
  //   '内装饰墙板',
  //   '门窗',
  //   '外墙板檩条',
  //   '外墙面板',
  //   '柱装饰板',
  //   '屋面板'
  // ])
  // // 需要先显示上一步的部件以免未执行第上一步
  // await animateObjects(['底柱'], 0)
  // // 执行当前步骤的动画
  // await animateObjects(['地板托架'], 0)
  // await animateObjects(['次梁'], 0)
  // await animateObjects(['密封钢板', '地板'])
  // btnLoading.value = false

  btnLoading.value = true
  hiddenModel([
    // '底柱',
    // '地板托架',
    // '次梁',
    // '密封钢板',
    // '地板' ,
    // '柱',
    '角件',
    '梁',
    '地板托架（顶）',
    '次梁（顶）',
    '密封钢板（顶）',
    '吊顶板',
    '地板(顶）',
    '屋架',
    '内装饰墙板',
    '门窗',
    '外墙板檩条',
    '外墙面板',
    '柱装饰板',
    '屋面板'
  ])
  await animateObjects(['柱'])
  btnLoading.value = false
}

async function playStepNew2Animation() {
  // btnLoading.value = true
  // hiddenModel([
  //   '柱',
  //   // '角件',
  //   '梁',
  //   '地板托架（顶）',
  //   '次梁（顶）',
  //   '密封钢板（顶）',
  //   '吊顶板',
  //   '地板(顶）',
  //   '屋架',
  //   '内装饰墙板',
  //   '门窗',
  //   '外墙板檩条',
  //   '外墙面板',
  //   '柱装饰板',
  //   '屋面板'
  // ])
  // // 需要先显示上一步的部件以免未执行第上一步
  // // await animateObjects(['底柱', '地板托架', '次梁', '密封钢板', '地板'], 0)
  // // // 执行当前步骤的动画
  // await animateObjects(['底柱'], 0)
  // await animateObjects(['角件'])
  // await animateObjects(['柱'])

  // await animateObjects(['梁'])
  // btnLoading.value = false
  btnLoading.value = true
  hiddenModel([
    // '底柱',
    // '地板托架',
    '次梁',
    '密封钢板',
    '地板',
    '柱',
    '角件',
    '梁',
    '地板托架（顶）',
    '次梁（顶）',
    '密封钢板（顶）',
    '吊顶板',
    '地板(顶）',
    '屋架',
    '内装饰墙板',
    '门窗',
    '外墙板檩条',
    '外墙面板',
    '柱装饰板',
    '屋面板'
  ])
  await animateObjects(['地板托架'])
  btnLoading.value = false
}
async function playStepNew221Animation() {
  btnLoading.value = true
  // hiddenModel([
  //   // '柱',
  //   // '角件',
  //   '梁',
  //   '地板托架（顶）',
  //   '次梁（顶）',
  //   '密封钢板（顶）',
  //   '吊顶板',
  //   '地板(顶）',
  //   '屋架',
  //   '内装饰墙板',
  //   '门窗',
  //   '外墙板檩条',
  //   '外墙面板',
  //   '柱装饰板',
  //   '屋面板'
  // ])
  // // 需要先显示上一步的部件以免未执行第上一步
  // // await animateObjects(['底柱', '地板托架', '次梁', '密封钢板', '地板'], 0)
  // // // 执行当前步骤的动画
  // await animateObjects(['底柱'], 0)
  // await animateObjects(['角件'],0)
  // await animateObjects(['柱'])

  // await animateObjects(['梁'])
  // btnLoading.value = false

  btnLoading.value = true
  hiddenModel([
    // '底柱',
    // '地板托架',
    // '次梁',
    '密封钢板',
    '地板',
    '柱',
    '角件',
    '梁',
    '地板托架（顶）',
    '次梁（顶）',
    '密封钢板（顶）',
    '吊顶板',
    '地板(顶）',
    '屋架',
    '内装饰墙板',
    '门窗',
    '外墙板檩条',
    '外墙面板',
    '柱装饰板',
    '屋面板'
  ])
  await animateObjects(['次梁'])
  btnLoading.value = false
}

async function playStep3Animation() {
  // btnLoading.value = true
  // hiddenModel([
  //   // '柱',
  //   // '角件',
  //   // '梁',
  //   '地板托架（顶）',
  //   '次梁（顶）',
  //   '密封钢板（顶）',
  //   '吊顶板',
  //   '地板(顶）',
  //   '屋架',
  //   '内装饰墙板',
  //   '门窗',
  //   '外墙板檩条',
  //   '外墙面板',
  //   '柱装饰板',
  //   '屋面板'
  // ])
  // // 需要先显示上一步的部件以免未执行第上一步
  // await animateObjects(['底柱', '地板托架', '次梁', '密封钢板', '地板'], 0)
  // // 执行当前步骤的动画
  // // await animateObjects(['柱'])
  // // await animateObjects(['角件'])
  // await animateObjects(['梁'])
  // btnLoading.value = false
  btnLoading.value = true
  hiddenModel([
    // '底柱',
    // '地板托架',
    // '次梁',
    // '密封钢板',
    // '地板' ,
    // '柱',
    // '角件',
    '梁',
    '地板托架（顶）',
    '次梁（顶）',
    '密封钢板（顶）',
    '吊顶板',
    '地板(顶）',
    '屋架',
    '内装饰墙板',
    '门窗',
    '外墙板檩条',
    '外墙面板',
    '柱装饰板',
    '屋面板'
  ])
  await animateObjects(['角件'])
  btnLoading.value = false
}

async function playStep41Animation() {
  // btnLoading.value = true
  // hiddenModel([
  //   '地板托架（顶）',
  //   '次梁（顶）',
  //   '密封钢板（顶）',
  //   '吊顶板',
  //   '地板(顶）',
  //   '屋架',
  //   '内装饰墙板',
  //   '门窗',
  //   '外墙板檩条',
  //   '外墙面板',
  //   '柱装饰板',
  //   '屋面板'
  // ])
  // // 需要先显示上一步的部件以免未执行第上一步
  // await animateObjects(['底柱', '地板托架', '次梁', '密封钢板', '地板', '柱', '角件', '梁'], 0)
  // // 执行当前步骤的动画
  // await animateObjects(['地板托架（顶）'])
  // // await animateObjects(['次梁（顶）'])
  // // await animateObjects(['密封钢板（顶）', '吊顶板', '地板(顶）'])
  // // await animateObjects(['屋架'])
  // btnLoading.value = false
  btnLoading.value = true
  hiddenModel([
    // '底柱',
    // '地板托架',
    // '次梁',
    // '密封钢板',
    // '地板' ,
    // '柱',
    // '角件',
    // '梁',
    '地板托架（顶）',
    '次梁（顶）',
    '密封钢板（顶）',
    '吊顶板',
    '地板(顶）',
    '屋架',
    '内装饰墙板',
    '门窗',
    '外墙板檩条',
    '外墙面板',
    '柱装饰板',
    '屋面板'
  ])
  await animateObjects(['梁'])
  btnLoading.value = false
}

async function playStep42Animation() {
  // btnLoading.value = true
  // hiddenModel([
  //   // '地板托架（顶）',
  //   '次梁（顶）',
  //   '密封钢板（顶）',
  //   '吊顶板',
  //   '地板(顶）',
  //   '屋架',
  //   '内装饰墙板',
  //   '门窗',
  //   '外墙板檩条',
  //   '外墙面板',
  //   '柱装饰板',
  //   '屋面板'
  // ])
  // // 需要先显示上一步的部件以免未执行第上一步
  // await animateObjects(['底柱', '地板托架', '次梁', '密封钢板', '地板', '柱', '角件', '梁'], 0)
  // // 执行当前步骤的动画
  // await animateObjects(['地板托架（顶）'], 0)
  // await animateObjects(['次梁（顶）'])
  // // await animateObjects(['密封钢板（顶）', '吊顶板', '地板(顶）'])
  // // await animateObjects(['屋架'])
  // btnLoading.value = false
  btnLoading.value = true
  hiddenModel([
    // '底柱',
    // '地板托架',
    // '次梁',
    // '密封钢板',
    // '地板' ,
    // '柱',
    // '角件',
    // '梁',
    // '地板托架（顶）',
    '次梁（顶）',
    '密封钢板（顶）',
    '吊顶板',
    '地板(顶）',
    '屋架',
    '内装饰墙板',
    '门窗',
    '外墙板檩条',
    '外墙面板',
    '柱装饰板',
    '屋面板'
  ])
  await animateObjects(['地板托架（顶）'])
  btnLoading.value = false
}
async function playStep43Animation() {
  // btnLoading.value = true
  // hiddenModel([
  //   // '地板托架（顶）',
  //   // '次梁（顶）',
  //   // '密封钢板（顶）',
  //   // '吊顶板',
  //   // '地板(顶）',
  //   '屋架',
  //   '内装饰墙板',
  //   '门窗',
  //   '外墙板檩条',
  //   '外墙面板',
  //   '柱装饰板',
  //   '屋面板'
  // ])
  // // 需要先显示上一步的部件以免未执行第上一步
  // await animateObjects(['底柱', '地板托架', '次梁', '密封钢板', '地板', '柱', '角件', '梁'], 0)
  // // 执行当前步骤的动画
  // await animateObjects(['地板托架（顶）'], 0)
  // await animateObjects(['次梁（顶）'], 0)
  // await animateObjects(['密封钢板（顶）', '吊顶板', '地板(顶）'])
  // // await animateObjects(['屋架'])
  // btnLoading.value = false
  btnLoading.value = true
  hiddenModel([
    // '底柱',
    // '地板托架',
    // '次梁',
    // '密封钢板',
    // '地板' ,
    // '柱',
    // '角件',
    // '梁',
    // '地板托架（顶）',
    // '次梁（顶）',
    '密封钢板（顶）',
    '吊顶板',
    '地板(顶）',
    '屋架',
    '内装饰墙板',
    '门窗',
    '外墙板檩条',
    '外墙面板',
    '柱装饰板',
    '屋面板'
  ])
  await animateObjects(['次梁（顶）'])
  btnLoading.value = false
}
async function playStep44Animation() {
  // btnLoading.value = true
  // hiddenModel([
  //   // '地板托架（顶）',
  //   // '次梁（顶）',
  //   // '密封钢板（顶）',
  //   // '吊顶板',
  //   // '地板(顶）',
  //   '屋架',
  //   '内装饰墙板',
  //   '门窗',
  //   '外墙板檩条',
  //   '外墙面板',
  //   '柱装饰板',
  //   '屋面板'
  // ])
  // // 需要先显示上一步的部件以免未执行第上一步
  // await animateObjects(['底柱', '地板托架', '次梁', '密封钢板', '地板', '柱', '角件', '梁'], 0)
  // // 执行当前步骤的动画
  // await animateObjects(['地板托架（顶）'], 0)
  // await animateObjects(['次梁（顶）'], 0)
  // await animateObjects(['密封钢板（顶）', '吊顶板', '地板(顶）'], 0)
  // await animateObjects(['屋架'])
  // btnLoading.value = false
  btnLoading.value = true
  hiddenModel([
    // '底柱',
    // '地板托架',
    // '次梁',
    // '密封钢板',
    // '地板' ,
    // '柱',
    // '角件',
    // '梁',
    // '地板托架（顶）',
    // '次梁（顶）',
    // '密封钢板（顶）',
    '吊顶板',
    '地板(顶）',
    '屋架',
    '内装饰墙板',
    '门窗',
    '外墙板檩条',
    '外墙面板',
    '柱装饰板',
    '屋面板'
  ])
  await animateObjects(['密封钢板（顶）'])
  btnLoading.value = false
}

async function playStep45Animation() {
  btnLoading.value = true
  hiddenModel([
    '地板托架（顶）',
    '次梁（顶）',
    '密封钢板（顶）',
    '吊顶板',
    '地板(顶）',
    '屋架',
    '内装饰墙板',
    '门窗',
    '外墙板檩条',
    '外墙面板',
    '柱装饰板',
    '屋面板'
  ])
  // 需要先显示上一步的部件以免未执行第上一步
  await animateObjects(['底柱', '地板托架', '次梁', '密封钢板', '地板', '柱', '角件', '梁'], 0)
  // 执行当前步骤的动画
  await animateObjects(['地板托架（顶）'], 0)
  await animateObjects(['次梁（顶）'], 0)
  await animateObjects(['密封钢板（顶）', '吊顶板', '地板(顶）'], 0)
  await animateObjects(['屋架'])
  btnLoading.value = false
}

async function playStep51Animation() {
  // btnLoading.value = true
  // hiddenModel(['内装饰墙板', '门窗', '外墙板檩条', '外墙面板', '柱装饰板', '屋面板'])
  // // 需要先显示上一步的部件以免未执行第上一步
  // await animateObjects(
  //   [
  //     '屋架',
  //     '底柱',
  //     '地板托架',
  //     '次梁',
  //     '密封钢板',
  //     '地板',
  //     '柱',
  //     '角件',
  //     '梁',
  //     '地板托架（顶）',
  //     '次梁（顶）',
  //     '密封钢板（顶）',
  //     '吊顶板',
  //     '地板(顶）'
  //   ],
  //   0
  // )
  // // 执行当前步骤的动画
  // await animateObjects(['内装饰墙板', '门窗'])
  // // await animateObjects(['外墙板檩条'])
  // // await animateObjects(['外墙面板'])
  // // await animateObjects(['柱装饰板'])
  // // await animateObjects(['屋面板'])
  // btnLoading.value = false
  btnLoading.value = true
  hiddenModel([
    // '底柱',
    // '地板托架',
    // '次梁',
    // '密封钢板',
    // '地板' ,
    // '柱',
    // '角件',
    // '梁',
    // '地板托架（顶）',
    // '次梁（顶）',
    // '密封钢板（顶）',
    // '吊顶板',
    '地板(顶）',
    '屋架',
    '内装饰墙板',
    '门窗',
    '外墙板檩条',
    '外墙面板',
    '柱装饰板',
    '屋面板'
  ])
  await animateObjects(['吊顶板'])
  btnLoading.value = false
}
async function playStep52Animation() {
  // btnLoading.value = true
  // hiddenModel(['外墙板檩条', '外墙面板', '柱装饰板', '屋面板'])
  // // 需要先显示上一步的部件以免未执行第上一步
  // await animateObjects(
  //   [
  //     '屋架',
  //     '底柱',
  //     '地板托架',
  //     '次梁',
  //     '密封钢板',
  //     '地板',
  //     '柱',
  //     '角件',
  //     '梁',
  //     '地板托架（顶）',
  //     '次梁（顶）',
  //     '密封钢板（顶）',
  //     '吊顶板',
  //     '地板(顶）'
  //   ],
  //   0
  // )
  // // 执行当前步骤的动画
  // await animateObjects(['内装饰墙板', '门窗'], 0)
  // await animateObjects(['外墙板檩条'])
  // // await animateObjects(['外墙面板'])
  // // await animateObjects(['柱装饰板'])
  // // await animateObjects(['屋面板'])
  // btnLoading.value = false
  btnLoading.value = true
  hiddenModel([
    // '底柱',
    // '地板托架',
    // '次梁',
    // '密封钢板',
    // '地板' ,
    // '柱',
    // '角件',
    // '梁',
    // '地板托架（顶）',
    // '次梁（顶）',
    // '密封钢板（顶）',
    // '吊顶板',
    // '地板(顶）',
    '屋架',
    '内装饰墙板',
    '门窗',
    '外墙板檩条',
    '外墙面板',
    '柱装饰板',
    '屋面板'
  ])
  await animateObjects(['地板(顶）'])
  btnLoading.value = false
}
async function playStep53Animation() {
  // btnLoading.value = true
  // hiddenModel(['外墙面板', '柱装饰板', '屋面板'])
  // // 需要先显示上一步的部件以免未执行第上一步
  // await animateObjects(
  //   [
  //     '屋架',
  //     '底柱',
  //     '地板托架',
  //     '次梁',
  //     '密封钢板',
  //     '地板',
  //     '柱',
  //     '角件',
  //     '梁',
  //     '地板托架（顶）',
  //     '次梁（顶）',
  //     '密封钢板（顶）',
  //     '吊顶板',
  //     '地板(顶）'
  //   ],
  //   0
  // )
  // // 执行当前步骤的动画
  // await animateObjects(['内装饰墙板', '门窗'], 0)
  // await animateObjects(['外墙板檩条'], 0)
  // await animateObjects(['外墙面板'])
  // // await animateObjects(['柱装饰板'])
  // // await animateObjects(['屋面板'])
  // btnLoading.value = false
  btnLoading.value = true
  hiddenModel([
    // '底柱',
    // '地板托架',
    // '次梁',
    // '密封钢板',
    // '地板' ,
    // '柱',
    // '角件',
    // '梁',
    // '地板托架（顶）',
    // '次梁（顶）',
    // '密封钢板（顶）',
    // '吊顶板',
    // '地板(顶）',
    '屋架',
    '内装饰墙板',
    '门窗',
    '外墙板檩条',
    '外墙面板',
    '柱装饰板',
    '屋面板'
  ])
  // await animateObjects(['屋面主檩条'])
  await animateObjects1(['屋架'], 500, 1, 0)
  btnLoading.value = false
}
async function playStep53Animation1() {
  // btnLoading.value = true
  // hiddenModel(['外墙面板', '柱装饰板', '屋面板'])
  // // 需要先显示上一步的部件以免未执行第上一步
  // await animateObjects(
  //   [
  //     '屋架',
  //     '底柱',
  //     '地板托架',
  //     '次梁',
  //     '密封钢板',
  //     '地板',
  //     '柱',
  //     '角件',
  //     '梁',
  //     '地板托架（顶）',
  //     '次梁（顶）',
  //     '密封钢板（顶）',
  //     '吊顶板',
  //     '地板(顶）'
  //   ],
  //   0
  // )
  // // 执行当前步骤的动画
  // await animateObjects(['内装饰墙板', '门窗'], 0)
  // await animateObjects(['外墙板檩条'], 0)
  // await animateObjects(['外墙面板'])
  // // await animateObjects(['柱装饰板'])
  // // await animateObjects(['屋面板'])
  // btnLoading.value = false
  btnLoading.value = true
  hiddenModel([
    // '底柱',
    // '地板托架',
    // '次梁',
    // '密封钢板',
    // '地板' ,
    // '柱',
    // '角件',
    // '梁',
    // '地板托架（顶）',
    // '次梁（顶）',
    // '密封钢板（顶）',
    // '吊顶板',
    // '地板(顶）',
    '屋架',
    '内装饰墙板',
    '门窗',
    '外墙板檩条',
    '外墙面板',
    '柱装饰板',
    '屋面板'
  ])
  // await animateObjects(['屋面主檩条'])
  await animateObjects1(['屋架'], 500, 1, 1)
  btnLoading.value = false
}
async function playStep53Animation2() {
  // btnLoading.value = true
  // hiddenModel(['外墙面板', '柱装饰板', '屋面板'])
  // // 需要先显示上一步的部件以免未执行第上一步
  // await animateObjects(
  //   [
  //     '屋架',
  //     '底柱',
  //     '地板托架',
  //     '次梁',
  //     '密封钢板',
  //     '地板',
  //     '柱',
  //     '角件',
  //     '梁',
  //     '地板托架（顶）',
  //     '次梁（顶）',
  //     '密封钢板（顶）',
  //     '吊顶板',
  //     '地板(顶）'
  //   ],
  //   0
  // )
  // // 执行当前步骤的动画
  // await animateObjects(['内装饰墙板', '门窗'], 0)
  // await animateObjects(['外墙板檩条'], 0)
  // await animateObjects(['外墙面板'])
  // // await animateObjects(['柱装饰板'])
  // // await animateObjects(['屋面板'])
  // btnLoading.value = false
  btnLoading.value = true
  hiddenModel([
    // '底柱',
    // '地板托架',
    // '次梁',
    // '密封钢板',
    // '地板' ,
    // '柱',
    // '角件',
    // '梁',
    // '地板托架（顶）',
    // '次梁（顶）',
    // '密封钢板（顶）',
    // '吊顶板',
    // '地板(顶）',
    '屋架',
    '内装饰墙板',
    '门窗',
    '外墙板檩条',
    '外墙面板',
    '柱装饰板',
    '屋面板'
  ])
  // await animateObjects(['屋面主檩条'])
  await animateObjects1(['屋架'], 500, 1, 2)
  btnLoading.value = false
}
async function playStep54Animation() {
  // btnLoading.value = true
  // hiddenModel(['柱装饰板', '屋面板'])
  // // 需要先显示上一步的部件以免未执行第上一步
  // await animateObjects(
  //   [
  //     '屋架',
  //     '底柱',
  //     '地板托架',
  //     '次梁',
  //     '密封钢板',
  //     '地板',
  //     '柱',
  //     '角件',
  //     '梁',
  //     '地板托架（顶）',
  //     '次梁（顶）',
  //     '密封钢板（顶）',
  //     '吊顶板',
  //     '地板(顶）'
  //   ],
  //   0
  // )
  // // 执行当前步骤的动画
  // await animateObjects(['内装饰墙板', '门窗'], 0)
  // await animateObjects(['外墙板檩条'], 0)
  // await animateObjects(['外墙面板'], 0)
  // await animateObjects(['柱装饰板'])
  // // await animateObjects(['屋面板'])
  // btnLoading.value = false

  btnLoading.value = true
  hiddenModel([
    // '底柱',
    // '地板托架',
    // '次梁',
    // '密封钢板',
    // '地板' ,
    // '柱',
    // '角件',
    // '梁',
    // '地板托架（顶）',
    // '次梁（顶）',
    // '密封钢板（顶）',
    // '吊顶板',
    // '地板(顶）',
    // '屋架',
    // '内装饰墙板',
    '门窗',
    '外墙板檩条',
    '外墙面板',
    '柱装饰板',
    '屋面板'
  ])
  await animateObjects(['内装饰墙板'])
  btnLoading.value = false
}
async function playStep55Animation() {
  // btnLoading.value = true
  // hiddenModel(['屋面板'])
  // // 需要先显示上一步的部件以免未执行第上一步
  // await animateObjects(
  //   [
  //     '屋架',
  //     '底柱',
  //     '地板托架',
  //     '次梁',
  //     '密封钢板',
  //     '地板',
  //     '柱',
  //     '角件',
  //     '梁',
  //     '地板托架（顶）',
  //     '次梁（顶）',
  //     '密封钢板（顶）',
  //     '吊顶板',
  //     '地板(顶）'
  //   ],
  //   0
  // )
  // // 执行当前步骤的动画
  // await animateObjects(['内装饰墙板', '门窗'], 0)
  // await animateObjects(['外墙板檩条'], 0)
  // await animateObjects(['外墙面板'], 0)
  // await animateObjects(['柱装饰板'], 0)
  // await animateObjects(['屋面板'])
  // btnLoading.value = false
  btnLoading.value = true
  hiddenModel([
    // '底柱',
    // '地板托架',
    // '次梁',
    // '密封钢板',
    // '地板' ,
    // '柱',
    // '角件',
    // '梁',
    // '地板托架（顶）',
    // '次梁（顶）',
    // '密封钢板（顶）',
    // '吊顶板',
    // '地板(顶）',
    // '屋架',
    // '内装饰墙板',
    // '门窗',
    '外墙板檩条',
    '外墙面板',
    '柱装饰板',
    '屋面板'
  ])
  await animateObjects(['门窗'])
  btnLoading.value = false
}
async function playStep55Animation1() {
  // btnLoading.value = true
  // hiddenModel(['屋面板'])
  // // 需要先显示上一步的部件以免未执行第上一步
  // await animateObjects(
  //   [
  //     '屋架',
  //     '底柱',
  //     '地板托架',
  //     '次梁',
  //     '密封钢板',
  //     '地板',
  //     '柱',
  //     '角件',
  //     '梁',
  //     '地板托架（顶）',
  //     '次梁（顶）',
  //     '密封钢板（顶）',
  //     '吊顶板',
  //     '地板(顶）'
  //   ],
  //   0
  // )
  // // 执行当前步骤的动画
  // await animateObjects(['内装饰墙板', '门窗'], 0)
  // await animateObjects(['外墙板檩条'], 0)
  // await animateObjects(['外墙面板'], 0)
  // await animateObjects(['柱装饰板'], 0)
  // await animateObjects(['屋面板'])
  // btnLoading.value = false
  btnLoading.value = true
  hiddenModel([
    // '底柱',
    // '地板托架',
    // '次梁',
    // '密封钢板',
    // '地板' ,
    // '柱',
    // '角件',
    // '梁',
    // '地板托架（顶）',
    // '次梁（顶）',
    // '密封钢板（顶）',
    // '吊顶板',
    // '地板(顶）',
    // '屋架',
    // '内装饰墙板',
    // '门窗',
    // '外墙板檩条',
    '外墙面板',
    '柱装饰板',
    '屋面板'
  ])
  await animateObjects(['外墙板檩条'])
  btnLoading.value = false
}
async function playStep55Animation2() {
  // btnLoading.value = true
  // hiddenModel(['屋面板'])
  // // 需要先显示上一步的部件以免未执行第上一步
  // await animateObjects(
  //   [
  //     '屋架',
  //     '底柱',
  //     '地板托架',
  //     '次梁',
  //     '密封钢板',
  //     '地板',
  //     '柱',
  //     '角件',
  //     '梁',
  //     '地板托架（顶）',
  //     '次梁（顶）',
  //     '密封钢板（顶）',
  //     '吊顶板',
  //     '地板(顶）'
  //   ],
  //   0
  // )
  // // 执行当前步骤的动画
  // await animateObjects(['内装饰墙板', '门窗'], 0)
  // await animateObjects(['外墙板檩条'], 0)
  // await animateObjects(['外墙面板'], 0)
  // await animateObjects(['柱装饰板'], 0)
  // await animateObjects(['屋面板'])
  // btnLoading.value = false
  btnLoading.value = true
  hiddenModel([
    // '底柱',
    // '地板托架',
    // '次梁',
    // '密封钢板',
    // '地板' ,
    // '柱',
    // '角件',
    // '梁',
    // '地板托架（顶）',
    // '次梁（顶）',
    // '密封钢板（顶）',
    // '吊顶板',
    // '地板(顶）',
    // '屋架',
    // '内装饰墙板',
    // '门窗',
    // '外墙板檩条',
    // '外墙面板',
    '柱装饰板',
    '屋面板'
  ])
  await animateObjects(['外墙面板'])
  btnLoading.value = false
}
async function playStep55Animation3() {
  // btnLoading.value = true
  // hiddenModel(['屋面板'])
  // // 需要先显示上一步的部件以免未执行第上一步
  // await animateObjects(
  //   [
  //     '屋架',
  //     '底柱',
  //     '地板托架',
  //     '次梁',
  //     '密封钢板',
  //     '地板',
  //     '柱',
  //     '角件',
  //     '梁',
  //     '地板托架（顶）',
  //     '次梁（顶）',
  //     '密封钢板（顶）',
  //     '吊顶板',
  //     '地板(顶）'
  //   ],
  //   0
  // )
  // // 执行当前步骤的动画
  // await animateObjects(['内装饰墙板', '门窗'], 0)
  // await animateObjects(['外墙板檩条'], 0)
  // await animateObjects(['外墙面板'], 0)
  // await animateObjects(['柱装饰板'], 0)
  // await animateObjects(['屋面板'])
  // btnLoading.value = false
  btnLoading.value = true
  hiddenModel([
    // '底柱',
    // '地板托架',
    // '次梁',
    // '密封钢板',
    // '地板' ,
    // '柱',
    // '角件',
    // '梁',
    // '地板托架（顶）',
    // '次梁（顶）',
    // '密封钢板（顶）',
    // '吊顶板',
    // '地板(顶）',
    // '屋架',
    // '内装饰墙板',
    // '门窗',
    // '外墙板檩条',
    // '外墙面板',
    // '柱装饰板',
    '屋面板'
  ])
  await animateObjects(['柱装饰板'])
  btnLoading.value = false
}
async function playStep55Animation4() {
  // btnLoading.value = true
  // hiddenModel(['屋面板'])
  // // 需要先显示上一步的部件以免未执行第上一步
  // await animateObjects(
  //   [
  //     '屋架',
  //     '底柱',
  //     '地板托架',
  //     '次梁',
  //     '密封钢板',
  //     '地板',
  //     '柱',
  //     '角件',
  //     '梁',
  //     '地板托架（顶）',
  //     '次梁（顶）',
  //     '密封钢板（顶）',
  //     '吊顶板',
  //     '地板(顶）'
  //   ],
  //   0
  // )
  // // 执行当前步骤的动画
  // await animateObjects(['内装饰墙板', '门窗'], 0)
  // await animateObjects(['外墙板檩条'], 0)
  // await animateObjects(['外墙面板'], 0)
  // await animateObjects(['柱装饰板'], 0)
  // await animateObjects(['屋面板'])
  // btnLoading.value = false
  btnLoading.value = true
  hiddenModel([
    // '底柱',
    // '地板托架',
    // '次梁',
    // '密封钢板',
    // '地板' ,
    // '柱',
    // '角件',
    // '梁',
    // '地板托架（顶）',
    // '次梁（顶）',
    // '密封钢板（顶）',
    // '吊顶板',
    // '地板(顶）',
    // '屋架',
    // '内装饰墙板',
    // '门窗',
    // '外墙板檩条',
    // '外墙面板',
    // '柱装饰板',
    // '屋面板'
  ])
  await animateObjects(['屋面板'])
  btnLoading.value = false
}
async function playStep5Animation() {
  btnLoading.value = true
  hiddenModel(['内装饰墙板', '门窗', '外墙板檩条', '外墙面板', '柱装饰板', '屋面板'])
  // 需要先显示上一步的部件以免未执行第上一步
  await animateObjects(
    [
      '屋架',
      '底柱',
      '地板托架',
      '次梁',
      '密封钢板',
      '地板',
      '柱',
      '角件',
      '梁',
      '地板托架（顶）',
      '次梁（顶）',
      '密封钢板（顶）',
      '吊顶板',
      '地板(顶）'
    ],
    0
  )
  // 执行当前步骤的动画
  await animateObjects(['内装饰墙板', '门窗'])
  await animateObjects(['外墙板檩条'])
  await animateObjects(['外墙面板'])
  await animateObjects(['柱装饰板'])
  await animateObjects(['屋面板'])
  btnLoading.value = false
}

/**
 * 通用防闪烁动画函数
 * @param {THREE.Object3D} object - 要执行动画的对象
 * @param {THREE.Vector3} endPosition - 最终位置
 * @param {number} startZ - 起始Z坐标
 * @param {number} duration - 动画时长
 */
function animateObject(object, endPosition, startZ = 500, duration = 1) {
  return new Promise((resolve) => {
    object.visible = true

    const clock = new THREE.Clock()
    let elapsedTime = 0

    // 起点微调
    const start = new THREE.Vector3(endPosition.x, endPosition.y, startZ + 0.01)
    object.position.copy(start)

    function animateFrame() {
      const delta = clock.getDelta()
      elapsedTime += delta
      const t = Math.min(elapsedTime / duration, 1)
      const easeT = 1 - Math.pow(1 - t, 3)

      object.position.lerpVectors(start, endPosition, easeT)

      if (t < 1) {
        requestAnimationFrame(animateFrame)
      } else {
        resolve(true)
      }
    }

    requestAnimationFrame(animateFrame)
  })
}

/**
 * 通用批量动画函数
 * @param {string[]} names - 模型部件名称数组
 * @param {number} startZ - 起始Z
 * @param {number} duration - 动画时长
 */
function animateObjects(names, startZ = 500, duration = 1) {
  const promises = names.map((name) => {
    const obj = scene.getObjectByName(name)
    if (!obj || obj.visible) return Promise.resolve()
    const endPos = obj.position.clone()
    return animateObject(obj, endPos, startZ, duration)
  })

  return Promise.all(promises)
}
function animateObjects1(names, startZ = 500, duration = 1, number = 0) {

  const promises = names.map((name) => {
    const obj = scene.getObjectByName(name)

    // const namme = ['屋面主檩条',"屋面次檩条","屋面连接件"]
    if (number == 0) {
      const obj = scene.getObjectByName("屋面主檩条")
      const obj1 = scene.getObjectByName("屋面次檩条")
      const obj2 = scene.getObjectByName("屋面连接件")
      obj.visible = true
      obj1.visible = false
      obj2.visible = false
    } else if (number == 1) {
      const obj1 = scene.getObjectByName("屋面次檩条")
      obj1.visible = true
      obj1.parent.visible = true
      const obj2 = scene.getObjectByName("屋面次檩条")
      obj2.visible = false
      animateObjects(["屋面次檩条"])
      const obj3 = scene.getObjectByName("屋面连接件")
      obj3.visible = false

    } else if (number == 2) {
      const obj1 = scene.getObjectByName("屋面次檩条")
      obj1.visible = true
      obj1.parent.visible = true
      const obj2 = scene.getObjectByName("屋面次檩条")
      obj2.visible = true
      const obj3 = scene.getObjectByName("屋面连接件")
      obj3.visible = false
      animateObjects(["屋面连接件"])
    }

    if (!obj || obj.visible) return Promise.resolve()
    const endPos = obj.position.clone()
    if (number == 0) {
      return animateObject(obj, endPos, startZ, duration)
    }
  })

  return Promise.all(promises)
}


// 隐藏模型
function hiddenModel(names = []) {
  names.forEach((name) => {
    const part = scene.getObjectByName(name)
    if (part) {
      part.visible = false
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
  camera.aspect = threeContainer.value.clientWidth / threeContainer.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(threeContainer.value.clientWidth, threeContainer.value.clientHeight)
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
  left: 20px;
  right: 20px;
  height: calc(100% - 40px);
  pointer-events: none;
  // width: 140px;
  background: transparent;
  overflow-y: auto;
  display: flex;
  // flex-wrap: wrap;
  // align-items: center;
  // justify-content: space-between;

  flex-direction: column;
  /* 垂直布局（主轴：垂直） */
  flex-wrap: wrap;
  justify-content: flex-start;
  /* 允许换行（垂直方向高度不足时，向右侧列排列） */
  align-items: flex-end;
  /* 交叉轴（水平）靠右对齐（核心：整体内容靠右） */
  gap: 8px;
align-content: flex-end;
  .el-button {
    margin: 0;
    margin-bottom: 10px;
  }
}

.toolbar-content {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 520px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.3);
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
