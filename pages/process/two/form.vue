<template>
  <div v-loading="pageLoading" class="h-full w-full flex flex-col border border-[1px] border-[#adcdf7]">
    <div class="flex-shrink-0 flex items-center h-[56px] px-[14px] border-b border-[#e4ecfd]">
      <span class="text-[16px] text-[#333] ml-[8px]">结构设计</span>
    </div>
    <div class="flex-1 flex flex-col px-[14px] py-[14px]">
      <el-form ref="ProjectFormRef" :model="projectForm" label-width="120px" class="w-full">
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
      </el-form>
      <div class="flex items-center justify-center mt-[14px]">
        <el-button type="primary" :disabled="saveLoading" plain @click="handleReset">重置</el-button>
        <el-button type="primary" :loading="saveLoading" @click="handleSave">保存</el-button>
        <el-button type="primary" :disabled="saveLoading" @click="handleGenerateSolution">生成方案</el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getPlanLayout, updatePlanLayoutParams, generatePlanLayoutPlan } from '@/apis/project'

const route = useRoute()

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
    const params = JSON.parse(JSON.stringify(projectForm.value))
    params.functionalBuilding = params.functionalBuilding.join(',')
    params.custom = params.custom.join(',')
    await updatePlanLayoutParams({
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

const handleGenerateSolution = async () => {
  try {
    saveLoading.value = true
    const params = JSON.parse(JSON.stringify(projectForm.value))
    params.functionalBuilding = params.functionalBuilding.join(',')
    params.custom = params.custom.join(',')
    await generatePlanLayoutPlan({
      projectId: projectId.value,
      params
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
      projectId: projectId.value
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

onMounted(() => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
    fetchDetail()
  }
  getDictMap([ClimateRegion, FunctionalDivision, SchemaType, BuildingFunctional])
})
</script>
<style lang="less" scoped></style>
