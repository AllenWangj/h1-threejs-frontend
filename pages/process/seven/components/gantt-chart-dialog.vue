<template>
  <ez-dialog title="项目排期" width="1200" v-model="visible" confirm-text="" cancel-text="" class="h-[600px]" @confirm="submit">
    <GanttChart v-if="visible" ref="ganttChartRef" :tasks="tasksData" />
  </ez-dialog>
</template>

<script setup>
import { ref } from 'vue'
import GanttChart from './gantt-chart.vue'

const visible = ref(false)
const ganttChartRef = ref(null)

const tasksData = ref({
  data: [
    { id: 1, text: '步骤1', start_date: '2025-12-24', duration: 20, progress: 0.6 },
    { id: 2, text: '步骤2', start_date: '2025-12-26', duration: 10, progress: 0.6 },
    { id: 3, text: '步骤3', start_date: '2025-12-26', duration: 10, progress: 0.6 },
    { id: 4, text: '步骤4', start_date: '2025-12-26', duration: 5, progress: 0.6 },
    { id: 5, text: '步骤5', start_date: '2025-12-26', duration: 15, progress: 0.6 },
    { id: 6, text: '步骤6', start_date: '2025-12-26', duration: 10, progress: 0.6 },
    { id: 7, text: '步骤7', start_date: '2025-12-26', duration: 5, progress: 0.6 },
    { id: 8, text: '步骤8', start_date: '2025-12-26', duration: 6, progress: 0.6 },
    { id: 9, text: '步骤9', start_date: '2025-12-26', duration: 7, progress: 0.6 },
    { id: 10, text: '步骤10', start_date: '2025-12-26', duration: 3, progress: 0.6 },
    { id: 11, text: '步骤11', start_date: '2025-12-26', duration: 2, progress: 0.6 },
    { id: 12, text: '步骤12', start_date: '2025-12-26', duration: 1, progress: 0.6 },
    { id: 13, text: '步骤13', start_date: '2025-12-26', duration: 4, progress: 0.6 },
    { id: 14, text: '步骤14', start_date: '2025-12-26', duration: 5, progress: 0.6 },
    { id: 15, text: '步骤15', start_date: '2025-12-26', duration: 7, progress: 0.6 },
    { id: 16, text: '步骤16', start_date: '2025-12-26', duration: 2, progress: 0.6 },
    { id: 17, text: '步骤17', start_date: '2025-12-26', duration: 3, progress: 0.6 },
    { id: 18, text: '步骤18', start_date: '2025-12-26', duration: 5, progress: 0.6 },
    { id: 19, text: '步骤19', start_date: '2025-12-26', duration: 3, progress: 0.6 },
    { id: 20, text: '步骤20', start_date: '2025-12-26', duration: 5, progress: 0.6 },
    { id: 21, text: '步骤21', start_date: '2025-12-26', duration: 7, progress: 0.6 },
    { id: 22, text: '步骤22', start_date: '2025-12-26', duration: 3, progress: 0 }
  ],
  links: [
    { id: 1, source: 1, target: 2, type: 0 },
  ]
})

const submit = () => {
  const currentData = ganttChartRef.value.getGanttData()

  console.log('当前全量任务数据：', currentData.data)
  console.log('当前全量连线数据：', currentData.links)
  visible.value = false
}

const open = () => {
  visible.value = true
}

defineExpose({
  open
})
</script>
