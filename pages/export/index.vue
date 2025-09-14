<template>
  <div class="three-container">
    <div ref="canvasContainer" class="canvas-wrapper"></div>
    <div class="controls">
      <el-tree style="width:100%" :data="treeData" :props="defaultProps" >
          <template #default="{ node, data }">
             <div class="custom-tree-node">
              <span style="margin-right:10px">{{node.label}}</span>
              <!-- @click="append(data)" -->
               <el-button type="primary" link @click.stop="handleExportFile(node.label)" >
              导出模型
            </el-button>
            <el-button style="margin-left:20px" type="primary" link @click.stop="handleExportNameVisible(node.label)" >
            移除模型
            </el-button>
             </div>
          </template>
      </el-tree>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import Export from '../../utils/exportGLTF'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import { saveAs } from 'file-saver'
const gltfName = "tool_6"
let obj
const canvasContainer = ref(null)
const treeData = ref([])
const defaultProps = {
  children: 'children',
  label: 'name'
}
onMounted(() => {
  const object = new Export(canvasContainer.value, {
    loadCbk: (containObjectList) => {
      treeData.value = containObjectList
    }
  })
  obj = object
  object.loadSceneData('/gltf/6-test/6-test.gltf')
  //  object.loadExportMode("/gltf/test/75/75-test-Group_37.gltf")
})
// function exportToGLTF(){
// }
// Three.js 核心对象
// let scene, camera, renderer, controls;
// let cube, sphere, animateId;

// // 组件状态
// const state = reactive({
//   isRotating: true
// });

// // 初始化场景
// const initScene = () => {
//   // 创建场景
//   scene = new THREE.Scene();
//   scene.background = new THREE.Color(0xf0f0f0);

//   // 创建相机
//   camera = new THREE.PerspectiveCamera(
//     75,
//     canvasContainer.value.clientWidth / canvasContainer.value.clientHeight,
//     0.1,
//     1000
//   );
//   camera.position.z = 8;

//   // 创建渲染器
//   renderer = new THREE.WebGLRenderer({ antialias: true });
//   renderer.setSize(
//     canvasContainer.value.clientWidth,
//     canvasContainer.value.clientHeight
//   );
//   canvasContainer.value.appendChild(renderer.domElement);

//   // 添加控制器
//   controls = new OrbitControls(camera, renderer.domElement);
//   controls.enableDamping = true;

//   // 创建立方体
//   const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
//   const cubeMaterial = new THREE.MeshStandardMaterial({
//     color: 0x00ff00,
//     metalness: 0.5,
//     roughness: 0.5
//   });
//   cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
//   cube.position.x = -3;
//   scene.add(cube);

//   // 创建球体
//   const sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
//   const sphereMaterial = new THREE.MeshStandardMaterial({
//     color: 0xff0000,
//     metalness: 0.8,
//     roughness: 0.2
//   });
//   sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
//   sphere.position.x = 3;
//   scene.add(sphere);

//   // 添加光源
//   const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//   scene.add(ambientLight);

//   const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//   directionalLight.position.set(5, 10, 7.5);
//   scene.add(directionalLight);

//   // 窗口大小调整监听
//   window.addEventListener('resize', onWindowResize);
// };

// // 窗口大小调整处理
// const onWindowResize = () => {
//   if (!camera || !renderer || !canvasContainer.value) return;

//   camera.aspect = canvasContainer.value.clientWidth / canvasContainer.value.clientHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(
//     canvasContainer.value.clientWidth,
//     canvasContainer.value.clientHeight
//   );
// };

// // 动画循环
// const animate = () => {
//   animateId = requestAnimationFrame(animate);

//   if (state.isRotating) {
//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;

//     sphere.rotation.x -= 0.01;
//     sphere.rotation.y -= 0.01;
//   }

//   controls.update();
//   renderer.render(scene, camera);
// };

// // 切换旋转状态
// const toggleRotation = () => {
//   state.isRotating = !state.isRotating;
// };

// // 导出为GLTF格式
const exportToGLTF = () => {
  exportScene(false)
}

// // 导出为GLB格式
// const exportToGLB = () => {
//   exportScene(true);
// };

