<template>
  <div v-loading="pageLoading" element-loading-background="rgba(0,0,0,0.5)" class="form-page-container">
    <div class="w-[100%] h-[100%] flex flex-col bg-[#022E67] rounded-[16px]">
      <div class="form-page-header">
        <span class="text-[16px] text-[#3689F7] ml-[8px]">地址决策</span>
      </div>

      <div class="form-page-body">
        <div class="flex-grow-[1]">
          <File :source="1" />
        </div>

        <div class="flex-grow-[3] flex flex-col">
          <div class="px-[14px] py-[14px]">
            <el-form
              ref="ProjectFormRef"
              :model="formData"
              size="large"
              label-position="top"
              label-width="120px"
              class="w-full"
            >
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
                      <pre v-if="item.value" class="text-[#69AAEE] text-[16px]">{{ item.value }}</pre>
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
                        <div class="text-[#69AAEE] text-[16px] min-w-[60px] text-right mr-[15px]">
                          {{ getArrayLabel(options.field, item.options) }}
                        </div>
                        <el-input v-model="options.value" oninput="value=value.replace(/[^\d]/g,'')" class="w-[200px]">
                          <template #append>{{ options.unit }}</template>
                        </el-input>
                        <!-- 可以输入数字和小数点得正则 -->
                        <el-input
                          v-if="options.unit2"
                          v-model="options.value2"
                          oninput="value=value.replace(/[^\d.]/g,'')"
                          class="w-[200px] ml-[10px]"
                        >
                          <template #append>{{ options.unit2 }}</template>
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
import { getProjectSiteDetail, updateProjectSiteParams, generateProjectSitePlan } from '@/apis/project'

const route = useRoute()

const projectId = ref('')

const saveLoading = ref(false)

const pageLoading = ref(false)

const Terrain = 'terrain' // 地形条件
const ClimateRegion = 'climate_region' // 气候类型
const Transportation = 'transportation' // 交通条件
const Condition = 'condition' // 基础设施
const Country = 'yes_no' // yes_no
const { dictMap, getDictMap, getArrayLabel } = useDict()

const customOptions = []

// 默认选项
const defaultOptions = [{ label: '默认', value: '0' }]

// label映射
const LABLE_MAP = {
  terrain: '地形条件',
  climateRegion: '气候类型',
  traffic: '交通条件',
  infrastructure: '基础设施',
  geological: '地质条件',
  country: '所在国限制',
  custom: '自定义参数'
}
// 字典映射
const DICT_MAP = computed(() => {
  return {
    terrain: [...defaultOptions, ...(dictMap.value.get(Terrain) || [])],
    climateRegion: [...defaultOptions, ...(dictMap.value.get(ClimateRegion) || [])],
    traffic: [...defaultOptions, ...(dictMap.value.get(Transportation) || [])],
    infrastructure: [...defaultOptions, ...(dictMap.value.get(Condition) || [])],
    geological: [...defaultOptions, ...(dictMap.value.get(Condition) || [])],
    country: [...defaultOptions, ...(dictMap.value.get(Country) || [])],
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
    await updateProjectSiteParams({
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
    await generateProjectSitePlan({
      projectId: projectId.value,
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
    const { data } = await getProjectSiteDetail({
      projectId: projectId.value
    })
    console.log('获取地址决策详情', data)
    data.params = (data.params ? data.params : []).length ? data.params : defData
    formData.value.projectForm = (data.params || defData).map((item) => {
      item.label = LABLE_MAP[item.field] || item.field
      item.options = DICT_MAP.value[item.field] || []
      // item.type = 'select'
      // if (item.field === 'terrain') {
      //   item.type = 'multiple-dynamic'
      // }
      return item
    })
    initProjectForm.value = JSON.parse(JSON.stringify(formData.value))
  } catch (error) {
    console.error('获取地址决策详情失败', error)
  } finally {
    pageLoading.value = false
  }
}

onMounted(async () => {
  await getDictMap([Terrain, ClimateRegion, Transportation, Condition, Country])
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
    fetchDetail()
  }
})

const defData = [
  {
    tag: true,
    type: 'multiple-dynamic',
    field: 'terrain',
    label: '地形条件',
    value: [],
    options: [],
    valueConfig: [
      {
        type: 'input',
        unit: 'm',
        field: '1',
        value: '',
        valueConfig: null
      }
    ]
  },
  {
    tag: true,
    type: 'multiple',
    field: 'climateRegion',
    label: '气候类型',
    value: [],
    options: [],
    valueConfig: null
  },
  {
    tag: true,
    type: 'multiple',
    field: 'traffic',
    label: '交通条件',
    value: [],
    options: [],
    valueConfig: null
  },
  {
    tag: true,
    type: 'select',
    field: 'infrastructure',
    label: '基础设施',
    options: [],
    valueConfig: null
  },
  {
    tag: true,
    type: 'select',
    field: 'geological',
    label: '地质条件',
    options: [],
    valueConfig: null
  },
  {
    tag: true,
    type: 'select',
    field: 'country',
    label: '所在国限制',
    options: [],
    valueConfig: null
  },
  {
    tag: true,
    type: '',
    field: 'custom',
    label: '自定义参数',
    value: '',
    options: [],
    valueConfig: null
  }
]
</script>
