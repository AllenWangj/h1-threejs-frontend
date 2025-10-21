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
                <el-checkbox @click.stop v-model="climateRegion" label="典型目标区域" size="small" />
              </div>
            </template>
            <div style="padding: 5px;">
              <el-radio-group v-model="climateRegionRadio" class="radio-block">
                <el-radio style="display: block;" :value="item.value" v-for="
(item) in regionList" :key="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>

          <el-collapse-item name="2">
            <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="land" label="土地规划" size="small" />
              </div>
            </template>
            <div style="padding: 5px;">
              <el-radio-group v-model="landRadio" class="radio-block">
                <el-radio style="display: block;" :value="item.value" v-for="
(item) in landList" :key="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>

          <el-collapse-item name="3">
            <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="functionalDivision" label="模式类型" size="small" />
              </div>
            </template>
            <div style="padding: 5px;">
              <el-radio-group v-model="functionalDivisionRadio" class="radio-block">
                <el-radio style="display: block;" :value="item.value" v-for="
(item) in landList" :key="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>


          <el-collapse-item name="4">
            <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="facilityLayout" label="建筑和设施布局" size="small" />
              </div>
            </template>
            <div style="padding: 5px;">
              <el-radio-group v-model="facilityLayoutRadio" class="radio-block">
                <el-radio style="display: block;" :value="item.value" v-for="
(item) in facilityLayoutList" :key="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>
          <el-collapse-item name="5">
            <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="functionalBuilding" label="功能模块建筑" size="small" />
              </div>
            </template>
            <div style="padding: 5px;">
              <el-radio-group v-model="functionalBuildingRadio" class="radio-block">
                <el-radio style="display: block;" :value="item.value" v-for="
(item) in functionalBuildingList" :key="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <p style="padding: 5px;">自定义参数</p>
      <ez-select v-model="projectForm.custom" placeholder="请选择自定义参数" multiple filterable allow-create
        default-first-option :clearable="true" style="width: 100%" :options="customOptions" />

      <!--  -->
      <!-- <el-form ref="ProjectFormRef" :model="projectForm" label-width="120px" class="w-full">
        <el-form-item label="典型目标区域">
          <ez-select
            v-model="projectForm.climateRegion"
            placeholder="请选择典型目标区域"
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(ClimateRegion)"
          />
        </el-form-item>
        <el-form-item label="土地规划">
          <ez-select
            v-model="projectForm.land"
            placeholder="请选择土地规划"
            :clearable="true"
            style="width: 100%"
            :options="LandOptions"
          />
        </el-form-item>
        <el-form-item label="功能区划">
          <ez-select
            v-model="projectForm.functionalDivision"
            placeholder="请选择功能区划"
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(FunctionalDivision)"
          />
        </el-form-item>
        <el-form-item label="模式类型">
          <ez-select
            v-model="projectForm.schemaType"
            placeholder="请选择模式类型"
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(SchemaType)"
          />
        </el-form-item>
        <el-form-item label="建筑和设施布局">
          <ez-select
            v-model="projectForm.facilityLayout"
            placeholder="请选择建筑和设施布局"
            :clearable="true"
            style="width: 100%"
            :options="FacilityLayoutOptions"
          />
        </el-form-item>
        <el-form-item label="功能模块建筑">
          <ez-select
            v-model="projectForm.functionalBuilding"
            placeholder="请选择功能模块建筑"
            multiple
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(BuildingFunctional)"
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
import { getPlanLayout, updatePlanLayoutParams, generatePlanLayoutPlan, planLayoutDetail, planLayoutDetailInfo } from '@/apis/project'
import { watch } from "vue"
const route = useRoute()
// { /** 荷载工况 字典 load_cases / loadCases: string /* 建筑布局 默认 0*/ buildingLayout: string /** 构建类型 字典 build_type / buildType: string /* 材料参数 字典 material / material: string /* 目标权重 默认0 / targetWeight: string /* 自定义参数 */ custom: string}


const projectId = ref('')

const saveLoading = ref(false)

const pageLoading = ref(false)

const ClimateRegion = 'climate_region' // 区域目标规划
const FunctionalDivision = 'functional_division' // 功能区划
const SchemaType = 'schema_type' // 模式类型
const BuildingFunctional = 'building_functional' // 功能模块建筑
const { dictMap, getDictMap } = useDict()
// 土地规划
const LandOptions = [
  {
    label: '默认',
    value: '0'
  }
]
// 建筑和设施布局
const FacilityLayoutOptions = [
  {
    label: '默认',
    value: '0'
  }
]

const customOptions = []
const all = ref(true)
const projectForm = ref({
  /** 区域目标规划 */
  climateRegion: '',
  /** 土地规划 */
  land: '',
  /** 功能区划 */
  functionalDivision: '',
  /** 模式类型  */
  schemaType: '',
  /** 建筑和设施布局 */
  facilityLayout: '',
  /** 功能模块建筑 */
  functionalBuilding: [],
  /** 自定义参数 */
  custom: []
})
const initProjectForm = ref({})

const handleReset = () => {
  projectForm.value = JSON.parse(JSON.stringify(initProjectForm.value))
}

