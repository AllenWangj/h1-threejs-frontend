<template>
    <div class="two-wrapper">
        <ProcessMenu />
        <div class="next-page-connnntent">
            <NuxtPage />
             <!-- <PlanAndLayout/> -->
        </div>
    </div>
</template>
<script setup lang="ts">
import ProcessMenu from "~~/component/process-menu/index.vue"
// import PlanAndLayout from "~~/component/PlanAndLayout/index.vue"
</script>
<style lang="less" scoped>
.two-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    // gap: 20px;
    .next-page-connnntent {
        flex: 1;
        background: linear-gradient(180deg, #fff, #deecff);
        border: 1px solid;
        -o-border-image: linear-gradient(180deg, #adcdf7, #9fc8ff) 1 1;
        border-image: linear-gradient(180deg, #adcdf7, #9fc8ff) 1 1;
        border-left: 0;
        margin: 20px;
        height:calc(100% - 40px);

        box-sizing: border-box;
    }
}
</style>
