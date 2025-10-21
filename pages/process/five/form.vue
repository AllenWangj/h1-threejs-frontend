<template>
  <div v-loading="pageLoading" class="h-full w-full flex flex-col border border-[1px] border-[#adcdf7]">
    <div class="flex-shrink-0 flex items-center h-[56px] px-[14px] border-b border-[#e4ecfd]">
      <span class="text-[16px] text-[#333] ml-[8px]">部件生产</span>
    </div>
    <div class="flex-1 flex flex-col px-[14px] py-[14px]">
       <p>
        <el-checkbox @change="handleAllChangeEvt" v-model="all" label="全部" size="large" />
      </p>
      <div style="padding: 10px;">
        <el-collapse>

          <el-collapse-item name="2">
            <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="layout" label="建筑布局" size="small" />
              </div>
            </template>
            <div style="padding: 5px;">
              <el-radio-group v-model="layoutRadio" class="radio-block">
                <el-radio style="display: block;" :value="item.value" v-for="
(item) in layoutList" :key="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>

          <el-collapse-item name="3">
            <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="structuralPlan" label="结构方案" size="small" />
              </div>
            </template>
            <div style="padding: 5px;">
              <el-radio-group v-model="structuralPlanRadio" class="radio-block">
                <el-radio style="display: block;" :value="item.value" v-for="
(item) in structuralPlanList" :key="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>


          <el-collapse-item name="4">
            <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="componentLocation" label="构部件位置" size="small" />
              </div>
            </template>
            <div style="padding: 5px;">
              <el-radio-group v-model="componentLocationRadio" class="radio-block">
                <el-radio style="display: block;" :value="item.value" v-for="
(item) in componentLocationList" :key="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>
          <!-- <el-collapse-item name="5">
            <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="componentSpecifications" label="目标权重" size="small" />
              </div>
            </template>
            <div style="padding: 5px;">
              <el-radio-group v-model="componentSpecificationsRadio" class="radio-block">
                <el-radio style="display: block;" :value="item.value" v-for="
(item) in componentSpecificationsList" :key="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item> -->

          <el-collapse-item name="1">
                <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="componentSpecifications" label="构部件规格" size="small" />
              </div>
            </template>
            <el-select v-model="projectForm.componentSpecifications" placeholder="请选择构部件规格" multiple :clearable="true"
              style="width: 100%" >
               <el-option v-for="(item) in componentSpecificationsList" :key="item.value" :value="item.value" :label="item.label">
                  <span style="width:120px;display: inline-block
                  ;">{{ item.label }}</span>
              <el-input size="small" @click.stop style="width:100px;margin-left: 10px;" placeholder="请输入" v-model="item.number"></el-input>
              </el-option> 
            </el-select>
          </el-collapse-item> 
        </el-collapse>
      </div>
      <p style="padding: 5px;">自定义参数</p>
      <ez-select v-model="projectForm.custom" placeholder="请选择自定义参数" multiple filterable allow-create
        default-first-option :clearable="true" style="width: 100%" :options="customOptions" />

      <!-- <el-form ref="ProjectFormRef" :model="projectForm" label-width="100px" class="w-full">
        <el-form-item label="建筑布局">
          <ez-select
            v-model="projectForm.layout"
            placeholder="请选择建筑布局"
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(BuildingFunctional)"
          />
        </el-form-item>
        <el-form-item label="结构方案">
          <ez-select
            v-model="projectForm.structuralPlan"
            placeholder="请选择结构方案"
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(StructuralPlan)"
          />
        </el-form-item>
        <el-form-item label="构部件位置">
          <ez-select
            v-model="projectForm.componentLocation"
            placeholder="请选择构部件位置"
            :clearable="true"
            style="width: 100%"
            :options="componentLocationOptions"
          />
        </el-form-item>
        <el-form-item label="构部件规格">
          <ez-select
            v-model="projectForm.componentSpecifications"
            placeholder="请选择构部件规格"
            multiple
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(ComponentSpecifications)"
          />
        </el-form-item>
        <el-form-item label="自定义参数">
          <ez-select
            v-model="projectForm.custom"
            placeholder="请选择自定义参数"
            multiple
            filterable
            allow-create
            default-first-option
            :clearable="true"
            style="width: 100%"
            :options="customOptions"
          />
        </el-form-item>
      </el-form> -->
      <div class="flex items-center justify-center mt-[14px]">
        <el-button type="primary" :disabled="saveLoading" plain @click="handleReset">重置</el-button>
        <el-button type="primary" :loading="saveLoading" @click="handleSave">保存</el-button>
        <el-button type="primary" :disabled="saveLoading" @click="handleGenerateSolution">生成方案</el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getPartsProductionDetail, updatePartsProductionParams, generatePartsProductionPlan,partsProductionDetail } from '@/apis/project'

