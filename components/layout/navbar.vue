<template>
  <el-header class="flex justify-between items-center border-solid border-[#dcdfe6]" height="48px">
    <div class="flex">
      <div class="flex items-center">
        <!-- <el-icon class="cursor-pointer mr-[20px]" :size="20" @click="triggerMenu()">
          <Fold v-if="expand" />
          <Expand v-else />
        </el-icon> -->
        <el-icon class="cursor-pointer mr-[20px]" :size="20" @click="triggerBack()">
          <Back />
        </el-icon>
      </div>
    </div>
    <div class="flex h-full">
      <el-dropdown placement="bottom-end" trigger="click" @command="selectMenu">
        <div class="flex items-center px-[12px] cursor-pointer">
          <el-avatar class="mr-[8px]" size="small" src="https://www.bsbnk.com/cdn/image/maxtan.png">
            <el-icon>
              <UserFilled />
            </el-icon>
          </el-avatar>
          <span class="text-[14px]">MaxTan</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { Expand, Fold, UserFilled } from '@element-plus/icons-vue'
const { logOut } = useAuth()
const { updateExpand, expand } = useMenu()
const selectMenu = (value: string) => {
  console.log(value)
  switch (value) {
    case 'logout':
      logOut()
      break
    default:
      break
  }
}
const triggerMenu = () => {
  updateExpand(!expand.value)
}

const router = useRouter()
const triggerBack = () => {
  router.back()
}
</script>
