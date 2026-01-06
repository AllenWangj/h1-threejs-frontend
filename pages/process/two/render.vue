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
        <div class="opt-content">
          <p class="opt-btn" @click="handllePlanRestEvt">
            <img src="./svg/rest.svg" style="width: 30px;height: 30px;position: relative;top: 5px;"/>
            <span>复位</span>
          </p>
          <p class="opt-btn" @click="handllePlanRoatationEvt">
            <img src="./svg/move.svg" style="width: 30px;height: 30px;position: relative;top: 5px;"/>
            <span>移动</span>
          </p>
          <p class="opt-btn" @click="handllePlanScaleEvt">
            <img src="./svg/rotation.svg" style="width: 30px;height: 30px;position: relative;top: 5px;"/>

            <span>旋转</span>
          </p>
          <!-- <p class="opt-btn">
            <span>复位</span>
          </p> -->
        </div>
        <el-button style="background-color: #3A78C0;width: 118px;border-radius: 30px;" type="primary" @click="handlleOtherSaveEvt"
          size="large">另保存</el-button>
        <el-button style="background-color: #3A78C0;width: 118px;border-radius: 30px;" type="primary" @click="handlleSaveEvt"
          size="large">保存</el-button>
        <el-button style="background-color: #3A78C0;width: 110px;border-radius: 30px;background: linear-gradient( 180deg, #C7EEFF 0%, #4FF396 100%);color:#09488A" type="primary" @click="downloadSolution"
          size="large">导出方案</el-button>
      </div>
      <div class="model-list">
        <ModelWrapper  @click="handleAddModel('02_75_10137')">
           <img  :src="image1" />
           <p style="margin:0px;text-align:center;color:#fff;font-weight:400px;margin-top:3px;font-size:18px">建筑一</p>
        </ModelWrapper>

                <ModelWrapper   @click="handleAddModel('02_75_10110')">
           <img  :src="image2" />
           <p style="margin:0px;text-align:center;color:#fff;font-weight:400px;margin-top:3px;font-size:18px">建筑二</p>
        </ModelWrapper>

        <ModelWrapper   @click="handleAddModel('02_75_10106')">
           <img  :src="image3" />
           <p style="margin:0px;text-align:center;color:#fff;font-weight:400px;margin-top:3px;font-size:18px">
            建筑三</p>
        </ModelWrapper>


         <ModelWrapper   @click="handleAddModel('02_75_10145')">
           <img  :src="image4" />
           <p style="margin:0px;text-align:center;color:#fff;font-weight:400px;margin-top:3px;font-size:18px">
            建筑四</p>
        </ModelWrapper>
        

          <ModelWrapper   @click="handleAddModel('02_75_10140')">
           <img  :src="image5" />
           <p style="margin:0px;text-align:center;color:#fff;font-weight:400px;margin-top:3px;font-size:18px">
            建筑五</p>
        </ModelWrapper>

         <ModelWrapper   @click="handleAddModel('02_75_10126')">
           <img  :src="image6" />
           <p style="margin:0px;text-align:center;color:#fff;font-weight:400px;margin-top:3px;font-size:18px">
            建筑六</p>
        </ModelWrapper>

          <ModelWrapper   @click="handleAddModel('02_75_10125')">
           <img  :src="image7" />
           <p style="margin:0px;text-align:center;color:#fff;font-weight:400px;margin-top:3px;font-size:18px">
            建筑七</p>
        </ModelWrapper>
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
          <el-descriptions title="建筑信息" :column="2">
            <el-descriptions-item label="经纬度" :span="2"> 31.2304°N, 121.4737°E</el-descriptions-item>
            <el-descriptions-item label="地块面积" :span="2"> 250mx250m</el-descriptions-item>
            <el-descriptions-item label="海拔" :span="1">1200m</el-descriptions-item>
            <el-descriptions-item label="功能区划" :span="1">{{functionalDivision}}</el-descriptions-item>
            <el-descriptions-item label="模式类型" :span="2">{{ schemaType }}</el-descriptions-item>
            <el-descriptions-item label="功能模块布局" :span="2">办公、生活、卫勤、指挥、仓库</el-descriptions-item>
          </el-descriptions>
        
        </div>
        <div>
             <el-descriptions title="各模块位置信息" :column="2">
            <el-descriptions-item label="模块名称" :span="1"> 办公区</el-descriptions-item>
            <el-descriptions-item label="位置信息" :span="1"> 106.2304°N, 27.2132E</el-descriptions-item>
              <el-descriptions-item label="模块名称" :span="1"> 生活区</el-descriptions-item>
            <el-descriptions-item label="位置信息" :span="1"> 106.2567°N, 27.2321E</el-descriptions-item>

            <el-descriptions-item label="模块名称" :span="1"> 服务区</el-descriptions-item>
            <el-descriptions-item label="位置信息" :span="1"> 106.2667°N, 27.2521E</el-descriptions-item>

               <el-descriptions-item label="模块名称" :span="1"> 生产区</el-descriptions-item>
            <el-descriptions-item label="位置信息" :span="1"> 106.2867°N, 27.2431E</el-descriptions-item>
             <el-descriptions-item label="模块名称" :span="1"> 仓储区</el-descriptions-item>
            <el-descriptions-item label="位置信息" :span="1"> 106.2362°N, 27.25881E</el-descriptions-item>

           <!-- <el-descriptions title="地块信息" :column="2" >
          <el-descriptions-item label="经纬度" :span="1"> 31.2304°N, 121.4737°E</el-descriptions-item>
          <el-descriptions-item label="地块面积" :span="1"> 250mx250m</el-descriptions-item>
          <el-descriptions-item label="海拔" :span="1">1200m</el-descriptions-item>
          <el-descriptions-item label="功能区划" :span="1">{{ functionalDivision }}111</el-descriptions-item>
          <el-descriptions-item label="模式模式" :span="1">{{ schemaType }}</el-descriptions-item>
          <el-descriptions-item label="功能模块布局" :span="1">办公、生活、卫勤、指挥、仓库</el-descriptions-item>
        </el-descriptions>
          
               <el-descriptions-item label="模块名称" :span="1"> 生产区</el-descriptions-item>
            <el-descriptions-item label="位置信息" :span="1"> 31.73404°N, 121.41737°E</el-descriptions-item>


               <el-descriptions-item label="模块名称" :span="1"> 仓储区</el-descriptions-item>
            <el-descriptions-item label="位置信息" :span="1"> 31.7804°N, 121.1737°E</el-descriptions-item> -->

          </el-descriptions>
        </div>
      </div>
         
    </div>
  </div>
