<template>
  <div class="flex flex-shrink-0 w-[100%] h-[100%] relative">
    <schemes-list></schemes-list>
    <div class="flex-1 relative border border-[1px] border-[#adcdf7]">
       <div class="plan-and-plan_tree" ref="three"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SchemesList from '@/components/schemes-list/index.vue'
import {ref,onMounted} from "vue"
const three = ref()
import Threeobject from "~~/threejs/three/index.ts"
let processTwo: Threeobject | null = null
onMounted(()=>{
    processTwo = new Threeobject(three.value,{
      progress:() =>{}
    })
})
</script>

<style lang="less" scoped>

.plan-and-plan_tree {
  width: 100%;
  height: 100%;
}
</style>
