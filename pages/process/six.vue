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

const isActiveTab = ref(1)

const tabChange = (tab: number) => {
  isActiveTab.value = tab
  if (tab === 1) {
    router.push('/process/six/file')
  } else if (tab === 2) {
    router.push('/process/six/form')
  } else if (tab === 3) {
    router.push('/process/six/render')
  }
}

onMounted(() => {
  if (route.path === '/process/six') {
    router.replace('/process/six/file')
  }
})
</script>

<style lang="less" scoped></style>
