<template>
  <div v-loading="pageLoading" class="h-full w-full flex flex-col border border-[1px] border-[#adcdf7]">
    <div class="flex-shrink-0 flex items-center h-[56px] px-[14px] border-b border-[#e4ecfd]">
      <span class="text-[16px] text-[#333] ml-[8px]">结构设计</span>
    </div>
    <div class="flex-1 flex flex-col px-[14px] py-[14px]">
      <el-form ref="ProjectFormRef" :model="projectForm" label-width="120px" class="w-full">
        <el-form-item label="建筑功能">
          <ez-select
            v-model="projectForm.functional"
            placeholder="请选择建筑功能"
            multiple
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(BuildingFunctional)"
          />
        </el-form-item>
        <el-form-item label="建筑边界">
          <ez-select
            v-model="projectForm.boundary"
            placeholder="请选择建筑边界"
            multiple
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(BuildingBoundary)"
          />
        </el-form-item>
        <el-form-item label="建筑规模">
          <ez-select
            v-model="projectForm.scale"
            placeholder="请选择建筑规模"
            multiple
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(BuildingScale)"
          />
        </el-form-item>
        <el-form-item label="整体布局">
          <ez-select
            v-model="projectForm.layout"
            placeholder="请选择整体布局"
            multiple
            :clearable="true"
            style="width: 100%"
            :options="layoutOptions"
          />
        </el-form-item>
        <el-form-item label="标准化功能模块">
          <ez-select
            v-model="projectForm.moduleLibrary"
            placeholder="请选择标准化功能模块"
            multiple
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(ModuleLibrary)"
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
        <el-button type="primary" :loading="saveLoading" @click="handleGenerateSolution">生成方案</el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getInternalLayoutDetail, updateInternalLayoutParams, generateInternalLayoutPlan } from '@/apis/project'

const route = useRoute()

const projectId = ref('')

const saveLoading = ref(false)

const pageLoading = ref(false)

const BuildingFunctional = 'building_functional' // 建筑功能
const BuildingBoundary = 'building_boundary' // 建筑边界
const BuildingScale = 'building_scale' // 建筑规模
const ModuleLibrary = 'module_library' // 标准化模块库
const { dictMap, getDictMap } = useDict()
// 整体布局
const layoutOptions = [{
  label: '默认',
  value: '0'
}]

const customOptions = []

const projectForm = ref({
  /** 建筑功能 */
  functional: [],
  /** 建筑边界 */
  boundary: [],
  /** 建筑规模  */
  scale: [],
  /** 整体布局 */
  layout: [],
  /** 标准化功能模块 */
  moduleLibrary: [],
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
    params.functional = params.functional.join(',')
    params.boundary = params.boundary.join(',')
    params.scale = params.scale.join(',')
    params.layout = params.layout.join(',')
    params.moduleLibrary = params.moduleLibrary.join(',')
    params.custom = params.custom.join(',')
    await updateInternalLayoutParams({
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
    params.functional = params.functional.join(',')
    params.boundary = params.boundary.join(',')
    params.scale = params.scale.join(',')
    params.layout = params.layout.join(',')
    params.moduleLibrary = params.moduleLibrary.join(',')
    params.custom = params.custom.join(',')
    await generateInternalLayoutPlan({
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
    const { data } = await getInternalLayoutDetail({
      projectId: projectId.value
    })
    projectForm.value.functional = (data.params?.functional || '').split(',').filter(Boolean)
    projectForm.value.boundary = (data.params?.boundary || '').split(',').filter(Boolean)
    projectForm.value.scale = (data.params?.scale || '').split(',').filter(Boolean)
    projectForm.value.layout = (data.params?.layout || '').split(',').filter(Boolean)
    projectForm.value.moduleLibrary = (data.params?.moduleLibrary || '').split(',').filter(Boolean)
    projectForm.value.custom = (data.params?.custom || '').split(',').filter(Boolean)
    console.log('获取内部布局详情', data)
    initProjectForm.value = JSON.parse(JSON.stringify(projectForm.value))
  } catch (error) {
    console.error('获取内部布局详情失败', error)
  } finally {
    pageLoading.value = false
  }
}

onMounted(() => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
    fetchDetail()
  }
  getDictMap([BuildingFunctional, BuildingBoundary, BuildingScale, ModuleLibrary])
})
</script>
<style lang="less" scoped></style>
