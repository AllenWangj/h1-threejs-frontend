<template>
  <div class="flex flex-shrink-0 w-[100%] h-[100%] relative">
    <schemes-list :list="schemeList" :current="currentAcviteScheme" @tap-scheme="tapScheme"></schemes-list>
    <div class="flex-1 relative border border-[1px] border-[#adcdf7]">
      <!-- 使用组件切换显示 -->
      <elevation-map
        v-if="terrainMode === 'elevation'"
        :dem-url="demUrl"
        :satellite-url="satelliteUrl"
        :analyzed-areas="analyzedAreas"
      />
      <contour-map v-else-if="terrainMode === 'contour'" :dem-url="demUrl" :analyzed-areas="analyzedAreas" />

      <!-- 新增切换按钮 -->
      <div class="terrain-toggle-btn">
        <el-button @click="toggleTerrainMode" type="primary">
          {{ terrainMode === 'elevation' ? '等高线地图' : '高程地图' }}
        </el-button>
        <!-- 下载方案 -->
        <el-button @click="downloadSolution" type="primary">导出方案</el-button>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getProjectSitePlanList, getProjectSitePlanDetail, planExport } from '@/apis/project'
import { fromArrayBuffer } from 'geotiff'
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

// 分析结果数据
const analyzedAreas = ref<any[]>([])
const isAnalyzing = ref(false)
const defaultDemUrl =
  'https://support.maxtan.cn/geoserver/h1/wcs?service=WCS&version=2.0.1&request=GetCoverage&coverageId=h1:dem_107252456638910473&format=image/tiff&subset=Long(106.2,106.3)&subset=Lat(26.1,26.2)&resx=0.001&resy=0.001'
const defaultSatelliteUrl = 'https://static.maxtan.cn/h1-static/uploads/20251023/90f6842eff314ee4f3c52fc4.jpg'
const demUrl = computed(() => {
  return gis.value?.url || defaultDemUrl
})

const satelliteUrl = computed(() => {
  return gis.value?.satelliteUrl || defaultSatelliteUrl
})

const DEM_BOUNDS = {
  lonMin: 106.2,
  lonMax: 106.3,
  latMin: 26.1,
  latMax: 26.2
}

const TERRAIN_SIZE = 8

const tapScheme = (item) => {
  console.log('点击了方案', item)
  currentAcviteScheme.value = item.id
  fetchPlanDetail(currentAcviteScheme.value)
}

function toggleTerrainMode() {
  terrainMode.value = terrainMode.value === 'elevation' ? 'contour' : 'elevation'
}

// 加载DEM数据
async function loadDEM(url: string) {
  const resp = await fetch(url)
  const buffer = await resp.arrayBuffer()
  const tiff = await fromArrayBuffer(buffer)
  const image = await tiff.getImage()
  const raster = await image.readRasters({ interleave: true })
  return { raster, width: image.getWidth(), height: image.getHeight() }
}

// 获取最小/最大值
function getMinMax(array: any) {
  let min = Infinity,
    max = -Infinity
  for (let i = 0; i < array.length; i++) {
    const v = array[i]
    if (v < min) min = v
    if (v > max) max = v
  }
  return { min, max }
}

// 地理坐标转世界坐标
function geoToWorld(
  lon: number,
  lat: number,
  raster: Float32Array,
  width: number,
  height: number,
  min: number,
  max: number
) {
  const x = (lon - DEM_BOUNDS.lonMin) / (DEM_BOUNDS.lonMax - DEM_BOUNDS.lonMin)
  const y = (lat - DEM_BOUNDS.latMin) / (DEM_BOUNDS.latMax - DEM_BOUNDS.latMin)

  const worldX = (x - 0.5) * TERRAIN_SIZE
  const worldZ = (y - 0.5) * TERRAIN_SIZE

  const rasterX = Math.floor(x * (width - 1))
  const rasterY = Math.floor(y * (height - 1))
  const rasterIndex = rasterY * width + rasterX
  const elevation = raster[rasterIndex] || min
  const normalizedHeight = (elevation - min) / (max - min)
  const worldY = normalizedHeight * 1.0

  return { x: worldX, y: worldY, z: worldZ, elevation }
}

// 计算地形坡度
function calculateSlope(raster: Float32Array, width: number, height: number, x: number, y: number): number {
  if (x <= 0 || x >= width - 1 || y <= 0 || y >= height - 1) {
    return Infinity
  }

  const index = y * width + x
  const current = raster[index]

  const diffs = [
    Math.abs(current - raster[(y - 1) * width + (x - 1)]),
    Math.abs(current - raster[(y - 1) * width + x]),
    Math.abs(current - raster[(y - 1) * width + (x + 1)]),
    Math.abs(current - raster[y * width + (x - 1)]),
    Math.abs(current - raster[y * width + (x + 1)]),
    Math.abs(current - raster[(y + 1) * width + (x - 1)]),
    Math.abs(current - raster[(y + 1) * width + x]),
    Math.abs(current - raster[(y + 1) * width + (x + 1)])
  ]

  return diffs.reduce((a, b) => a + b, 0) / diffs.length
}

