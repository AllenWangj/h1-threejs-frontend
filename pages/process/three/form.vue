<template>
  <div v-loading="pageLoading" class="h-full w-full flex flex-col border border-[1px] border-[#adcdf7]">
    <div class="flex-shrink-0 flex items-center h-[56px] px-[14px] border-b border-[#e4ecfd]">
      <span class="text-[16px] text-[#333] ml-[8px]">内部布局</span>
    </div>

    <div class="flex flex-1 overflow-hidden">
      <div class="flex-grow-[1]">
        <File />
      </div>

      <div class="flex-grow-[3] flex flex-col">
        <div class="flex-shrink-0 flex items-center h-[56px] px-[14px] border-b border-[#e4ecfd]">
          <img src="../../../assets/images/home/file-icon.svg" width="20" height="20" alt="" />
          <span class="text-[16px] text-[#333] ml-[8px]">参数配置</span>
        </div>
        <div class="flex-1 flex flex-col px-[14px] py-[14px] overflow-y-auto">
          <el-form ref="ProjectFormRef" :model="formData" label-position="top" label-width="120px" class="w-full">
            <div class="w-full px-[14px] py-[10px] bg-[#fff] mb-[14px] rounded-[4px]"
              v-for="item in formData.projectForm" :key="item.field">
              <el-form-item label="">
                <template #label>
                  <div class="flex items-center">
                    <el-checkbox v-model="item.tag">{{ item.label }}</el-checkbox>
                  </div>
                </template>
                <ez-select v-if="item.field === 'custom'" v-model="item.value" placeholder="请选择" multiple filterable
                  allow-create default-first-option :clearable="true" style="width: 100%" :options="item.options" />
                <ez-select v-else-if="item.type === 'select'" v-model="item.value" placeholder="请选择" :clearable="true"
                  style="width: 100%" :options="item.options" />
                <ez-select v-else-if="item.type === 'multiple'" v-model="item.value" placeholder="请选择" :clearable="true"
                  multiple style="width: 100%" :options="item.options" />
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="flex items-center justify-center py-[10px]">
          <el-button type="primary" :disabled="saveLoading" plain @click="handleReset">重置</el-button>
          <el-button type="primary" :loading="saveLoading" @click="handleSave">保存</el-button>
          <el-button type="primary" :loading="saveLoading" @click="handleGenerateSolution">生成方案</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import File from './file.vue'
import {
  getInternalLayoutDetail,
  updateInternalLayoutParams,
  generateInternalLayoutPlan,
} from '@/apis/project'
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
const layoutOptions = [
  {
    label: '默认',
    value: '0'
  }
]
const customOptions = []

// label映射
const LABLE_MAP = {
  functional: '建筑功能',
  boundary: '建筑边界',
  scale: '建筑规模',
  layout: '整体布局',
  moduleLibrary: '标准化功能模块',
  custom: '自定义参数'
}
// 字典映射
const DICT_MAP = computed(() => {
  return {
    functional: dictMap.value.get(BuildingFunctional) || [],
    boundary: dictMap.value.get(BuildingBoundary) || [],
    scale: dictMap.value.get(BuildingScale) || [],
    layout: layoutOptions || [],
    moduleLibrary: dictMap.value.get(ModuleLibrary) || [],
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
    await updateInternalLayoutParams({
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
    await generateInternalLayoutPlan({
      projectId: projectId.value,
      type: 3
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
    console.log('获取内部布局详情', data)
    formData.value.projectForm = (data.params || defData).map((item) => {
      item.label = LABLE_MAP[item.field] || item.field
      item.options = DICT_MAP.value[item.field] || []
      return item
    })
    initProjectForm.value = JSON.parse(JSON.stringify(formData.value))
  } catch (error) {
    console.error('获取内部布局详情失败', error)
  } finally {
    pageLoading.value = false
  }
}

onMounted(async () => {
  await getDictMap([BuildingFunctional, BuildingBoundary, BuildingScale, ModuleLibrary])
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
    fetchDetail()
  }
})


const defData = [
    {
        "tag": true,
        "type": "select",
        "field": "functional",
        "label": "建筑功能",
        "value": "",
        "options": [],
        "valueConfig": null
    },
    {
        "tag": true,
        "type": "multiple",
        "field": "boundary",
        "label": "建筑边界",
        "value": [],
        "options": [],
        "valueConfig": null
    },
    {
        "tag": true,
        "type": "multiple",
        "field": "scale",
        "label": "建筑规模",
        "value": [],
        "options": [],
        "valueConfig": null
    },
    {
        "tag": true,
        "type": "select",
        "field": "layout",
        "label": "整体布局",
        "value": "",
        "options": [],
        "valueConfig": null
    },
    {
        "tag": true,
        "type": "multiple",
        "field": "moduleLibrary",
        "label": "标准化功能模块",
        "value": [],
        "options": [],
        "valueConfig": null
    },
    {
        "tag": true,
        "type": "select",
        "field": "custom",
        "label": "自定义参数",
        "value": [],
        "options": [],
        "valueConfig": null
    }
]
</script>
