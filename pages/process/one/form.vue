<template>
  <div class="h-full w-full flex flex-col overflow-y-auto">
    <div class="flex-shrink-0 flex items-center h-[56px] px-[14px] border-b border-[#e4ecfd]">
      <span class="text-[16px] text-[#333] ml-[8px]">地址决策</span>
    </div>
    <div class="flex-1 flex flex-col px-[14px] py-[14px]">
      <p>
        <el-checkbox @change="handleAllChangeEvt" v-model="all" label="全部" size="large" />
      </p>
      <div style="padding: 10px; overflow: auto">
        <el-collapse>
          <el-collapse-item name="1">
            <template #title>
              <div style="padding: 5px">
                <el-checkbox @click.stop v-model="terrain" label="构部件规格" size="small" />
              </div>
            </template>
            <el-select
              v-model="projectForm.terrain"
              placeholder="请选择构部件规格"
              multiple
              :clearable="true"
              style="width: 100%"
            >
              <el-option v-for="item in terrainList" :key="item.value" :value="item.value" :label="item.label">
                <span style="width: 120px; display: inline-block">{{ item.label }}</span>
                <el-input
                  size="small"
                  @click.stop
                  style="width: 100px; margin-left: 10px"
                  placeholder="请输入"
                  v-model="item.number"
                ></el-input>
              </el-option>
            </el-select>
          </el-collapse-item>
          <!-- <el-collapse-item name="2">
            <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="terrain" label="地形条件" size="small" />
              </div>
            </template>
            <div style="padding: 5px;">
              <el-radio-group v-model="terrainRadio" class="radio-block">
                <el-radio style="display: block;" :value="item.value" v-for="
(item) in terrainList" :key="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item> -->

          <el-collapse-item name="3">
            <template #title>
              <div style="padding: 5px">
                <el-checkbox @click.stop v-model="climateRegion" label="气候类型" size="small" />
              </div>
            </template>
            <div style="padding: 5px">
              <el-radio-group v-model="climateRegionRadio" class="radio-block">
                <el-radio
                  style="display: block"
                  :value="item.value"
                  v-for="item in climateRegionList"
                  :key="item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>

          <el-collapse-item name="4">
            <template #title>
              <div style="padding: 5px">
                <el-checkbox @click.stop v-model="traffic" label="交通条件" size="small" />
              </div>
            </template>
            <div style="padding: 5px">
              <el-radio-group v-model="trafficRadio" class="radio-block">
                <el-radio style="display: block" :value="item.value" v-for="item in trafficList" :key="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>

          <el-collapse-item name="5">
            <template #title>
              <div style="padding: 5px">
                <el-checkbox @click.stop v-model="infrastructure" label="基础设施" size="small" />
              </div>
            </template>
            <div style="padding: 5px">
              <el-radio-group v-model="infrastructureRadio" class="radio-block">
                <el-radio
                  style="display: block"
                  :value="item.value"
                  v-for="item in infrastructureList"
                  :key="item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>

          <el-collapse-item name="6">
            <template #title>
              <div style="padding: 5px">
                <el-checkbox @click.stop v-model="geological" label="地质条件" size="small" />
              </div>
            </template>
            <div style="padding: 5px">
              <el-radio-group v-model="geologicalRadio" class="radio-block">
                <el-radio style="display: block" :value="item.value" v-for="item in geologicalList" :key="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>
          <el-collapse-item name="7">
            <template #title>
              <div style="padding: 5px">
                <el-checkbox @click.stop v-model="country" label="所在国限制" size="small" />
              </div>
            </template>
            <div style="padding: 5px">
              <el-radio-group v-model="countryRadio" class="radio-block">
                <el-radio style="display: block" :value="item.value" v-for="item in countryList" :key="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <p style="padding: 5px">自定义参数</p>
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
      <!-- <el-form ref="ProjectFormRef" :model="projectForm" label-width="100px" class="w-full">
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
      </el-form> -->
      <div class="flex items-center justify-center mt-[14px] sticky bottom-0 h-[44px]">
        <el-button type="primary" :disabled="saveLoading" plain @click="handleReset">重置</el-button>
        <el-button type="primary" :loading="saveLoading" @click="handleSave">保存</el-button>
        <el-button type="primary" :loading="saveLoading" @click="handleGenerateSolution">生成方案</el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getProjectSiteDetail, updateProjectSiteParams, generateProjectSitePlan, siteDetail } from '@/apis/project'

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
let params = []

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