// 计算区域的平均坡度和平坦度
function calculateAreaSlope(
  raster: Float32Array,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  radius: number
): { slope: number; variance: number } {
  let totalSlope = 0
  let count = 0
  const heights: number[] = []

  const radiusPixels = Math.floor(radius)

  for (let dy = -radiusPixels; dy <= radiusPixels; dy++) {
    for (let dx = -radiusPixels; dx <= radiusPixels; dx++) {
      if (dx * dx + dy * dy <= radiusPixels * radiusPixels) {
        const x = centerX + dx
        const y = centerY + dy

        if (x > 0 && x < width - 1 && y > 0 && y < height - 1) {
          const slope = calculateSlope(raster, width, height, x, y)
          totalSlope += slope

          const index = y * width + x
          heights.push(raster[index])

          count++
        }
      }
    }
  }

  if (count === 0) return { slope: Infinity, variance: Infinity }

  const avgSlope = totalSlope / count
  const avgHeight = heights.reduce((a, b) => a + b, 0) / heights.length
  const variance = heights.reduce((sum, h) => sum + Math.pow(h - avgHeight, 2), 0) / heights.length

  return { slope: avgSlope, variance: Math.sqrt(variance) }
}

// 自动分析并推荐平缓的选址区域
function analyzeFlatAreas(
  raster: Float32Array,
  width: number,
  height: number,
  min: number,
  max: number,
  options: {
    minRadius?: number
    maxSlope?: number
    maxVariance?: number
    numRecommendations?: number
  } = {}
) {
  const {
    minRadius = Math.floor(width * 0.08),
    maxSlope = (max - min) * 0.05,
    maxVariance = (max - min) * 0.05,
    numRecommendations = 1
  } = options

  console.log('开始分析地形平缓区域...')
  console.log(`参数: 最小半径=${minRadius}像素, 最大坡度=${maxSlope.toFixed(2)}m, 最大方差=${maxVariance.toFixed(2)}m`)

  const candidates: Array<any> = []
  const step = Math.max(Math.floor(minRadius / 3), 3)

  for (let y = minRadius + 5; y < height - minRadius - 5; y += step) {
    for (let x = minRadius + 5; x < width - minRadius - 5; x += step) {
      const { slope, variance } = calculateAreaSlope(raster, width, height, x, y, minRadius)

      if (slope < maxSlope && variance < maxVariance) {
        const index = y * width + x
        const elevation = raster[index]

        candidates.push({
          x,
          y,
          slope,
          variance,
          elevation,
          radius: minRadius
        })
      }
    }
  }

  console.log(`找到 ${candidates.length} 个候选平缓区域`)

  if (candidates.length === 0) {
    console.warn('未找到符合条件的区域，尝试大幅放宽条件...')
    for (let y = minRadius + 5; y < height - minRadius - 5; y += step) {
      for (let x = minRadius + 5; x < width - minRadius - 5; x += step) {
        const { slope, variance } = calculateAreaSlope(raster, width, height, x, y, minRadius)

        if (slope < maxSlope * 10 && variance < maxVariance * 10) {
          const index = y * width + x
          const elevation = raster[index]

          candidates.push({
            x,
            y,
            slope,
            variance,
            elevation,
            radius: minRadius
          })
        }
      }
    }
    console.log(`大幅放宽条件后找到 ${candidates.length} 个候选区域`)
  }

  candidates.forEach((c) => {
    const slopeScore = 1 - Math.min(c.slope / maxSlope, 1)
    const varianceScore = 1 - Math.min(c.variance / maxVariance, 1)
    c.score = slopeScore * 0.5 + varianceScore * 0.5
  })

  candidates.sort((a, b) => b.score - a.score)
  const selectedAreas = candidates.slice(0, numRecommendations)

  console.log(`最终推荐 ${selectedAreas.length} 个选址区域`)

  return selectedAreas.map((area) => {
    const lonFraction = area.x / (width - 1)
    const latFraction = area.y / (height - 1)
    const lon = DEM_BOUNDS.lonMin + lonFraction * (DEM_BOUNDS.lonMax - DEM_BOUNDS.lonMin)
    const lat = DEM_BOUNDS.latMin + latFraction * (DEM_BOUNDS.latMax - DEM_BOUNDS.latMin)

    const worldPos = geoToWorld(lon, lat, raster, width, height, min, max)
    const radiusWorld = (area.radius / width) * TERRAIN_SIZE

    return {
      centerX: area.x,
      centerY: area.y,
      lon,
      lat,
      elevation: Math.round(area.elevation),
      slope: area.slope,
      variance: area.variance,
      radius: radiusWorld,
      score: area.score,
      worldPos
    }
  })
}

// 分析地形数据
async function analyzeTerrainData() {
  try {
    isAnalyzing.value = true
    console.log('开始加载和分析地形数据...')

    const dem = await loadDEM(demUrl.value)

    const step = Math.ceil(Math.sqrt((dem.width * dem.height) / (150 * 150)))
    const width = Math.floor(dem.width / step)
    const height = Math.floor(dem.height / step)

    const raster = new Float32Array(width * height)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        raster[y * width + x] = dem.raster[y * step * dem.width + x * step] as number
      }
    }

    const { min, max } = getMinMax(raster)

    const areas = analyzeFlatAreas(raster, width, height, min, max, {
      minRadius: Math.floor(width * 0.08),
      maxSlope: (max - min) * 0.05,
      maxVariance: (max - min) * 0.05,
      numRecommendations: 1
    })

    analyzedAreas.value = areas
    console.log('地形分析完成，推荐区域:', areas)
  } catch (error) {
    console.error('地形分析失败:', error)
  } finally {
    isAnalyzing.value = false
  }
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

// 下载方案
const downloadSolution = async () => {
  try {
    const url = planExport({
      projectId: projectId.value,
      type: 1
    })
    const a = document.createElement('a')
    a.href = url
    a.download = `地址决策方案.docx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } catch (error) {
    console.error('下载方案失败', error)
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
  // 自动分析地形数据
  analyzeTerrainData()
})
</script>

<style scoped lang="less">
.terrain-toggle-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 9999;
}

</style>
