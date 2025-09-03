<template>
  <el-menu-item :index="props.item.path">
    <el-icon v-if="props.item.icon" :size="20">
      <component :is="props.item.icon" />
    </el-icon>
    <template #title>
      <span>{{ props.item.name }}</span>
    </template>
  </el-menu-item>
</template>

<script lang="ts" setup>
import type { MenuTree } from '~/types/account'
interface PropsType {
  item: Partial<MenuTree>
}
const props = defineProps<PropsType>()
</script>
