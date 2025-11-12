<template>
  <div v-loading="pageLoading" class="h-full w-full flex flex-col border border-[1px] border-[#adcdf7]">
    <div class="flex-shrink-0 flex items-center h-[56px] px-[14px] border-b border-[#e4ecfd]">
      <span class="text-[16px] text-[#333] ml-[8px]">部件生产</span>
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
                    <template v-if="item.field === 'custom'">
                      <el-upload class="ml-[20px]" accept=".json" :auto-upload="false" :show-file-list="false"
                        :on-change="(e) => handleFileChange(e, item)">
                        <el-button type="primary">选择 JSON 文件</el-button>
                      </el-upload>
                    </template>
                  </div>
                </template>
                <template v-if="item.field === 'custom'">
                  <!-- 显示JSON字符串，并按格式换行缩进 -->
                  <div class="w-[100%]">
                    <pre v-if="item.value" class="text-[#333] text-[12px]">{{ item.value }}</pre>
                  </div>
                </template>
                <ez-select v-else-if="item.type === 'select'" v-model="item.value" placeholder="请选择" :clearable="true"
                  style="width: 100%" :options="item.options" />
                <ez-select v-else-if="item.type === 'multiple'" v-model="item.value" placeholder="请选择" :clearable="true"
                  multiple style="width: 100%" :options="item.options" />
                <div v-else-if="item.type === 'multiple-dynamic'" class="w-full">
                  <ez-select v-model="item.value" placeholder="请选择" :clearable="true" multiple style="width: 100%"
                    :options="item.options" />
                  <div v-for="(options, index) in item.valueConfig" :key="options.field">
                    <div v-if="item.value.includes(options.field)" class="flex items-center mt-[8px]">
                      <div class="text-[#666] text-[14px] min-w-[120px] text-right mr-[15px]">
                        {{ getArrayLabel(options.field, item.options) }}
                      </div>
                      <el-input v-model="options.value" oninput="value=value.replace(/[^\d]/g,'')" class="w-[200px]">
                        <template #append>{{ options.unit }}</template>
                      </el-input>
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
    </div>
  </div>
</template>
<script setup lang="ts">
import File from './file.vue'
import {
  updatePartsProductionParams,
  generatePartsProductionPlan,
  partsProductionDetail
} from '@/apis/project'

const route = useRoute()

const projectId = ref('')

const saveLoading = ref(false)

const pageLoading = ref(false)

const BuildingFunctional = 'building_functional' // 建筑功能
const StructuralPlan = 'structural_plan' // 结构方案
const ComponentSpecifications = 'component_pecifications' // 构件规格
const { dictMap, getDictMap, getArrayLabel } = useDict()
const componentLocationOptions = [
  {
    label: '默认',
    value: '0'
  }
]
const customOptions = []

const defaultOptions = [
  {
    label: '默认',
    value: '0'
  }
]

// label映射
const LABLE_MAP = {
  layout: '建筑布局',
  structuralPlan: '结构方案',
  componentLocation: '构部件位置',
  componentSpecifications: '构部件规格',
  custom: '自定义参数'
}
// 字典映射
const DICT_MAP = computed(() => {
  return {
    layout: [...defaultOptions, ...(dictMap.value.get(BuildingFunctional) || [])],
    structuralPlan: [...defaultOptions, ...(dictMap.value.get(StructuralPlan) || [])],
    componentLocation: componentLocationOptions || [],
    componentSpecifications: [...defaultOptions, ...(dictMap.value.get(ComponentSpecifications) || [])],
    custom: customOptions || []
  }
})
// 表单数据
const formData = ref({
  projectForm: []
})
const initProjectForm = ref({})

// 处理文件选择
const handleFileChange = (file: any, item: any) => {
  const rawFile = file.raw
  if (!rawFile) return

  // 判断文件类型
  if (!rawFile.name.endsWith('.json')) {
    ElMessage.error('请选择 JSON 文件')
    return
  }

  // 使用 FileReader 读取文件内容
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const result = e.target?.result as string
      item.value = result
      ElMessage.success('JSON 文件读取成功！')
    } catch (err) {
      console.error(err)
      ElMessage.error('JSON 解析失败，请检查文件内容')
    }
  }
  reader.readAsText(rawFile)
}

const handleReset = () => {
  formData.value = JSON.parse(JSON.stringify(initProjectForm.value))
}

const handleSave = async () => {
  try {
    saveLoading.value = true
    const params = JSON.parse(JSON.stringify(formData.value.projectForm))
    await updatePartsProductionParams({
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
    await generatePartsProductionPlan({
      projectId: projectId.value,
      type: 5
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
    const { data } = await partsProductionDetail({
      projectId: projectId.value
    })
    console.log('获取部件生产详情', data)
    formData.value.projectForm = (data.params || defData).map((item) => {
      item.label = LABLE_MAP[item.field] || item.field
      item.options = DICT_MAP.value[item.field] || []
      return item
    })
    initProjectForm.value = JSON.parse(JSON.stringify(formData.value))
  } catch (error) {
    console.error('获取部件生产详情失败', error)
  } finally {
    pageLoading.value = false
  }
}

onMounted(async () => {
  await getDictMap([BuildingFunctional, StructuralPlan, ComponentSpecifications])
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
    fetchDetail()
  }
})

const defData = [
    {
        "tag": true,
        "type": "select",
        "field": "layout",
        "label": "建筑布局",
        "options": [],
        "valueConfig": null
    },
    {
        "tag": true,
        "type": "select",
        "field": "structuralPlan",
        "label": "结构方案",
        "options": [],
        "valueConfig": null
    },
    {
        "tag": true,
        "type": "select",
        "field": "componentLocation",
        "label": "构部件位置",
        "options": [],
        "valueConfig": null
    },
    {
        "tag": true,
        "type": "multiple-dynamic",
        "field": "componentSpecifications",
        "label": "构部件规格",
        "value": [],
        "options": [],
        "valueConfig": [
            {
                "type": "input",
                "unit": "kg",
                "field": "1",
                "value": ""
            }
        ]
    },
    {
        "tag": true,
        "type": "select",
        "field": "custom",
        "label": "自定义参数",
        "value": '',
        "options": [],
        "valueConfig": null
    }
]
</script>
