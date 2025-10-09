import Three from "../threejs"
import * as THREE from 'three';
import { position } from "./source"
import { type GLTF } from 'three/addons/loaders/GLTFLoader.js';
class ProcesTwo extends Three {
    wrapper: THREE.Group
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
        this.handleOriginModel()
    }
    private async handleOriginModel() {
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
            wrapper.add(object.scene)
        })
        const size = this.calculateGroupDimensions(this.wrapper)

        const number = 600
        this.camera!.position.set(size.center.x, size.center.y - number, size.center.z)
        this.controls.target.set(size.center.x, size.center.y, size.center.z)
    }
    private handleLoadUrl(object: any, parent: any) {
               if (object.code) {
            this.promiseFactories.push(() => {
                return new Promise((reslove) => {
                    console.log("object.code",object.code)
                    this.loadGLTFResource(`/xfour/${object.code}.gltf`).then(res => {
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

export default ProcesTwo