const route = useRoute()

const projectId = ref('')

const saveLoading = ref(false)

const pageLoading = ref(false)

const BuildingFunctional = 'building_functional' // 建筑功能
const StructuralPlan = 'structural_plan' // 结构方案
const ComponentSpecifications = 'component_pecifications' // 构件规格
const { dictMap, getDictMap } = useDict()
const componentLocationOptions = [
  {
    label: '默认',
    value: '0'
  }
]
const customOptions = []

const projectForm = ref({
  /** 建筑布局 */
  layout: '',
  /** 结构方案 */
  structuralPlan: '',
  /** 构部件位置 */
  componentLocation: '',
  /** 构部件规格 */
  componentSpecifications: [],
  /** 自定义参数 */
  custom: []
})
const initProjectForm = ref({})

const handleReset = () => {
  projectForm.value = JSON.parse(JSON.stringify(initProjectForm.value))
}



const handleGenerateSolution = async () => {
  try {
    saveLoading.value = true
    const params = JSON.parse(JSON.stringify(projectForm.value))
    params.componentSpecifications = params.componentSpecifications.join(',')
    params.custom = params.custom.join(',')
    await generatePartsProductionPlan({
      projectId: projectId.value,
      type:5
    })
    ElMessageBox.alert('方案生成中，请稍后去生产方案中查看', '温馨提示', {
      confirmButtonText: '知道了'
    })
  } catch (error) {
    ElMessage.error('方案生成失败')
  } finally {
    saveLoading.value = false
  }
}

// 获取详情
async function fetchDetail() {
  try {
    pageLoading.value = true
    const { data } = await getPartsProductionDetail({
      projectId: projectId.value
    })
    projectForm.value.layout = data.params?.layout || ''
    projectForm.value.structuralPlan = data.params?.structuralPlan || ''
    projectForm.value.componentLocation = data.params?.componentLocation || ''
    projectForm.value.componentSpecifications = (data.params?.componentSpecifications || '').split(',').filter(Boolean)
    projectForm.value.custom = (data.params?.custom || '').split(',').filter(Boolean)
    console.log('获取部件生产详情', data)
    initProjectForm.value = JSON.parse(JSON.stringify(projectForm.value))
  } catch (error) {
    console.error('获取部件生产详情失败', error)
  } finally {
    pageLoading.value = false
  }
}

onMounted(async () => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
    fetchDetail()
  }
 await getDictMap([BuildingFunctional, StructuralPlan, ComponentSpecifications])
 layoutList.value = dictMap.value.get(BuildingFunctional)
 structuralPlanList.value = dictMap.value.get(StructuralPlan)
 componentSpecificationsList.value = dictMap.value.get(ComponentSpecifications)
  partsProductionDetail({
    projectId: projectId.value
  }).then(res=>{
     const { data: {
      params
    } } = res
    if(!params || params.length ==0){
      return
    }
   const layoutFieldRes = params.find(ele => ele.field === layoutField)
   if (layoutFieldRes) {
      layout.value = true
      layoutRadio.value = layoutFieldRes.value
    } else {
      layout.value = false
      layoutRadio.value = ""
    }


     const structuralPlanFieldRes = params.find(ele => ele.field === structuralPlanField)
   if (structuralPlanFieldRes) {
      structuralPlan.value = true
      structuralPlanRadio.value = structuralPlanFieldRes.value
    } else {
      structuralPlan.value = false
      structuralPlanRadio.value = ""
    }


    const componentLocationFieldRes = params.find(ele => ele.field === componentLocationField)
   if (componentLocationFieldRes) {
      componentLocation.value = true
      componentLocationRadio.value = componentLocationFieldRes.value
    } else {
      componentLocation.value = false
      componentLocationRadio.value = ""
    }

     const componentSpecificationsFieldRes = params.find(ele => ele.field === componentSpecificationsField)
   if (componentSpecificationsFieldRes) {
      componentSpecifications.value = true
      if(componentSpecificationsFieldRes.value) {
        projectForm.value.componentSpecifications = componentSpecificationsFieldRes.value.split(",")
        const valueConfig = componentSpecificationsFieldRes.valueConfig || []
        componentSpecificationsList.value = componentSpecificationsList.value.map(ele=>{
          const result = valueConfig.find(e =>ele.value ===e.field)
          return {
            ...ele,
            number:result?.value
          }
        })

      }else {
        projectForm.value.componentSpecifications = [] 
          componentSpecificationsList.value = componentSpecificationsList.value.map(ele=>{
          return {
            ...ele,
            number:""
          }
        })
      }
    } else {
      componentSpecifications.value = false
      componentSpecificationsRadio.value = ""
    }

      const customFieldRes = params.find(ele => ele.field === customField)
       if (customFieldRes) {
      const value = customFieldRes.value.split(",")
      projectForm.value.custom = value
    }
  
  })
})
const customField = "custom"

