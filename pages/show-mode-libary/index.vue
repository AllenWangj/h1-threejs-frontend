<template>
    <div class="wrapper">
<div class="table">
     <el-table :data="tableSource" style="width: 100%" @row-click="handleRowClickEvt">
    <el-table-column prop="name" label="模型名称" width="180" />
    <el-table-column prop="width" label="长" width="180" />
    <el-table-column prop="height" label="宽" />
    <el-table-column prop="deep" label="高" />
  </el-table>
</div>
<div class="echart">
    <div class="three" ref="three"></div>
</div>
</div>
</template>
<script lang="ts" setup>
import { ref ,onMounted} from "vue"
import Libary from "~~/utils/show-mode-libary.ts"
let libary :Libary | null = null
const three = ref()
const tableSource = ref([
    {
        name: "模型1",
        url: "/libary/1.gltf",
        remark:'备注1',
        width:1,
        height:1,
        deep:1
    },
    {
        name: "模型2",
        url: "/libary/2.gltf",
        remark:'备注1',
        width:1,
        height:1,
        deep:1
    },
    {
        name: "模型3",
        url: "/libary/3.gltf",
        remark:'备注1',
        width:1,
        height:1,
        deep:1
    },
    {
        name: "模型4",
        url: "/libary/4.gltf",
        remark:'备注1',
        width:1,
        height:1,
        deep:1
    },
    {
        name: "模型5",
        url: "/libary/5.gltf",
        remark:'备注1',
        width:1,
        height:1,
        deep:1
    },
])
function handleRowClickEvt(record){
   libary!.handleLoadModel(record.url)
}
onMounted(() =>{
libary = new Libary(three.value)
})
</script>
<style lang="less" scoped>
.wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    gap: 20px;
    .table {
        width: 20ppx;

    }
    .echart {
        flex: 1;
        .three {
            width: 100%;
            height: 100%;
        }

    }

}

</style>