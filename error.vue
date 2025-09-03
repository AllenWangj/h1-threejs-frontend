<template>
  <div class="h-screen flex flex-col items-center px-[32px] py-[72px]">
    <div class="w-[620px] h-[360px]">
      <img
        v-if="error.statusCode === 401"
        src="~/assets/images/error/401.png"
        alt="forbidden image"
      />
      <img
        v-else-if="error.statusCode === 403"
        src="~/assets/images/error/403.png"
        alt="forbidden image"
      />
      <img
        v-else-if="error.statusCode === 404"
        src="~/assets/images/error/404.png"
        alt="not found image"
      />
      <img v-else src="~/assets/images/error/500.png" alt="error image" />
    </div>
    <div class="text-[24px] leading-[1.8]">{{ error.statusCode }}</div>
    <div class="text-[14px] leading-[1.6] text-[#a3a6ad]">{{ error.statusMessage }}</div>
    <div class="mt-[24px]">
      <el-button type="primary" @click="onClick">返回首页</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type { NuxtError } from '#app'

defineProps({
  error: { type: Object as PropType<NuxtError> }
})

const onClick = () => {
  clearError({ redirect: '/' })
}
</script>
