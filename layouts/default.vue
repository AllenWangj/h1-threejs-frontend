<template>
  <el-container class="h-screen container-background">
    <!-- <layout-sidebar /> -->
    <el-container direction="vertical">
      <layout-new-navbar />
      <el-main class="flex p-0 mt-[10px]">
        <div class="flex-1 flex-col flex shadow-sm min-w-[1000px] overflow-auto px-[32px] pt-0 pb-[20px]">
          <slot />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="less" scoped>
.container-background {
  background-image: url('../assets/images/home/homeBk.e325e136.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding-top: 20px;
}
</style>
