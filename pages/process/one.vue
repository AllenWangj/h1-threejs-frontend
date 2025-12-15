<template>
  <div class="process-new-page-container">
    <sub-menu-sidebar :active-tab="isActiveTab" @on-change="tabChange" />
    <div class="flex-1 overflow-hidden">
      <nuxt-page />
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()
console.log('route', route)

const isActiveTab = ref(2)

const projectId = ref('')

const tabChange = (tab: number) => {
  isActiveTab.value = tab
  if (tab === 1) {
    router.push({
      path: '/process/one/file',
      query: {
        projectId: projectId.value
      }
    })
  } else if (tab === 2) {
    router.push({
      path: '/process/one/form',
      query: {
        projectId: projectId.value
      }
    })
  } else if (tab === 3) {
    router.push({
      path: '/process/one/render',
      query: {
        projectId: projectId.value
      }
    })
  }
}

onMounted(() => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
  }
  if (route.path === '/process/six') {
    router.replace({
      path: '/process/six/form',
      query: {
        projectId: projectId.value
      }
    })
  } else if (route.path === '/process/six/file') {
    // isActiveTab.value = 1
  } else if (route.path === '/process/six/form') {
    isActiveTab.value = 2
  } else if (route.path === '/process/six/render') {
    isActiveTab.value = 3
  }
})
</script>

<style lang="less" scoped>
:deep(.add-block-button) {
  width: 165px;
  height: 73px;
  background-image: url('../../assets/images/home/icon-input-button-bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #ffffff;
  line-height: 33px;
  margin-left: auto;
  cursor: pointer;

  span {
    margin-left: 10px;
  }
}

.plot-wrapper {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 14px 54px;

  .plot-item {
    display: flex;
    flex-direction: column;
    width: 406px;
    margin: 0 55px 55px 0;
    background: linear-gradient(180deg, #0865bc 0%, #002051 100%);
    box-shadow:
      0px 0px 12px 0px #125091,
      inset 0px 0px 13px 0px #0796fd;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;

    &:hover {
      box-shadow:
        0px 0px 24px 0px #125091,
        inset 0px 0px 27px 0px #0796fd;
    }
  }
}
</style>
