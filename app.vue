<template>
  <el-config-provider :locale="locale">
    <nuxt-layout>
      <nuxt-page />
    </nuxt-layout>
  </el-config-provider>
</template>
<script lang="ts" setup>
import '~/assets/css/style.css'
import { zhCn as elZhCn } from 'element-plus/es/locale/index'
import { zhCn as ezZhCn } from '@sino/i18n'
const locale = { ...elZhCn, ...ezZhCn }
</script>
