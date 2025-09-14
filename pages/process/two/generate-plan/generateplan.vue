<template>
    <div class="generate">
        <div class="schemeList">
            <div class="schemeTitle">
                <div class="name">
                    <img src="./fanganicon.svg" width="20" height="20" alt="" style="margin-right: 5px;">
                    <span>方案名称</span>
                </div>
                <div class="desc"> 已生成<span>4</span>
                    个方案 </div>
            </div>
            <div class="listBox">
                <div @click="handleSelectPlanEvt(item, index)" class="list" v-for="(item, index) in listData"
                    :key="index" :class="[
                        {
                            'act': currentSelect === index
                        }
                    ]">
                    <div class="listLeft">
                        <div class="title">{{ item.name }}</div>
                        <div class="content"><span>评分：{{ item.score }}分</span><span>{{ item.time }}</span></div>
                    </div>
                    <div class="listRight">
                        <img src="./xiala.svg" width="20" height="20" alt="">
                    </div>
                </div>
            </div>
        </div>
        <div class="scheme" v-loading="loading">
            <div class="plan-and-plan_tree" ref="three"></div>
            <div class="plan-and-plan-opt">
                <el-button type="primary" style="margin-right: 10px;width:100px"
                    @click="handleMouseMoveEvt">移动</el-button>
                <el-button type="primary" style="width:100px" @click="handleMouseRotationEvt">旋转</el-button>

            </div>
            <div class="plan-and-plan-set">
                <el-button type="primary" style="margin-right: 10px;width:100px">提交</el-button>
                <el-button type="primary" style="margin-right: 10px;width:100px" @click="handleRestEvt">复位</el-button>
                <el-button type="primary" style="width:100px" @click="handleDeleteModelEvt">删除</el-button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue"
import PlanAndLayout from "~~/utils/planAndLayout.ts"
const three = ref()
const currentSelect = ref(0)
function getActive(index: number) {
    // 激活列表的位置
    return currentSelect.value === index
}
const listData = ref([
    {
        name: '方案一',
        score: 90,
        time: '2025-09-07 17:23:20'
    },
    {
        name: '方案二',
        score: 95,
        time: '2025-09-07 17:23:20'
    },
    {
        name: '方案三',
        score: 91,
        time: '2025-09-07 17:23:20'
    },
    {
        name: '方案四',
        score: 80,
        time: '2025-09-07 17:23:20'
    },

])
function handleSelectPlanEvt(item: any, index: number) {
    currentSelect.value = index
}
const loading = ref(false)
let planAndLayout: PlanAndLayout | null = null

onMounted(() => {
    planAndLayout = new PlanAndLayout(three.value)
})
function handleMouseMoveEvt() {
    // 处理鼠标移动
    planAndLayout!.handleThreeIsDrag()

}
function handleMouseRotationEvt() {
    // 处理鼠标旋转
    planAndLayout!.handleThreeIsNotDrag()

}
function handleRestEvt(){
    planAndLayout!.handleRestPosition()

}
function handleDeleteModelEvt(){
   planAndLayout!.handleDeleteMode()
}
</script>
<style lang="less" scoped>
.generate {
    width: 100%;
    height: 100%;
    // background: linear-gradient(180deg, #fff, #eef5ff);
    border-radius: 0 0 0 0;
    border: 1px solid;
    -o-border-image: linear-gradient(180deg, #adcdf7, #9fc8ff) 1 1;
    border-image: linear-gradient(180deg, #adcdf7, #9fc8ff) 1 1;
    padding: 10px;
    box-sizing: border-box;
    overflow: auto;
    display: flex;
    flex-direction: row;
    gap: 20px;

    .schemeList {
        width: 294px;
        height: 100%;
        background: linear-gradient(180deg, #fff, #eef5ff);
        border: 1px solid;
        -o-border-image: linear-gradient(180deg, #adcdf7, #9fc8ff) 1 1;
        border-image: linear-gradient(180deg, #adcdf7, #9fc8ff) 1 1;

        .schemeTitle {
            height: 54px;
            border-bottom: 1px solid #e4ecfd;
            padding: 0 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .name {
                font-size: 16px;
                color: #1e1e1e;
                display: flex;
            }

            .desc {
                font-size: 12px;
                color: #94a3c0;
            }
        }

        .listBox {
            padding: 14px;
            height: calc(100% - 85px);
            overflow-y: auto;

            .list {
                width: 100%;
                height: 68px;
                background: #f8f9fd;
                border-radius: 2px 2px 2px 2px;
                border: 1px solid #e8e9ef;
                padding: 0 20px;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 14px;
                cursor: pointer;

                &.act {
                    background: linear-gradient(180deg, #fff, #deecff);
                    border-radius: 2px 2px 2px 2px;
                    border: 1px solid #adcdf7;
                }
            }

            .listLeft {
                flex: 1;

                .title {
                    font-size: 14px;
                    color: #1e1e1e;

                }

                .content {
                    font-size: 12px;
                    color: #8999b8;
                    margin-top: 8px;
                    display: flex;
                    justify-content: space-between;
                }
            }

            .listRight {
                margin-left: 10px;
            }
        }
    }

    .scheme {
        position: relative;
        height: 100%;
        flex: 1;

        .plan-and-plan_tree {
            width: 100%;
            height: 100%;
            // background: #f00;
        }

        .plan-and-plan-opt,
        .plan-and-plan-set {
            position: absolute;
            width: 100%;
            padding: 10px 0px;
            // /background: #f0f0f0;
            text-align: center;
            z-index: 99999;
            
        }

        .plan-and-plan-opt {
            bottom: 20px;

        }

        .plan-and-plan-set {
            top: 20px;
            text-align: left;
            padding: 0px 10px;
            box-sizing: border-box;
        }
    }
}
</style>