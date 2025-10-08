<template>
  <div class="flex flex-shrink-0 w-[100%] h-[100%] relative">
    <schemes-list></schemes-list>
    <div class="flex-1 relative border border-[1px] border-[#adcdf7]">
      <div ref="threeContainer" class="three-container"></div>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SchemesList from '@/components/schemes-list/index.vue'
import * as THREE from 'three'
import SixObject from "~~/threejs/six/index.ts"
const threeContainer = ref()
onMounted(() =>{
  new SixObject(threeContainer.value)
})
</script>

<style>
.three-container {
  width: 100%;
  height: 100%;
  background: #000;
}

.toolbar-container {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 999;
  background: transparent;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;

  .el-button {
    margin: 0;
    margin-bottom: 10px;
  }
}
</style>
