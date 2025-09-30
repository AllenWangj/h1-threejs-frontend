<template>
  <div class="w-full h-full flex">
    <div class="w-[280px] bg-[#f8f9fa] rounded-[4px] flex flex-col items-center">
      <div class="pointer flex flex-col justify-center items-center py-[30px]" @click="handleCreateProject">
        <img src="../../assets/images/home/addIcon.svg" alt="add" class="w-[44px] h-[44px]" />
        <span class="text-[#333333] text-[14px] mt-[10px]">新建项目</span>
      </div>
      <div class="w-[100%] h-[1px] bg-[#9CC6ED]"></div>
      <div class="mt-[20px] w-[100%] px-[10px]">
        <el-input v-model="searchText" placeholder="Please input" class="w-[100%]">
          <template #append>
            <el-button :icon="Search" class="!text-[#fff] !rounded-[0]" style="background: linear-gradient(#3a83fc 16%,#a0c6ff);" />
          </template>
        </el-input>
      </div>
      <div class="list-wrap">
        <div class="list-wrap-item" v-for="n in 5" :key="n">
          <div class="list-wrap-item-header w-[100%] flex items-center justify-between">
            <p class="list-wrap-item-header__title">wwwwwwwwwwwwwwwwwwwwwwww</p>
            <span class="flex-1"></span>
            <img class="list-wrap-item-header__edit" src="../../assets/images/home/edit.svg" alt="" />
            <div v-if="n === 1" class="list-wrap-item-header__status status-ongoing" @click="handlepushLibarty">进行中</div>
            <div v-else-if="n === 2" class="list-wrap-item-header__status status-done" @click="handlepushLibarty">已完成</div>
            <div v-else class="list-wrap-item-header__status" @click="handlepushLibarty">进行中</div>
          </div>
          <div class="list-wrap-item-body">
            <div class="body-item">
              <img class="w-[16px] h-[16px] icon" src="../../assets/images/home/type.svg" alt="" />
              <span class="title">地址决策</span>
              <span class="status status-done">已完成</span>
            </div>
            <div class="body-item">
              <img class="w-[16px] h-[16px] icon" src="../../assets/images/home/type.svg" alt="" />
              <span class="title">规划布局</span>
              <span class="status status-ongoing">进行中</span>
            </div>
            <div class="body-item">
              <img class="w-[16px] h-[16px] icon" src="../../assets/images/home/type.svg" alt="" />
              <span class="title">内部结构</span>
              <span class="status">未选择</span>
            </div>
            <div class="body-item">
              <img class="w-[16px] h-[16px] icon" src="../../assets/images/home/type.svg" alt="" />
              <span class="title">结构设计</span>
              <span class="status">未选择</span>
            </div>
            <div class="body-item">
              <img class="w-[16px] h-[16px] icon" src="../../assets/images/home/type.svg" alt="" />
              <span class="title">部件生产</span>
              <span class="status">未选择</span>
            </div>
            <div class="body-item">
              <img class="w-[16px] h-[16px] icon" src="../../assets/images/home/type.svg" alt="" />
              <span class="title">运输保障</span>
              <span class="status">未选择</span>
            </div>
            <div class="body-item">
              <img class="w-[16px] h-[16px] icon" src="../../assets/images/home/type.svg" alt="" />
              <span class="title">现场组装</span>
              <span class="status">未选择</span>
            </div>
            <div class="body-item">
              <img class="w-[16px] h-[16px] icon" src="../../assets/images/home/timeIcon.svg" alt="" />
              <span class="title">创建时间</span>
              <span class="status">2023-01-01 00:00:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="relative flex-1 ml-[15px] home-background">
      <RouterLink to="/process/one" class="text-[#007bff] mx-[10px] step-button step-button-1">
        <div>
          <span v-if="false" class="status-unselected">未选择</span>
          <span v-if="false" class="status-ongoing">进行中</span>
          <span v-if="true" class="status-done">已完成</span>
        </div>
      </RouterLink>
      <RouterLink to="/process/two" class="text-[#007bff] mx-[10px] step-button step-button-2">
        <div>
          <span v-if="false" class="status-unselected">未选择</span>
          <span v-if="true" class="status-ongoing">进行中</span>
          <span v-if="false" class="status-done">已完成</span>
        </div>
      </RouterLink>
      <RouterLink to="/process/three" class="text-[#007bff] mx-[10px] step-button step-button-3">
        <div>
          <span v-if="true" class="status-unselected">未选择</span>
          <span v-if="false" class="status-ongoing">进行中</span>
          <span v-if="false" class="status-done">已完成</span>
        </div>
      </RouterLink>
      <RouterLink to="/process/four" class="text-[#007bff] mx-[10px] step-button step-button-4">
        <div>
          <span v-if="true" class="status-unselected">未选择</span>
          <span v-if="false" class="status-ongoing">进行中</span>
          <span v-if="false" class="status-done">已完成</span>
        </div>
      </RouterLink>
      <RouterLink to="/process/five" class="text-[#007bff] mx-[10px] step-button step-button-5">
        <div>
          <span v-if="true" class="status-unselected">未选择</span>
          <span v-if="false" class="status-ongoing">进行中</span>
          <span v-if="false" class="status-done">已完成</span>
        </div>
      </RouterLink>
      <RouterLink to="/process/six" class="text-[#007bff] mx-[10px] step-button step-button-6">
        <div>
          <span v-if="true" class="status-unselected">未选择</span>
          <span v-if="false" class="status-ongoing">进行中</span>
          <span v-if="false" class="status-done">已完成</span>
        </div>
      </RouterLink>
      <RouterLink to="/process/seven" class="text-[#007bff] mx-[10px] step-button step-button-7">
        <div>
          <span v-if="true" class="status-unselected">未选择</span>
          <span v-if="false" class="status-ongoing">进行中</span>
          <span v-if="false" class="status-done">已完成</span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@maxtan/ez-ui-icons'
