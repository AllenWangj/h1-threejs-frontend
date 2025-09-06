import Three from "./threejs";
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
interface ICallBack {
    loadCbk: (objectList: ITree[]) => void
}
interface ITree {
    name: string,
    children?: ITree[]
}
class ExportThree extends Three {
    public containterList: THREE.Object3D[] = []
    public cbk: ICallBack
    constructor(node: HTMLElement, cbk: ICallBack) {
        super(node)
        this.cbk = cbk
        // this.camera.position.set(1000, 1000, 1000)
    }
    public getObjectData(object: THREE.Object3D): ITree {
        const target: ITree = {
            name: object.name
        }
        if (object.children.length > 0) {
            // 代表存在子对象
            const children: ITree[] = []
            for (let index = 0; index < object.children.length; index++) {
                const element = object.children[index];
                const childObject = this.getObjectData(element)
                children.push(childObject)
            }
            target.children = children
        }
        return target
    }
    public loadExportMode(url: string) {
        const loader = new GLTFLoader();
        loader.load(url,
            (gltf) => {
                gltf.scene.position.set(2802,2128,0)
                this.scene.add(gltf.scene)
                // console.log("gltf---",gltf)
            }
        )
    }
    public loadSceneData(url: string) {
        const loader = new GLTFLoader();
        loader.load(url,
            (gltf) => {
                const children = gltf.scene.children
                const group = new THREE.Group()
                const object3DList = children.filter(ele => ele.type === 'Object3D' && ele.children.length > 0)
                if (object3DList.length > 0) {
                    const childrenList = object3DList[0].children
                    this.containterList = [...childrenList]
                    const objectList: ITree[] = []
                    for (let index = 0; index < this.containterList.length; index++) {
                        const element = this.containterList[index];
                        objectList.push(this.getObjectData(element))
                    }
                    this.cbk.loadCbk(objectList)
                    group.add(...childrenList)
                }
                const size = this.calculateGroupDimensions(group)
                this.scene.add(group)
                // const object = gltf.scene.getObjectByName("Group_37")
                // // object.visible = false
                // const clone = object.clone(true)
                // clone.position.set(0,0,0)
                // clone.rotation.x = Math.PI/2
                // // clone.position.copy(object.position)
                // // clone.rotation.copy(object.rotation)
                // clone.scale.set(0.025,0.025,0.025)
                // clone.name = "1222222"
                // this.scene.add(clone)
                // const size1= this.calculateGroupDimensions(clone)
                // console.log("soze", this.scene)
                // console.log(":size1---",size1,object.scale)
                //     const clone = object.clone()
                //     this.scene.add(clone)
                //    const size= this.calculateGroupDimensions(object)
                //    console.log("soze",size)


                // const p1 = new THREE.Vector3(size.center.x, size.center.y, size.center.z); // 示例坐标

                // // 方法1: 使用旋转矩阵计算
                // const rotationMatrix = new THREE.Matrix4();
                // rotationMatrix.makeRotationX(-Math.PI / 2); // 90度对应的弧度是π/2
                // const p2 = new THREE.Vector3().copy(p1).applyMatrix4(rotationMatrix);
                // 方法2: 直接使用旋转方法
                // const p2_alternative = new THREE.Vector3().copy(p1).applyAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
              console.log("size.center",size.center)
                const number = 3000
                this.camera!.position.set(size.center.x, size.center.y, size.center.z + number)
                this.controls.target.set(size.center.x, size.center.y, size.center.z)
            }, (xhr) => {
                const progress = Math.round((xhr.loaded / xhr.total) * 100);
                console.log("progress", progress)
            }, err => {
                console.log("err", err)
            })
    }

}
export default ExportThree