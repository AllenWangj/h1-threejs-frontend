<template>
  <div class="flex h-full w-full bg-white rounded-[4px] process-page-container">
    <SubMenuSidebar :active-tab="isActiveTab" @on-change="tabChange" />
    <div class="flex-1 mx-[20px] my-[20px]">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
import SubMenuSidebar from '@/components/sub-mune-sidebar/index.vue'
const router = useRouter()
const route = useRoute()
console.log('route', route)

const projectId = ref(route.query.projectId || '')
const isActiveTab = ref(1)

const tabChange = (tab: number) => {
  isActiveTab.value = tab
  if (tab === 1) {
    router.push({
      path: '/process/five/file',
      query: {
        projectId: projectId.value
      }
    })
  } else if (tab === 2) {
    router.push({
      path: '/process/five/form',
      query: {
        projectId: projectId.value
      }
    })
  } else if (tab === 3) {
    router.push({
      path: '/process/five/render',
      query: {
        projectId: projectId.value
      }
    })
  }
}

onMounted(() => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId
  }
  if (route.path === '/process/five') {
    router.replace({
      path: '/process/five/file',
      query: {
        projectId: projectId.value
      }
    })
  }
})
</script>
