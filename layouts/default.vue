<template>
  <el-container class="h-screen">
    <!-- <layout-sidebar /> -->
    <el-container direction="vertical">
      <layout-navbar />
      <el-main class="flex p-0 bg-[#f5f7fa]">
        <div class="flex-1 flex-col flex shadow-sm min-w-[1000px] overflow-auto m-[8px] rounded-[4px]">
          <slot />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup></script>
