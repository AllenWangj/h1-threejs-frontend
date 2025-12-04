<template>
    <div style="width:800px;height:800px" ref="three">222</div>
</template>
<script setup lang="ts">
import {ref,onMounted} from "vue"
import {useRender} from "./source"
const three = ref()
onMounted(() =>{
    const {IFC} = useRender()
    new IFC(three.value)
})
</script>