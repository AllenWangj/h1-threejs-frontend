<template>
  <div class="flex flex-shrink-0 w-[100%] h-[100%] relative">
    <schemes-list :list="schemeList" :current="currentAcviteScheme" @tap-scheme="tapScheme"></schemes-list>
    <div v-loading="loading" class="flex-1 relative border border-[1px] border-[#adcdf7]">
      <div class="three-content" ref="four"></div>
      <div v-if="!loading && currentAcviteScheme" class="absolute top-[10px] left-[10px] z-10" style="width: 100%;">
        <!-- 下载方案 -->
        <!-- <el-button @click="downloadSolution" type="primary">导出方案</el-button>
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
      <div class="plan-detail">
        <div class="plan-wrapper">
          <div class="plan-base">
            <el-descriptions title="方案信息" :column="2">
              <el-descriptions-item label="方案名称" :span="2"> {{ currentPlan.name }}</el-descriptions-item>
              <el-descriptions-item label="方案评分" :span="2"> {{ currentPlan.score }}</el-descriptions-item>
              <el-descriptions-item label="方案造价" :span="2"> {{ info.price || 30 }}W</el-descriptions-item>
              <el-descriptions-item label="方案创建时间" :span="2">{{ formatTime(currentPlan.updatedAt, 'YYYY-MM-DD HH:mm:ss')
                }}</el-descriptions-item>

            </el-descriptions>

          </div>
          <div class="plan-construct">
            <el-descriptions title="结构信息" :column="2">
              <el-descriptions-item label="建筑类型" :span="2">{{ info.buildingType }}</el-descriptions-item>
              <el-descriptions-item label="建筑边界" :span="2">{{  info.buildingBoundary }}</el-descriptions-item>
              <el-descriptions-item label="建筑规模" :span="2">{{  info.buildingScale }}</el-descriptions-item>
              <el-descriptions-item label="标准功能模块" :span="2">{{  info.standardFunctionModule }}</el-descriptions-item>
              <el-descriptions-item label="门" :span="1">{{  info.doorCount }}个</el-descriptions-item>
              <el-descriptions-item label="窗" :span="1">{{  info.windowCount }}个</el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
        <BuildInfo v-for="item in info.table" :key="item.value" :name="item.name" :list="item.infoList">
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
const { formatTime } = useUtils()
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
const info = ref<any>({table:[]})
const tapScheme = (item) => {
  currentAcviteScheme.value = item.id
  currentPlan.value = item
  try {
    loading.value = true
    planDetailInfo({ id: item.id }).then(async (res: any) => {
      const {
        data: { layouts }
      } = res
        console.log("layouts",layouts)
      info.value = res.data.info
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
      source: 4
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
console.log("materialDataList",materialDataList)
// 获取详情
async function fetchDetail() {
  try {
    const { data } = await planList({
      projectId: projectId.value,
      source: 4
    })
    schemeList.value = data || []
    if (schemeList.value.length > 0) {
      currentAcviteScheme.value = schemeList.value[0].id
      loading.value = true
      currentPlan.value = schemeList.value[0]
      planDetailInfo({ id: currentAcviteScheme.value }).then(async (res) => {
        const {
          data: { layouts }
        } = res
        debugger
          info.value = res.data.info
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
    progress: () => { }
  })
})
const currentPlan = ref<any>({})
function handleScenePane(state: boolean) {
  processFour!.handleScenePane(state)
}
function handleSceneEnable(state: boolean) {
  processFour!.handleSceneEnable(state)
}
function handleSceneScale(state: boolean) {
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
  width: 508px;
  max-height: calc(100% - 70px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: #568FCC;
  border-radius: 8px;
  border: 1px solid #3A78C0;
  padding: 10px;

  .plan-wrapper {
    display: flex;
    flex-direction: row;
    width: 100%;

    .plan-base,
    .plan-construct {
      width: calc(508px / 2);
    }
  }

  & ::v-deep {
    .el-descriptions__body {
      background: transparent !important;
    }

    .el-descriptions__label,
    .el-descriptions__content {
      color: #CEE6FF;
    }

    .el-descriptions__title {
      color: #fff;
    }
  }
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
