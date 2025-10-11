<template>
  <div class="flex flex-shrink-0 w-[100%] h-[100%] relative">
    <schemes-list :list="schemeList" :current="currentAcviteScheme" @tap-scheme="tapScheme"></schemes-list>
    <div class="flex-1 relative border border-[1px] border-[#adcdf7]">
      <div class="three-content" ref="four"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import SchemesList from '@/components/schemes-list/index.vue'
import FourObject from "~~/threejs/four/index"
import { getStructuralDesignDetail } from '@/apis/project'


const four = ref()
let processFour: FourObject | null = null

const route = useRoute()
const projectId = ref('')
const schemeList = ref<any[]>([])
// 当前激活得方案id
const currentAcviteScheme = ref('')

const tapScheme = (item) => {
  console.log('点击了结构设计方案', item)
}

// 获取详情
async function fetchDetail() {
  try {
    const { data } = await getStructuralDesignDetail({
      projectId: projectId.value
    })
    schemeList.value = data.plans || []
    if (schemeList.value.length) {
      currentAcviteScheme.value = schemeList.value[0].id
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
  fetchDetail();
  processFour = new FourObject(four.value, {
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
