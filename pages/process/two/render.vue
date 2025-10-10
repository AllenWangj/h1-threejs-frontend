<template>
  <div class="flex flex-shrink-0 w-[100%] h-[100%] relative">
    <schemes-list></schemes-list>
    <div class="flex-1 relative border border-[1px] border-[#adcdf7]">
      <div class="plan-and-plan_tree" ref="renderRef"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SchemesList from '@/components/schemes-list/index.vue'
import { useRender } from './composables/use-render'

const renderRef = ref<HTMLDivElement | null>(null)
const { RenderPlanLayout } = useRender()
let renderPlanLayout: InstanceType<typeof RenderPlanLayout> | null = null
onMounted(() => {
  renderPlanLayout = new RenderPlanLayout(renderRef.value)
})
</script>

<style lang="less" scoped>
.plan-and-plan_tree {
  width: 100%;
  height: 100%;
}
</style>