onMounted(async () => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
    fetchDetail()
  }
  await getDictMap([Terrain, ClimateRegion, Transportation, Condition, Country])
  terrainList.value = dictMap.value.get(Terrain)
  terrainList.value = terrainList.value.map((ele) => {
    return {
      ...ele,
      number: undefined
    }
  })
  climateRegionList.value = dictMap.value.get(ClimateRegion)
  trafficList.value = dictMap.value.get(Transportation)

  // trafficList.value = [{
  //   label: '默认',
  //   value: '0'
  // }]
  infrastructureList.value = dictMap.value.get(Condition)
  geologicalList.value = dictMap.value.get(Condition)
  countryList.value = dictMap.value.get(Country)

  // siteDetail()
  siteDetail({
    projectId: projectId.value
  }).then((res) => {
    const {
      data: { params }
    } = res
    if (!params || params.length == 0) {
      return
    }
    //    const terrainFieldRes = params.find(ele => ele.field === terrainField)
    //  if (terrainFieldRes) {
    //     terrain.value = true
    //     terrainRadio.value = terrainFieldRes.value
    //   } else {
    //     terrain.value = false
    //     terrainRadio.value = ""
    //   }
    const terrainFieldRes = params.find((ele) => ele.field === terrainField)
    if (terrainFieldRes) {
      terrain.value = true
      if (terrainFieldRes.value) {
        projectForm.value.terrain = terrainFieldRes.value.split(',')
        const valueConfig = terrainFieldRes.valueConfig || []
        terrainList.value = terrainList.value.map((ele) => {
          const result = valueConfig.find((e) => ele.value === e.field)
          return {
            ...ele,
            number: result?.value
          }
        })
      } else {
        projectForm.value.terrain = []
        terrainList.value = terrainList.value.map((ele) => {
          return {
            ...ele,
            number: ''
          }
        })
      }
    } else {
      terrain.value = false
      terrainRadio.value = ''
    }

    const climateRegionFieldRes = params.find((ele) => ele.field === climateRegionField)
    if (climateRegionFieldRes) {
      climateRegion.value = true
      climateRegionRadio.value = climateRegionFieldRes.value
    } else {
      climateRegion.value = false
      climateRegionRadio.value = ''
    }

    const trafficFieldRes = params.find((ele) => ele.field === trafficField)
    if (trafficFieldRes) {
      traffic.value = true
      trafficRadio.value = trafficFieldRes.value
    } else {
      traffic.value = false
      trafficRadio.value = ''
    }

    const infrastructureFieldRes = params.find((ele) => ele.field === infrastructureField)
    if (infrastructureFieldRes) {
      infrastructure.value = true
      infrastructureRadio.value = infrastructureFieldRes.value
    } else {
      infrastructure.value = false
      infrastructureRadio.value = ''
    }

    const geologicalFieldRes = params.find((ele) => ele.field === geologicalField)
    if (geologicalFieldRes) {
      geological.value = true
      geologicalRadio.value = geologicalFieldRes.value
    } else {
      geological.value = false
      geologicalRadio.value = ''
    }

    const countryFieldRes = params.find((ele) => ele.field === countryField)
    if (countryFieldRes) {
      country.value = true
      countryRadio.value = countryFieldRes.value
    } else {
      country.value = false
      countryRadio.value = ''
    }
    const customFieldRes = params.find((ele) => ele.field === customField)
    if (customFieldRes) {
      const value = customFieldRes.value.split(',')
      projectForm.value.custom = value
    }
  })
})
const customField = 'custom'

const terrainField = 'terrain' //地形条件
const terrain = ref(true)
const terrainRadio = ref('')
const terrainList = ref<any[]>([])

const climateRegionField = 'climateRegion' //气候类型
const climateRegion = ref(true)
const climateRegionRadio = ref('')
const climateRegionList = ref<any[]>([])

const trafficField = 'traffic' //交通条件
const traffic = ref(true)
const trafficRadio = ref('')
const trafficList = ref<any[]>([
  {
    label: '默认',
    value: '0'
  }
])

const infrastructureField = 'infrastructure' //基础设施
const infrastructure = ref(true)
const infrastructureRadio = ref('')
const infrastructureList = ref<any[]>([
  {
    label: '默认',
    value: '0'
  }
])

const geologicalField = 'geological' //地质条件
const geological = ref(true)
const geologicalRadio = ref('')
const geologicalList = ref<any[]>([
  {
    label: '默认',
    value: '0'
  }
])

const countryField = 'country' //所在国限制
const country = ref(true)
const countryRadio = ref('')
const countryList = ref<any[]>([
  {
    label: '默认',
    value: '0'
  }
])
const all = ref(true)
watch(
  () => [terrain.value, climateRegion.value, traffic.value, infrastructure.value, geological.value, country.value],
  (newValue) => {
    const result = newValue.every((ele) => ele)
    all.value = result
  }
)
function handleAllChangeEvt() {
  terrain.value = true
  climateRegion.value = true
  traffic.value = true
  infrastructure.value = true
  geological.value = true
  country.value = true
}
const handleSave = async () => {
  try {
    saveLoading.value = true
    const params = []
    // const params = JSON.parse(JSON.stringify(projectForm.value))
    // params.terrain = params.terrain.join(',')
    // params.traffic = params.traffic.join(',')
    // params.custom = params.custom.join(',')
    if (terrain.value) {
      if (projectForm.value.terrain.length > 0) {
        params.push({
          field: terrainField,
          type: 'select',
          value: projectForm.value.terrain.join(','),
          valueConfig: projectForm.value.terrain.map((ele, index) => {
            // debugger
            const find = terrainList.value.find((e) => e.value === ele)
            return {
              field: ele,
              type: 'input',
              value: find.number,
              valueConfig: null
            }
          })
        })
      }
    }

    if (climateRegion.value) {
      params.push({
        field: climateRegionField,
        type: 'radio',
        value: climateRegionRadio.value,
        valueConfig: null
      })
    }

    if (traffic.value) {
      params.push({
        field: trafficField,
        type: 'radio',
        value: trafficRadio.value,
        valueConfig: null
      })
    }
    if (infrastructure.value) {
      params.push({
        field: infrastructureField,
        type: 'radio',
        value: infrastructureRadio.value,
        valueConfig: null
      })
    }

    if (geological.value) {
      params.push({
        field: geologicalField,
        type: 'radio',
        value: geologicalRadio.value,
        valueConfig: null
      })
    }

    if (country.value) {
      params.push({
        field: countryField,
        type: 'radio',
        value: countryRadio.value,
        valueConfig: null
      })
    }

    if (projectForm.value.custom.length > 0) {
      params.push({
        field: customField,
        type: 'radio',
        value: projectForm.value.custom.join(','),
        valueConfig: null
      })
    }
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
</script>
<style lang="less" scoped></style>
<style>
.radio-block {
  display: flex !important;
  flex-wrap: wrap !important;
  font-size: 0 !important;
  flex-direction: column !important;
  justify-content: flex-start !important;
  align-items: start !important;
  flex-direction: column;
}
</style>
