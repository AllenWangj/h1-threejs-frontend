<template>
  <div class="flex flex-shrink-0 w-[100%] h-[100%] relative">
    <schemes-list></schemes-list>
    <div class="flex-1 relative border border-[1px] border-[#adcdf7]">
      <div ref="threeContainer" class="three-container"></div>
      <div class="toolbar-container">
        <el-button :disabled="btnLoading" class="w-[120px]" type="primary" @click="playStep1Animation">步骤1</el-button>
        <el-button :disabled="btnLoading" class="w-[120px]" type="primary" @click="playStep2Animation">步骤2</el-button>
        <el-button :disabled="btnLoading" class="w-[120px]" type="primary" @click="playStep3Animation">步骤3</el-button>
        <el-button :disabled="btnLoading" class="w-[120px]" type="primary" @click="playStep4Animation">步骤4</el-button>
        <el-button :disabled="btnLoading" class="w-[120px]" type="primary" @click="playStep5Animation">步骤5</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import SchemesList from '@/components/schemes-list/index.vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

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
  camera.position.set(300, 300, 900)

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
  scene.add(axesHelper)

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

// 加载模型并创建自定义动画
function loadModel() {
  btnLoading.value = true
  const loader = new GLTFLoader()
  loader.load(
    '/models/tool7/scene.gltf', // 替换成你自己的路径
    (gltf) => {
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

async function playStep2Animation() {
  btnLoading.value = true
  hiddenModel([
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
  // 需要先显示上一步的部件以免未执行第上一步
  await animateObjects(['底柱'], 0)
  // 执行当前步骤的动画
  await animateObjects(['地板托架'])
  await animateObjects(['次梁'])
  await animateObjects(['密封钢板', '地板'])
  btnLoading.value = false
}

async function playStep3Animation() {
  btnLoading.value = true
  hiddenModel([
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
  // 需要先显示上一步的部件以免未执行第上一步
  await animateObjects(['底柱', '地板托架', '次梁', '密封钢板', '地板'], 0)
  // 执行当前步骤的动画
  await animateObjects(['柱'])
  await animateObjects(['角件'])
  await animateObjects(['梁'])
  btnLoading.value = false
}

async function playStep4Animation() {
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
  await animateObjects(['地板托架（顶）'])
  await animateObjects(['次梁（顶）'])
  await animateObjects(['密封钢板（顶）', '吊顶板', '地板(顶）'])
  await animateObjects(['屋架'])
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
        resolve()
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
