<template>
  <el-container class="h-screen container-background">
    <!-- <layout-sidebar /> -->
    <el-container direction="vertical">
      <layout-new-navbar />
      <div v-if="showBreadcrumb" class="px-[72px] pb-[10px]">
        <el-breadcrumb :separator-icon="ArrowRight">
          <el-breadcrumb-item :to="{ path: '/' }">{{ homePageName }}</el-breadcrumb-item>
          <el-breadcrumb-item disabled>{{ detailPageName }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-main class="flex p-0 mt-[10px]">
        <div class="flex-1 flex-col flex shadow-sm min-w-[1000px] overflow-auto px-[32px] pt-0 pb-[20px]">
          <slot />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ArrowRight } from '@maxtan/ez-ui-icons'
import { useRoute } from 'vue-router'

const route = useRoute()
const showBreadcrumb = ref(false)
const homePageName = ref('')
const detailPageName = ref('')
const stepNameMap = {
  '/process/one': '地址决策',
  '/process/two': '规划布局',
  '/process/three': '内部布局',
  '/process/four': '结构设计',
  '/process/five': '部件生产',
  '/process/six': '运输保障',
  '/process/seven': '现场组装'
}
watchEffect(() => {
  showBreadcrumb.value = route.path.includes('/process/')
  const currentProjectCache = JSON.parse(sessionStorage.getItem('currentProject') || '{}')
  homePageName.value = currentProjectCache.name || '首页'
  const key = Object.keys(stepNameMap).find((key) => route.path.includes(key))
  detailPageName.value = stepNameMap[key] || ''
})
</script>

<style lang="less" scoped>
.container-background {
  background-image: url('../assets/images/home/icon-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;

  :deep(.el-breadcrumb) {
    --el-text-color-primary: #fff;
    --el-text-color-regular: #398EFF;
    --el-text-color-placeholder: #398EFF;
    font-size: 18px;
  }
}
</style>
