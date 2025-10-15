<template>
  <div class="flex flex-shrink-0 w-[100%] h-[100%] relative">
    <schemes-list :list="schemeList" :current="currentAcviteScheme" @tap-scheme="tapScheme"></schemes-list>
    <div  class="flex-1 relative border border-[1px] border-[#adcdf7] relative">
    <el-button class="opt-btn" type="primary" @click="handleDeliveEvt">运输路线</el-button>  
    <SixComponent v-if="!isDelive" :planId="currentAcviteScheme"/>
    <Delive v-else :planId="currentAcviteScheme"/>
    </div>
 </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getPackingDetail, planDetail } from '@/apis/project'
import SixComponent from "@/components/six-component/index.vue"
import Delive from "@/components/delivery/index.vue"

const currentAcviteScheme = ref(-1)
const isDelive = ref(false)
const planid = ref(-1)
const tapScheme = (item) => {
  console.log('点击了运输保障方案', item)
  currentAcviteScheme.value = item.id
  // planDetail({ planId: item.id }).then(res => {
  //   const { data: { layouts } } = res
  //   // handleLoadInitModel(layouts)
  //   // renderPlanLayout!.loadSceneModels(layouts)
  // })
}

function handleDeliveEvt(){
  isDelive.value =!isDelive.value
}
const projectId = ref('')
const route = useRoute()
const schemeList = ref<any[]>([])

onMounted(() => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
  }
  fetchDetail();
})
async function fetchDetail() {
  try {
    const { data } = await getPackingDetail({
      projectId: projectId.value
    })
    schemeList.value = data.plans || []
    if (schemeList.value.length) {
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
</script>

<style lang="less" scoped>
.opt-btn {
   position: absolute;
  top: 10px;
  left: 10px;
  z-index: 9999;
}
</style>
