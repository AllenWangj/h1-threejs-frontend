<template>
  <div v-loading="pageLoading" class="h-full w-full flex flex-col border border-[1px] border-[#adcdf7]">
    <div class="flex-shrink-0 flex items-center h-[56px] px-[14px] border-b border-[#e4ecfd]">
      <span class="text-[16px] text-[#333] ml-[8px]">结构设计</span>
    </div>
    <div class="flex-1 flex flex-col px-[14px] py-[14px]">
        <p>
        <el-checkbox @change="handleAllChangeEvt" v-model="all" label="全部" size="large" />
      </p>
      <div style="padding: 10px;">
        <el-collapse>
          <el-collapse-item name="1">
            <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="functional" label="建筑功能" size="small" />
              </div>
            </template>
            <div style="padding: 5px;">
              <el-radio-group v-model="functionalRadio" class="radio-block">
                <el-radio style="display: block;" :value="item.value" v-for="
(item) in functionalList" :key="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>

          <el-collapse-item name="2">
            <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="boundary" label="建筑边界" size="small" />
              </div>
            </template>
            <div style="padding: 5px;">
              <el-radio-group v-model="boundaryRadio" class="radio-block">
                <el-radio style="display: block;" :value="item.value" v-for="
(item) in boundaryList" :key="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>

          <el-collapse-item name="3">
            <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="scale" label="建筑规模" size="small" />
              </div>
            </template>
            <div style="padding: 5px;">
              <el-radio-group v-model="scaleRadio" class="radio-block">
                <el-radio style="display: block;" :value="item.value" v-for="
(item) in scaleList" :key="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>


          <el-collapse-item name="4">
            <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="layout" label="整体布局" size="small" />
              </div>
            </template>
            <div style="padding: 5px;">
              <el-radio-group v-model="layoutRadio" class="radio-block">
                <el-radio style="display: block;" :value="item.value" v-for="
(item) in layoutList" :key="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>
          <el-collapse-item name="5">
            <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="moduleLibrary" label="标准化功能模块" size="small" />
              </div>
            </template>
            <div style="padding: 5px;">
              <el-radio-group v-model="moduleLibraryRadio" class="radio-block">
                <el-radio style="display: block;" :value="item.value" v-for="
(item) in moduleLibraryList" :key="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <p style="padding: 5px;">自定义参数</p>
      <ez-select v-model="projectForm.custom" placeholder="请选择自定义参数" multiple filterable allow-create
        default-first-option :clearable="true" style="width: 100%" :options="customOptions" />
      <!-- <el-form ref="ProjectFormRef" :model="projectForm" label-width="120px" class="w-full">
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
      </el-form> -->
      <div class="flex items-center justify-center mt-[14px]">
        <el-button type="primary" :disabled="saveLoading" plain @click="handleReset">重置</el-button>
        <el-button type="primary" :loading="saveLoading" @click="handleSave">保存</el-button>
        <el-button type="primary" :loading="saveLoading" @click="handleGenerateSolution">生成方案</el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getInternalLayoutDetail, updateInternalLayoutParams, generateInternalLayoutPlan,internalLayoutDetail,internalLayout } from '@/apis/project'
