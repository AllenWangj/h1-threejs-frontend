<template>
  <div class="flex flex-shrink-0 w-[100%] h-[100%] relative">
    <schemes-list :list="schemeList" :current="currentAcviteScheme" @tap-scheme="tapScheme">
      <template #opt="{ record }" v-if="record">
        <img class="ml-[15px] w-[20px] h-[20px] cursor-pointer" src="../../../assets/images/icon-plot-delete.svg" alt=""
          title="删除" @click.stop="handleDeleteItem(record)" />
      </template>
    </schemes-list>
    <div v-loading="loading" class="flex-1 relative border border-[1px] border-[#adcdf7]">
      <div class="plan-and-plan_tree" ref="renderRef"></div>
      <div class="opt">
        <el-button type="primary" style="width: 100px" @click="handllePlanRoatationEvt">移动</el-button>
        <el-button type="primary" style="width: 100px" @click="handllePlanScaleEvt">旋转</el-button>
        <el-button type="primary" style="width: 100px" @click="handllePlanRestEvt">复位</el-button>
        <el-button type="primary" style="width: 100px" @click="handlleSaveEvt">保存</el-button>
        <el-button type="primary" style="width: 100px" @click="handlleOtherSaveEvt">另保存</el-button>
        <el-button @click="downloadSolution" type="primary">导出方案</el-button>
      </div>
      <div class="model-list">
        <el-popover class="box-item" placement="left">
          <template #reference>
            <el-button type="primary" style="width: 100px;margin-bottom: 10px;margin-left: 0px;"
              @click="handleAddModel('02_75_10137')">建筑一</el-button>
          </template>
          <img src="/assets/02_75_10137.png" />
        </el-popover>
        <el-popover class="box-item" placement="left">
          <template #reference>
            <el-button type="primary" style="width: 100px;margin-bottom: 10px;margin-left: 0px;"
              @click="handleAddModel('02_75_10110')">建筑二</el-button>
          </template>
          <img src="/assets/02_75_10137.png" />
        </el-popover>
        <el-popover class="box-item" placement="left">
          <template #reference>
            <el-button type="primary" style="width: 100px;margin-bottom: 10px;margin-left: 0px;"
              @click="handleAddModel('02_75_10106')">建筑三</el-button>
          </template>
          <img src="/assets/02_75_10106.png" />
        </el-popover>
        <el-popover class="box-item" placement="left">
          <template #reference>
            <el-button type="primary" style="width: 100px;margin-bottom: 10px;margin-left: 0px;"
              @click="handleAddModel('02_75_10145')">建筑四</el-button>

          </template>
          <img src="/assets/02_75_10145.png" />
        </el-popover>
        <el-popover class="box-item" placement="left">
          <template #reference>
            <el-button type="primary" style="width: 100px;margin-bottom: 10px;margin-left: 0px;"
              @click="handleAddModel('02_75_10140')">建筑五</el-button>
          </template>
          <img src="/assets/02_75_10140.png" />
        </el-popover>
        <el-popover class="box-item" placement="left">
          <template #reference>
            <el-button type="primary" style="width: 100px;margin-bottom: 10px;margin-left: 0px;"
              @click="handleAddModel('02_75_10126')">建筑六</el-button>
          </template>
          <img src="/assets/02_75_10126.png" />
        </el-popover>
        <el-popover class="box-item" placement="left">
          <template #reference>
            <el-button type="primary" style="width: 100px;margin-bottom: 10px;margin-left: 0px;"
              @click="handleAddModel('02_75_10125')">建筑七</el-button>
          </template>
          <img src="/assets/02_75_10125.png" />
        </el-popover>
        <!-- <el-button type="primary" style="width: 100px;margin-bottom: 10px;margin-left: 0px;" @click="handleAddModel('02_75_10137')">建筑一</el-button> -->
      </div>
      <div class="plan-detail">
        <el-descriptions title="方案信息" :column="2">
          <el-descriptions-item label="方案名称" :span="1"> {{ currentPlan.name }}</el-descriptions-item>
          <el-descriptions-item label="方案评分" :span="1"> {{ currentPlan.score }}</el-descriptions-item>
          <el-descriptions-item label="方案创建时间" :span="1">{{ formatTime(currentPlan.createTime, 'YYYY-MM-DD HH:mm:ss')
            }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="地块信息" :column="2">
          <el-descriptions-item label="经纬度" :span="1"> 31.2304°N, 121.4737°E</el-descriptions-item>
          <el-descriptions-item label="地块面积" :span="1"> 250mx250m</el-descriptions-item>
          <el-descriptions-item label="海拔" :span="1">1200m</el-descriptions-item>
          <el-descriptions-item label="功能区别" :span="1">集中式</el-descriptions-item>
          <el-descriptions-item label="模式类型" :span="1">临时</el-descriptions-item>
          <el-descriptions-item label="功能模块布局" :span="1">办公、生活、卫勤、指挥、仓库</el-descriptions-item>

        </el-descriptions>


        <el-descriptions title="建筑信息" :column="2">
          <el-descriptions-item label="办公" :span="1"> 3栋</el-descriptions-item>
          <el-descriptions-item label="生活" :span="1"> 6栋</el-descriptions-item>
          <el-descriptions-item label="卫勤" :span="1"> 2栋</el-descriptions-item>
          <el-descriptions-item label="指挥" :span="1"> 6栋</el-descriptions-item>
          <el-descriptions-item label="仓库" :span="1"> 2栋</el-descriptions-item>

        </el-descriptions>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SchemesList from '@/components/schemes-list/index.vue'
import { useRender } from './composables/use-render'
const { formatTime } = useUtils()
import { planList, planDetailInfo, removePlan, createPlan, updatePlan, planExport } from '@/apis/project'
const route = useRoute()
const projectId = ref('')
const schemeList = ref<any[]>([])
const currentPlan = ref<any>({})
// 当前激活得方案id
const currentAcviteScheme = ref('')
const renderRef = ref<HTMLDivElement | null>(null)
const { RenderPlanLayout } = useRender()
let renderPlanLayout: InstanceType<typeof RenderPlanLayout> | null = null
const loading = ref(false)
const tapScheme = (item) => {
  currentPlan.value = item
  currentAcviteScheme.value = item.id
  planDetailInfo({ id: item.id }).then(async (res) => {
    const {
      data: { layouts }
    } = res
    loading.value = true
    await renderPlanLayout!.loadSceneModels(layouts)
    loading.value = false
  })
}

// 下载方案
const downloadSolution = async () => {
  try {
    const url = planExport({
      projectId: projectId.value,
      type: 2
    })
    const a = document.createElement('a')
    a.href = url
    a.download = `规划布局方案.docx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } catch (error) {
    console.error('下载方案失败', error)
  }
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
    const { data } = await planList({
      projectId: projectId.value,
      type: '2'
    })
    schemeList.value = data || []
    if (schemeList.value.length>0  && isLoadFirst) {
      currentAcviteScheme.value = schemeList.value[0].id
      currentPlan.value = schemeList.value[0]

      planDetailInfo({ id: currentAcviteScheme.value }).then(async (res) => {
        const {
          data: { layouts }
        } = res
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
  fetchDetail()
  renderPlanLayout = new RenderPlanLayout(renderRef.value)
})
function handlleSaveEvt() {
  const position = renderPlanLayout!.handlleSaveEvt()
  const data = {
    id: currentAcviteScheme.value,
    layouts: JSON.stringify(position)
  }
  updatePlan(data).then((res) => {
    ElMessage({ message: '保存成功', type: 'success' })
  })
}
function handlleOtherSaveEvt() {
  ElMessageBox.prompt('请输入方案名称', '方案确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputErrorMessage: ''
  })
    .then(({ value }) => {
      console.log('value', value)
      const position = renderPlanLayout!.handlleSaveEvt()
      const result = schemeList.value.find((ele) => ele.id === currentAcviteScheme.value)!
      const data = {
        id: result.id,
        type: '2',
        projectId: projectId.value,
        name: value,
        layouts: JSON.stringify(position)
      }
      createPlan(data).then((res) => {
        ElMessage({ message: '保存成功', type: 'success' })
        fetchDetail(false)
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Input canceled'
      })
    })
}
function handleDeleteItem(record: any) {
  ElMessageBox.confirm('确定删除该方案？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    callback: (action: any) => {
      removePlan(record).then((res) => {
        ElMessage({
          type: 'info',
          message: '删除成功'
        })
        const result = record.id === currentAcviteScheme.value
        fetchDetail(result)
      })

      //fetchDetail
    }
  })
}
// 添加模型
function handleAddModel(code: string) {
  renderPlanLayout!.handleCreateModel(code)
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

.model-list {
  position: absolute;
  right: 10px;
  width: 100px;
  height: 100%;
  top: 80px;
}

.plan-detail {
  position: absolute;
  // top: 380px;
  left: 20px;
  bottom: 20px;
  width: 380px;
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
    .el-descriptions__content,
    .el-descriptions__title {
      color: #fff;
    }
  }
}
</style>
