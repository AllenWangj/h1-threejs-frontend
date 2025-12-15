<template>
  <el-header class="flex justify-between items-center border-solid border-[#dcdfe6] pt-[5px]" height="60px">
    <div class="flex flex-1">
      <div class="flex items-center flex-1">
        <el-icon class="cursor-pointer mr-[20px]" :size="20" @click="triggerMenu()">
          <Fold v-if="expand" />
          <Expand v-else />
        </el-icon>
      </div>
    </div>
    <div class="flex h-full">
      <el-dropdown placement="bottom-end" trigger="click" @command="selectMenu">
        <div class="flex items-center px-[12px] cursor-pointer">
          <img src="../../assets/images/home/icon-touxiang.png" alt="" class="w-[36px] h-[36px] mr-[8px]" />
          <span class="text-[14px]">{{ userInfo?.name }}</span>
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
const { logOut, userInfo } = useAuth()
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

const triggerHome = () => {
  router.push('/')
}
</script>