// // 导出场景的核心方法
const exportScene = (binary = false) => {
  if (!obj.scene) return

  // 创建导出器实例
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
  const gltfName = 'Group_37'
  const object = obj.scene.getObjectByName(gltfName)
  const position = object.position.clone()
  //  const world = object.localToWorld(position)
  //  console.log("world---",world)
  object.visible = false
  const clone = object.clone()
  clone.visible = true
  clone.scale.set(0.025, 0.025, 0.025)
  //  const p2 = new THREE.Vector3(position.x*0.025, position.y*0.025, position.z*0.025);
  //  const rotationMatrix = new THREE.Matrix4();
  //  const p1 = new THREE.Vector3().copy(p2).applyMatrix4(rotationMatrix);
  // rotationMatrix.makeRotationX(-Math.PI / 2);
  // //
  //  clone.visible = true
  //   clone.position.set(p1.x,p1.y,p1.z)
  //  clone.rotation.x = Math.PI /2;
  //  clone.position.set(world.x,world.y,world.z)
  //  clone.position.set(0,0,0)
  clone.position.set(position.x * 0.025, position.y * 0.025, position.z * 0.025)
  obj.scene.add(clone)

  //  clone.rotation.copy(object.rotation)
  //  clone.position.set(position.x*0.025, position.y*0.025, position.z*0.025)
  //   //  clone.rotation.x += Math.PI /2;

  //  obj.scene.add(clone)
  //  return
  //
  // clone.updateMatrix();

  //  clone.position.set(0, 0, 0);
  // clone.rotation.set(0, 0, 0);

  // clone.updateMatrix();
  // clone.geometry.applyMatrix4(clone.matrix);
  // clone.position.set(0, 0, 0);
  // clone.rotation.set(0, 0, 0);
  //  clone.scale.set(1, 1, 1);
  // 执行导出

  setTimeout(() => {
    exporter.parse(
      clone,
      (result) => {
        if (binary && result instanceof ArrayBuffer) {
          // 处理GLB格式
          const blob = new Blob([result], { type: 'application/octet-stream' })
          saveAs(blob, 'scene-1.glb')
        } else {
          // 处理GLTF格式
          const output = JSON.stringify(result, null, 2)
          const blob = new Blob([output], { type: 'application/json' })
          saveAs(blob, `${gltfName}.gltf`)
        }
      },
      (error) => {
        console.error('导出过程中发生错误:', error)
      },
      options
    )
  }, 4000)
}

// 组件挂载时初始化
// onMounted(() => {
//   initScene();
//   animate();
// });

// // 组件卸载时清理资源
// onUnmounted(() => {
//   window.removeEventListener('resize', onWindowResize);
//   cancelAnimationFrame(animateId);

//   if (renderer) {
//     renderer.dispose();
//   }

//   if (controls) {
//     controls.dispose();
//   }

//   if (canvasContainer.value && renderer?.domElement) {
//     canvasContainer.value.removeChild(renderer.domElement);
//   }
// });
function handleExportNameVisible(name){
  const binary =false
  const itemName = `${gltfName}-${name}`
  localStorage.setItem(itemName,itemName)
  const object = obj.scene.getObjectByName(name)
   object.visible = false
   object.parent.remove(object)
}
function handleExportFile(name) {
  const binary =false
  const itemName = `${gltfName}-${name}`
  localStorage.setItem(itemName,itemName)
  const object = obj.scene.getObjectByName(name)
   object.visible = false
  const clone = object.clone()
  clone.visible = true
  const position = clone.position.clone()
  clone.position.set(0,0,0)
   const exporter = new GLTFExporter()
  // 导出选项配置
  const options = {
    trs: false, // 导出位置、旋转、缩放为单独的属性
    onlyVisible: true, // 只导出可见对象
    truncateDrawRange: true, // 截断绘制范围
    binary: binary, // 是否导出为二进制格式(GLB)
    forcePowerOfTwoTextures: false,
    embedImages: true // 将图像嵌入到输出文件
  }
    exporter.parse(
      clone,
      (result) => {
        if (binary && result instanceof ArrayBuffer) {
          // 处理GLB格式
          const blob = new Blob([result], { type: 'application/octet-stream' })
          saveAs(blob, 'scene-1.glb')
        } else {
          // 处理GLTF格式
          const output = JSON.stringify(result, null, 2)
          const blob = new Blob([output], { type: 'application/json' })
          saveAs(blob, `${itemName}.gltf`)
        }
      },
      (error) => {
        console.error('导出过程中发生错误:', error)
      },
      options
    )
 
}
</script>

<style scoped>
.three-container {
  position: relative;
  width: 100%;
  height: 90vh;
}

.canvas-wrapper {
  width: 100%;
  height: 100%;
}

.controls {
  position: absolute;
  top: 0px;
  right: 0px;
  display: flex;
  /* gap: 10px; */
  width: 400px;
  height: 100%;
  background: #fff;
  z-index: 100;
  overflow: auto;
}

.control-btn,
.export-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.control-btn {
  background-color: #42b983;
  color: white;
}

.control-btn:hover {
  background-color: #359e75;
}

.export-btn {
  background-color: #2196f3;
  color: white;
}

.export-btn:hover {
  background-color: #0b7dda;
}
</style>
