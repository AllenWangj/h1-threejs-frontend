<template>
  <div v-loading="pageLoading" class="h-full w-full flex flex-col border border-[1px] border-[#adcdf7]">
    <div class="flex-shrink-0 flex items-center h-[56px] px-[14px] border-b border-[#e4ecfd]">
      <span class="text-[16px] text-[#333] ml-[8px]">运输保障</span>
    </div>
    <div class="flex-1 flex flex-col px-[14px] py-[14px]">
      <el-form ref="ProjectFormRef" :model="projectForm" label-width="100px" class="w-full">
        <el-form-item label="运转方式">
          <ez-select
            v-model="projectForm.transportation"
            placeholder="请选择运转方式"
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(Transportation)"
          />
        </el-form-item>
        <el-form-item label="装载量">
          <ez-select
            v-model="projectForm.loadingCapacity"
            placeholder="请选择装载量"
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(LoadingCapacity)"
          />
        </el-form-item>
        <el-form-item label="运输时间">
          <ez-select
            v-model="projectForm.shippingTime"
            placeholder="请选择运输时间"
            multiple
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(Time)"
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
import { getPackingDetail, updatePackingParams, generatePackingPlan } from '@/apis/project'

const route = useRoute()

const projectId = ref('')

const saveLoading = ref(false)

const pageLoading = ref(false)

const Transportation = 'transportation' // 运载方式
const LoadingCapacity = 'loading_capacity' // 装载量
const Time = 'time' // 运输时间
const { dictMap, getDictMap } = useDict()

const customOptions = []

const projectForm = ref({
  /** 运载方式 */
  transportation: '',
  /** 装载量 */
  loadingCapacity: '',
  /** 运输时间  */
  shippingTime: [],
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
    params.shippingTime = params.shippingTime.join(',')
    params.custom = params.custom.join(',')
    await updatePackingParams({
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
    params.shippingTime = params.shippingTime.join(',')
    params.custom = params.custom.join(',')
    await generatePackingPlan({
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
    const { data } = await getPackingDetail({
      projectId: projectId.value
    })
    projectForm.value.transportation = data.params?.transportation || ''
    projectForm.value.loadingCapacity = data.params?.loadingCapacity || ''
    projectForm.value.shippingTime = (data.params?.shippingTime || '').split(',').filter(Boolean)
    projectForm.value.custom = (data.params?.custom || '').split(',').filter(Boolean)
    console.log('获取运输保障详情', data)
    initProjectForm.value = JSON.parse(JSON.stringify(projectForm.value))
  } catch (error) {
    console.error('获取运输保障详情失败', error)
  } finally {
    pageLoading.value = false
  }
}

onMounted(() => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
    fetchDetail()
  }
  getDictMap([Transportation, LoadingCapacity, Time])
})
</script>
<style lang="less" scoped></style>
