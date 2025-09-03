<template>
  <el-sub-menu :index="props.item.path">
    <template #title>
      <el-icon v-if="props.item.icon" :size="20">
        <component :is="props.item.icon" />
      </el-icon>
      <span>{{ props.item.name }}</span>
    </template>
    <template v-for="child in props.item.children" :key="child.path">
      <sub-menu v-if="child.type === 1 && child.children.length > 0" :item="child" />
      <menu-item v-else-if="child.type === 2 && child.visible === 1" :item="child" />
    </template>
  </el-sub-menu>
</template>

<script lang="ts" setup>
import type { MenuTree } from '~/types/account'
import MenuItem from './menu-item.vue'
interface PropsType {
  item: Partial<MenuTree>
}
const props = defineProps<PropsType>()
</script>
