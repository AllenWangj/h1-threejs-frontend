import * as THREE from 'three';
import { type GLTF } from 'three/addons/loaders/GLTFLoader.js';
const { BaseThree } = useThree()
const { getModelUrl, getModelMap } = useModelMap()
class ProcessFour extends BaseThree {
    wrapper: THREE.Group
    private gltfCode: string[] = []
    public promiseFactories: (() => Promise<{
        wrapper: THREE.Group,
        object: GLTF,
        position: { x: number, y: number, z: number },
        roation: { x: number, y: number, z: number },
        scale: { x: number, y: number, z: number },
        name: string
    }>)[] = [];
    constructor(node: HTMLElement, public opt: {
        progress: (progress: number) => void
    }) {
        super(node, {

        })
        this.wrapper = new THREE.Group()
        this.scene.add(this.wrapper)
        // this.handleOriginModel(position)


    }
    public async handleOriginModel(position: any) {
        this.gltfCode = []
          this.handleClearnJunk(this.wrapper)
        this.handleLoadUrl(position, this.wrapper)
        await getModelMap(this.gltfCode)
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
            // wrapper.name = name
            wrapper.add(object.scene)
        })
        const size = this.calculateGroupDimensions(this.wrapper)



        //  const group2 = this.wrapper.getObjectByName("Group_89")
        // group2.visible =false

        //    const group3 = this.wrapper.getObjectByName("Group_317")
        // group3.visible =false

        //  const group4 = this.wrapper.getObjectByName("Group_380")
        // group4.visible =false

        //   const group5 = this.wrapper.getObjectByName("Group_273")
        // group5.visible =false

        //  const group6 = this.wrapper.getObjectByName("Group_25")
        // group6.visible =false
        const number = 600
        this.camera!.position.set(size.center.x- number, size.center.y , size.center.z)
        this.controls.target.set(size.center.x, size.center.y, size.center.z)
    }
     protected handleClearnJunk(group: THREE.Group): void {
            if (!group || !group.parent) {
                console.warn('⚠️ 尝试释放无效的组')
                return
            }
            // 递归释放所有资源
            group.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    // 释放几何体
                    object.geometry?.dispose()
                    object.material?.dispose()
                }
            })
            group.clear()
        }
    private handleLoadUrl(object: any, parent: any) {
        if (object.code) {
            const code = object.code == '10404' ? "04_01_" +object.code :object.code
            this.gltfCode.push(code)
            this.promiseFactories.push(() => {
                return new Promise((reslove) => {
                    const modelUrl = getModelUrl(code)
                    this.loadGLTFResource(modelUrl).then(res => {
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
            let name = ""
            if (object.children && object.children.length > 0) {
                const children = object.children[0]
                name = children.name
            }
            if (name && name.indexOf("<组件#") != -1) {
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
                // const name = (result as string).split("model")
                // object.code = "102"+name[name.length -1]
                // this.promiseFactories.push(() =>this.loadGLTFResource(`/gltf/5/libary/${result}.gltf`))
                this.promiseFactories.push(() => {
                    return new Promise((reslove) => {
                        const code = object.code || result

                        this.loadGLTFResource(`/xfour/${code}.gltf`).then(res => {
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
}
export const useRender = () => {
    return { ProcessFour }
}