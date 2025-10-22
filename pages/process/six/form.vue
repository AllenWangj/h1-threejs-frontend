<template>
  <div v-loading="pageLoading" class="h-full w-full flex flex-col border border-[1px] border-[#adcdf7] overflow-y-auto">
    <div class="flex-shrink-0 flex items-center h-[56px] px-[14px] border-b border-[#e4ecfd]">
      <span class="text-[16px] text-[#333] ml-[8px]">运输保障</span>
    </div>
    <div class="flex-1 flex flex-col px-[14px] py-[14px]">
       <p>
        <el-checkbox @change="handleAllChangeEvt" v-model="all" label="全部" size="large" />
      </p>
      <div style="padding: 10px;">
        <el-collapse>

          <el-collapse-item name="2">
            <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="transportation" label="建筑布局" size="small" />
              </div>
            </template>
            <div style="padding: 5px;">
              <el-radio-group v-model="transportationRadio" class="radio-block">
                <el-radio style="display: block;" :value="item.value" v-for="
(item) in transportationList" :key="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>

          <el-collapse-item name="3">
            <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="loadingCapacity" label="结构方案" size="small" />
              </div>
            </template>
            <div style="padding: 5px;">
              <el-radio-group v-model="loadingCapacityRadio" class="radio-block">
                <el-radio style="display: block;" :value="item.value" v-for="
(item) in loadingCapacityList" :key="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>


          <!-- <el-collapse-item name="4">
            <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="shippingTime" label="构部件位置" size="small" />
              </div>
            </template>
            <div style="padding: 5px;">
              <el-radio-group v-model="shippingTimeRadio" class="radio-block">
                <el-radio style="display: block;" :value="item.value" v-for="
(item) in shippingTimeList" :key="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item> -->

          <el-collapse-item name="1">
                <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="shippingTime" label="构部件规格" size="small" />
              </div>
            </template>
            <el-select v-model="projectForm.shippingTime" placeholder="请选择构部件规格" multiple :clearable="true"
              style="width: 100%" >
               <el-option v-for="(item) in shippingTimeList" :key="item.value" :value="item.value" :label="item.label">
                  <span style="width:120px;display: inline-block
                  ;">{{ item.label }}</span>
              <el-input size="small" @click.stop style="width:100px;margin-left: 10px;" placeholder="请输入" v-model="item.number"></el-input>
              </el-option> 
            </el-select>
          </el-collapse-item> 
        </el-collapse>
      </div>
      <p style="padding: 5px;">自定义参数</p>
      <ez-select v-model="projectForm.custom" placeholder="请选择自定义参数" multiple filterable allow-create
        default-first-option :clearable="true" style="width: 100%" :options="customOptions" />
      <!-- <el-form ref="ProjectFormRef" :model="projectForm" label-width="100px" class="w-full">
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
      </el-form> -->
      <div class="flex items-center justify-center mt-[14px] sticky bottom-0 h-[44px]">
        <el-button type="primary" :disabled="saveLoading" plain @click="handleReset">重置</el-button>
        <el-button type="primary" :loading="saveLoading" @click="handleSave">保存</el-button>
        <el-button type="primary" :disabled="saveLoading" @click="handleGenerateSolution">生成方案</el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getPackingDetail, updatePackingParams, generatePackingPlan,packingDetail } from '@/apis/project'

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



