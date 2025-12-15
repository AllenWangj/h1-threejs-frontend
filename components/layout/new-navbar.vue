<template>
  <el-header class="flex justify-between items-center nav-container" height="110px">
    <div class="flex-1 w-[100%] h-[100px] px-[18px] flex justify-between">
      <div class="icon-header-left">
        <span class="current-time-style">{{ currentDateTime }}</span>
        <div>
          <span class="current-date-style">{{ currentDate }}</span>
          <span class="current-week-style">{{ currentWeek }}</span>
        </div>
      </div>
      <div class="icon-header-center">
        <span class="text-[32px] text-[#fff] font-bold cursor-pointer" @click="triggerHome()">典型区域全过程快速建造管理工具</span>
      </div>
      <div class="icon-header-right">
        <el-dropdown placement="bottom-end" trigger="click" @command="selectMenu">
          <div class="flex items-center px-[12px] cursor-pointer icon-header-right-button">
            <img src="../../assets/images/home/icon-touxiang.png" alt="" class="w-[36px] h-[36px] mr-[8px]" />
            <span class="text-[14px]">{{ userInfo?.name }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="management">管理系统</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-header>
</template>

<script setup lang="ts">
const { logOut, userInfo } = useAuth()
const { updateExpand, expand } = useMenu()
const { formatTime } = useUtils()

// 获取当前星期几 并映射成星期一到星期日
const week = ref(new Date().getDay())
const weekNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
const currentWeek = computed(() => weekNames[week.value])

// 获取当前时间
const currentDate = ref(formatTime(new Date().getTime(), 'YYYY-MM-DD'))
const currentDateTime = ref(formatTime(new Date().getTime(), 'HH:mm:ss'))

setInterval(() => {
  currentDateTime.value = formatTime(new Date().getTime(), 'HH:mm:ss')
}, 1000)

const selectMenu = (value: string) => {
  console.log(value)
  switch (value) {
    case 'logout':
      logOut()
      break
    case 'management':
      router.push('/model/list')
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
  margin: 0;
  padding: 0;

  .icon-header-center {
    width: 40%;
    height: 110px;
    background-image: url('../../assets/images/home/icon-header-center.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;

    /* 用 mask 保持左右不拉伸，中间拉伸 */
    -webkit-mask: url('../../assets/images/home/icon-header-center.png') 0 0 / auto 100% stretch;
    mask: url('../../assets/images/home/icon-header-center.png') 0 0 / auto 100% stretch;

    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 17px;
    padding-bottom: 30px;

    span {
      // 超出隐藏并显示...
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
      text-align: center;
      // width: 70%;
    }
  }

  .icon-header-left {
    width: 30%;
    height: 110px;
    background-image: url('../../assets/images/home/icon-header-left.png');
    background-repeat: no-repeat;
    background-size: 100% 28px;
    background-position: left bottom;

    /* 用 mask 保持左右不拉伸，中间拉伸 */
    -webkit-mask: url('../../assets/images/home/icon-header-left.png') 0 0 / auto 100% stretch;
    mask: url('../../assets/images/home/icon-header-left.png') 0 0 / auto 100% stretch;

    padding-top: 10px;
    padding-left: 11px;

    .current-time-style {
      font-size: 24px;
      color: #ffffff;
      line-height: 34px;
    }

    .current-date-style {
      font-size: 16px;
      color: #ffffff;
      line-height: 22px;
    }

    .current-week-style {
      margin-left: 10px;
      font-size: 14px;
      color: #ffffff;
      line-height: 22px;
    }
  }

  .icon-header-right {
    width: 30%;
    height: 110px;
    background-image: url('../../assets/images/home/icon-header-right.png');
    background-repeat: no-repeat;
    background-size: 100% 28px;
    background-position: left bottom;

    /* 用 mask 保持左右不拉伸，中间拉伸 */
    -webkit-mask: url('../../assets/images/home/icon-header-right.png') 0 0 / auto 100% stretch;
    mask: url('../../assets/images/home/icon-header-right.png') 0 0 / auto 100% stretch;

    display: flex;
    justify-content: right;
    padding-top: 17px;

    .icon-header-right-button {
      height: 48px;
      min-width: 130px;
      padding: 6px 13px 6px 7px;
      font-size: 20px;
      color: #ffffff;
      line-height: 28px;
      letter-spacing: 2px;
      background: #1766b8;
      border-radius: 78px;
      border: 1px solid #77baff;
    }
  }
}
</style>
