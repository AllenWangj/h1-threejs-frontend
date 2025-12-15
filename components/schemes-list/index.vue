<template>
  <div class="schemes-list-container">
    <div class="flex items-center pt-[37px] pb-[26px] px-[35px]">
      <img src="../../assets/images/home/schemes-icon.svg" alt="" width="22" height="22" />
      <span class="text-[20px] ml-[8px] text-[#fff]">方案名称</span>
      <span class="flex-1"></span>
      <span class="text-[14px] text-[#CEE6FF]">
        已生成
        <span class="text-[14px] text-[#CEE6FF]">{{ props.list.length }}</span>
        个方案
      </span>
    </div>
    <div class="schemes-list-wrapper">
      <div
        class="scheme-item"
        v-for="item in props.list"
        :key="item.id"
        :class="item.id === current ? 'is-active' : ''"
        @click="handleTapScheme(item)"
      >
        <div class="flex-1 mr-[20px]">
          <div class="flex items-center justify-between">
            <span class="text-[18px] font-bold text-[#ffffff]">{{ item.name }}</span>
            <slot name="opt" :record="item"></slot>
          </div>
          <div class="flex flex-col mt-[8px]">
            <span class="text-[14px] text-[#CEE6FF]">评分：{{ Number(item.score) }}分</span>
            <span class="text-[14px] text-[#CEE6FF]">时间：{{ formatTime(item.updatedAt, 'YYYY-MM-DD HH:mm:ss') }}</span>
          </div>
        </div>
        <!-- <img src="../../assets/images/home/xiala.svg" alt="" width="20px" height="20px" /> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { formatTime } = useUtils()

const emits = defineEmits<{
  (e: 'tapScheme', item: any): void
}>()

const props = defineProps<{
  list: any[]
  current: string
}>()

const activeScheme = ref('')

watchEffect(() => {
  if (props.current !== activeScheme.value) {
    activeScheme.value = props.current
  }
})

const handleTapScheme = (item: any) => {
  // if (item.id === activeScheme.value) return
  activeScheme.value = item.id
  emits('tapScheme', item)
}
</script>

<style lang="less" scoped>
.schemes-list-container {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  width: 336px;
  background: #09488a;

  .schemes-list-wrapper {
    flex: 1;
    padding: 14px;
    overflow-y: auto;

    .scheme-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 21px;
      margin-bottom: 10px;
      background: rgba(86, 143, 204, 0.43);
      border-radius: 8px;
      border: 1px solid #3a78c0;
    }

    .scheme-item.is-active {
      background: #568FCC;
      border: 1px solid #3A78C0;
    }
  }
}
</style>
