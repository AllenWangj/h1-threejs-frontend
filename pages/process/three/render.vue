<template>
  <div class="flex flex-shrink-0 w-[100%] h-[100%] relative">
    <schemes-list :list="schemeList" :current="currentAcviteScheme" @tap-scheme="tapScheme"></schemes-list>
    <div  v-loading="loading"  class="flex-1 relative border border-[1px] border-[#adcdf7]">
      <div class="plan-and-plan_tree" ref="three"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import SchemesList from '@/components/schemes-list/index.vue'
// import Threeobject from "@/threejs/three/index"
import { getInternalLayoutDetail,planDetailInfo,planList ,createPlan} from '@/apis/project'
import {useRender} from "./composables/use-render"
import {plan} from "./composables/plan1.ts"
// import {plan} from "./composables/plan2"

const three = ref()
const { ProcessThree } = useRender()
let processThree: InstanceType<typeof ProcessThree> | null = null
const loading = ref(false)
// let processTwo: Threeobject | null = null

const route = useRoute()
const projectId = ref('')
const schemeList = ref<any[]>([])
// 当前激活得方案id
const currentAcviteScheme = ref('')

const tapScheme = (item) => {
  currentAcviteScheme.value  = item.id
    planDetailInfo({ id: currentAcviteScheme.value }).then(async (res) => {
        const { data: { layouts } } = res
        loading.value = true

       await processThree!.handleOriginModel(layouts)
        loading.value = false
      })
  // console.log('点击了内部布局方案', item)
}

// 获取详情
async function fetchDetail() {
  try {
    const { data } = await planList({
      projectId: projectId.value,
      type:3
    })
    schemeList.value = data || []
    if (schemeList.value.length) {
      currentAcviteScheme.value = schemeList.value[0].id
    }
    // createPlan({
    //   projectId:projectId.value,
    //   type:3,
    //   name:"方案二",
    //   layouts:JSON.stringify(plan)
    // })


    // console.log('获取内部布局详情', data)
     planDetailInfo({ id: currentAcviteScheme.value }).then(async (res) => {
        const { data: { layouts } } = res
        loading.value = true
       await processThree!.handleOriginModel(layouts)
        loading.value = false

      })
  } catch (error) {
    console.error('获取内部布局详情失败', error)
  } finally {
  }
}

onMounted(() => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
  }
  fetchDetail();
  processThree = new ProcessThree(three.value,{
    progress:() =>{
    }
  })
})
</script>

<style lang="less" scoped>
.plan-and-plan_tree {
  width: 100%;
  height: 100%;
}
</style>
