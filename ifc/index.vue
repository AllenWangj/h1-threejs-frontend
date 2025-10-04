<template>
    <div style="width:100%;height:100%" ref="three"></div>
</template>
<script setup lang="ts">
import {ref,onMounted} from "vue"
import IFC from "~~/threejs/ifc/index"
// 
const three = ref()

onMounted(() =>{
    new IFC(three.value)
})
</script>