const layoutField = "layout" //建筑布局
const layout = ref(true)
const layoutRadio = ref("")
const layoutList = ref<any[]>([])

const structuralPlanField = "structuralPlan" //结构方案
const structuralPlan = ref(true)
const structuralPlanRadio = ref("")
const structuralPlanList = ref<any[]>([])


const componentLocationField = "componentLocation" //构部件位置
const componentLocation = ref(true)
const componentLocationRadio = ref("")
const componentLocationList = ref<any[]>([{
  label: '默认',
  value: '0'
}])

const componentSpecificationsField = "componentSpecifications" //构部件规格
const componentSpecifications = ref(true)
const componentSpecificationsRadio = ref("")
const componentSpecificationsList = ref<any[]>([{
  label: '默认',
  value: '0'
}])


// const targetWeightField = "targetWeight"
// const targetWeight = ref(true)
// const targetWeightRadio = ref("")
// const targetWeightList = ref<any[]>([{
//   label: '默认',
//   value: '0'
// }])
const all = ref(true)
watch(() => [
  layout.value,
  structuralPlan.value,
  componentLocation.value,
  componentSpecifications.value,
], (newValue) => {
  const result = newValue.every(ele => ele)
  all.value = result
})
function handleAllChangeEvt() {
  layout.value = true
  structuralPlan.value = true
  componentLocation.value = true
  componentSpecifications.value = true
}
const handleSave = async () => {
  try {
    saveLoading.value = true
    const params =[]
    
       if (layout.value) {
      params.push({
        "field": layoutField,
        "type": "radio",
        "value": layoutRadio.value,
        "valueConfig": null
      })
    }

     if (structuralPlan.value) {
      params.push({
        "field": structuralPlanField,
        "type": "radio",
        "value": structuralPlanRadio.value,
        "valueConfig": null
      })
    }

    if (componentLocation.value) {
      params.push({
        "field": componentLocationField,
        "type": "radio",
        "value": componentLocationRadio.value,
        "valueConfig": null
      })
    }

        if (componentSpecifications.value) {
      if(projectForm.value.componentSpecifications.length > 0){
        params.push({
        "field": componentSpecificationsField,
        "type": "select",
        "value": projectForm.value.componentSpecifications.join(","),
        "valueConfig": projectForm.value.componentSpecifications.map((ele,index)=>{
          // debugger
          const find = componentSpecificationsList.value.find(e=>e.value ===ele) 
          return {
              "field": ele,
              "type": "input",
              "value": find.number,
              "valueConfig": null
          }
        })
      })
      }
    }
     if (projectForm.value.custom.length > 0) {
      params.push({
        "field": customField,
        "type": "radio",
        "value": projectForm.value.custom.join(","),
        "valueConfig": null
      })
    }
    await updatePartsProductionParams({
      projectId: projectId.value,
      params
    })

    
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    saveLoading.value = false
  }
}
</script>
<style lang="less" scoped></style>
<style>
.radio-block {
  display: flex !important;
  flex-wrap: wrap !important;
  font-size: 0 !important;
  flex-direction: column !important;
  justify-content: flex-start !important;
  align-items: start !important;
  flex-direction: column;
}
</style>