</template>
<script setup lang="ts">
import SchemesList from '@/components/schemes-list/index.vue'
import ModelWrapper from "@/components/model-wrapper/index.vue"
import { useRender } from './composables/use-render'
import image1 from "/assets/02_75_10137.png"
import image2 from "/assets/02_75_10110.png"
import image3 from "/assets/02_75_10106.png"
import image4 from "/assets/02_75_10145.png"
import image5 from "/assets/02_75_10140.png"
import image6 from "/assets/02_75_10126.png"
import image7 from "/assets/02_75_10125.png"
const { formatTime } = useUtils()
import { planLayoutDetailInfo,planList, planDetailInfo, removePlan, createPlan, updatePlan, planExport } from '@/apis/project'
import dayjs from 'dayjs'
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
      source: 2
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
      source: 2
    })
    schemeList.value = data || []
    if (schemeList.value.length > 0 && isLoadFirst) {
      currentAcviteScheme.value = schemeList.value[0].id
      currentPlan.value = schemeList.value[0]

      planDetailInfo({ id: currentAcviteScheme.value }).then(async (res) => {
        const {
          data: { layouts }
        } = res
        loading.value = true
        console.log("layouts",layouts)
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
const schemaType  = ref("")
const functionalDivision = ref("")
onMounted(() => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
  }
  fetchDetail()
  renderPlanLayout = new RenderPlanLayout(renderRef.value)
  planLayoutDetailInfo({projectId: projectId.value}).then(res=>{
    console.log("res---",res)
    let {params}=res.data
    params = params || []
    const find = params.find(ele =>'schemaType' === ele.field)
    // debugger
    if(find) {
      const {options,value} = find
       schemaType.value = options.find(ele=>ele.value == value).label
    }
    // debugger
    const functionalDivisionResult =   params.find(ele =>'functionalDivision' === ele.field)
    if(functionalDivisionResult) {
      const {options,value} = functionalDivisionResult
      functionalDivision.value = options.find(ele=>ele.value == value).label
    }
  })
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
        source: 2,
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
  display: flex;
  flex-direction: row;
  gap: 10px;
   justify-content: center;
    width: 100%;
  .opt-content {
    width: 436px;
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
      display: flex;
    justify-content: center;
    gap: 5px;
      &:hover {
        background: #568FCC90

      }
    }

  }

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
  width: 510px;
  overflow-y: auto;
  display: flex;
  background: #568FCC;
  padding: 10px 10px 0;
  border-radius: 8px;
  border: 1px solid #3A78C0;
  display: flex;
  // flex-direction: row;
  flex-direction: column;


  .plan-base,
  .plan-construct {
    width: 100%;
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

    .el-descriptions__label,
    .el-descriptions__content,
    .el-descriptions__title {
      color: #fff;
    }
  }
}
</style>
<style>
.plan-label,
.plan-content {
  color: #CEE6FF !important;
}
</style>
