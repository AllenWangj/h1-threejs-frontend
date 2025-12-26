<template>
  <div class="menu-list">
    <el-scrollbar>
      <el-menu class="menu" :default-active="getActive(menuTree)" :default-openeds="menus.map(item => item.id)" :collapse="!expand" de router>
        <template v-for="item in menuTree" :key="item.code">
          <sub-menu v-if="item.type === 1 && item.children.length > 0" :index="item.id" :item="item" />
          <menu-item v-else-if="item.type === 2" :item="item" />
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import SubMenu from './sub-menu.vue'
import MenuItem from './menu-item.vue'
const { menuTree, menus } = useAuth()
const { expand } = useMenu()
const route = useRoute()
/**
 * @description 高亮菜单
 * @param menus
 */
const getActive = (menus) => {
  let path = ''
  menus.forEach((menu) => {
    if (menu.type === 2 && route.path.startsWith(menu.path)) {
      path = menu.path
    } else if (menu.children?.length > 0) {
      const result = getActive(menu.children)
      if (result) {
        path = result
      }
    }
  })
  return path
}
</script>

<style lang="less" scoped>
.menu-list {
  position: relative;
  height: 100%;
  flex-shrink: 0;
  .el-menu {
    border-right: none;
  }
  .menu:not(.el-menu--collapse) {
    width: 100%;
  }
}
</style>
