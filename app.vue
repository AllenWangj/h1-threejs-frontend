<template>
  <el-config-provider :locale="zhCn">
    <nuxt-layout>
      <nuxt-page />
    </nuxt-layout>
  </el-config-provider>
</template>
<script lang="ts" setup>
import '~/assets/css/style.less'
import { zhCn } from 'element-plus/es/locale/index'
</script>
