import Three from "../threejs"
import * as THREE from 'three';
import { type GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { position } from "./sixPosition"
import { DragControls } from 'three/examples/jsm/controls/DragControls.js'

class SixObject extends Three {
    private wrapper = new THREE.Group()
    private draggesObject: THREE.Group[] = []
    public dragControls: DragControls
    private containerSize: {
        x: number
        y: number
        z: number
    } = { x: 0, y: 0, z: 0 }
    public promiseFactories: (() => Promise<{
        wrapper: THREE.Group,
        object: GLTF,
        position: { x: number, y: number, z: number },
        roation: { x: number, y: number, z: number },
        scale: { x: number, y: number, z: number },
        name: string
    }>)[] = [];
    constructor(node: HTMLElement) {
        super(node, {

        })
        this.scene.add(this.wrapper)
        this.handleWholeLoadUrl()
    }
    private async handleWholeLoadUrl() {
        this.handleLoadUrl(position, this.wrapper)

        const results = await this.runWithConcurrency(this.promiseFactories, 500)
        results.forEach(ele => {
            const { object, wrapper, position, roation, scale, name } = ele
            object.scene.position.set(
                position.x,
                position.y,
                position.z,
            )
            object.scene.rotation.set(
                roation.x,
                roation.y,
                roation.z,
            )
            object.scene.scale.set(
                scale.x,
                scale.y,
                scale.z,
            )
                  object.scene.children.forEach(child => {
                    child.children.forEach(child => {
                        child.raycast = () => {}; // 空函数，不响应射线检测

                    })
        });
            // object.scene.children[0].raycast = () => {};
            // object.scene.children[1].raycast = () => {};

            console.log("name---",name)
            object.scene.name = name
            object.scene.userData.isGroup = true
            this.draggesObject.push(wrapper)
            wrapper.add(object.scene)
        })
        this.initDragControls()
        const size = this.calculateGroupDimensions(this.wrapper)
        const number = 600

        this.camera!.position.set(size.center.x, size.center.y - number, size.center.z)
        this.controls.target.set(size.center.x, size.center.y, size.center.z)
        //设置长宽高
        this.containerSize.x = size.width
        this.containerSize.y = size.height
        this.containerSize.z = size.depth
    }
    private handleLoadUrl(object: any, parent: any) {
        if (object.url) {
            this.promiseFactories.push(() => {
                return new Promise((reslove) => {
                    this.loadGLTFResource(`/gltf/six/${object.url}`).then(res => {
                        reslove({
                            wrapper: parent,
                            object: res,
                            position: object.position,
                            roation: object.roation,
                            scale: object.scale,
                            name: object.name
                        })
                    })
                })
            })
        }
        else if (object.name.indexOf("<组件#") != -1) {
            const children = object.children[0]
            if (children.name && children.name.indexOf("<组件#") != -1) {
                const group = new THREE.Group()
                group.name = object.name
                group.position.set(
                    object.position.x,
                    object.position.y,
                    object.position.z,
                )
                group.rotation.set(
                    object.roation.x,
                    object.roation.y,
                    object.roation.z,
                )
                group.scale.set(
                    object.scale.x,
                    object.scale.y,
                    object.scale.z,
                )
                parent.add(group)
                object.children.forEach(ele => {
                    this.handleLoadUrl(ele, group)
                })
            } else {
                // 说明需要加载组件
                const result = object.name.replace(/<组件#(\d+)>.*/, "model$1");
                // this.promiseFactories.push(() =>this.loadGLTFResource(`/gltf/5/libary/${result}.gltf`))
                this.promiseFactories.push(() => {
                    return new Promise((reslove) => {
                        this.loadGLTFResource(`/gltf/six/${result}.gltf`).then(res => {
                            reslove({
                                wrapper: parent,
                                object: res,
                                position: object.position,
                                roation: object.roation,
                                scale: object.scale,
                                name: object.name
                            })
                        })
                    })
                })
            }
        }
        else if (object.children && object.children.length > 0) {
            const group = new THREE.Group()
            group.name = object.name
            group.position.set(
                object.position.x,
                object.position.y,
                object.position.z,

            )
            group.rotation.set(
                object.roation.x,
                object.roation.y,
                object.roation.z,
            )
            parent.add(group)
            object.children.forEach(ele => {
                this.handleLoadUrl(ele, group)
            })
        }
    }
    private initDragControls() {
        if (this.dragControls) this.dragControls.dispose()
        const meshes = this.draggesObject.map((o: any) => o)
    // debugger
        this.dragControls = new DragControls(meshes, this.camera, this.renderer.domElement)
        this.dragControls.addEventListener('dragstart', (event) => {
            this.controls.enabled = false
            const object = event.object
            const originPos = object.position.clone()
            object.userData.pos = originPos
            
            console.log("event.object---", object)
            // const obj = draggableObjects.find((o) => o.mesh === event.object)
            // if (obj) obj.prevPosition = event.object.position.clone()
        })

        this.dragControls.addEventListener('drag', (event) => {
            // console.log("----", event.object)
            const object = event.object
            let group: any = null
            let isResult = true
            // debugger
            let initObject = object
            while (isResult) {
                group = initObject.parent
                if (group.userData.isGroup) {
                    isResult = false
                }
                initObject = initObject.parent
            }
            let targetPos = event.object.position.clone()
           
            //  object.userData.pos = originPos
        
            // group.position.set(targetPos.x,targetPos.y,targetPos.z)
            // event.object.position.set(
            //   object.userData.pos.x,
            //   object.userData.pos.y,
            //   object.userData.pos.z,
            // )
            // console.log("group--", group)
            // const size = this.calculateGroupDimensions(initObject)

            // const halfSize = {
            //     x: size.size.x / 2,
            //     y: size.size.y / 2,
            //     z: size.size.z / 2
            // }
            // let targetPos = event.object.position.clone()
            // // 判断是否已经进入容器
            // const insideContainer =
            //     targetPos.x - halfSize.x >= -this.containerSize.x / 2 &&
            //     targetPos.x + halfSize.x <= this.containerSize.x / 2 &&
            //     targetPos.y - halfSize.y >= -this.containerSize.y / 2 &&
            //     targetPos.y + halfSize.y <= this.containerSize.y / 2 &&
            //     targetPos.z - halfSize.z >= -this.containerSize.z / 2 &&
            //     targetPos.z + halfSize.z <= this.containerSize.z / 2



            //     const obj = draggableObjects.find((o) => o.mesh === event.object)
            //     if (!obj) return

            //     const halfSize = {
            //         x: obj.size.x / 2,
            //         y: obj.size.y / 2,
            //         z: obj.size.z / 2
            //     }
            //     let targetPos = event.object.position.clone()

            //     // 限制物体不能低于地面
            //     const groundLevel = -containerSize.y / 2 + halfSize.y
            //     targetPos.y = Math.max(groundLevel, targetPos.y)

            //     // 判断是否已经进入容器
            //     const insideContainer =
            //         targetPos.x - halfSize.x >= -containerSize.x / 2 &&
            //         targetPos.x + halfSize.x <= containerSize.x / 2 &&
            //         targetPos.y - halfSize.y >= -containerSize.y / 2 &&
            //         targetPos.y + halfSize.y <= containerSize.y / 2 &&
            //         targetPos.z - halfSize.z >= -containerSize.z / 2 &&
            //         targetPos.z + halfSize.z <= containerSize.z / 2

            //     if (insideContainer) obj.enteredContainer = true

            //     // 如果已经进入过容器，限制在容器内，否则允许在外面拖动
            //     if (obj.enteredContainer) {
            //         targetPos.x = Math.max(-containerSize.x / 2 + halfSize.x, Math.min(containerSize.x / 2 - halfSize.x, targetPos.x))
            //         targetPos.y = Math.min(containerSize.y / 2 - halfSize.y, Math.max(-containerSize.y / 2 + halfSize.y, targetPos.y))
            //         targetPos.z = Math.max(-containerSize.z / 2 + halfSize.z, Math.min(containerSize.z / 2 - halfSize.z, targetPos.z))
            //     }

            //     // 碰撞检测
            //     const minA = new THREE.Vector3(targetPos.x - halfSize.x, targetPos.y - halfSize.y, targetPos.z - halfSize.z)
            //     const maxA = new THREE.Vector3(targetPos.x + halfSize.x, targetPos.y + halfSize.y, targetPos.z + halfSize.z)

            //     let overlap = false
            //     for (let other of draggableObjects) {
            //         if (other.mesh === obj.mesh) continue
            //         const halfOther = {
            //             x: other.size.x / 2,
            //             y: other.size.y / 2,
            //             z: other.size.z / 2
            //         }
            //         const minB = new THREE.Vector3(
            //             other.mesh.position.x - halfOther.x,
            //             other.mesh.position.y - halfOther.y,
            //             other.mesh.position.z - halfOther.z
            //         )
            //         const maxB = new THREE.Vector3(
            //             other.mesh.position.x + halfOther.x,
            //             other.mesh.position.y + halfOther.y,
            //             other.mesh.position.z + halfOther.z
            //         )

            //         if (
            //             minA.x < maxB.x &&
            //             maxA.x > minB.x &&
            //             minA.y < maxB.y &&
            //             maxA.y > minB.y &&
            //             minA.z < maxB.z &&
            //             maxA.z > minB.z
            //         ) {
            //             overlap = true
            //             break
            //         }
            //     }

            //     // 根据物体位置调整材质亮度
            //     if (obj.enteredContainer) {
            //         // 在容器内部，使用较暗的材质
            //         obj.mesh.material.emissive = new THREE.Color(0x607897)
            //     } else {
            //         // 在容器外部，使用较亮的材质
            //         obj.mesh.material.emissive = new THREE.Color(0x000000)
            //     }

            //     if (overlap) {
            //         event.object.position.copy(obj.prevPosition)
            //     } else {
            //         obj.prevPosition.copy(targetPos)
            //         event.object.position.copy(targetPos)
            //     }
            // })

            // dragControls.addEventListener('dragend', () => {
            //     orbitControls.enabled = rotateEnabled.value

            //     // 拖拽完成后，检查是否所有物体都在容器内
            //     const allInside = draggableObjects.every((obj) => obj.enteredContainer)

            //     if (!allInside) {
            //         // 有物体不在容器内，则回到初始位置
            //         draggableObjects.forEach((obj) => {
            //             if (!obj.enteredContainer) {
            //                 obj.mesh.position.copy(obj.initialPosition)
            //                 obj.prevPosition.copy(obj.initialPosition)
            //             }
            //         })
            //     }
            // })

            // // 添加点击选择物体的功能
            // dragControls.addEventListener('hoveron', (event) => {
            //     selectedObject = event.object
            //     // 高亮选中物体
            //     selectObject(selectedObject)
            // })

            // dragControls.addEventListener('hoveroff', (event) => {
            //     if (selectedObject === event.object) {
            //         selectedObject.material.emissive = new THREE.Color(0x000000)
            //         selectedObject = null
            //     }
        })
        this.dragControls.addEventListener('dragend', () => {
            this.controls.enabled = true
        })
    }
}
export default SixObject