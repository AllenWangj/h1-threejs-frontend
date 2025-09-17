<template>
    <div   class="wrapper">
    <div style="width: 100%;height: 100%;" ref="wrapper"></div>
    <div style="position: absolute;left: 0px;top:0px;z-index: 900;">
      <div style="display: grid;grid-template-columns:180px 180px;gap: 20px;overflow-y: auto;">
          <el-button  @click="handleExportFile('<组件#28>_3')">正向横梁导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#28>_3')">正向横梁查看</el-button>


         <el-button  @click="handleExportFile('<组件#22>_3')">木连接导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#22>_3')">木连接查看</el-button>


        <el-button  @click="handleExportFile('<组件#26>_2')">立柱导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#26>_2')">立柱查看</el-button>

 <el-button  @click="handleExportFile('<组件#63>_7')">地砖导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#63>_7')">地砖查看</el-button>


       <el-button  @click="handleExportFile('<组件#27>_1')">横梁导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#27>_1')">横梁查看</el-button>



      

      


      


     


       <!-- <el-button  @click="handleExportFile('IfcDoor_-_单嵌板木门_14D-04455344<3ID151naX4SP9QZfy4vvW9#1>_18')">门导出</el-button>
      <el-button  @click="handleLoadShowMode('IfcDoor_-_单嵌板木门_14D-04455344<3ID151naX4SP9QZfy4vvW9#1>_18')">门查看</el-button>

       <el-button  @click="handleExportFile('<组件#88>')">前面墙导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#88>')">前面墙查看</el-button>

        <el-button  @click="handleExportFile('<组件#92>')">带门的墙导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#92>')">带门的墙查看</el-button>

        <el-button  @click="handleExportFile('<组件#42>')">带窗的墙导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#42>')">带窗的墙查看</el-button>



      <el-button  @click="handleExportFile('<组件#51>_17')">天花板门板导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#51>_17')">天花板门板查看</el-button>



       <el-button  @click="handleExportFile('<组件#28>_8')">门上的的横梁导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#28>_8')">门上的的横梁查看</el-button>



       <el-button  @click="handleExportFile('<组件#66>_1')">窗导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#66>_1')">窗查看</el-button>

    
       <el-button  @click="handleExportFile('Group_122')">窄地板导出</el-button>
      <el-button   @click="handleLoadShowMode('Group_122')">窄地板查看</el-button>



        <el-button  @click="handleExportFile('<组件#31>_5')">短横条导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#31>_5')">短横条查看</el-button>


        <el-button  @click="handleExportFile('<组件#36>_11')">宽地板导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#36>_11')">宽地板查看</el-button>



           <el-button  @click="handleExportFile('<组件#36>_11')">宽地板导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#36>_11')">宽地板查看</el-button>

           <el-button  @click="handleExportFile('<组件#63>')">木地砖导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#63>')">木地砖查看</el-button>



       <el-button  @click="handleExportFile('<组件#22>_11')">木连接导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#22>_11')">木连接查看</el-button>



       <el-button  @click="handleExportFile('<组件#23>_33')">铁连接导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#23>_33')">铁连接查看</el-button>



       <el-button  @click="handleExportFile('<组件#23>_33')">铁连接导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#23>_33')">铁连接查看</el-button>


        <el-button  @click="handleExportFile('<组件#40>_5')">门前墙内板导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#40>_5')">门前墙内板查看</el-button>


        <el-button  @click="handleExportFile('<组件#37>_11')">侧墙内板导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#37>_11')">侧墙内板查看</el-button>



         <el-button  @click="handleExportFile('<组件#37>_11')">侧墙内板导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#37>_11')">侧墙内板查看</el-button>



          <el-button  @click="handleExportFile('<组件#27>_6')">侧墙横梁导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#27>_6')">侧墙横梁查看</el-button>



           <el-button  @click="handleExportFile('<组件#27>_6')">侧墙横梁导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#27>_6')">侧墙横梁查看</el-button>



          <el-button  @click="handleExportFile('Group_19')">梁固定器导出</el-button>
      <el-button   @click="handleLoadShowMode('Group_19')">梁固定器查看</el-button>



       <el-button  @click="handleExportFile('Group_16')">立柱导出</el-button>
      <el-button   @click="handleLoadShowMode('Group_16')">立柱查看</el-button>



        <el-button  @click="handleExportFile('<组件#26>_4')">外立柱导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#26>_4')">外立柱查看</el-button>




       <el-button  @click="handleExportFile('<组件#26>_4')">外立柱导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#26>_4')">外立柱查看</el-button>


         <el-button  @click="handleExportFile('<组件#16>_58')">地板横梁导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#16>_58')">地板横梁查看</el-button>



      <el-button  @click="handleExportFile('<组件#16>_58')">地板横梁导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#16>_58')">地板横梁查看</el-button>



      <el-button  @click="handleExportFile('<组件#14>_57')">地板导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#14>_57')">地板查看</el-button>


       <el-button  @click="handleExportFile('<组件#66>')">前门窗导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#66>')">前门窗查看</el-button> -->



      



      



      


     


     

      
      
      </div>
    </div>
    </div>
</template>
<script setup lang="ts">
import {ref,onMounted} from "vue"
import FiveExport from "~~/utils/fiveExport.ts"
import { saveAs } from 'file-saver'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'

const wrapper = ref()
let opt:FiveExport | null = null
onMounted(() =>{
   const fiveObject = new  FiveExport(wrapper.value)
  //  fiveObject.handleLoadGlbMode("/a.glb")
  //  fiveObject.handleLoadMode("/gszh_xyz.glb")
  //  fiveObject.handleLoadMode("/a.glb")

   fiveObject.handleLoadMode("/gltf/5/three.skp.gltf")

   opt = fiveObject
})
async function handleExportFile(itemName) {
    const binary = false
  const exporter = new GLTFExporter()
  // 导出选项配置
  const options = {
    trs: true, // 导出位置、旋转、缩放为单独的属性
    onlyVisible: true, // 只导出可见对象
    truncateDrawRange: true, // 截断绘制范围
    binary: binary, // 是否导出为二进制格式(GLB)
    forcePowerOfTwoTextures: false,
    embedImages: true // 将图像嵌入到输出文件
  }

    exporter.parse(
     opt.exportObject,
      (result) => {
        if (binary && result instanceof ArrayBuffer) {
          // 处理GLB格式
          const blob = new Blob([result], { type: 'application/octet-stream'})
          saveAs(blob, 'scene-1.glb')
        } else {
          // 处理GLTF格式
          const output = JSON.stringify(result, null, 2)
          const blob = new Blob([output], { type: 'application/json'})
          saveAs(blob, `${itemName}.gltf`)
        }
      },
      (error) => {
        console.error('导出过程中发生错误:', error)
      },
      options
    )
 
}
function handleLoadShowMode(name){
  opt!.handleLoadShowMode(name)
}
</script>
<style lang="less" scoped>
.wrapper {
    width:100%;
    height:100%;
    background:#f0f0f0;
    position: relative;
}
</style>