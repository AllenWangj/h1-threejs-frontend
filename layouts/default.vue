<template>
  <el-container class="h-screen container-background">
    <!-- <layout-sidebar /> -->
    <el-container direction="vertical">
      <layout-navbar />
      <el-main class="flex p-0">
        <div class="flex-1 flex-col flex shadow-sm min-w-[1000px] overflow-auto p-[20px] pt-0">
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
}
</style>
