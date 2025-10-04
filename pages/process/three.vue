<template>
    <div class="two-wrapper">
        <ProcessMenu 
            uploadFileUrl="/process/three/upload-file/file"
        paramsSetUrl="/process/three/params-set/params"
        createUrl="/process/three/generate-plan/generateplan"
        />
        <div class="next-page-connnntent">
            <NuxtPage />
        </div>
    </div>
</template>
<script setup lang="ts">
import ProcessMenu from "~~/component/process-menu/index.vue"
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
