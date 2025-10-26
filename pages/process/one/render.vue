<template>
  <div class="flex flex-shrink-0 w-[100%] h-[100%] relative">
    <schemes-list :list="schemeList" :current="currentAcviteScheme" @tap-scheme="tapScheme"></schemes-list>
    <div class="flex-1 relative border border-[1px] border-[#adcdf7]">
      <!-- 使用组件切换显示 -->
      <elevation-map 
        v-if="terrainMode === 'elevation'" 
        :dem-url="demUrl" 
        :satellite-url="satelliteUrl"
      />
      <contour-map 
        v-else-if="terrainMode === 'contour'" 
        :dem-url="demUrl"
      />
      
      <!-- 新增切换按钮 -->
      <el-button @click="toggleTerrainMode" class="terrain-toggle-btn" type="primary">
        {{ terrainMode === 'elevation' ? '高程地图' : '等高线地图' }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getProjectSitePlanList, getProjectSitePlanDetail } from '@/apis/project'
import ElevationMap from './elevation-map.vue'
import ContourMap from './contour-map.vue'

const route = useRoute()
const projectId = ref('')
const schemeList = ref<any[]>([])
const currentAcviteScheme = ref('')

const gis = ref({
  url: '',
  demUrl: '',
  satelliteUrl: ''
})

const terrainMode = ref('elevation')

const demUrl = computed(() => {
  return 'https://support.maxtan.cn/geoserver/h1/wcs?' +
    'service=WCS&version=2.0.1&request=GetCoverage&coverageId=h1:dem_107252456638910473' +
    '&format=image/tiff&subset=Long(106.2,106.3)&subset=Lat(26.1,26.2)&resx=0.001&resy=0.001'
})

const satelliteUrl = computed(() => {
  return 'https://static.maxtan.cn/h1-static/uploads/20251023/90f6842eff314ee4f3c52fc4.jpg'
})

const tapScheme = (item) => {
  console.log('点击了方案', item)
  currentAcviteScheme.value = item.id
  fetchPlanDetail(currentAcviteScheme.value)
}

function toggleTerrainMode() {
  terrainMode.value = terrainMode.value === 'elevation' ? 'contour' : 'elevation'
}

async function fetchDetail() {
  try {
    const { data } = await getProjectSitePlanList({
      projectId: projectId.value
    })
    console.log('获取部件生产详情', data)
    schemeList.value = data || []
    if (schemeList.value.length) {
      currentAcviteScheme.value = schemeList.value[0].id
      fetchPlanDetail(currentAcviteScheme.value)
    }
  } catch (error) {
    console.error('获取部件生产详情失败', error)
  }
}

async function fetchPlanDetail(planId) {
  try {
    const { data: plan } = await getProjectSitePlanDetail({
      planId
    })
    gis.value = plan.gis || {}
    console.log('获取方案详情', plan)
  } catch (error) {
    console.error('获取方案详情失败', error)
  }
}

onMounted(() => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
  }
  fetchDetail()
})
</script>

<style scoped>
.terrain-toggle-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 9999;
}
</style>
