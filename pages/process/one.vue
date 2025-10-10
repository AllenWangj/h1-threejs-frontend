<template>
  <div class="flex h-full w-full bg-white rounded-[4px] process-page-container">
    <!-- 初始化选择地块 -->
    <div v-if="pageState === 'list'" class="w-full">
      <div class="flex items-center px-[14px] h-[54px] border-b-[1px] border-[#e4ecfd]">
        <img src="../../assets/images/icon-header.svg" alt="" width="20" height="20" />
        <span class="text-[16px] text-[#1e1e1e] ml-[10px]">地块列表</span>
        <el-button class="ml-auto" type="primary" @click="handleAddPlot">新增地块</el-button>
      </div>
      <div class="plot-wrapper">
        <div
          class="plot-item cursor-pointer flex px-[14px] py-[10px] bg-[#f8f9fd] border border-[#e8e9ef] rounded-[2px] mb-[10px]"
          v-for="(item, index) in 8"
          :key="index"
          :class="{ 'is-active': currentPlot === item }"
          @click="handlePlotClick(item)"
        >
          <div class="flex flex-col flex-1">
            <span class="text-[14px] text-[#1e1e1e]">地块{{ item }}</span>
            <span class="text-[12px] text-[#a7aebb] mt-[5px]">2025/10/05 12:00:00</span>
          </div>
          <img class="ml-[15px] w-[20px] h-[20px]" src="../../assets/images/icon-plot-edit.svg" alt="" />
          <img class="ml-[15px] w-[20px] h-[20px]" src="../../assets/images/icon-plot-delete.svg" alt="" />
        </div>
      </div>
    </div>
    <!-- 地块信息 -->
    <div v-else-if="pageState === 'detail'" class="flex h-full w-full bg-white rounded-[4px] process-page-container">
      <div class="flex flex-col">
        <div class="w-[100%] flex item-center justify-center pt-[20px] border-r border-[#adcdf7]">
          <el-button type="info" text :icon="ArrowLeftBold" @click="pageState = 'list'">返回地块列表</el-button>
        </div>
        <sub-menu-sidebar class="flex-1" :active-tab="isActiveTab" @on-change="tabChange" />
      </div>
      <div class="flex-1 mx-[20px] my-[20px]">
        <keep-alive>
          <nuxt-page />
        </keep-alive>
      </div>
    </div>
    <!-- 新增地块 -->
    <ez-dialog v-model="dialogVisible" title="新增地块" width="600px" @confirm="add">
      <el-form ref="PlotFormRef" :model="plotForm" label-width="80px">
        <el-form-item label="地块名称" prop="name" :rules="{ required: true, message: '请输入地块名称', trigger: 'blur' }">
          <el-input v-model="plotForm.name" placeholder="请输入地块名称"></el-input>
        </el-form-item>
      </el-form>
    </ez-dialog>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftBold } from '@maxtan/ez-ui-icons'
const router = useRouter()
const route = useRoute()
console.log('route', route)

const pageState = ref('list') // list | detail

const currentPlot = ref(null)
const handlePlotClick = (item: number) => {
  currentPlot.value = item
  pageState.value = 'detail'
  tabChange(1)
}

const isActiveTab = ref(1)
const tabChange = (tab: number) => {
  isActiveTab.value = tab
  if (tab === 1) {
    router.push('/process/one/file')
  } else if (tab === 2) {
    router.push('/process/one/form')
  } else if (tab === 3) {
    router.push('/process/one/render')
  }
}

// 新增地块
const dialogVisible = ref(false)
const PlotFormRef = ref(null)
const plotForm = ref({
  name: ''
})
const handleAddPlot = () => {
  dialogVisible.value = true
}
const add = async () => {
  try {
    await PlotFormRef.value.validate()
    console.log('新增地块', plotForm.value)
    dialogVisible.value = false
  } catch (error) {
    console.error('新增地块失败', error)
  }
}
</script>

<style lang="less" scoped>
.plot-wrapper {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 14px;

  .plot-item {
    width: calc(25% - 20px);
    margin: 0 20px 20px 0;

    &:hover {
      background: #f4f9ff;
      box-shadow: 0 4px 4px 0 rgba(58, 131, 252, 0.25);
      border-radius: 2px 2px 2px 2px;
      border: 1px solid #3a83fc;
    }

    &.is-active {
      background: #f4f9ff;
      box-shadow: 0 4px 4px 0 rgba(58, 131, 252, 0.25);
      border-radius: 2px 2px 2px 2px;
      border: 1px solid #3a83fc;
    }
  }
}
</style>
