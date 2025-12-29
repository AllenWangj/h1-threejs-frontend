<template>
  <div ref="ganttContainer" class="gantt-container"></div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue' // ✅ 1. 导入 nextTick
import { gantt } from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'

const props = defineProps({
  tasks: {
    type: Object,
    default: () => ({ data: [], links: [] })
  }
})

const ganttContainer = ref(null)
let isUpdating = ref(false) // ✅ 2. 添加更新锁，防止循环

onMounted(async () => {
  // 等待 DOM 挂载
  await nextTick()

  // 配置甘特图（只配置一次）
  gantt.config.date_format = '%Y-%m-%d %H:%i'
  gantt.config.readonly = true
  gantt.i18n.setLocale('cn')

  // 初始化挂载
  gantt.init(ganttContainer.value)

  // 首次渲染数据
  if (props.tasks.data.length > 0) {
    gantt.parse(props.tasks)
  }
})

// ✅ 3. 优化 watch：添加防抖和循环保护
watch(
  () => props.tasks,
  async (newData, oldData) => {
    // 防止循环：如果正在更新，跳过本次
    if (isUpdating.value) return

    // 防抖：等待下一帧，确保数据稳定
    await nextTick()

    try {
      isUpdating.value = true

      // 清空并重新加载数据
      gantt.clearAll()

      // 确保数据存在且有效
      if (newData && newData.data && newData.data.length > 0) {
        gantt.parse(newData)
      }

      // 强制刷新视图
      gantt.render()

    } finally {
      // 释放锁，但延迟释放避免快速连续触发
      setTimeout(() => {
        isUpdating.value = false
      }, 100)
    }
  },
  {
    deep: true,
    // 不要在初始化时立即执行，避免不必要的渲染
    // immediate: false (默认就是 false)
  }
)

/**
 * 获取编辑后数据
 */
const getGanttData = () => {
  try {
    const currentData = gantt.serialize()
    return currentData
  } catch (error) {
    console.error('获取甘特图数据失败:', error)
    return { data: [], links: [] }
  }
}

// ✅ 4. 提供销毁钩子，清理资源
onUnmounted(() => {
  if (gantt) {
    gantt.destructor() // 清理 gantt 实例
  }
})

defineExpose({
  getGanttData
})
</script>

<style scoped>
.gantt-container {
  width: 100%;
  height: 500px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