const handleGenerateSolution = async () => {
  try {
    saveLoading.value = true
    const params = JSON.parse(JSON.stringify(projectForm.value))
    params.shippingTime = params.shippingTime.join(',')
    params.custom = params.custom.join(',')
    await generatePackingPlan({
      projectId: projectId.value,
      type:6
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

onMounted(async () => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
    fetchDetail()
  }
await  getDictMap([Transportation, LoadingCapacity, Time])
transportationList.value = dictMap.value.get(Transportation)
loadingCapacityList.value = dictMap.value.get(LoadingCapacity)
shippingTimeList.value = dictMap.value.get(Time)
  packingDetail({
    projectId: projectId.value
  }).then(res=>{
     const { data: {
      params
    } } = res
    if(!params || params.length ==0) {
      return
    }
  const transportationFieldRes = params.find(ele => ele.field === transportationField)
   if (transportationFieldRes) {
      transportation.value = true
      transportationRadio.value = transportationFieldRes.value
    } else {
      transportation.value = false
      transportationRadio.value = ""
    }
     const loadingCapacityFieldRes = params.find(ele => ele.field === loadingCapacityField)
   if (loadingCapacityFieldRes) {
      loadingCapacity.value = true
      loadingCapacityRadio.value = loadingCapacityFieldRes.value
    } else {
      loadingCapacity.value = false
      loadingCapacityRadio.value = ""
    }

    
  
   const shippingTimeFieldRes = params.find(ele => ele.field === shippingTimeField)
   if (shippingTimeFieldRes) {
      shippingTime.value = true
      if(shippingTimeFieldRes.value) {
        projectForm.value.shippingTime = shippingTimeFieldRes.value.split(",")
        const valueConfig = shippingTimeFieldRes.valueConfig || []
        shippingTimeList.value = shippingTimeList.value.map(ele=>{
          const result = valueConfig.find(e =>ele.value ===e.field)
          return {
            ...ele,
            number:result?.value
          }
        })

      }else {
        projectForm.value.shippingTime = [] 
          shippingTimeList.value = shippingTimeList.value.map(ele=>{
          return {
            ...ele,
            number:""
          }
        })
      }
    } else {
      shippingTime.value = false
      shippingTimeRadio.value = ""
    }

      const customFieldRes = params.find(ele => ele.field === customField)
       if (customFieldRes) {
      const value = customFieldRes.value.split(",")
      projectForm.value.custom = value
    }
  
  
  })
})
const customField = "custom"

const transportationField = "transportation" //运转方式
const transportation = ref(true)
const transportationRadio = ref("")
const transportationList = ref<any[]>([])

const loadingCapacityField = "loadingCapacity" //装载量
const loadingCapacity = ref(true)
const loadingCapacityRadio = ref("")
const loadingCapacityList = ref<any[]>([])


const shippingTimeField = "shippingTime" //构部件位置
const shippingTime = ref(true)
const shippingTimeRadio = ref("")
const shippingTimeList = ref<any[]>([{
  label: '默认',
  value: '0'
}])

const all = ref(true)
watch(() => [
  transportation.value,
  loadingCapacity.value,
  shippingTime.value,
], (newValue) => {
  const result = newValue.every(ele => ele)
  all.value = result
})
function handleAllChangeEvt() {
  transportation.value = true
  loadingCapacity.value = true
  shippingTime.value = true
}
const handleSave = async () => {
  try {
    saveLoading.value = true
     const params =[]
    
       if (transportation.value) {
      params.push({
        "field": transportationField,
        "type": "radio",
        "value": transportationRadio.value,
        "valueConfig": null
      })
    }

     if (loadingCapacity.value) {
      params.push({
        "field": loadingCapacityField,
        "type": "radio",
        "value": loadingCapacityRadio.value,
        "valueConfig": null
      })
    }

    if (shippingTime.value) {
      if(projectForm.value.shippingTime.length > 0){
        params.push({
        "field": shippingTimeField,
        "type": "select",
        "value": projectForm.value.shippingTime.join(","),
        "valueConfig": projectForm.value.shippingTime.map((ele,index)=>{
          // debugger
          const find = shippingTimeList.value.find(e=>e.value ===ele) 
          return {
              "field": ele,
              "type": "input",
              "value": find.number,
              "valueConfig": null
          }
        })
      })
      }
    }
     if (projectForm.value.custom.length > 0) {
      params.push({
        "field": customField,
        "type": "radio",
        "value": projectForm.value.custom.join(","),
        "valueConfig": null
      })
    }
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