import {watch} from "vue"
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
    // const params = JSON.parse(JSON.stringify(projectForm.value))
    // params.functional = params.functional.join(',')
    // params.boundary = params.boundary.join(',')
    // params.scale = params.scale.join(',')
    // params.layout = params.layout.join(',')
    // params.moduleLibrary = params.moduleLibrary.join(',')
    // params.custom = params.custom.join(',')
    // await updateInternalLayoutParams({
    //   projectId: projectId.value,
    //   params
    // })
     const params = []
     if (functional.value) {
      params.push({
        "field": functionalField,
        "type": "radio",
        "value": functionalRadio.value,
        "valueConfig": null
      })
    }

      if (boundary.value) {
      params.push({
        "field": boundaryField,
        "type": "radio",
        "value": boundaryRadio.value,
        "valueConfig": null
      })
    }

    if (scale.value) {
      params.push({
        "field": scaleField,
        "type": "radio",
        "value": scaleRadio.value,
        "valueConfig": null
      })
    }

     if (layout.value) {
      params.push({
        "field": layoutField,
        "type": "radio",
        "value": layoutRadio.value,
        "valueConfig": null
      })
    }

     if (moduleLibrary.value) {
      params.push({
        "field": moduleLibraryField,
        "type": "radio",
        "value": moduleLibraryRadio.value,
        "valueConfig": null
      })
    }

 if (projectForm.value.custom.length > 0) {
      params.push({
        "field": customField,
        "type": "radio",
        "value": projectForm.value.custom.join(","),
        "valueConfig": null
      })
    }
    await internalLayout({
      params,
      projectId: projectId.value
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
      type:3
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

onMounted(async () => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
    fetchDetail()
  }
await getDictMap([BuildingFunctional, BuildingBoundary, BuildingScale, ModuleLibrary])
functionalList.value = dictMap.value.get(BuildingFunctional)
boundaryList.value = dictMap.value.get(BuildingBoundary)
scaleList.value = dictMap.value.get(BuildingScale)
moduleLibraryList.value = dictMap.value.get(ModuleLibrary)
  internalLayoutDetail({
    projectId: projectId.value
  }).then(res=>{
    const { data: {
      params
    } } = res
     const functionalFieldRes = params.find(ele => ele.field === functionalField)
    if (functionalFieldRes) {
      functional.value = true
      functionalRadio.value = functionalFieldRes.value
    } else {
      functional.value = false
      functionalRadio.value = ""
    }

     const boundaryFieldRes = params.find(ele => ele.field === boundaryField)
    if (boundaryFieldRes) {
      boundary.value = true
      boundaryRadio.value = boundaryFieldRes.value
    } else {
      boundary.value = false
      boundaryRadio.value = ""
    }


     const scaleFielddRes = params.find(ele => ele.field === scaleField)
    if (scaleFielddRes) {
      scale.value = true
      scaleRadio.value = scaleFielddRes.value
    } else {
      scale.value = false
      scaleRadio.value = ""
    }

      const layoutFieldRes = params.find(ele => ele.field === layoutField)      
    if (layoutFieldRes) {
      layout.value = true
      layoutRadio.value = layoutFieldRes.value
    } else {
      layout.value = false
      layoutRadio.value = ""
    }

       const moduleLibraryFieldRes = params.find(ele => ele.field === moduleLibraryField)
    if (moduleLibraryFieldRes) {
      moduleLibrary.value = true
      moduleLibraryRadio.value = moduleLibraryFieldRes.value
    } else {
      moduleLibrary.value = false
      moduleLibraryRadio.value = ""
    }

     const customFieldRes = params.find(ele => ele.field === customField)
    if (customFieldRes) {
      const value = customFieldRes.value.split(",")
      projectForm.value.custom = value
    } 
  })
})


const all = ref(true)
const functionalField = "functional"
const boundaryField = "boundary"
const scaleField = "scale"
const layoutField = "layout"
const moduleLibraryField = "moduleLibrary"
const customField = "custom"


const functional = ref(true)
const functionalRadio = ref("")
const functionalList = ref<any[]>([])


const boundary = ref(true)
const boundaryRadio = ref("")
const boundaryList = ref<any[]>([])

const scale = ref(true)
const scaleRadio = ref("")
const scaleList = ref<any[]>([])

const layout = ref(true)
const layoutRadio = ref("")
const layoutList = ref<any[]>([{
  label: '默认',
  value: '0'
}])

const moduleLibrary = ref(true)
const moduleLibraryRadio = ref("")
const moduleLibraryList = ref<any[]>([])

watch(() => [
  functional.value,
  boundary.value,
  scale.value,
  layout.value,
  moduleLibrary.value,
], (newValue) => {
  const result = newValue.every(ele => ele)
  all.value = result
})
function handleAllChangeEvt() {
  functional.value=true
  boundary.value=true
  scale.value=true
  layout.value=true
  moduleLibrary.value=true
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
