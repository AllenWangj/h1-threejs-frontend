import Three from "../threejs"
import * as THREE from 'three';
import { source } from "./source"

class LibaryModal extends Three {
  private wrapper = new THREE.Group()
  public number = 0
  constructor(node: HTMLElement) {
    super(node, {

    })
    this.scene.add(this.wrapper)
    this.hanleLoadResouce()
    setTimeout(() => {
      const size = this.calculateGroupDimensions(this.wrapper)
      const number = size.maxDim
      this.camera!.position.set(size.center.x, size.center.y - number, size.center.z + number)
      this.controls.target.set(size.center.x, size.center.y, size.center.z)
      console.log("number---",this.wrapper.children)
    }, 20 * 1000)

  }
  public hanleLoadResouce() {
    const set = new Set()
    this.number = 0
    source.forEach(ele => {
      const {  categories, } = ele
      // const group = new THREE.Group()
      // group.name = component_type
      // this.wrapper.add(group)
      categories.forEach((ele) => {
        //  const childGroup = new THREE.Group()
        //  group.add(childGroup)
        // childGroup.name = component_type
        const { components, position_and_rotation, component_count } = ele
        const cmpUrl = components[0]
        const url = cmpUrl.length == 14 ? cmpUrl.slice(0, -5) : cmpUrl.slice(0, -4)
        const name = "/ifc/" + url + ".glb"
        this.loadGLTFResource(name).then(res => {
          const { scene } = res
          for (let index = 0; index < component_count; index++) {
            // const element = array[index];
            const clone = scene.clone()
            this.wrapper.add(clone)
            const item = position_and_rotation[index]
            const [x, y, z] = item.rotation

            scene.rotation.set
              (
                parseFloat(x) * Math.PI / 180,
                parseFloat(y) * Math.PI / 180,
                parseFloat(z) * Math.PI / 180,
              )
            scene.position.set(item.position[0], item.position[1], item.position[2])
          }

         this.number+=component_count
        })
      })
    })
    console.log("from:", Array.from(set))
  }
  public handleLoadModelByUrl(url, item, parent) {
    this.loadGLTFResource(url).then(res => {

      const { scene } = res
      const [x, y, z] = item.rotation
      scene.rotation.set
        (
          parseFloat(x) * Math.PI / 180,
          parseFloat(y) * Math.PI / 180,
          parseFloat(z) * Math.PI / 180,
        )
      scene.position.set(item.position[0], item.position[1], item.position[2])
      parent.add(scene)
    })
  }

}
async function checkFileExists(filename) {
  try {
    const response = await fetch(`/${filename}`, { method: 'HEAD' });
    // 如果状态码在200-299之间，表示请求成功
    return response.ok;
  } catch (error) {
    console.error('检查文件存在性时出错:', error);
    return false;
  }
}

// 使用示例
async function example() {
  // 检查public目录下是否存在test.txt文件
  const exists = await checkFileExists('test.txt');
  if (exists) {
    console.log('文件存在');
  } else {
    console.log('文件不存在');
  }
}
export default LibaryModal