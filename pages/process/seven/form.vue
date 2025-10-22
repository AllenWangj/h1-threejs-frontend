<template>
  <div v-loading="pageLoading" class="h-full w-full flex flex-col border border-[1px] border-[#adcdf7] overflow-y-auto">
    <div class="flex-shrink-0 flex items-center h-[56px] px-[14px] border-b border-[#e4ecfd]">
      <span class="text-[16px] text-[#333] ml-[8px]">现场组装</span>
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
                <el-checkbox @click.stop v-model="overallSize" label="总体规模" size="small" />
              </div>
            </template>
            <div style="padding: 5px;">
              <el-radio-group v-model="overallSizeRadio" class="radio-block">
                <el-radio style="display: block;" :value="item.value" v-for="
(item) in overallSizeList" :key="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="completionTime" label="完成时间" size="small" />
              </div>
            </template>
            <el-select v-model="projectForm.completionTime" placeholder="请选择完成时间" multiple :clearable="true"
              style="width: 100%" >
               <el-option v-for="(item) in completionTimeList" :key="item.value" :value="item.value" :label="item.label">
                  <span style="width:80px;display: inline-block
                  ;">{{ item.label }}</span>
              <el-input size="small" @click.stop style="width:100px;margin-left: 10px;" placeholder="请输入" v-model="item.number"></el-input>
              </el-option> 
            </el-select>
          </el-collapse-item>

                <el-collapse-item name="3">
            <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="worker" label="工人数量" size="small" />
              </div>
            </template>
            <el-select v-model="projectForm.worker" placeholder="请选择工人数量" multiple :clearable="true"
              style="width: 100%" >
               <el-option v-for="(item) in workerList" :key="item.value" :value="item.value" :label="item.label">
                  <span style="width:80px;display: inline-block
                  ;">{{ item.label }}</span>
              <el-input size="small" @click.stop style="width:100px;margin-left: 10px;" placeholder="请输入" v-model="item.number"></el-input>
              </el-option> 
            </el-select>
          </el-collapse-item>
            <el-collapse-item name="4">
            <template #title>
              <div style="padding: 5px;">
                <el-checkbox @click.stop v-model="machinery" label="设备数量" size="small" />
              </div>
            </template>
            <el-select v-model="projectForm.machinery" placeholder="请选择设备数量" multiple :clearable="true"
              style="width: 100%" >
               <el-option v-for="(item) in machineryList" :key="item.value" :value="item.value" :label="item.label">
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
        <el-form-item label="总体规模">
          <ez-select
            v-model="projectForm.overallSize"
            placeholder="请选择总体规模"
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(AssembleScale)"
          />
        </el-form-item>
        <el-form-item label="完成时间">
          <ez-select
            v-model="projectForm.completionTime"
            placeholder="请选择完成时间"
            multiple
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(Time)"
          />
        </el-form-item>
        <el-form-item label="工人数量">
          <ez-select
            v-model="projectForm.worker"
            placeholder="请选择工人数量"
            multiple
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(Workers)"
          />
        </el-form-item>
        <el-form-item label="机械数量">
          <ez-select
            v-model="projectForm.machinery"
            placeholder="请选择机械数量"
            multiple
            :clearable="true"
            style="width: 100%"
            :options="dictMap.get(Machinery)"
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
import { getAssembleDetail, updateAssembleParams, generateAssemblePlan,assembleUpdateParams,assembleDetail } from '@/apis/project'
import { watch } from "vue"

const route = useRoute()

const projectId = ref('')

const saveLoading = ref(false)

const pageLoading = ref(false)

const AssembleScale = 'assemble_scale' // 总体规模
const Time = 'time' // 完成时间
const Workers = 'workers' // 工人数量
const Machinery = 'machinery' // 机器数量
const { dictMap, getDictMap } = useDict()

const customOptions = []

