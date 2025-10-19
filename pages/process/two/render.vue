<template>
  <div class="flex flex-shrink-0 w-[100%] h-[100%] relative">
    <schemes-list :list="schemeList" :current="currentAcviteScheme" @tap-scheme="tapScheme">
      <template #opt="{ record }">
        <el-button @click.stop="handleDeleteItem(record)" style="margin-left: 126px;" type="primary" link>删除</el-button>
      </template>
    </schemes-list>
    <div v-loading="loading" class="flex-1 relative border border-[1px] border-[#adcdf7]">
      <div class="plan-and-plan_tree" ref="renderRef"></div>
      <div class="opt">
        <el-button type="primary" style="width:100px" @click="handllePlanRoatationEvt">移动</el-button>
        <el-button type="primary" style="width:100px" @click="handllePlanScaleEvt">旋转</el-button>
        <el-button type="primary" style="width:100px" @click="handllePlanRestEvt">复位</el-button>
        <el-button type="primary" style="width:100px" @click="handlleSaveEvt">保存</el-button>
        <el-button type="primary" style="width:100px" @click="handlleOtherSaveEvt">另保存</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SchemesList from '@/components/schemes-list/index.vue'
import { useRender } from './composables/use-render'
import { planList, planDetailInfo, removePlan, createPlan, updatePlan } from '@/apis/project'

const route = useRoute()
const projectId = ref('')
const schemeList = ref<any[]>([])
// 当前激活得方案id
const currentAcviteScheme = ref('')

const renderRef = ref<HTMLDivElement | null>(null)
const { RenderPlanLayout } = useRender()
let renderPlanLayout: InstanceType<typeof RenderPlanLayout> | null = null
const loading = ref(false)
const tapScheme = (item) => {
  currentAcviteScheme.value = item.id
  planDetailInfo({ id: item.id }).then(async (res) => {
    const { data: { layouts } } = res
    loading.value = true
    await renderPlanLayout!.loadSceneModels(layouts)
    loading.value = false

  })
}
function handllePlanRoatationEvt() {
  renderPlanLayout!.setMoveMode()
}
function handllePlanScaleEvt() {
  renderPlanLayout!.setRotateMode()

}
function handllePlanRestEvt() {
  renderPlanLayout!.resetObjectTransform()

}

// 获取详情
async function fetchDetail(isLoadFirst = true) {
  try {
    const {data} = await planList({
      projectId: projectId.value,
      type:"2"
    })
    schemeList.value = data || []
    if (schemeList.value.length && isLoadFirst) {
      currentAcviteScheme.value = schemeList.value[0].id
      planDetailInfo({ id: currentAcviteScheme.value }).then(async (res) => {
        const { data: { layouts } } = res
        loading.value = true
        await renderPlanLayout!.loadSceneModels(layouts)
        loading.value = false
      })
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
function handlleSaveEvt() {
  const position = renderPlanLayout!.handlleSaveEvt()
  const data = {
    id: currentAcviteScheme.value,
    layouts: JSON.stringify(position)
  }
  updatePlan(data).then(res => {
    ElMessage({ message: '保存成功', type: 'success' })
  })
}
function handlleOtherSaveEvt() {
  ElMessageBox.prompt('请输入方案名称', '方案确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputErrorMessage: '',
  })
    .then(({ value }) => {
      console.log("value",value)
      const position = renderPlanLayout!.handlleSaveEvt()
      const result = schemeList.value.find(ele => (ele.id === currentAcviteScheme.value))!
      const data = {
        id: result.id,
        type: "2",
        projectId:projectId.value,
        name: value,
        layouts: JSON.stringify(position)
      }
      createPlan(data).then(res => {
        ElMessage({ message: '保存成功', type: 'success' })
        fetchDetail(false)
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Input canceled',
      })
    })
}
function handleDeleteItem(record: any) {
  ElMessageBox.confirm('确定删除该方案？', {
    confirmButtonText: '确定',
    cancelButtonText: "取消",
    callback: (action: any) => {
      removePlan(record).then(res => {
        ElMessage({
          type: 'info',
          message: '删除成功',
        })
        const result = record.id === currentAcviteScheme.value
        fetchDetail(result)
      })

      //fetchDetail
    },
  })
}
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
