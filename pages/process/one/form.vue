<template>
  <div class="h-full w-full flex flex-col">
    <div class="flex-shrink-0 flex items-center h-[56px] px-[14px] border-b border-[#e4ecfd]">
      <span class="text-[16px] text-[#333] ml-[8px]">地址决策</span>
    </div>
    <div class="flex-1 flex flex-col px-[14px] py-[14px]">
      <el-form ref="ProjectFormRef" :model="projectForm" label-width="100px" class="w-full">
        <el-form-item label="地形条件">
          <ez-select
            v-model="projectForm.terrain"
            placeholder="请选择地形条件"
            multiple
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(Terrain)"
          />
        </el-form-item>
        <el-form-item label="气候类型">
          <ez-select
            v-model="projectForm.climateRegion"
            placeholder="请选择气候类型"
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(ClimateRegion)"
          />
        </el-form-item>
        <el-form-item label="交通条件">
          <ez-select
            v-model="projectForm.traffic"
            placeholder="请选择交通条件"
            multiple
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(Transportation)"
          />
        </el-form-item>
        <el-form-item label="基础设施">
          <ez-select
            v-model="projectForm.infrastructure"
            placeholder="请选择基础设施"
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(Condition)"
          />
        </el-form-item>
        <el-form-item label="地质条件">
          <ez-select
            v-model="projectForm.geological"
            placeholder="请选择地质条件"
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(Condition)"
          />
        </el-form-item>
        <el-form-item label="所在国限制">
          <ez-select
            v-model="projectForm.country"
            placeholder="请选择所在国限制"
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(Country)"
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
const { dictMap, getDictMap } = useDict()

const customOptions = []

const projectForm = ref({
  /** 地形条件 */
  terrain: [],
  /** 气候类型 */
  climateRegion: '',
  /** 交通条件 */
  traffic: [],
  /** 基础设施 */
  infrastructure: '',
  /** 地质条件 */
  geological: '',
  /** 所在国限制 */
  country: '',
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
    params.terrain = params.terrain.join(',')
    params.traffic = params.traffic.join(',')
    params.custom = params.custom.join(',')
    await updateProjectSiteParams({
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
    params.terrain = params.terrain.join(',')
    params.traffic = params.traffic.join(',')
    params.custom = params.custom.join(',')
    await generateProjectSitePlan({
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
    const { data } = await getProjectSiteDetail({
      projectId: projectId.value
    })
    projectForm.value.terrain = (data.params?.terrain || '').split(',').filter(Boolean)
    projectForm.value.climateRegion = data.params?.climateRegion || ''
    projectForm.value.traffic = (data.params?.traffic || '').split(',').filter(Boolean)
    projectForm.value.infrastructure = data.params?.infrastructure || ''
    projectForm.value.geological = data.params?.geological || ''
    projectForm.value.country = data.params?.country || ''
    projectForm.value.custom = (data.params?.custom || '').split(',').filter(Boolean)
    console.log('获取地址决策详情', data)
    initProjectForm.value = JSON.parse(JSON.stringify(projectForm.value))
  } catch (error) {
    console.error('获取地址决策详情失败', error)
  } finally {
    pageLoading.value = false
  }
}

onMounted(() => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
    fetchDetail()
  }
  getDictMap([Terrain, ClimateRegion, Transportation, Condition, Country])
})
</script>
<style lang="less" scoped></style>
