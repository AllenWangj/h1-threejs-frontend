<template>
  <div v-loading="pageLoading" class="h-full w-full flex flex-col border border-[1px] border-[#adcdf7]">
    <div class="flex-shrink-0 flex items-center h-[56px] px-[14px] border-b border-[#e4ecfd]">
      <span class="text-[16px] text-[#333] ml-[8px]">运输保障</span>
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
            <div v-else-if="item.type === 'multiple-dynamic'" class="w-full">
              <ez-select
                v-model="item.value"
                placeholder="请选择"
                :clearable="true"
                multiple
                style="width: 100%"
                :options="item.options"
              />
              <div v-for="(options, index) in item.valueConfig" :key="options.field">
                <div v-if="item.value.includes(options.field)" class="flex items-center mt-[8px]">
                  <div class="text-[#666] text-[14px] min-w-[120px] text-right mr-[15px]">
                    {{ getArrayLabel(options.field, item.options) }}
                  </div>
                  <el-input v-model="options.value" class="w-[200px]"></el-input>
                </div>
              </div>
            </div>
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
import { updatePackingParams, generatePackingPlan, packingDetail } from '@/apis/project'

const route = useRoute()

const projectId = ref('')

const saveLoading = ref(false)

const pageLoading = ref(false)

const Transportation = 'transportation' // 运载方式
const LoadingCapacity = 'loading_capacity' // 装载量
const Time = 'time' // 运输时间
const { dictMap, getDictMap, getArrayLabel } = useDict()

const customOptions = []

// label映射
const LABLE_MAP = {
  transportation: '运载方式',
  loadingCapacity: '装载量',
  shippingTime: '运输时间',
  custom: '自定义参数'
}
// 字典映射
const DICT_MAP = computed(() => {
  return {
    transportation: dictMap.value.get(Transportation) || [],
    loadingCapacity: dictMap.value.get(LoadingCapacity) || [],
    shippingTime: dictMap.value.get(Time) || [],
    custom: customOptions || []
  }
})
// 表单数据
const formData = ref({
  projectForm: []
})
const initProjectForm = ref({})

const handleReset = () => {
  formData.value = JSON.parse(JSON.stringify(initProjectForm.value))
}

const handleSave = async () => {
  try {
    saveLoading.value = true
    const params = JSON.parse(JSON.stringify(formData.value.projectForm))
    await updatePackingParams({
      projectId: projectId.value,
      params
    })
    ElMessage.success('保存成功')
    initProjectForm.value = JSON.parse(JSON.stringify(formData.value))
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    saveLoading.value = false
  }
}

const handleGenerateSolution = async () => {
  try {
    saveLoading.value = true
    await generatePackingPlan({
      projectId: projectId.value,
      type: 6
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
    const { data } = await packingDetail({
      projectId: projectId.value
    })
    console.log('获取运输保障详情', data)
    formData.value.projectForm = (data.params || []).map((item) => {
      item.label = LABLE_MAP[item.field] || item.field
      item.options = DICT_MAP.value[item.field] || []
      return item
    })
    initProjectForm.value = JSON.parse(JSON.stringify(formData.value))
  } catch (error) {
    console.error('获取运输保障详情失败', error)
  } finally {
    pageLoading.value = false
  }
}

onMounted(async () => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
    fetchDetail()
  }
  await getDictMap([Transportation, LoadingCapacity, Time])
})
</script>
