<template>
  <div class="w-full h-full flex">
    <div class="w-[200px] bg-white rounded-[4px]">
      <h1 class="text-2xl font-bold mb-4">首页</h1>
      <p>欢迎来到首页！</p>
    </div>
    <div class="flex-1 ml-[15px] home-background">
      <RouterLink to="/process/one" class="text-[#007bff] mx-[10px] step-button step-button-1">第一步</RouterLink>
      <RouterLink to="/process/two" class="text-[#007bff] mx-[10px] step-button  step-button-2">第二步</RouterLink>
      <RouterLink to="/process/three" class="text-[#007bff] mx-[10px] step-button step-button-3">第三步</RouterLink>
      <RouterLink to="/process/four" class="text-[#007bff] mx-[10px] step-button step-button-4">第四步</RouterLink>
      <RouterLink to="/process/five" class="text-[#007bff] mx-[10px] step-button step-button-5">第五步</RouterLink>
      <RouterLink to="/process/six" class="text-[#007bff] mx-[10px] step-button step-button-6">第六步</RouterLink>
      <RouterLink to="/process/seven" class="text-[#007bff] mx-[10px] step-button step-button-7">第七步</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
.home-background {
  position: relative;
  background-image: url("../assets/images/home/homeRightBk.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;

  .step-button {
    position: absolute;
    background: rgba(255, 255, 255, 0);
    width: 13%;
    height: 26%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .step-button-1 {
    top: 40%;
    left: 3%;
  }

  .step-button-2 {
    top: 60%;
    left: 14%;
  }

  .step-button-3 {
    top: 67%;
    left: 31%;
  }

  .step-button-4 {
    top: 67%;
    left: 51%;
  }

  .step-button-5 {
    top: 60%;
    left: 69%;
  }

  .step-button-6 {
    top: 40%;
    left: 82%;
  }

  .step-button-7 {
    top: 21%;
    left: 66%;
  }
}
</style>
