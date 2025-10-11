<template>
  <el-aside
    class="border-r border-solid border-[#eaebef] h-[100%] transition-all duration-300"
    :width="expand ? '220px' : '64px'"
  >
    <nuxt-link class="flex items-center justify-center h-[60px]" to="/">
      <img class="w-[44px] h-[44px] rounded-[22px]" src="~/assets/images/logo.png" alt="logo" />
      <span v-show="expand" class="truncate ml-[15px] text-[18px] font-bold">智能建造管理工具</span>
    </nuxt-link>
    <div class="h-[calc(100%-60px)] flex flex-col">
      <layout-menu-list />
    </div>
  </el-aside>
</template>

<script lang="ts" setup>
const { expand } = useMenu()
</script>
