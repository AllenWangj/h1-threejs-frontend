<template>
  <div class="flex flex-shrink-0 w-[100%] h-[100%] relative">
    <schemes-list :list="schemeList" :current="currentAcviteScheme" @tap-scheme="tapScheme"></schemes-list>
    <div v-loading="loading" class="flex-1 relative border border-[1px] border-[#adcdf7]">
      <div class="plan-and-plan_tree" ref="three"></div>
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
              <img src="./svg/stop-o.svg" style="width: 30px; position: relative; margin-right: 3px; display: inline-block;" />
              <span>禁止拖动</span>
            </p>
            <p class="opt-btn" @click="handleScenePane(true)">
              <img src="./svg/drag.svg" style="width: 30px;position: relative;  margin-right: 3px;display: inline-block;" />
              <span>允许拖动</span>
            </p>
            <p class="opt-btn" @click="handleSceneEnable(false)">
              <img src="./svg/closescene.svg" style="width: 30px;position: relative;  margin-right: 3px; display: inline-block;" />
              <span>关闭场景</span>
            </p>
            <p class="opt-btn" @click="handleSceneEnable(true)">
              <img src="./svg/openscene.svg" style="width: 30px; position: relative;  margin-right: 3px; display: inline-block;" />
              <span>开启场景</span>
            </p>
            <p class="opt-btn" @click="handleSceneScale(true)">
              <img src="./svg/okscale.svg" style="width: 30px;position: relative;  margin-right: 3px;  display: inline-block;" />
              <span>允许缩放</span>
            </p>
            <p class="opt-btn" @click="handleSceneScale(false)">
              <img  src="./svg/hide.svg" style="width: 30px; position: relative; margin-right: 3px; display: inline-block;" />
              <span>禁止缩放</span>
            </p>
          </div>
          <el-button
            style="background-color: #3A78C0;width: 110px;border-radius: 30px;background: linear-gradient( 180deg, #C7EEFF 0%, #4FF396 100%);color:#09488A"
            type="primary" @click="downloadSolution" size="large">导出方案</el-button>
        </div>
      </div>
      <div class="plan-detail">
        <div class="plan-base">
          <el-descriptions title="方案信息" :column="1">
            <el-descriptions-item label="方案名称" :span="1"> {{ currentPlan.name }}</el-descriptions-item>
            <el-descriptions-item label="方案评分" :span="1"> {{ currentPlan.score }}</el-descriptions-item>
            <el-descriptions-item label="方案创建时间" :span="1">{{ formatTime(currentPlan.updatedAt, 'YYYY-MM-DD HH:mm:ss')
            }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="plan-construct">
          <el-descriptions title="结构信息" :column="2">
            <el-descriptions-item label="建筑类型" :span="1">仓储</el-descriptions-item>
            <el-descriptions-item label="建筑边界" :span="1">1m</el-descriptions-item>
            <el-descriptions-item label="建筑规模" :span="2">10平米</el-descriptions-item>
            <el-descriptions-item label="标准功能模块" :span="2">供电</el-descriptions-item>
            <el-descriptions-item label="门" :span="2">2个</el-descriptions-item>
            <el-descriptions-item label="窗" :span="2">3个</el-descriptions-item>
          </el-descriptions>
        </div>
           <el-descriptions title="位置信息" :column="2">
         <el-descriptions-item label="经纬度" :span="2"> 31.2304°N, 121.4737°E</el-descriptions-item>
            <!-- <el-descriptions-item label="颜色说明" :span="1"> 蓝色表示生活区</el-descriptions-item> -->
            <!-- <el-descriptions-item label="面积" :span="1"> 3mx4m</el-descriptions-item> -->
            <!-- <el-descriptions-item label="颜色说明" :span="1"> 其他颜色表示办公区</el-descriptions-item> -->
            <el-descriptions-item label="面积" :span="1"> 4mx6m</el-descriptions-item>
            <el-descriptions-item label="海拔" :span="1">1200m</el-descriptions-item>
            <el-descriptions-item label="功能区别" :span="1">集中式</el-descriptions-item>
            <el-descriptions-item label="模式类型" :span="2">临时</el-descriptions-item>
            <el-descriptions-item label="功能模块布局" :span="2">办公</el-descriptions-item>
          </el-descriptions>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import SchemesList from '@/components/schemes-list/index.vue'
// import Threeobject from "@/threejs/three/index"
import { getInternalLayoutDetail, planDetailInfo, planList, createPlan, planExport } from '@/apis/project'
import { useRender } from "./composables/use-render"
const { formatTime } = useUtils()
import dayjs from "dayjs"
// import {plan} from "./composables/plan1.ts"
// import {plan} from "./composables/plan2"
// import {plan} from "./composables/a"

const three = ref()
const { ProcessThree } = useRender()
let processThree: InstanceType<typeof ProcessThree> | null = null
const loading = ref(false)
const route = useRoute()
const projectId = ref('')
const schemeList = ref<any[]>([])
// 当前激活得方案id
const currentAcviteScheme = ref('')

const tapScheme = (item) => {
  currentAcviteScheme.value = item.id
  currentPlan.value = item
  planDetailInfo({ id: currentAcviteScheme.value }).then(async (res) => {
    const { data: { layouts } } = res
    loading.value = true
    console.log("layouts",layouts)
    await processThree!.handleOriginModel(layouts)
    loading.value = false
  })
  // console.log('点击了内部布局方案', item)
}

// 下载方案
const downloadSolution = async () => {
  try {
    const url = planExport({
      projectId: projectId.value,
      source: 3
    })
    const a = document.createElement('a')
    a.href = url
    a.download = `内部布局方案.docx`
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
    const { data } = await planList({
      projectId: projectId.value,
      source:3
    })
    schemeList.value = data || []
    if (schemeList.value.length > 0) {
      currentAcviteScheme.value = schemeList.value[0].id
      currentPlan.value = schemeList.value[0]
      planDetailInfo({ id: currentAcviteScheme.value }).then(async (res) => {
        let { data: { layouts } } = res
        // const bottom = {
        //   ...layouts.children[0].children[0],
        //   position:{
        //     ...layouts.children[0].children[0].position
        //   }
        // }
        // const top = {
        //   ...layouts.children[0].children[1],
        //    position:{
        //     ...layouts.children[0].children[1].position
        //   }
        // } 
        // const yLen = 100
        // bottom.position.y +=yLen
        // top.position.y +=yLen

        //  const bottom1 = {
        //   ...layouts.children[0].children[0],
        //   position:{
        //     ...layouts.children[0].children[0].position
        //   }
        // }
        // const top1 = {
        //   ...layouts.children[0].children[1],
        //    position:{
        //     ...layouts.children[0].children[1].position
        //   }
        // } 
        // bottom1.position.y +=yLen *2
        // top1.position.y +=yLen *2
        const object =  layouts.children[0].children[0]
        const clone = {
          ...layouts.children[0].children[0],
          position: {
            ...object.position
          }
        }
        clone.position.y +=100
        layouts = {
          ...layouts,
          children:[
            {
              ... layouts.children[0],
              children:[
                layouts.children[0].children[0],
                clone
            ]
            }
           
          ]
        }
        loading.value = true
        console.log(":layouts",layouts)
        
        await processThree!.handleOriginModel(layouts)
        loading.value = false

      })
    }
    // createPlan({
    //   projectId:projectId.value,
    //   type:3,
    //   name:"方案二",
    //   layouts:JSON.stringify(plan)
    // })


    // console.log('获取内部布局详情', data)

  } catch (error) {
    console.error('获取内部布局详情失败', error)
  } finally {
  }
}

onMounted(() => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
  }
  fetchDetail();
  processThree = new ProcessThree(three.value, {
    progress: () => {
    }
  })
})
const currentPlan = ref<any>({})
function handleScenePane(state: boolean) {
  processThree!.handleScenePane(state)
}
function handleSceneEnable(state: boolean) {
  processThree!.handleSceneEnable(state)
}
function handleSceneScale(state: boolean) {
  processThree!.handleSceneScale(state)

}
</script>

<style lang="less" scoped>
.plan-and-plan_tree {
  width: 100%;
  height: 100%;
}

.plan-detail {
  position: absolute;
  // top: 380px;
  left: 20px;
  bottom: 20px;
  width: 493px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  // background: rgba(0, 0, 0, 0.3);
  padding: 10px 10px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  display: flex;
  background: #568FCC;
  border-radius: 8px;
  border: 1px solid #3A78C0;

  .plan-base,
  .plan-construct {
    width: calc(493px / 2);
  }

  & ::v-deep {

    .el-descriptions__label,
    .el-descriptions__content {
      color: #CEE6FF !important;
    }
  }

  & ::v-deep {
    .el-descriptions__body {
      background: transparent !important;
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
