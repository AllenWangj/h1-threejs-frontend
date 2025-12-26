<template>
  <div v-loading="pageLoading" element-loading-background="rgba(0,0,0,0.5)" class="form-page-container">
    <div class="w-[100%] h-[100%] flex flex-col bg-[#022E67] rounded-[16px]">
      <div class="form-page-header">
        <span class="text-[16px] text-[#3689F7] ml-[8px]">现场组装</span>
      </div>

      <div class="form-page-body">
        <div class="flex-grow-[1]">
          <File :source="7" />
        </div>

        <div class="flex-grow-[3] flex flex-col">
          <div class="px-[14px] py-[14px]">
            <el-form ref="ProjectFormRef" :model="formData" size="large" label-position="top" label-width="120px" class="w-full">
              <div
                class="w-full px-[14px] py-[10px] mb-[14px] rounded-[4px]"
                v-for="item in formData.projectForm"
                :key="item.field"
              >
                <el-form-item label="">
                  <template #label>
                    <div class="flex items-center">
                      <el-checkbox size="large" v-model="item.tag" class="checkbox-class">{{ item.label }}</el-checkbox>
                      <template v-if="item.field === 'custom'">
                        <el-upload
                          class="ml-[20px]"
                          accept=".json"
                          :auto-upload="false"
                          :show-file-list="false"
                          :on-change="(e) => handleFileChange(e, item)"
                        >
                          <el-button type="primary">选择 JSON 文件</el-button>
                        </el-upload>
                      </template>
                    </div>
                  </template>
                  <template v-if="item.field === 'custom'">
                    <!-- 显示JSON字符串，并按格式换行缩进 -->
                    <div class="w-[100%]">
                      <pre v-if="item.value"  class="text-[#69AAEE] text-[16px]">{{ item.value }}</pre>
                    </div>
                  </template>
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
                        <div class="text-[#666] text-[14px] min-w-[80px] text-right mr-[15px]">
                          {{ getArrayLabel(options.field, item.options) }}
                        </div>
                        <el-input v-model="options.value" @input="handleInputFilter(options, $event)" class="w-[200px]">
                          <template #append>{{ options.unit }}</template>
                        </el-input>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="item.type === 'select-dynamic'" class="w-full">
                    <ez-select
                      v-model="item.value"
                      placeholder="请选择"
                      :clearable="true"
                      style="width: 100%"
                      :options="item.options"
                    />
                    <div v-for="(options, index) in item.valueConfig" :key="options.field">
                      <div v-if="item.value === options.field" class="flex items-center mt-[8px]">
                        <div class="text-[#69AAEE] text-[16px] min-w-[60px] text-right mr-[15px]">
                          {{ getArrayLabel(options.field, item.options) }}
                        </div>
                        <el-input v-model="options.value" @input="handleInputFilter(options, $event)" class="w-[200px]">
                          <template #append>{{ options.unit }}</template>
                        </el-input>
                      </div>
                    </div>
                  </div>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>

    <div class="form-page-foooter">
      <el-button class="def-plain-button" size="large" :disabled="saveLoading" @click="handleReset">重置</el-button>
      <el-button class="def-plain-button" size="large" :loading="saveLoading" @click="handleSave">保存</el-button>
      <el-button class="def-primary-button" size="large" :disabled="saveLoading" @click="handleGenerateSolution">
        生成方案
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import File from '~/pages/process/components/file.vue'
import { updateAssembleParams, generateAssemblePlan, assembleDetail } from '@/apis/project'

const route = useRoute()

const projectId = ref('')

const saveLoading = ref(false)

const pageLoading = ref(false)

const AssembleScale = 'assemble_scale' // 总体规模
const Time = 'time' // 完成时间
const Workers = 'workers' // 工人数量
const Machinery = 'machinery' // 机器数量
const { dictMap, getDictMap, getArrayLabel } = useDict()

const customOptions = []

const defaultOptions = [
  {
    label: '默认',
    value: '0'
  }
]

// label映射
const LABLE_MAP = {
  overallSize: '总体规模',
  completionTime: '完成时间',
  worker: '工人数量',
  machinery: '机械数量',
  custom: '自定义参数'
}
// 字典映射
const DICT_MAP = computed(() => {
  return {
    overallSize: [...defaultOptions, ...(dictMap.value.get(AssembleScale) || [])],
    completionTime: [...defaultOptions, ...(dictMap.value.get(Time) || [])],
    worker: [...defaultOptions, ...(dictMap.value.get(Workers) || [])],
    machinery: [...defaultOptions, ...(dictMap.value.get(Machinery) || [])],
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

// 处理输入限制
const handleInputFilter = (options: any, value: string) => {
  const regex = options.regex || /[^\d]/g
  const filtered = value.replace(regex, '')
  options.value = filtered
}

const handleReset = () => {
  formData.value = JSON.parse(JSON.stringify(initProjectForm.value))
}

const handleSave = async () => {
  try {
    saveLoading.value = true
    const params = JSON.parse(JSON.stringify(formData.value.projectForm))
    await updateAssembleParams({
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
    const params = JSON.parse(JSON.stringify(formData.value.projectForm))
    await generateAssemblePlan({
      projectId: projectId.value,
      source: 7,
      params
    })
    ElMessageBox.alert('方案生成中，请稍后去生成方案中查看', '温馨提示', {
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
    const { data } = await assembleDetail({
      projectId: projectId.value
    })
    console.log('获取现场组装详情', data)
    formData.value.projectForm = defData.map((item) => {
      item.label = LABLE_MAP[item.field] || item.field
      item.options = DICT_MAP.value[item.field] || []
      return item
    })
    initProjectForm.value = JSON.parse(JSON.stringify(formData.value))
  } catch (error) {
    console.error('获取现场组装详情失败', error)
  } finally {
    pageLoading.value = false
  }
}

onMounted(async () => {
  await getDictMap([AssembleScale, Time, Workers, Machinery])
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
    fetchDetail()
  }
})

const defData = [
  {
    tag: true,
    type: 'select-dynamic',
    field: 'overallSize',
    label: '总体规模',
    value: '',
    options: [],
    valueConfig: [
      {
        type: 'input',
        unit: '人',
        field: '1',
        value: '',
        valueConfig: null
      }
    ]
  },
  {
    tag: true,
    type: 'select-dynamic',
    field: 'completionTime',
    label: '完成时间',
    value: '',
    options: [],
    valueConfig: [
      {
        type: 'input',
        unit: '天',
        field: '1',
        value: '',
        regex: /[^\d.]/g,
        valueConfig: null
      },
      {
        type: 'input',
        unit: '小时',
        field: '2',
        value: '',
        regex: /[^\d.]/g,
        valueConfig: null
      }
    ]
  },
  {
    tag: true,
    type: 'select-dynamic',
    field: 'worker',
    label: '工人数量',
    value: '',
    options: [],
    valueConfig: [
      {
        type: 'input',
        unit: '人',
        field: '1',
        value: '',
        valueConfig: null
      }
    ]
  },
  {
    tag: true,
    type: 'select-dynamic',
    field: 'machinery',
    label: '机械数量',
    value: '',
    options: [],
    valueConfig: [
      {
        type: 'input',
        unit: '台',
        field: '1',
        value: '',
        valueConfig: null
      },
      {
        type: 'input',
        unit: '台',
        field: '2',
        value: '',
        valueConfig: null
      }
    ]
  },
  {
    tag: true,
    type: 'select',
    field: 'custom',
    label: '自定义参数',
    value: '',
    options: [],
    valueConfig: null
  }
]
</script>
