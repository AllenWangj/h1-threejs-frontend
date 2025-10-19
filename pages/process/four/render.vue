<template>
  <div class="flex flex-shrink-0 w-[100%] h-[100%] relative">
    <schemes-list :list="schemeList" :current="currentAcviteScheme" @tap-scheme="tapScheme"></schemes-list>
    <div v-loading="loading" class="flex-1 relative border border-[1px] border-[#adcdf7]">
      <div class="three-content" ref="four"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import SchemesList from '@/components/schemes-list/index.vue'
// import FourObject from "~~/threejs/four/index"
import { planList, planDetailInfo } from '@/apis/project'
import { useRender } from "./composables/use-render"
const loading = ref(true)
const four = ref()
const { ProcessFour } = useRender()
let processFour: InstanceType<typeof ProcessFour> | null = null

const route = useRoute()
const projectId = ref('')
const schemeList = ref<any[]>([])
// 当前激活得方案id
const currentAcviteScheme = ref('')

const tapScheme = (item) => {
   currentAcviteScheme.value =item.id
  try {
    loading.value = true
    planDetailInfo({ id: item.id }).then(async (res:any) => {
      const { data: { layouts } } = res
      await processFour!.handleOriginModel(layouts)
      loading.value = false
    })
    } catch (e) {
    loading.value = false

  }

}

// 获取详情
async function fetchDetail() {
  try {
    const { data } = await planList({
      projectId: projectId.value,
      type:4
    })
    schemeList.value = data || []
    if (schemeList.value.length) {
      currentAcviteScheme.value = schemeList.value[0].id
      loading.value = true
      planDetailInfo({ id: currentAcviteScheme.value }).then(async (res) => {
        const { data: { layouts } } = res
        loading.value = true
        await processFour!.handleOriginModel(layouts)
        loading.value = false
      })
    }
    console.log('获取结构设计详情', data)
  } catch (error) {
    console.error('获取结构设计详情失败', error)
  } finally {
  }
}

onMounted(() => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
  }
  fetchDetail()
  processFour = new ProcessFour(four.value, {
    progress: () => { }
  })
})
</script>

<style lang="less" scoped>
.three-content {
  width: 100%;
  height: 100%
}
</style>
