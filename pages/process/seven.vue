<template>
  <div class="flex h-full w-full bg-white rounded-[4px]">
    <SubMenuSidebar :active-tab="isActiveTab" @on-change="tabChange" />
    <div class="flex-1 mx-[20px] my-[20px] border border-[1px] border-[#adcdf7]">
      <KeepAlive>
        <NuxtPage  />
      </KeepAlive>
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
    router.push('/process/seven/file')
  } else if (tab === 2) {
    router.push('/process/seven/form')
  } else if (tab === 3) {
    router.push('/process/seven/render')
  }
}

onMounted(() => {
  if (route.path === '/process/seven') {
    router.replace('/process/seven/file')
  }
})
</script>

<style lang="less" scoped></style>
