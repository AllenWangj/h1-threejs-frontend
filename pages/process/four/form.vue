<template>
  <div v-loading="pageLoading" class="h-full w-full flex flex-col border border-[1px] border-[#adcdf7]">
    <div class="flex-shrink-0 flex items-center h-[56px] px-[14px] border-b border-[#e4ecfd]">
      <span class="text-[16px] text-[#333] ml-[8px]">结构设计</span>
    </div>
    <div class="flex-1 flex flex-col px-[14px] py-[14px]">
      <el-form ref="ProjectFormRef" :model="projectForm" label-width="100px" class="w-full">
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
import { getStructuralDesignDetail, updateStructuralDesignParams, generateStructuralDesignPlan } from '@/apis/project'

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

const handleSave = async () => {
  try {
    saveLoading.value = true
    const params = JSON.parse(JSON.stringify(projectForm.value))
    params.loadCases = params.loadCases.join(',')
    params.buildingLayout = params.buildingLayout.join(',')
    params.buildType = params.buildType.join(',')
    params.material = params.material.join(',')
    params.targetWeight = params.targetWeight.join(',')
    params.custom = params.custom.join(',')
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

onMounted(() => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
    fetchDetail()
  }
  getDictMap([LoadCases, BuildType, Material])
})
</script>
<style lang="less" scoped></style>
