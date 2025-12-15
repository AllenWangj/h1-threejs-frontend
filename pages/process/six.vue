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
      path: '/process/six/file',
      query: {
        projectId: projectId.value
      }
    })
  } else if (tab === 2) {
    router.push({
      path: '/process/six/form',
      query: {
        projectId: projectId.value
      }
    })
  } else if (tab === 3) {
    router.push({
      path: '/process/six/render',
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

<style lang="less" scoped></style>
