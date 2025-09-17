<template>
  <div class="w-full h-full flex">
    <div class="w-[280px] bg-[#f8f9fa] rounded-[4px] flex flex-col items-center">
      <div class="pointer flex flex-col justify-center items-center py-[30px]"  @click="handleCreateProject">
        <img src="../assets/images/home/addIcon.svg" alt="add" class="w-[44px] h-[44px]" />
        <span class="text-[#333333] text-[14px] mt-[10px]">新建项目</span>
      </div>
      <div class="w-[100%] h-[1px] bg-[#9CC6ED]"></div>
      <div class="mt-[20px] w-[100%] px-[10px]">
        <el-input v-model="searchText" placeholder="Please input" class="w-[100%]">
          <template #append>
            <el-button :icon="Search" class="!bg-[#9CC6ED] !text-[#fff] !rounded-[0]" />
          </template>
        </el-input>
      </div>
      <div class="list-wrap">
        <div class="list-wrap-item" v-for="n in 5" :key="n">
          <div class="list-wrap-item-header w-[100%] flex items-center justify-between">
            <p class="list-wrap-item-header__title">wwwwwwwwwwwwwwwwwwwwwwww</p>
            <span class="flex-1"></span>
            <img class="list-wrap-item-header__edit" src="../assets/images/home/edit.svg" alt="" />
            <div class="list-wrap-item-header__status" @click="handlepushLibarty">进行中</div>
          </div>
          <div class="list-wrap-item-body">
            <div class="body-item">
              <img class="w-[20px] h-[20px] icon" src="../assets/images/home/type.svg" alt="" />
              <span class="title">地址决策</span>
              <span class="status status-ongoing">进行中</span>
            </div>
            <div class="body-item">
              <img class="w-[20px] h-[20px] icon" src="../assets/images/home/type.svg" alt="" />
              <span class="title">规划布局</span>
              <span class="status">未选择</span>
            </div>
            <div class="body-item">
              <img class="w-[20px] h-[20px] icon" src="../assets/images/home/type.svg" alt="" />
              <span class="title">内部结构</span>
              <span class="status">未选择</span>
            </div>
            <div class="body-item">
              <img class="w-[20px] h-[20px] icon" src="../assets/images/home/type.svg" alt="" />
              <span class="title">结构设计</span>
              <span class="status">未选择</span>
            </div>
            <div class="body-item">
              <img class="w-[20px] h-[20px] icon" src="../assets/images/home/type.svg" alt="" />
              <span class="title">部件生产</span>
              <span class="status">未选择</span>
            </div>
            <div class="body-item">
              <img class="w-[20px] h-[20px] icon" src="../assets/images/home/type.svg" alt="" />
              <span class="title">运输保障</span>
              <span class="status">未选择</span>
            </div>
            <div class="body-item">
              <img class="w-[20px] h-[20px] icon" src="../assets/images/home/type.svg" alt="" />
              <span class="title">现场组装</span>
              <span class="status">未选择</span>
            </div>
            <div class="body-item">
              <img class="w-[20px] h-[20px] icon" src="../assets/images/home/timeIcon.svg" alt="" />
              <span class="title">创建时间</span>
              <span class="status">2023-01-01 00:00:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1 ml-[15px] home-background">
      <RouterLink to="/process/one" class="text-[#007bff] mx-[10px] step-button step-button-1">
        <img src="../assets/images/home/1-1.svg" alt="Step 1" class="w-[60%]" />
      </RouterLink>
      <RouterLink to="/process/two" class="text-[#007bff] mx-[10px] step-button step-button-2">
        <img src="../assets/images/home/2-1.svg" alt="Step 2" class="w-[60%]" />
      </RouterLink>
      <RouterLink to="/process/three" class="text-[#007bff] mx-[10px] step-button step-button-3">
        <img src="../assets/images/home/3-1.svg" alt="Step 3" class="w-[60%]" />
      </RouterLink>
      <RouterLink to="/process/four" class="text-[#007bff] mx-[10px] step-button step-button-4">
        <img src="../assets/images/home/4-1.svg" alt="Step 4" class="w-[60%]" />
      </RouterLink>
      <RouterLink to="/process/five" class="text-[#007bff] mx-[10px] step-button step-button-5">
        <img src="../assets/images/home/5-1.svg" alt="Step 5" class="w-[60%]" />
      </RouterLink>
      <RouterLink to="/process/six" class="text-[#007bff] mx-[10px] step-button step-button-6">
        <img src="../assets/images/home/6-1.svg" alt="Step 6" class="w-[60%]" />
      </RouterLink>
      <RouterLink to="/process/seven" class="text-[#007bff] mx-[10px] step-button step-button-7">
        <img src="../assets/images/home/7-1.svg" alt="Step 7" class="w-[60%]" />
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
const router = useRouter()

const searchText = ref('')
function handleCreateProject(){
router.push('/fivelibary')
}

function handlepushLibarty(){
router.push('/show-mode-libary')
}
</script>

<style lang="less" scoped>
:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #9cc6ed inset;
}

.list-wrap {
  flex: 1;
  width: 100%;
  margin-top: 10px;
  padding: 0 10px 10px;
  overflow-y: auto;

  .list-wrap-item {
    width: 100%;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 15px;

    .list-wrap-item-header {
      padding: 10px 0;
      border-bottom: 1px solid #9cc6ed;

      .list-wrap-item-header__title {
        font-size: 14px;
        font-weight: bold;
        // 超出省略号
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .list-wrap-item-header__edit {
        flex-shrink: 0;
        margin: 0 8px;
        width: 24px;
        height: 24px;
        cursor: pointer;
      }

      .list-wrap-item-header__status {
        flex-shrink: 0;
        background-image: linear-gradient(to right, #fdbd0d, #e4d86a);
        font-size: 12px;
        color: #fff;
        padding: 4px 8px;
        border-radius: 4px;
      }
    }
    .list-wrap-item-body {
      margin-top: 10px;

      .body-item {
        display: flex;
        align-items: center;
        padding: 5px 0;
        
        .icon {
          flex-shrink: 0;
          margin-right: 8px;
        }

        .title {
          flex: 1;
          font-size: 14px;
          // 超出省略号
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .status {
          font-size: 14px;
          color: #999;
        }

        .status-ongoing {
          color: #fdbd0d;
        }
      }
    }
  }
}

.home-background {
  position: relative;
  background-image: url('../assets/images/home/homeRightBk.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;

  .step-button {
    position: absolute;
    background: rgba(255, 255, 255, 0);
    width: 13%;
    height: 27%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .step-button-1 {
    top: 40%;
    left: 3%;
  }

  .step-button-2 {
    top: 60%;
    left: 14%;
  }

  .step-button-3 {
    top: 67%;
    left: 31%;
  }

  .step-button-4 {
    top: 67%;
    left: 51%;
  }

  .step-button-5 {
    top: 60%;
    left: 69%;
  }

  .step-button-6 {
    top: 40%;
    left: 82%;
  }

  .step-button-7 {
    top: 21%;
    left: 66%;
  }
}
</style>
