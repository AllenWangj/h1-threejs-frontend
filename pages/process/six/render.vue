<template>
  <div class="flex flex-shrink-0 w-[100%] h-[100%] relative">
    <schemes-list :list="schemeList" :current="currentAcviteScheme" @tap-scheme="tapScheme"></schemes-list>
    <div class="flex-1 relative border border-[1px] border-[#adcdf7] relative">
      <SixComponent v-if="!isDelive" :planId="currentAcviteScheme" />
      <delivery v-else :demBounds="demBounds" :planId="currentAcviteScheme" :dem-url="demUrl" :satellite-url="satelliteUrl" />
      <div v-if="currentAcviteScheme" class="absolute top-[10px] left-[10px] z-10">
        <el-button type="primary" @click="handleDeliveEvt" :disabled="!(schemeList.length > 0)">运输路线</el-button>
        <!-- 下载方案 -->
        <el-button @click="downloadSolution" type="primary">导出方案</el-button>
        
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getPackingDetail, planExport } from '@/apis/project'
import { getResourceList } from '@/apis/resource'
import SixComponent from '@/components/six-component/index.vue'
import Delivery from './components/delivery.vue'

const currentAcviteScheme = ref(-1)
const isDelive = ref(false)
const tapScheme = (item) => {
  currentAcviteScheme.value = item.id
}
const demUrl = ref('')
const demBounds = ref({
  lonMin: 106.2,
  lonMax: 106.3,
  latMin: 26.1,
  latMax: 26.2
})
const satelliteUrl = ref('')

function handleDeliveEvt() {
  isDelive.value = !isDelive.value
}
const projectId = ref('')
const route = useRoute()
const schemeList = ref<any[]>([])

onMounted(() => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
  }
  fetchResourceUrls()
  fetchDetail()
})
async function fetchResourceUrls() {
  try {
    const { data } = await getResourceList({
      projectId: projectId.value
    })
    const {records} = data
    if(records && records.length) {
      demUrl.value = records[0].url
      satelliteUrl.value = records[0].satelliteUrl
      demBounds.value = {
        lonMin: records[0].minX,
        lonMax: records[0].maxX,
        latMin: records[0].minY,
        latMax: records[0].maxY
      }
    }
    console.log('获取资源列表', data)
  } catch (error) {
    console.error('获取资源列表失败', error)
  }
}
async function fetchDetail() {
  try {
    const { data } = await getPackingDetail({
      projectId: projectId.value,
      type: 6
    })
    schemeList.value = data || []
    if (schemeList.value.length >0) {
      currentAcviteScheme.value = schemeList.value[0].id
      // planDetail({ planId: currentAcviteScheme.value }).then(res => {
      //   const { data: { layouts } } = res
      //   // handleLoadInitModel(layouts)
      //   // renderPlanLayout!.loadSceneModels(layouts)
      // })
    }
    console.log('获取运输保障详情', data)
  } catch (error) {
    console.error('获取运输保障详情失败', error)
  } finally {
  }
}

// 下载方案
const downloadSolution = async () => {
  try {
    const url = planExport({
      projectId: projectId.value,
      type: 6
    })
    const a = document.createElement('a')
    a.href = url
    a.download = `运输保障方案.docx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } catch (error) {
    console.error('下载方案失败', error)
  }
}
</script>

<style lang="less" scoped>
.opt-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 9999;
}
</style>
