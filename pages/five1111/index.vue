<template>
    <div class="libary" >
        <div class="three" ref="libary"></div>
    </div>
</template>
<script setup lang="ts">
import {ref,onMounted} from "vue"
const libary = ref()
import FiveLibary from "~~/utils/five-libary.ts"
onMounted(() =>{

})
</script>
<style lang="less" scoped>
.libary {
    width:100%;
    height:100%;
    background:#f0f0f0  ;
    .three{
        width:100%;
    height:100%;
    background:#f0f0f0  ;   
    }
}
</style>