const handleSave = async () => {
  try {
    saveLoading.value = true
    const params = []

    if (climateRegion.value) {
      params.push({
        "field": climateRegionField,
        "type": "radio",
        "value": climateRegionRadio.value,
        "valueConfig": null
      })
    }

    if (land.value) {
      params.push({
        "field": landField,
        "type": "radio",
        "value": landRadio.value,
        "valueConfig": null
      })
    }

    if (functionalDivision.value) {
      params.push({
        "field": functionalDivisionField,
        "type": "radio",
        "value": functionalDivisionRadio.value,
        "valueConfig": null
      })
    }

    if (facilityLayout.value) {
      params.push({
        "field": facilityLayoutField,
        "type": "radio",
        "value": facilityLayoutRadio.value,
        "valueConfig": null
      })
    }


    if (functionalBuilding.value) {
      params.push({
        "field": functionalBuildingField,
        "type": "radio",
        "value": functionalBuildingRadio.value,
        "valueConfig": null
      })
    }

    if (projectForm.value.custom.length > 0) {
      params.push({
        "field": customField,
        "type": "radio",
        "value": projectForm.value.custom.join(","),
        "valueConfig": null
      })
    }
    await planLayoutDetail({
      params,
      projectId: projectId.value
    })
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    saveLoading.value = false
  }
}

const handleGenerateSolution = async () => {
  try {
    saveLoading.value = true
    const params = JSON.parse(JSON.stringify(projectForm.value))
    params.functionalBuilding = params.functionalBuilding.join(',')
    params.custom = params.custom.join(',')
    await generatePlanLayoutPlan({
      projectId: projectId.value,
      type:2
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
    const { data } = await getPlanLayout({
      id: projectId.value
    })
    projectForm.value.climateRegion = data.params?.climateRegion || ''
    projectForm.value.land = data.params?.land || ''
    projectForm.value.functionalDivision = data.params?.functionalDivision || ''
    projectForm.value.schemaType = data.params?.schemaType || ''
    projectForm.value.facilityLayout = data.params?.facilityLayout || ''
    projectForm.value.functionalBuilding = (data.params?.functionalBuilding || '').split(',').filter(Boolean)
    projectForm.value.custom = (data.params?.custom || '').split(',').filter(Boolean)
    console.log('获取规划布局详情', data)
    initProjectForm.value = JSON.parse(JSON.stringify(projectForm.value))
  } catch (error) {
    console.error('获取规划布局详情失败', error)
  } finally {
    pageLoading.value = false
  }
}


onMounted(async () => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
    fetchDetail()
  }
  await getDictMap([ClimateRegion, FunctionalDivision, SchemaType, BuildingFunctional])
  regionList.value = dictMap.value.get(ClimateRegion)
  functionalDivisionList.value = dictMap.value.get(FunctionalDivision)
  functionalBuildingList.value = dictMap.value.get(BuildingFunctional)
  planLayoutDetailInfo({
    projectId: projectId.value
  }).then(res => {
    const { data: {
      params
    } } = res
    const climateRegionRes = params.find(ele => ele.field === climateRegionField)
    if (climateRegionRes) {
      climateRegion.value = true
      climateRegionRadio.value = climateRegionRes.value
    } else {
      climateRegion.value = false
      climateRegionRadio.value = ""
    }

    const landFieldRes = params.find(ele => ele.field === landField)
    if (landFieldRes) {
      land.value = true
      landRadio.value = landFieldRes.value
    } else {
      land.value = false
      landRadio.value = ""
    }
    const functionalDivisionFieldRes = params.find(ele => ele.field === functionalDivisionField)
    if (functionalDivisionFieldRes) {
      functionalDivision.value = true
      functionalDivisionRadio.value = functionalDivisionFieldRes.value
    } else {
      functionalDivision.value = false
      functionalDivisionRadio.value = ""
    }
    const facilityLayoutFieldRes = params.find(ele => ele.field === facilityLayoutField)
    if (facilityLayoutFieldRes) {
      facilityLayout.value = true
      facilityLayoutRadio.value = facilityLayoutFieldRes.value
    } else {
      facilityLayout.value = false
      facilityLayoutRadio.value = ""
    }


    const functionalBuildingFieldRes = params.find(ele => ele.field === functionalBuildingField)
    if (functionalBuildingFieldRes) {
      functionalBuilding.value = true
      functionalBuildingRadio.value = functionalBuildingFieldRes.value
    } else {
      functionalBuilding.value = false
      functionalBuildingRadio.value = ""
    }

    const customFieldRes = params.find(ele => ele.field === customField)
    if (customFieldRes) {
      const value = customFieldRes.value.split(",")
      projectForm.value.custom = value
    }
  })
})

const climateRegionField = "climateRegion"
const landField = "land"
const functionalDivisionField = "functionalDivision"
const facilityLayoutField = "facilityLayout"
const functionalBuildingField = "functionalBuilding"
const customField = "custom"


const climateRegion = ref(true)
const climateRegionRadio = ref("")
const regionList = ref<any[]>([])

const land = ref(true)
const landRadio = ref("")
const landList = ref<any[]>([{
  label: '默认',
  value: '0'
}])



const functionalDivision = ref(true)
const functionalDivisionRadio = ref("")
const functionalDivisionList = ref<any[]>([])


const facilityLayout = ref(true)
const facilityLayoutRadio = ref("")
const facilityLayoutList = ref<any[]>([{
  label: '默认',
  value: '0'
}])



const functionalBuilding = ref(true)
const functionalBuildingRadio = ref("")
const functionalBuildingList = ref<any[]>([{
  label: '默认',
  value: '0'
}])

watch(() => [
  climateRegion.value,
  functionalDivision.value,
  facilityLayout.value,
  functionalBuilding.value,
  land.value,
], (newValue) => {
  const result = newValue.every(ele => ele)
  all.value = result
})
function handleAllChangeEvt() {
  climateRegion.value = true
  functionalDivision.value = true
  facilityLayout.value = true
  functionalBuilding.value = true
}

// facilityLayout
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
