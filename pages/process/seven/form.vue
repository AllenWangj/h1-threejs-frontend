<template>
  <div v-loading="pageLoading" class="h-full w-full flex flex-col border border-[1px] border-[#adcdf7]">
    <div class="flex-shrink-0 flex items-center h-[56px] px-[14px] border-b border-[#e4ecfd]">
      <span class="text-[16px] text-[#333] ml-[8px]">现场组装</span>
    </div>
    <div class="flex-1 flex flex-col px-[14px] py-[14px]">
      <el-form ref="ProjectFormRef" :model="projectForm" label-width="100px" class="w-full">
        <el-form-item label="总体规模">
          <ez-select
            v-model="projectForm.overallSize"
            placeholder="请选择总体规模"
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(AssembleScale)"
          />
        </el-form-item>
        <el-form-item label="完成时间">
          <ez-select
            v-model="projectForm.completionTime"
            placeholder="请选择完成时间"
            multiple
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(Time)"
          />
        </el-form-item>
        <el-form-item label="工人数量">
          <ez-select
            v-model="projectForm.worker"
            placeholder="请选择工人数量"
            multiple
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(Workers)"
          />
        </el-form-item>
        <el-form-item label="机械数量">
          <ez-select
            v-model="projectForm.machinery"
            placeholder="请选择机械数量"
            multiple
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(Machinery)"
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
import { getAssembleDetail, updateAssembleParams, generateAssemblePlan } from '@/apis/project'

const route = useRoute()

const projectId = ref('')

const saveLoading = ref(false)

const pageLoading = ref(false)

const AssembleScale = 'assemble_scale' // 总体规模
const Time = 'time' // 完成时间
const Workers = 'workers' // 工人数量
const Machinery = 'machinery' // 机器数量
const { dictMap, getDictMap } = useDict()

const customOptions = []

const projectForm = ref({
  /** 总体规模 */
  overallSize: '',
  /** 完成时间 */
  completionTime: [],
  /** 工人数量 */
  worker: [],
  /** 机器数量 */
  machinery: [],
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
    params.completionTime = params.completionTime.join(',')
    params.worker = params.worker.join(',')
    params.machinery = params.machinery.join(',')
    params.custom = params.custom.join(',')
    await updateAssembleParams({
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
    params.completionTime = params.completionTime.join(',')
    params.worker = params.worker.join(',')
    params.machinery = params.machinery.join(',')
    params.custom = params.custom.join(',')
    await generateAssemblePlan({
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
    const { data } = await getAssembleDetail({
      projectId: projectId.value
    })
    projectForm.value.overallSize = data.params?.overallSize || ''
    projectForm.value.completionTime = (data.params?.completionTime || '').split(',').filter(Boolean)
    projectForm.value.worker = (data.params?.worker || '').split(',').filter(Boolean)
    projectForm.value.machinery = (data.params?.machinery || '').split(',').filter(Boolean)
    projectForm.value.custom = (data.params?.custom || '').split(',').filter(Boolean)
    console.log('获取现场组装详情', data)
    initProjectForm.value = JSON.parse(JSON.stringify(projectForm.value))
  } catch (error) {
    console.error('获取现场组装详情失败', error)
  } finally {
    pageLoading.value = false
  }
}

onMounted(() => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
    fetchDetail()
  }
  getDictMap([AssembleScale, Time, Workers, Machinery])
})
</script>
<style lang="less" scoped></style>
