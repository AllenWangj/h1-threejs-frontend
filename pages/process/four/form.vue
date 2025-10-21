<template>
  <div v-loading="pageLoading" class="h-full w-full flex flex-col border border-[1px] border-[#adcdf7]">
    <div class="flex-shrink-0 flex items-center h-[56px] px-[14px] border-b border-[#e4ecfd]">
      <span class="text-[16px] text-[#333] ml-[8px]">结构设计</span>
    </div>
    <div class="flex-1 flex flex-col px-[14px] py-[14px]">
         <p>
        <el-checkbox @change="handleAllChangeEvt" v-model="all" label="全部" size="large" />
      </p>
      <div style="padding: 10px;">
        <el-collapse>
          <el-collapse-item name="1">
                <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="loadCases" label="荷载工况" size="small" />
              </div>
            </template>
            <el-select v-model="projectForm.loadCases" placeholder="请选择荷载工况" multiple :clearable="true"
              style="width: 100%" >
               <el-option v-for="(item) in loadCasesList" :key="item.value" :value="item.value" :label="item.label">
                  <span style="width:120px;display: inline-block
                  ;">{{ item.label }}</span>
              <el-input size="small" @click.stop style="width:100px;margin-left: 10px;" placeholder="请输入" v-model="item.number"></el-input>
              </el-option> 
            </el-select>
          </el-collapse-item>

          <el-collapse-item name="2">
            <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="buildingLayout" label="建筑布局" size="small" />
              </div>
            </template>
            <div style="padding: 5px;">
              <el-radio-group v-model="buildingLayoutRadio" class="radio-block">
                <el-radio style="display: block;" :value="item.value" v-for="
(item) in buildingLayoutList" :key="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>

          <el-collapse-item name="3">
            <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="buildType" label="构件类型" size="small" />
              </div>
            </template>
            <div style="padding: 5px;">
              <el-radio-group v-model="buildTypeRadio" class="radio-block">
                <el-radio style="display: block;" :value="item.value" v-for="
(item) in buildTypeList" :key="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>


          <el-collapse-item name="4">
            <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="material" label="材料参数" size="small" />
              </div>
            </template>
            <div style="padding: 5px;">
              <el-radio-group v-model="materialRadio" class="radio-block">
                <el-radio style="display: block;" :value="item.value" v-for="
(item) in materialList" :key="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>
          <el-collapse-item name="5">
            <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="targetWeight" label="目标权重" size="small" />
              </div>
            </template>
            <div style="padding: 5px;">
              <el-radio-group v-model="targetWeightRadio" class="radio-block">
                <el-radio style="display: block;" :value="item.value" v-for="
(item) in targetWeightList" :key="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <p style="padding: 5px;">自定义参数</p>
      <ez-select v-model="projectForm.custom" placeholder="请选择自定义参数" multiple filterable allow-create
        default-first-option :clearable="true" style="width: 100%" :options="customOptions" />

      <!-- <el-form ref="ProjectFormRef" :model="projectForm" label-width="100px" class="w-full">
        <el-form-item label="荷载工况">
          <ez-select
            v-model="projectForm.loadCases"
            placeholder="请选择荷载工况"
            multiple
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(LoadCases)"
          />
        </el-form-item>
        <el-form-item label="建筑布局">
          <ez-select
            v-model="projectForm.buildingLayout"
            placeholder="请选择建筑布局"
            multiple
            :clearable="true"
            style="width: 100%"
            :options="BuildingLayoutOptions"
          />
        </el-form-item>
        <el-form-item label="构件类型">
          <ez-select
            v-model="projectForm.buildType"
            placeholder="请选择构件类型"
            multiple
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(BuildType)"
          />
        </el-form-item>
        <el-form-item label="材料参数">
          <ez-select
            v-model="projectForm.material"
            placeholder="请选择材料参数"
            multiple
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(Material)"
          />
        </el-form-item>
        <el-form-item label="目标权重">
          <ez-select
            v-model="projectForm.targetWeight"
            placeholder="请选择目标权重"
            multiple
            :clearable="true"
            style="width: 100%"
            :options="TargetWeightOptions"
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
import { getStructuralDesignDetail, updateStructuralDesignParams, generateStructuralDesignPlan ,updateParamsDetail} from '@/apis/project'

