<template>
  <div class="flex flex-shrink-0 w-[100%] h-[100%] relative">
    <schemes-list></schemes-list>
    <div class="flex-1 relative border border-[1px] border-[#adcdf7]">
      <div class="three-content" ref="four"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SchemesList from '@/components/schemes-list/index.vue'
import FourObject from "~~/threejs/four/index.ts"
import {ref} from "vue"
const four = ref()
let processFour: FourObject | null = null
onMounted(()=>{
    processFour = new FourObject(four.value,{
      progress:() =>{}
    })
})
</script>

<style lang="less" scoped>
.three-content {
  width:100%;
  height:100%
}


</style>