definePageMeta({
  permissions: 'home'
})

const router = useRouter()

const searchText = ref('')
function handleCreateProject() {
  router.push('/fivelibary')
}

function handlepushLibarty() {
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
    cursor: pointer;
    width: 100%;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(116,166,248,.2);
    border-radius: 4px;
    border: 1px solid #fff;
    padding: 10px;
    margin-bottom: 15px;

    &:hover {
      border: 1px solid #3a83fc;

      .list-wrap-item-header {
        .list-wrap-item-header__title {
          color: #3a83fc;
        }

      }
    }

    .list-wrap-item-header {
      padding: 10px 0;
      border-bottom: 1px solid #9cc6ed;

      .list-wrap-item-header__title {
        font-size: 14px;
        color: #333;
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
        width: 60px;
        line-height: 24px;
        text-align: center;
        flex-shrink: 0;
        font-size: 12px;
        color: #fff;
        background: #acb3c1;
        border-radius: 23px;
      }

      .list-wrap-item-header__status.status-ongoing {
        background: linear-gradient(270deg,rgba(255,218,55,.4),#ffc118);
        color: #ff8206;
      }
      .list-wrap-item-header__status.status-done {
        background: linear-gradient(270deg,#e5eeff,#b3cfff);
        color: #3a83fc;
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
          font-size: 13px;
          color: #333;
          // 超出省略号
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .status {
          font-size: 13px;
          color: #777;
        }

        .status-ongoing {
          color: #ff8206;
        }

        .status-done {
          color: #3a83fc;
        }
      }
    }
  }
}

.home-background {
  position: relative;
  background-image: url('../../assets/images/home/homeRightBk.png');
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

    &>div {
      position: relative;
      width: 172px;
      height: 49px;

      &>span {
        position: absolute;
        top: -12px;
        right: -30px;
        display: inline-block;
        width: 60px;
        height: 24px;
        border-radius: 23px 23px 23px 23px;
        font-size: 12px;
        text-align: center;
        line-height: 24px;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
      }

      &>.status-unselected {
        background: #acb3c1;
        color: #fff;
      }

      &>.status-ongoing {
        background: linear-gradient(270deg,rgba(255,218,55,.4),#ffc118);
        color: #ff8206;
      }

      &>.status-done {
        background: linear-gradient(270deg, #e5eeff, #b3cfff);
        color: #3a83fc;
      }

    }
  }

  .step-button-1 {
    top: 40%;
    left: 3.5%;
    background-image: url('../../assets/images/home/1-1.svg');

    &:hover {
      &>div {
        background-image: url('../../assets/images/home/1-2.svg');
      }
    }
  }

  .step-button-2 {
    top: 60%;
    left: 14.5%;
    background-image: url('../../assets/images/home/2-1.svg');

    &:hover {
      &>div {
        background-image: url('../../assets/images/home/2-2.svg');
      }
    }
  }

  .step-button-3 {
    top: 67%;
    left: 31.5%;
    background-image: url('../../assets/images/home/3-1.svg');

    &:hover {
      &>div {
        background-image: url('../../assets/images/home/3-2.svg');
      }
    }
  }

  .step-button-4 {
    top: 67%;
    left: 51.5%;
    background-image: url('../../assets/images/home/4-1.svg');

    &:hover {
      &>div {
        background-image: url('../../assets/images/home/4-2.svg');
      }
    }
  }

  .step-button-5 {
    top: 60%;
    left: 69.5%;
    background-image: url('../../assets/images/home/5-1.svg');

    &:hover {
      &>div {
        background-image: url('../../assets/images/home/5-2.svg');
      }
    }
  }

  .step-button-6 {
    top: 40%;
    left: 82.5%;
    background-image: url('../../assets/images/home/6-1.svg');

    &:hover {
      &>div {
        background-image: url('../../assets/images/home/6-2.svg');
      }
    }
  }

  .step-button-7 {
    top: 21%;
    left: 66.5%;
    background-image: url('../../assets/images/home/7-1.svg');

    &:hover {
      &>div {
        background-image: url('../../assets/images/home/7-2.svg');
      }
    }
  }
}
</style>
