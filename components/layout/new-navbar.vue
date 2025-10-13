<template>
  <el-header class="flex justify-between items-center nav-container" height="60px">
    <!-- <div class="flex flex-1">
      <div class="flex items-center flex-1">
        <el-icon class="cursor-pointer mr-[20px]" :size="20" @click="triggerMenu()">
          <Fold v-if="expand" />
          <Expand v-else />
        </el-icon>
      </div>
    </div> -->
    <img src="../../assets/images/home/nameText.svg" alt="" class="cursor-pointer h-[26px]" @click="triggerHome()" />
    <div class="flex items-center h-[60px]">
      <span class="current-date">{{ currentDate }}</span>
      <span class="current-time">{{ currentDateTime.hh }}</span>
      <span class="text-[#3a83fc] mx-[5px]">:</span>
      <span class="current-time">{{ currentDateTime.mm }}</span>
      <span class="text-[#3a83fc] mx-[5px]">:</span>
      <span class="current-time mr-[20px]">{{ currentDateTime.ss }}</span>
      <el-dropdown placement="bottom-end" trigger="click" @command="selectMenu">
        <div class="flex items-center px-[12px] cursor-pointer">
          <img src="../../assets/images/home/touxiang.svg" alt="" class="w-[24px] h-[24px] mr-[8px]" />
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
const { formatTime } = useUtils()


// 获取当前时间
const currentDate = ref(formatTime(new Date().getTime(), 'YYYY-MM-DD'))
const currentDateTime = ref({
  hh: formatTime(new Date().getTime(), 'HH'),
  mm: formatTime(new Date().getTime(), 'mm'),
  ss: formatTime(new Date().getTime(), 'ss')
})

setInterval(() => {
  currentDateTime.value = {
    hh: formatTime(new Date().getTime(), 'HH'),
    mm: formatTime(new Date().getTime(), 'mm'),
    ss: formatTime(new Date().getTime(), 'ss')
  }
}, 1000)


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


<style scoped lang="less">
.nav-container {
  border: 30px solid transparent;
  border-image-source: url('../../assets/images/home/nav-bg.svg');
  border-image-slice: 30 fill;
  border-image-repeat: stretch;
  margin: 0 32px;
  padding: 0;

  .current-date {
    font-weight: 700;
    font-size: 16px;
    color: transparent;
    background: linear-gradient(90deg, #78c0ff, #3a83fc 80%);
    -webkit-background-clip: text;
    background-clip: text;
    margin-right: 16px;
    display: flex;
    align-items: center;
  }

  .current-time {
    width: 22px;
    height: 25px;
    line-height: 25px;
    background: url(../../assets/images/home/icon-time-bg.svg) no-repeat;
    background-size: 22px 25px;
    text-align: center;
    font-size: 14px;
    color: #f2f7ff;
  }
}
</style>