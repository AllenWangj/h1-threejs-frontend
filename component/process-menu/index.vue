<template>
    <div class="process-menu">
        <div data-v-d10265b4="" class="list" @click="$router.push('/process/two/upload-file/file')" >
            <div class="shangchuan"></div>
            <span>上传文件</span>
        </div>
        <div class="list"  @click="$router.push('/process/two/params-set/params')">
            <div class="canshu"></div>
            <span>输入参数</span>
        </div>
        <div class="list" @click="$router.push('/process/two/generate-plan/generateplan')">
            <div class="fangan">
            </div><span>生成方案</span>
        </div>
    </div>
</template>
<script setup lang="ts">
// import {ref} from "vue"
</script>
<style lang="less" scoped>
.process-menu {
    width: 200px;
    height: 100%;
    background: linear-gradient(180deg, #fff, #deecff);
    border: 1px solid;
    -o-border-image: linear-gradient(180deg, #adcdf7, #9fc8ff) 1 1;
    border-image: linear-gradient(180deg, #adcdf7, #9fc8ff) 1 1;
    padding: 20px 14px;
    box-sizing: border-box;

    .list {
        width: 100%;
        height: 56px;
        background: linear-gradient(180deg, #fff, #deecff);
        border-radius: 2px 2px 2px 2px;
        border: 1px solid #adcdf7;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 14px;
        cursor: pointer;
        font-size: 16px;
        color: #000;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;

        .shangchuan {
            width: 30px;
            height: 30px;
            background: url(./shangchuan.svg) no-repeat;
            background-size: 30px 30px;
            margin-right: 10px;
        }

        .canshu {
            width: 30px;
            height: 30px;
            background: url(./canshu.svg) no-repeat;
            background-size: 30px 30px;
            margin-right: 10px;

        }

        .fangan {
            width: 30px;
            height: 30px;
            background: url(./fangan.svg) no-repeat;
            background-size: 30px 30px;
            margin-right: 10px;

        }

        &:hover {
            background: #3a83fc;
            box-shadow: 0 6px 6px 0 rgba(58, 131, 252, .25);
            border-radius: 4px 4px 4px 4px;
            color: #fff;
            font-weight: 700;
        }

        &.act {
            background: #3a83fc;
            box-shadow: 0 6px 6px 0 rgba(58, 131, 252, .25);
            border-radius: 4px 4px 4px 4px;
            color: #fff;
            font-weight: 700;

            .shangchuan {
                width: 30px;
                height: 30px;
                background: url(./shangchuan-active.svg) no-repeat;
                background-size: 30px 30px;
            }

            .canshu {
                width: 30px;
                height: 30px;
                background: url(./canshu-active.svg) no-repeat;
                background-size: 30px 30px;
            }

            .shangchuan {
                width: 30px;
                height: 30px;
                background: url(./fangan-active.svg) no-repeat;
                background-size: 30px 30px;
            }
        }

    }

}
</style>