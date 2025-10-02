<template>
  <div class="schemes-list-container">
    <div class="flex items-center h-[54px] px-[14px] border-b-[1px] border-[#e4ecfd]">
      <img src="../../assets/images/home/schemes-icon.svg" alt="" width="20" height="20" />
      <span class="text-[16px] ml-[8px]">方案名称</span>
      <span class="flex-1"></span>
      <span class="text-[12px] text-[#94a3c0]">
        已生成
        <span class="text-[#3a83fc]">69</span>
        个方案
      </span>
    </div>
    <div class="schemes-list-wrapper">
      <div class="scheme-item" v-for="i in 20" :key="i" :class="i === 1 ? 'is-active' : ''">
        <div class="flex-1 mr-[20px]">
          <span class="text-[14px] text-[#1e1e1e]">方案1</span>
          <div class="flex items-center justify-between mt-[8px]">
            <span class="text-[12px] text-[#8999b8]">评分：84分</span>
            <span class="text-[12px] text-[#8999b8]">2025-10-01 12:00:00</span>
          </div>
        </div>
        <img src="../../assets/images/home/xiala.svg" alt="" width="20px" height="20px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
.schemes-list-container {
  display: flex;
  flex-direction: column;
  width: 300px;
  margin-right: 10px;
  border: 1px solid #adcdf7;

  .schemes-list-wrapper {
    flex: 1;
    padding: 14px;
    overflow-y: auto;

    .scheme-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      margin-bottom: 14px;
      background: #f8f9fd;
      border-radius: 4px;
      border: 1px solid #e8e9ef;
    }

    .scheme-item.is-active {
      background: linear-gradient(180deg, #fff, #deecff);
      border: 1px solid #adcdf7;
    }
  }
}
</style>
