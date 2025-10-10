<template>
    <div   class="wrapper">
    <div style="width: 100%;height: 100%;" ref="wrapper"></div>
    <div style="position: absolute;left: 0px;top:0px;z-index: 900;">
      <div style="display: grid;grid-template-columns:360px;gap: 20px;overflow-y: auto;">

         <el-button  @click="handleExportFile('Group_1')">Group_1</el-button>
      <el-button   @click="handleLoadShowMode('Group_1')">Group_1</el-button>



       <el-button  @click="handleExportFile('IfcBuildingElementProxy_-_8mm钢板-006<2Q_NGBswqpI9xb7oSV4NH8>_2')">1</el-button>
      <el-button   @click="handleLoadShowMode('IfcBuildingElementProxy_-_8mm钢板-006<2Q_NGBswqpI9xb7oSV4NH8>_2')">2</el-button>



           <el-button  @click="handleExportFile('IfcBuildingElementProxy_-_100x150矩形管-1<33jZUxx0itOw__CId2E8Xz>_2')">2-1</el-button>
      <el-button   @click="handleLoadShowMode('IfcBuildingElementProxy_-_100x150矩形管-1<33jZUxx0itOw__CId2E8Xz>_2')">2-2</el-button>


           <el-button  @click="handleExportFile('Group_271')">Group_271</el-button>
      <el-button   @click="handleLoadShowMode('Group_271')">Group_271</el-button>


        


         <!-- <el-button  @click="handleExportFile('<组件#73>')">74</el-button> -->
          <!-- <el-button   @click="handleLoadShowMode('<组件#43>_1')">43</el-button> -->
        <!--  -->
          <!-- <el-button  @click="handleExportFile('IfcDoor_-_单嵌板木门_14D-04455344<3ID151naX4SP9QZfy4vvW9#1>_3')">men</el-button>
      <el-button   @click="handleLoadShowMode('IfcDoor_-_单嵌板木门_14D-04455344<3ID151naX4SP9QZfy4vvW9#1>_3')">men</el-button>
 -->


      <!-- <el-button  @click="handleExportFile('<组件#73>')">74</el-button>
      <el-button   @click="handleLoadShowMode('<组件#73>')">74</el-button>


        <el-button  @click="handleExportFile('<组件#43>_1')">43</el-button>
      <el-button   @click="handleLoadShowMode('<组件#43>_1')">43</el-button>


      
        <el-button  @click="handleExportFile('<组件#13>_1')">13</el-button>
      <el-button   @click="handleLoadShowMode('<组件#13>_1')">13</el-button>


          <el-button  @click="handleExportFile('<组件#62>_1')">62</el-button>
      <el-button   @click="handleLoadShowMode('<组件#62>_1')">62</el-button>


      
          <el-button  @click="handleExportFile('<组件#61>_1')">61</el-button>
      <el-button   @click="handleLoadShowMode('<组件#61>_1')">61</el-button>


            <el-button  @click="handleExportFile('<组件#72>')">72</el-button>
      <el-button   @click="handleLoadShowMode('<组件#72>')">72</el-button> -->

      

      <!-- <el-button  @click="handleExportFile('<组件#74>_1')">74</el-button>
      <el-button   @click="handleLoadShowMode('<组件#74>_1')">74</el-button>




        <el-button  @click="handleExportFile('<组件#41>_1')">41</el-button>
      <el-button   @click="handleLoadShowMode('<组件#41>_1')">41</el-button>


       <el-button  @click="handleExportFile('<组件#38>_1')">38</el-button>
      <el-button   @click="handleLoadShowMode('<组件#38>_1')">38</el-button>



         <el-button  @click="handleExportFile('<组件#57>_1')">57</el-button>
      <el-button   @click="handleLoadShowMode('<组件#57>_1')">57</el-button>


               <el-button  @click="handleExportFile('<组件#54>_1')">54</el-button>
      <el-button   @click="handleLoadShowMode('<组件#54>_1')">54</el-button>



             <el-button  @click="handleExportFile('<组件#73>_1')">73</el-button>
      <el-button   @click="handleLoadShowMode('<组件#73>_1')">73</el-button>



      <el-button  @click="handleExportFile('<组件#42>_1')">42</el-button>
      <el-button   @click="handleLoadShowMode('<组件#42>_1')">42</el-button>



       <el-button  @click="handleExportFile('<组件#12>_1')">12</el-button>
      <el-button   @click="handleLoadShowMode('<组件#12>_1')">12</el-button>


       <el-button  @click="handleExportFile('<组件#61>_1')">61</el-button>
      <el-button   @click="handleLoadShowMode('<组件#61>_1')">61</el-button> -->
      
          <!-- 
      


        <el-button  @click="handleExportFile('Group_226')">Group_226</el-button>
      <el-button   @click="handleLoadShowMode('Group_226')">Group_226</el-button>


         <el-button  @click="handleExportFile('<组件#51>_34')">组件#51_34</el-button>
      <el-button   @click="handleLoadShowMode('<组件#51>_34')">组件#51_34</el-button>


         <el-button  @click="handleExportFile('Group_238')">Group_238</el-button>
      <el-button   @click="handleLoadShowMode('Group_238')">Group_238</el-button>


    <el-button  @click="handleExportFile('<组件#44>_2')">组件#44_2</el-button>
      <el-button   @click="handleLoadShowMode('<组件#44>_2')">组件#44_2</el-button>


    <el-button  @click="handleExportFile('<组件#35>_77')"> 组件#35_77</el-button>
      <el-button   @click="handleLoadShowMode('<组件#35>_77')">组件#35_77</el-button>





          <el-button  @click="handleExportFile('<组件#15>_63')"> 组件#15_63</el-button>
      <el-button   @click="handleLoadShowMode('<组件#15>_63')">组件#15_63</el-button>


  <el-button  @click="handleExportFile('<组件#16>_102')">  组件#16_102</el-button>
      <el-button   @click="handleLoadShowMode('<组件#16>_102')">组件#16_102</el-button>



        <el-button  @click="handleExportFile('<组件#32>_6')">  组件#32_6</el-button>
      <el-button   @click="handleLoadShowMode('<组件#32>_6')">组件#32_6</el-button>




        <el-button  @click="handleExportFile('<组件#32>_6')">  组件#32_6</el-button>
      <el-button   @click="handleLoadShowMode('<组件#32>_6')">组件#32_6</el-button>



        <el-button  @click="handleExportFile('<组件#33>_6')">组件#33_6</el-button>
      <el-button   @click="handleLoadShowMode('<组件#33>_6')">组件#33_6</el-button>



         <el-button  @click="handleExportFile('<组件#34>_7')">组件#34_7</el-button>
      <el-button   @click="handleLoadShowMode('<组件#34>_7')">组件#34_7</el-button>




      <el-button  @click="handleExportFile('<组件#23>_98')">组件#23_98</el-button>
      <el-button   @click="handleLoadShowMode('<组件#23>_98')">组件#23_98</el-button>
      


      <el-button  @click="handleExportFile('<组件#22>_1')">组件#23_98</el-button>
      <el-button   @click="handleLoadShowMode('<组件#22>_1')">组件#23_98</el-button> -->


      <div v-for="(item) in set" :key="item"> <el-button  @click="handleExportFile(item)">{{item}}</el-button>
      <el-button   @click="handleLoadShowMode(item)">{{item}}</el-button>
    </div>
       


      








      

      

      






      
     







     
      

      
      

         <!-- <el-button  @click="handleExportFile('<组件#22>_3')">木连接导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#22>_3')">木连接查看</el-button>


        <el-button  @click="handleExportFile('<组件#26>_2')">立柱导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#26>_2')">立柱查看</el-button>

 <el-button  @click="handleExportFile('<组件#63>_7')">地砖导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#63>_7')">地砖查看</el-button>


       <el-button  @click="handleExportFile('<组件#27>_1')">横梁导出</el-button>
      <el-button   @click="handleLoadShowMode('<组件#27>_1')">横梁查看</el-button> -->



      

      


      


     


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
// const set  =Array.from(new Set([
//     "<组件#15>_1",
//     "<组件#16>_1",
//     "<组件#29>_1",
//     "<组件#51>_1",
//     "<组件#52>_1",
//     "<组件#37>_1",
//     "<组件#39>_1",
//     "<组件#40>_1",
//     "<组件#44>_1",
//     "<组件#35>_1",
//     "<组件#53>_1",
//     "<组件#23>_1",
//     "<组件#22>_1",
//     "<组件#59>_1",
//     "<组件#26>_1",
//     "<组件#27>_1",
//     "<组件#28>_1",
//     "<组件#56>_1",
//     "<组件#14>_1",
//     "<组件#36>_1",
//     "<组件#32>_1",
//     "<组件#31>_1",
//     "<组件#30>_1",
//     "<组件#33>_1",
//     "<组件#34>_1",
//     "<组件#88>_1",
//     "<组件#89>_1",
//     "<组件#90>_1",
//     "<组件#91>_1",
//     "<组件#10>_1",
//     "<组件#9>_1",
//     "<组件#92>_1",
//     "<组件#93>_1",
//     "<组件#46>_1",
//     "<组件#50>_1",
//     "<组件#47>_1",
//     "<组件#48>_1",
//     "<组件#45>_1",
//     "<组件#49>_1",
//     "<组件#66>_1"
// ]))
const set = Array.from(
  new Set([
    "<组件#15>_1",
    "<组件#16>_1",
    "<组件#32>_1",
    "<组件#31>_1",
    "<组件#30>_1",
    "<组件#33>_1",
    "<组件#34>_1",
    "<组件#29>_1",
    "<组件#56>_1",
    "<组件#23>_1",
    "<组件#22>_1",
    "<组件#55>_1",
    "<组件#26>_1",
    "<组件#27>_1",
    "<组件#28>_1",
    "<组件#35>_1",
    "<组件#63>_1"
]))
const wrapper = ref()
let opt:FiveExport | null = null
onMounted(() =>{
   const fiveObject = new  FiveExport(wrapper.value)
  //  fiveObject.handleLoadGlbMode("/a.glb")
  //  fiveObject.handleLoadMode("/gszh_xyz.glb")
  //  fiveObject.handleLoadMode("/a.glb")

  //  fiveObject.handleLoadMode("/gltf/5/three.skp.gltf")
   fiveObject.handleLoadMode("/gltf/originsix/six.gltf")


   opt = fiveObject
})
async function handleExportFile(itemName) {
            const itemName1 = itemName.replace(/<组件#(\d+)>.*/, "model$1");
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
          saveAs(blob, `${itemName1}.gltf`)
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