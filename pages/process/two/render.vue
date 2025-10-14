<template>
  <div class="flex flex-shrink-0 w-[100%] h-[100%] relative">
    <schemes-list :list="schemeList" :current="currentAcviteScheme" @tap-scheme="tapScheme"></schemes-list>
    <div v-loading="loading" class="flex-1 relative border border-[1px] border-[#adcdf7]">
      <div class="plan-and-plan_tree" ref="renderRef"></div>
      <div class="opt">
        <el-button type="primary" style="width:100px" @click="handllePlanRoatationEvt">移动</el-button>
        <el-button type="primary" style="width:100px" @click="handllePlanScaleEvt">旋转</el-button>
        <el-button type="primary" style="width:100px" @click="handllePlanRestEvt">复位</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SchemesList from '@/components/schemes-list/index.vue'
import { useRender } from './composables/use-render'
import { getPlanLayout, planDetail } from '@/apis/project'

const route = useRoute()
const projectId = ref('')
const schemeList = ref<any[]>([])
// 当前激活得方案id
const currentAcviteScheme = ref('')

const renderRef = ref<HTMLDivElement | null>(null)
const { RenderPlanLayout } = useRender()
let renderPlanLayout: InstanceType<typeof RenderPlanLayout> | null = null
const loading = ref(true)
const tapScheme = (item) => {
  planDetail({ planId: item.id }).then(async (res) => {
    const { data: { layouts } } = res
  loading.value = true
   await renderPlanLayout!.loadSceneModels(layouts)
  loading.value = false

  })
}
function handllePlanRoatationEvt(){
  renderPlanLayout!.setMoveMode()
}
function handllePlanScaleEvt(){
  renderPlanLayout!.setRotateMode()

}
function handllePlanRestEvt(){
  renderPlanLayout!.resetObjectTransform()

}

// 获取详情
async function fetchDetail() {
  try {
    const { data } = await getPlanLayout({
      projectId: projectId.value
    })
    schemeList.value = data.plans || []
    if (schemeList.value.length) {
      currentAcviteScheme.value = schemeList.value[0].id
      planDetail({ planId: currentAcviteScheme.value }).then(async (res) => {
        // console.log("res===", res)
        const { data: { layouts } } = res
        loading.value = true

       await renderPlanLayout!.loadSceneModels(layouts)
        loading.value = false
      })
      // /project/record/v1/plan/detail
      // console.log(" schemeList.value[0],", schemeList.value[0])
    }
    console.log('获取规划布局详情', data)
  } catch (error) {
    console.error('获取规划布局详情失败', error)
  } finally {
  }
}


onMounted(() => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
  }
  fetchDetail();
  renderPlanLayout = new RenderPlanLayout(renderRef.value)
})
</script>

<style lang="less" scoped>
.plan-and-plan_tree {
  width: 100%;
  height: 100%;
}

.opt {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
