<template>
  <div class="flex h-full w-full bg-white rounded-[4px] process-page-container">
    <sub-menu-sidebar :active-tab="isActiveTab" @on-change="tabChange" />
    <div class="flex-1 mx-[20px] my-[20px]">
      <nuxt-page />
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()
console.log('route', route)

const projectId = ref('')

const isActiveTab = ref(1)

const tabChange = (tab: number) => {
  isActiveTab.value = tab
  if (tab === 1) {
    router.push({
      path: '/process/two/file',
      query: {
        projectId: projectId.value
      }
    })
  } else if (tab === 2) {
    router.push({
      path: '/process/two/form',
      query: {
        projectId: projectId.value
      }
    })
  } else if (tab === 3) {
    router.push({
      path: '/process/two/render',
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
  if (route.path === '/process/two') {
    router.replace({
      path: '/process/two/file',
      query: {
        projectId: projectId.value
      }
    })
  } else if (route.path === '/process/two/file') {
    isActiveTab.value = 1
  } else if (route.path === '/process/two/form') {
    isActiveTab.value = 2
  } else if (route.path === '/process/two/render') {
    isActiveTab.value = 3
  }
})
</script>
