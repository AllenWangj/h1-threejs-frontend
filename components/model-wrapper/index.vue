<template>
    <div class="wrapper">
        <slot></slot>
        <!-- <img :src="image1" /> -->
    </div>
</template>
<script setup lang="ts">

</script>
<style lang="less" scoped>
.wrapper {
    width: 100px;
    // height: 92px;
    background: #568FCC;
    border-radius: 8px;
    border: 1px solid #6197D6;
    padding: 10px;
    margin-bottom:10px;
    pointer-events: auto;
    cursor: pointer;
}
</style>