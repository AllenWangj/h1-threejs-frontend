<template>
  <div class="flex flex-shrink-0 w-[100%] h-[100%] relative">
    <schemes-list :list="schemeList" :current="currentAcviteScheme" @tap-scheme="tapScheme"></schemes-list>
    <div v-loading="loading" class="flex-1 relative border border-[1px] border-[#adcdf7]">
      <div class="three-content" ref="four"></div>
      <div v-if="!loading && currentAcviteScheme" class="absolute top-[10px] left-[10px] z-10">
        <!-- 下载方案 -->
        <el-button @click="downloadSolution" type="primary">导出方案</el-button>
          <el-button type="primary" @click="handleScenePane(false)">禁止拖动</el-button>
        <el-button type="primary" @click="handleScenePane(true)">允许拖动</el-button>
        <el-button type="primary" @click="handleSceneEnable(false)">关闭场景</el-button>
        <el-button type="primary" @click="handleSceneEnable(true)">开启场景</el-button>
        <el-button type="primary" @click="handleSceneScale(true)">允许缩放</el-button>
        <el-button type="primary"  @click="handleSceneScale(false)">禁止缩放</el-button>
      </div>
         <div class="plan-detail">
        <el-descriptions title="方案信息" :column="2" >
          <el-descriptions-item label="方案评分" :span="1"> {{ currentPlan.name }}</el-descriptions-item>
          <el-descriptions-item label="方案评分" :span="1"> {{ currentPlan.score }}</el-descriptions-item>
          <el-descriptions-item label="方案创建时间" :span="1">{{ dayjs(currentPlan.createdAt).format('YYYY-MM-DD HH:mm:ss') }}</el-descriptions-item>
        </el-descriptions>
           <el-descriptions title="结构信息" :column="2" >
          <el-descriptions-item label="建筑类型" :span="1">仓储</el-descriptions-item>
          <el-descriptions-item label="建筑边界" :span="1">1m</el-descriptions-item>
          <el-descriptions-item label="建筑规模" :span="1">10平米</el-descriptions-item>
          <el-descriptions-item label="标准功能模块" :span="1">供电</el-descriptions-item>
          <el-descriptions-item label="门" :span="1">2个</el-descriptions-item>
          <el-descriptions-item label="窗" :span="1">3个</el-descriptions-item>
        </el-descriptions>
            <BuildInfo v-for="item in materialDataList" :key="item.value" :name="item.name" :list="item.infoList">
        </BuildInfo>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SchemesList from '@/components/schemes-list/index.vue'
// import FourObject from "~~/threejs/four/index"
import { planList, planDetailInfo, planExport } from '@/apis/project'
import { useRender } from './composables/use-render'
import { materialInfoService } from './composables/material-info-service'
import BuildInfo from './build-info.vue'
import dayjs from 'dayjs'

const loading = ref(true)
const four = ref()
const { ProcessFour } = useRender()
let processFour: InstanceType<typeof ProcessFour> | null = null

const route = useRoute()
const projectId = ref('')
const schemeList = ref<any[]>([])
// 当前激活得方案id
const currentAcviteScheme = ref('')

const tapScheme = (item) => {
  currentAcviteScheme.value = item.id
  currentPlan.value = item
  try {
    loading.value = true
    planDetailInfo({ id: item.id }).then(async (res: any) => {
      const {
        data: { layouts }
      } = res
      await processFour!.handleOriginModel(layouts)
      loading.value = false
    })
  } catch (e) {
    loading.value = false
  }
}

// 下载方案
const downloadSolution = async () => {
  try {
    const url = planExport({
      projectId: projectId.value,
      type: 4
    })
    const a = document.createElement('a')
    a.href = url
    a.download = `结构设计方案.docx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } catch (error) {
    console.error('下载方案失败', error)
  }
}
const materialDataList = ref(materialInfoService())
// 获取详情
async function fetchDetail() {
  try {
    const { data } = await planList({
      projectId: projectId.value,
      type: 4
    })
    schemeList.value = data || []
    if (schemeList.value.length) {
      currentAcviteScheme.value = schemeList.value[0].id
      loading.value = true
      currentPlan.value = schemeList.value[0]
      planDetailInfo({ id: currentAcviteScheme.value }).then(async (res) => {
        const {
          data: { layouts }
        } = res
        loading.value = true
        await processFour!.handleOriginModel(layouts)
        loading.value = false
      })
    }
    console.log('获取结构设计详情', data)
  } catch (error) {
    console.error('获取结构设计详情失败', error)
  } finally {
  }
}

onMounted(() => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
  }
  fetchDetail()
  processFour = new ProcessFour(four.value, {
    progress: () => {}
  })
})
const currentPlan =ref<any>({})
function handleScenePane(state:boolean) {
  processFour!.handleScenePane(state)
}
function handleSceneEnable(state:boolean) {
  processFour!.handleSceneEnable(state)
}
function handleSceneScale(state:boolean) {
  processFour!.handleSceneScale(state)

}
</script>

<style lang="less" scoped>
.three-content {
  width: 100%;
  height: 100%;
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
