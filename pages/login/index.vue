<template>
  <div class="h-screen login">
    <div class="flex pt-[33px] pl-[47px] items-center">
      <!-- <img class="w-[50px] h-[50px]" src="@/assets/images/ican.png" alt="banner" /> -->
      <p class="ml-[13px] text-[#333] font-bold text-[48px]">典型区域全过程智能建造管理工具</p>
    </div>
    <div class="login-form">
      <login-form />
    </div>
  </div>
</template>
<script lang="ts" setup>
import LoginForm from './components/login-form.vue'
definePageMeta({
  layout: false
})

const { clearLoginState } = useAuth()

onMounted(() => {
  // 进入登录页清空权限信息
  clearLoginState()
})

</script>
<style scoped>
.login {
  background: url('@/assets/images/login.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
}

.login-form {
  width: 517px;
  background: #fff;
  box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.17);
  border-radius: 16px;
  position: absolute;
  top: 50%;
  right: 170px;
  transform: translateY(-50%);
}

@media screen and (max-width: 1024px) {
  .login-form {
    right: 50%;
    transform: translate(50%, -50%);
    width: 90%;
  }
}
</style>
