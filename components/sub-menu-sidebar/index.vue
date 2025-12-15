<template>
  <div class="flex-shrink-0 flex items-center justify-center w-[100%] px-[14px] pb-[10px] sub-menu-sidebar">
    <div class="sub-menu-sidebar-item" :class="{ 'is-active': isActiveTab === 2 }" @click="change(2)">输入参数</div>
    <div class="sub-menu-sidebar-item" :class="{ 'is-active': isActiveTab === 3 }" @click="change(3)">生成方案</div>
    <!-- <el-button type="primary" :class="{ 'is-active': isActiveTab === 2 }" @click="change(2)">
            <img v-if="isActiveTab === 2" src="../../assets/images/home/canshu-2.svg" width="28" height="28" alt="">
            <img v-else src="../../assets/images/home/canshu-1.svg" width="28" height="28" alt="">
            <span class="ml-[8px] text-[16px]" :class="isActiveTab === 2 ? 'font-bold' : ''">输入参数</span>
        </el-button>
        <el-button type="primary" :class="{ 'is-active': isActiveTab === 3 }" @click="change(3)">
            <img v-if="isActiveTab === 3" src="../../assets/images/home/fangan-2.svg" width="28" height="28" alt="">
            <img v-else src="../../assets/images/home/fangan-1.svg" width="28" height="28" alt="">
            <span class="ml-[8px] text-[16px]" :class="isActiveTab === 3 ? 'font-bold' : ''">生成方案</span>
        </el-button> -->
  </div>
</template>
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'on-change', tab: number): void
}>()
const props = defineProps({
  /** 1: 上传文件 2: 输入参数 3: 生成方案 */
  activeTab: {
    type: Number,
    default: 2
  }
})

const isActiveTab = ref(props.activeTab)

watch(
  () => props.activeTab,
  (newVal) => {
    isActiveTab.value = newVal
  }
)

const change = (tab: number) => {
  isActiveTab.value = tab
  emit('on-change', tab)
}
</script>
<style lang="less" scoped>
.sub-menu-sidebar {
  .sub-menu-sidebar-item {
    position: relative;
    font-weight: 400;
    font-size: 24px;
    color: #ffffff;
    line-height: 33px;
    padding: 10px 0;
    cursor: pointer;
  }

  .is-active::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 0;
    margin-left: -29px;
    width: 58px;
    height: 5px;
    background: linear-gradient(180deg, #49bbef 0%, #23da72 100%);
    border-radius: 3px;
  }

  .sub-menu-sidebar-item + .sub-menu-sidebar-item {
    margin-left: 107px;
  }
}
</style>