const route = useRoute()

const projectId = ref('')

const saveLoading = ref(false)

const pageLoading = ref(false)

const LoadCases = 'load_cases' // 荷载工况
const BuildType = 'build_type' // 构建类型
const Material = 'material' // 材料参数
const { dictMap, getDictMap } = useDict()
// 建筑布局
const BuildingLayoutOptions = [{
  label: '默认',
  value: '0'
}]
// 目标权重
const TargetWeightOptions = [{
  label: '默认',
  value: '0'
}]

const customOptions = []

const projectForm = ref({
  /** 荷载工况 */
  loadCases: [],
  /** 建筑布局 */
  buildingLayout: [],
  /** 构建类型  */
  buildType: [],
  /** 材料参数 */
  material: [],
  /** 目标权重 */
  targetWeight: [],
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
    params.loadCases = params.loadCases.join(',')
    params.buildingLayout = params.buildingLayout.join(',')
    params.buildType = params.buildType.join(',')
    params.material = params.material.join(',')
    params.targetWeight = params.targetWeight.join(',')
    params.custom = params.custom.join(',')
    await generateStructuralDesignPlan({
      projectId: projectId.value,
      type:4
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
    const { data } = await getStructuralDesignDetail({
      projectId: projectId.value
    })
    projectForm.value.loadCases = (data.params?.loadCases || '').split(',').filter(Boolean)
    projectForm.value.buildingLayout = (data.params?.buildingLayout || '').split(',').filter(Boolean)
    projectForm.value.buildType = (data.params?.buildType || '').split(',').filter(Boolean)
    projectForm.value.material = (data.params?.material || '').split(',').filter(Boolean)
    projectForm.value.targetWeight = (data.params?.targetWeight || '').split(',').filter(Boolean)
    projectForm.value.custom = (data.params?.custom || '').split(',').filter(Boolean)
    console.log('获取结构设计详情', data)
    initProjectForm.value = JSON.parse(JSON.stringify(projectForm.value))
  } catch (error) {
    console.error('获取结构设计详情失败', error)
  } finally {
    pageLoading.value = false
  }
}

onMounted(async () => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
    fetchDetail()
  }
 await getDictMap([LoadCases, BuildType, Material])
 loadCasesList.value = dictMap.value.get(LoadCases)
 loadCasesList.value = loadCasesList.value.map(ele=>{
  return {
    ...ele,
    number:undefined
  }
 })
 buildTypeList.value = dictMap.value.get(BuildType)
 materialList.value = dictMap.value.get(Material)
 

 updateParamsDetail({
    projectId: projectId.value
  }).then(res=>{
     const { data: {
      params
    } } = res
     const loadCasesFieldRes = params.find(ele => ele.field === loadCasesField)
   if (loadCasesFieldRes) {
      loadCases.value = true
      if(loadCasesFieldRes.value) {
        projectForm.value.loadCases = loadCasesFieldRes.value.split(",")
        const valueConfig = loadCasesFieldRes.valueConfig || []
        loadCasesList.value = loadCasesList.value.map(ele=>{
          const result = valueConfig.find(e =>ele.value ===e.field)
          return {
            ...ele,
            number:result?.value
          }
        })

      }else {
        projectForm.value.loadCases = [] 
          loadCasesList.value = loadCasesList.value.map(ele=>{
          return {
            ...ele,
            number:""
          }
        })
      }
    } else {
      loadCases.value = false
      loadCasesRadio.value = ""
    }

       const buildingLayoutRes = params.find(ele => ele.field === buildingLayoutField)
   if (buildingLayoutRes) {
      buildingLayout.value = true
      buildingLayoutRadio.value = buildingLayoutRes.value
    } else {
      buildingLayout.value = false
      buildingLayoutRadio.value = ""
    }


    const buildTypeFieldRes = params.find(ele => ele.field === buildTypeField)
   if (buildTypeFieldRes) {
      buildType.value = true
      buildTypeRadio.value = buildTypeFieldRes.value
    } else {
      buildType.value = false
      buildTypeRadio.value = ""
    }

    const materialFieldRes = params.find(ele => ele.field === materialField)
   if (materialFieldRes) {
      material.value = true
      materialRadio.value = materialFieldRes.value
    } else {
      material.value = false
      materialRadio.value = ""
    }


    const targetWeightFieldRes = params.find(ele => ele.field === targetWeightField)
   if (targetWeightFieldRes) {
      targetWeight.value = true
      targetWeightRadio.value = targetWeightFieldRes.value
    } else {
      targetWeight.value = false
      targetWeightRadio.value = ""
    }
      const customFieldRes = params.find(ele => ele.field === customField)
    if (customFieldRes) {
      const value = customFieldRes.value.split(",")
      projectForm.value.custom = value
    }

  })

//  buildingLayoutList.value = dictMap.value.get(LoadCases)


})
const customField = "custom"

