<template>
  <div class="form-content w-full h-full">
    <p class="text-[#f4f5f8] text-[43px] mb-[5px]">HELLO</p>
    <p class="text-[32px] text-[#333]">欢迎使用SCRM管理平台</p>
    <div class="w-[36px] h-[6px] bg-[#d11f25] mt-[11px] mb-[49px]"></div>
    <login-text @success="onSuccess" />
  </div>
</template>

<script lang="ts" setup>
import LoginText from './login-text.vue'
const route = useRoute()
// 登录成功根据 redirect url 参数跳转回原登录链接
const onSuccess = () => {
  const { redirect } = route.query
  // 登录成功返回来源页
  // 带有 redirect 参数按指定返回
  // 没有则取环境变量文件里获取的默认地址
  if (redirect && typeof redirect === 'string') {
    navigateTo(redirect, { external: true, replace: true })
  } else {
    navigateTo('/', { replace: true })
  }
}
</script>
<style>
.form-content {
  padding: 40px;
}
</style>
