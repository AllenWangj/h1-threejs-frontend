<template>
    <div class="inputParameter">
        <div class="parameter-checkbox">
            <el-checkbox v-model="selectWhole" @change="selectAllEvt">全选</el-checkbox>
        </div>
        <el-collapse v-model="activeNames">
            <el-collapse-item :name="index" v-for="(item, index) in paramsList" :key="index">
                <template #title>
                    <div style="padding-left: 10px;">
                        <el-checkbox v-model="item.collapse" @click.stop="() => 0">{{ item.collapseTitle
                        }}</el-checkbox>
                    </div>
                </template>
                <div class="collapse-content">
                    <el-radio-group v-model="item.radio" style="flex-direction: column;">
                        <div v-for="(group, index) in item.groupList" :key="index">
                            <el-radio class="block-radio" :value="group">{{ group
                                }}</el-radio>
                        </div>
                    </el-radio-group>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue"
const activeNames = ref([])
const selectWhole = ref(true)
const paramsList = ref([
    {
        type: 0,
        collapse: true,
        collapseTitle: "典型目标区域",
        radio: '默认',
        groupList: [
            "默认",
            "*",
            "**",
            "***"
        ]
    },
    {
        type: 1,
        collapse: true,
        radio: '默认',

        collapseTitle: "土地规划",
        groupList: [
            "默认",
        ]
    },
    {
        type: 2,
        collapse: true,
        radio: '默认',
        collapseTitle: "功能划分",

        groupList: [
            "默认",
            "集中式",
            "分散式"
        ]
    },
    {
        type: 3,
        collapse: true,
        collapseTitle: "模式类型",
        radio: '默认',
        groupList: [
            "默认",
            "临时",
            "半永久",
            "永久"
        ]
    },
    {
        type: 4,
        collapse: true,
        radio: '默认',
        collapseTitle: "建设和设施布局",

        groupList: [
            "默认",
        ]
    },
    {
        type: 4,
        collapse: true,
        radio: '默认',
        collapseTitle: "功能模块建筑",
        groupList: [
            "默认",
        ]
    },
])
function selectAllEvt(value: boolean) {
    if (value) {
        paramsList.value.forEach(ele => {
            ele.collapse = true
            ele.radio = "默认"
        })
    } 
}
</script>
<style lang="less" scoped>
.inputParameter {
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, #fff, #eef5ff);
    border-radius: 0 0 0 0;
    border: 1px solid;
    -o-border-image: linear-gradient(180deg, #adcdf7, #9fc8ff) 1 1;
    border-image: linear-gradient(180deg, #adcdf7, #9fc8ff) 1 1;
    padding: 10px;
    box-sizing: border-box;
    overflow: auto;

    .parameter-checkbox {
        padding-bottom: 10px;
        border-bottom: 1px solid #e8e9ef;
        font-size: 14px;
        color: #1e1e1e;
    }

    .collapse-content {
        padding-left: 40px;

        ::v-deep {
            label {
                width: 50px
            }
        }
    }

}
</style>