const projectForm = ref({
  /** 总体规模 */
  overallSize: '',
  /** 完成时间 */
  completionTime: [],
  /** 工人数量 */
  worker: [],
  /** 机器数量 */
  machinery: [],
  /** 自定义参数 */
  custom: []
})
const initProjectForm = ref({})
const customField = "custom"

const handleReset = () => {
  projectForm.value = JSON.parse(JSON.stringify(initProjectForm.value))
}

const handleSave = async () => {
  try {
    saveLoading.value = true
     const params = []

    if (overallSize.value) {
      params.push({
        "field": overallSizeField,
        "type": "radio",
        "value": overallSizeRadio.value,
        "valueConfig": null
      })
    }


     if (completionTime.value) {
      if(projectForm.value.completionTime.length > 0){
        params.push({
        "field": completionTimeField,
        "type": "select",
        "value": projectForm.value.completionTime.join(","),
        "valueConfig": projectForm.value.completionTime.map((ele,index)=>{
          // debugger
          const find = completionTimeList.value.find(e=>e.value ===ele) 
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

      if (worker.value) {
      if(projectForm.value.worker.length > 0){
        params.push({
        "field": workerField,
        "type": "select",
        "value": projectForm.value.worker.join(","),
        "valueConfig": projectForm.value.worker.map((ele,index)=>{
            const find = workerList.value.find(e=>e.value ===ele) 
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


      if (machinery.value) {
      if(projectForm.value.machinery.length > 0){
        params.push({
        "field": machineryField,
        "type": "select",
        "value": projectForm.value.machinery.join(","),
        "valueConfig": projectForm.value.machinery.map((ele,index)=>{
            const find = machineryList.value.find(e=>e.value ===ele) 
          return {
              "field":ele,
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
        "type": "input",
        "value": projectForm.value.custom.join(","),
        "valueConfig": null
      })
    }
   await assembleUpdateParams({
      params,
      projectId: projectId.value
    })
    // ElMessage.success('保存成功')
    // const params = JSON.parse(JSON.stringify(projectForm.value))
    // params.completionTime = params.completionTime.join(',')
    // params.worker = params.worker.join(',')
    // params.machinery = params.machinery.join(',')
    // params.custom = params.custom.join(',')
    // await updateAssembleParams({
    //   projectId: projectId.value,
    //   params
    // })
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
    params.completionTime = params.completionTime.join(',')
    params.worker = params.worker.join(',')
    params.machinery = params.machinery.join(',')
    params.custom = params.custom.join(',')
    await generateAssemblePlan({
      projectId: projectId.value,
      type:7
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
    const { data } = await getAssembleDetail({
      projectId: projectId.value
    })
    projectForm.value.overallSize = data.params?.overallSize || ''
    projectForm.value.completionTime = (data.params?.completionTime || '').split(',').filter(Boolean)
    projectForm.value.worker = (data.params?.worker || '').split(',').filter(Boolean)
    projectForm.value.machinery = (data.params?.machinery || '').split(',').filter(Boolean)
    projectForm.value.custom = (data.params?.custom || '').split(',').filter(Boolean)
    console.log('获取现场组装详情', data)
    initProjectForm.value = JSON.parse(JSON.stringify(projectForm.value))
  } catch (error) {
    console.error('获取现场组装详情失败', error)
  } finally {
    pageLoading.value = false
  }
}

onMounted(async () => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
    // fetchDetail()
  }
  await getDictMap([AssembleScale, Time, Workers, Machinery])
  overallSizeList.value = dictMap.value.get(AssembleScale)
  completionTimeList.value = dictMap.value.get(Time)
   completionTimeList.value  =  completionTimeList.value .map(ele=>{
    return {
      ...ele,
      number:""
    }
   })


   workerList.value = dictMap.value.get(Workers)
   workerList.value  =  workerList.value .map(ele=>{
    return {
      ...ele,
      number:""
    }
   })
   
machineryList.value = dictMap.value.get(Machinery)
   machineryList.value  =  machineryList.value .map(ele=>{
    return {
      ...ele,
      number:""
    }
   })
    assembleDetail({
    projectId: projectId.value
  }).then(res => {
    const { data: {
      params
    } } = res

    if(!params || params.length ==0){
      return 
    }
   const overallSizeFieldRes = params.find(ele => ele.field === overallSizeField)
   if (overallSizeFieldRes) {
      overallSize.value = true
      overallSizeRadio.value = overallSizeFieldRes.value
    } else {
      overallSize.value = false
      overallSizeRadio.value = ""
    }

     const completionTimeFieldRes = params.find(ele => ele.field === completionTimeField)
   if (completionTimeFieldRes) {
      completionTime.value = true
      if(completionTimeFieldRes.value) {
        projectForm.value.completionTime = completionTimeFieldRes.value.split(",")
        const valueConfig = completionTimeFieldRes.valueConfig || []
        completionTimeList.value = completionTimeList.value.map(ele=>{
          const result = valueConfig.find(e =>ele.value ===e.field)
          return {
            ...ele,
            number:result?.value
          }
        })

      }else {
        projectForm.value.completionTime = [] 
          completionTimeList.value = completionTimeList.value.map(ele=>{
          return {
            ...ele,
            number:""
          }
        })
      }
    } else {
      overallSize.value = false
      overallSizeRadio.value = ""
    }


     const workerFieldRes = params.find(ele => ele.field === workerField)
   if (workerFieldRes) {
      worker.value = true
      if(workerFieldRes.value) {
        projectForm.value.worker = workerFieldRes.value.split(",")
        const valueConfig = workerFieldRes.valueConfig || []
        workerList.value = workerList.value.map(ele=>{
          const result = valueConfig.find(e =>ele.value ===e.field)
          return {
            ...ele,
            number:result?.value
          }
        })

      }else {
        projectForm.value.worker = [] 
          workerList.value = workerList.value.map(ele=>{
          return {
            ...ele,
            number:""
          }
        })
      }
    } else {
      overallSize.value = false
      overallSizeRadio.value = ""
    }


     const machineryFieldRes = params.find(ele => ele.field === machineryField)
   if (machineryFieldRes) {
      machinery.value = true
      if(machineryFieldRes.value) {
        projectForm.value.machinery = machineryFieldRes.value.split(",")
        const valueConfig = machineryFieldRes.valueConfig || []
        machineryList.value = machineryList.value.map(ele=>{
          const result = valueConfig.find(e =>ele.value ===e.field)
          return {
            ...ele,
            number:result?.value
          }
        })

      }else {
        projectForm.value.machinery = [] 
          machineryList.value = machineryList.value.map(ele=>{
          return {
            ...ele,
            number:""
          }
        })
      }
    } else {
      overallSize.value = false
      overallSizeRadio.value = ""
    }
      const customFieldRes = params.find(ele => ele.field === customField)
    if (customFieldRes) {
      const value = customFieldRes.value.split(",")
      projectForm.value.custom = value
    }
  
  })
   
})
// const customField = "overallSize"
const overallSizeField = "overallSize"
const overallSize = ref(true)
const overallSizeRadio = ref("")
const overallSizeList = ref<any[]>([])


const completionTimeField = "completionTime"
const completionTime = ref(true)
const completionTimeList = ref<any[]>([])
// const landRadio = ref("")
// const landList = ref<any[]>([{
//   label: '默认',
//   value: '0'
// }])


const workerField = "worker"
const worker = ref(true)
const workerList = ref<any[]>([])


const machineryField = "machinery"
const machinery = ref(true)
const machineryList = ref<any[]>([])


const all = ref(true)
watch(() => [
  machinery.value,
  worker.value,
  completionTime.value,
  overallSize.value,
], (newValue) => {
  const result = newValue.every(ele => ele)
  all.value = result
})
function handleAllChangeEvt() {
  machinery.value = true
  worker.value = true
  completionTime.value = true
  overallSize.value = true
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
