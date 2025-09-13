<template>
  <div class="flex h-full w-full bg-white rounded-[8px] px-[10px] py-[10px]">
    <h1 class="flex flex-col w-[150px] flex-shrink-0 px-[10px]">
      <el-button type="primary" @click="$router.push('/process/six/file')">上传文件</el-button>
      <el-button type="primary" @click="$router.push('/process/six/form')">form表单</el-button>
      <el-button type="primary" @click="$router.push('/process/six/render')">模型渲染</el-button>
    </h1>
    <NuxtPage />
  </div>
</template>
<style lang="less" scoped>
.el-button+.el-button {
  margin-top: 10px;
  margin-left: 0px;
}
</style>