const loadCasesField = "loadCases"
const loadCases = ref(true)
const loadCasesRadio = ref("")
const loadCasesList = ref<any[]>([])

const buildingLayoutField = "buildingLayout"
const buildingLayout = ref(true)
const buildingLayoutRadio = ref("")
const buildingLayoutList = ref<any[]>([{
  label: '默认',
  value: '0'
}])


const buildTypeField = "buildType"
const buildType = ref(true)
const buildTypeRadio = ref("")
const buildTypeList = ref<any[]>([])

const materialField = "material"
const material = ref(true)
const materialRadio = ref("")
const materialList = ref<any[]>([{
  label: '默认',
  value: '0'
}])


const targetWeightField = "targetWeight"
const targetWeight = ref(true)
const targetWeightRadio = ref("")
const targetWeightList = ref<any[]>([{
  label: '默认',
  value: '0'
}])
const all = ref(true)
watch(() => [
  loadCases.value,
  buildingLayout.value,
  buildType.value,
  material.value,
  targetWeight.value,
], (newValue) => {
  const result = newValue.every(ele => ele)
  all.value = result
})
function handleAllChangeEvt() {
  loadCases.value = true
  buildingLayout.value = true
  buildType.value = true
  material.value = true
  targetWeight.value = true
}
const handleSave = async () => {
  try {
    saveLoading.value = true
    const params = []
    if(loadCases.value){
      if(projectForm.value.loadCases.length > 0){
        params.push({
        "field": loadCasesField,
        "type": "select",
        "value": projectForm.value.loadCases.join(","),
        "valueConfig": projectForm.value.loadCases.map((ele,index)=>{
          // debugger
          const find = loadCasesList.value.find(e=>e.value ===ele) 
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
     if (buildingLayout.value) {
      params.push({
        "field": buildingLayoutField,
        "type": "radio",
        "value": buildingLayoutRadio.value,
        "valueConfig": null
      })
    }

    if (buildType.value) {
      params.push({
        "field": buildTypeField,
        "type": "radio",
        "value": buildTypeRadio.value,
        "valueConfig": null
      })
    }

    if (material.value) {
      params.push({
        "field": materialField,
        "type": "radio",
        "value": materialRadio.value,
        "valueConfig": null
      })
    }
     if (targetWeight.value) {
      params.push({
        "field": targetWeightField,
        "type": "radio",
        "value": targetWeightRadio.value,
        "valueConfig": null
      })
    }
     if (projectForm.value.custom.length > 0) {
      params.push({
        "field": customField,
        "type": "input",
        "value": projectForm.value.custom.join(","),
        "valueConfig": null
      })
    }
    // const params = JSON.parse(JSON.stringify(projectForm.value))
    // params.loadCases = params.loadCases.join(',')
    // params.buildingLayout = params.buildingLayout.join(',')
    // params.buildType = params.buildType.join(',')
    // params.material = params.material.join(',')
    // params.targetWeight = params.targetWeight.join(',')
    // params.custom = params.custom.join(',')
    await updateStructuralDesignParams({
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
