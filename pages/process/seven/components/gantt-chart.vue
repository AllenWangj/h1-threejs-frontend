<template>
  <div ref="ganttContainer" class="gantt-container"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { gantt } from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'

const props = defineProps({
  tasks: {
    type: Object,
    default: () => ({ data: [], links: [] })
  }
})

const ganttContainer = ref(null)

onMounted(async () => {
  // 必须等待 Vue 将组件挂载到 DOM
  await nextTick()

  // 1. 配置甘特图（可选）
  gantt.config.date_format = '%Y-%m-%d %H:%i'
  gantt.config.readonly = true;
  gantt.i18n.setLocale('cn') // 设置中文

  // 2. 初始化挂载
  gantt.init(ganttContainer.value)

  // 3. 渲染数据
  gantt.parse(props.tasks)
})

// 监听数据变化（如果是从后端动态获取）
watch(
  () => props.tasks,
  (newData) => {
    gantt.clearAll()
    gantt.parse(newData)
  },
  { deep: true }
)


/**
 * 获取编辑后数据
 */
const getGanttData = () => {
  // serialize() 会返回一个包含 data 和 links 的对象
  const currentData = gantt.serialize()

  return currentData
}

defineExpose({
    getGanttData
})

</script>

<style scoped>
.gantt-container {
  width: 100%;
  height: 500px; /* 必须指定高度，否则看不见 */
}
</style>
