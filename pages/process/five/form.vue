<template>
  <div v-loading="pageLoading" class="h-full w-full flex flex-col border border-[1px] border-[#adcdf7]">
    <div class="flex-shrink-0 flex items-center h-[56px] px-[14px] border-b border-[#e4ecfd]">
      <span class="text-[16px] text-[#333] ml-[8px]">部件生产</span>
    </div>
    <div class="flex-1 flex flex-col px-[14px] py-[14px]">
      <el-form ref="ProjectFormRef" :model="projectForm" label-width="100px" class="w-full">
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
import { getPartsProductionDetail, updatePartsProductionParams, generatePartsProductionPlan } from '@/apis/project'

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

const handleSave = async () => {
  try {
    saveLoading.value = true
    const params = JSON.parse(JSON.stringify(projectForm.value))
    params.componentSpecifications = params.componentSpecifications.join(',')
    params.custom = params.custom.join(',')
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

const handleGenerateSolution = async () => {
  try {
    saveLoading.value = true
    const params = JSON.parse(JSON.stringify(projectForm.value))
    params.componentSpecifications = params.componentSpecifications.join(',')
    params.custom = params.custom.join(',')
    await generatePartsProductionPlan({
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

onMounted(() => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
    fetchDetail()
  }
  getDictMap([BuildingFunctional, StructuralPlan, ComponentSpecifications])
})
</script>
<style lang="less" scoped></style>
