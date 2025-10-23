<template>
  <div v-loading="pageLoading" class="h-full w-full flex flex-col border border-[1px] border-[#adcdf7]">
    <div class="flex-shrink-0 flex items-center h-[56px] px-[14px] border-b border-[#e4ecfd]">
      <span class="text-[16px] text-[#333] ml-[8px]">结构设计</span>
    </div>
    <div class="flex-1 flex flex-col px-[14px] py-[14px] overflow-y-auto">
      <el-form ref="ProjectFormRef" :model="formData" label-position="top" label-width="120px" class="w-full">
        <div
          class="w-full px-[14px] py-[10px] bg-[#fff] mb-[14px] rounded-[4px]"
          v-for="item in formData.projectForm"
          :key="item.field"
        >
          <el-form-item label="">
            <template #label>
              <div class="flex items-center">
                <el-checkbox v-model="item.tag">{{ item.label }}</el-checkbox>
              </div>
            </template>
            <ez-select
              v-if="item.field === 'custom'"
              v-model="item.value"
              placeholder="请选择"
              multiple
              filterable
              allow-create
              default-first-option
              :clearable="true"
              style="width: 100%"
              :options="item.options"
            />
            <ez-select
              v-else-if="item.type === 'select'"
              v-model="item.value"
              placeholder="请选择"
              :clearable="true"
              style="width: 100%"
              :options="item.options"
            />
            <ez-select
              v-else-if="item.type === 'multiple'"
              v-model="item.value"
              placeholder="请选择"
              :clearable="true"
              multiple
              style="width: 100%"
              :options="item.options"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="flex items-center justify-center py-[10px]">
      <el-button type="primary" :disabled="saveLoading" plain @click="handleReset">重置</el-button>
      <el-button type="primary" :loading="saveLoading" @click="handleSave">保存</el-button>
      <el-button type="primary" :disabled="saveLoading" @click="handleGenerateSolution">生成方案</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { updatePlanLayoutParams, generatePlanLayoutPlan, planLayoutDetailInfo } from '@/apis/project'
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
// 自定义
const customOptions = []
// 字典映射
const DICT_MAP = computed(() => {
  return {
    climateRegion: dictMap.value.get(ClimateRegion) || [],
    land: LandOptions || [],
    functionalDivision: dictMap.value.get(FunctionalDivision) || [],
    schemaType: dictMap.value.get(SchemaType) || [],
    facilityLayout: FacilityLayoutOptions || [],
    functionalBuilding: dictMap.value.get(BuildingFunctional) || [],
    custom: customOptions || []
  }
})
// label映射
const LABLE_MAP = {
  climateRegion: '典型目标区域',
  land: '土地规划',
  functionalDivision: '功能区划',
  schemaType: '模式类型',
  facilityLayout: '建筑和设施布局',
  functionalBuilding: '功能模块建筑',
  custom: '自定义参数'
}
// 表单数据
const formData = ref({
  projectForm: []
})
// 保存初始数据用来重置功能
const initProjectForm = ref({})
// 重置
const handleReset = () => {
  formData.value = JSON.parse(JSON.stringify(initProjectForm.value))
}
// 保存
const handleSave = async () => {
  try {
    saveLoading.value = true
    const params = JSON.parse(JSON.stringify(formData.value.projectForm))
    await updatePlanLayoutParams({
      params,
      projectId: projectId.value
    })
    ElMessage.success('保存成功')
    initProjectForm.value = JSON.parse(JSON.stringify(formData.value))
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    saveLoading.value = false
  }
}
// 生成方案
const handleGenerateSolution = async () => {
  try {
    saveLoading.value = true
    // const params = JSON.parse(JSON.stringify(formData.value.projectForm.reduce((acc, item) => {
    //   if (Array.isArray(item.value)) {
    //     acc[item.field] = item.value.join(',')
    //   } else {
    //     acc[item.field] = item.value
    //   }
    //   return acc
    // }, {})))
    await generatePlanLayoutPlan({
      projectId: projectId.value,
      type: 2
    })
    ElMessageBox.alert('方案生成中，请稍后去生产方案中查看', '温馨提示', {
      confirmButtonText: '知道了'
    })
  } catch (error) {
    ElMessage.error('方案生成失败', error)
  } finally {
    saveLoading.value = false
  }
}

// 获取详情
async function fetchDetail() {
  try {
    pageLoading.value = true
    const { data } = await planLayoutDetailInfo({
      projectId: projectId.value
    })
    console.log('获取规划布局详情', data)
    formData.value.projectForm = (data.params || []).map((item) => {
      item.label = LABLE_MAP[item.field] || item.field
      item.options = DICT_MAP.value[item.field] || []
      return item
    })
    initProjectForm.value = JSON.parse(JSON.stringify(formData.value))
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
})
</script>
