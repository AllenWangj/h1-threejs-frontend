import Three from "../threejs"
import * as THREE from 'three';
import { position } from "./three-position"
// import type { GLTF } from "three/examples/jsm/Addons.js";
import { type GLTF } from 'three/addons/loaders/GLTFLoader.js';
enum EGroupType {
    OUT_GROUP=1, //外墙
    INNER_WALL=2, //内墙
    UNKNOW =-1,//未知道类型
    TOP_GRoup=3,//顶部
}
// con
class ProcesTwo extends Three {
    private wrapper = new THREE.Group()
    private outLineGroup :THREE.Group[] = []
    private innerGroup :THREE.Group[] = []
    private topGroup:THREE.Group[] = []
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
        this.scene.add(this.wrapper)
        this.handleOriginModel()
    }
   private setGroupOpacity(group, opacity) {
    // 遍历组内所有子对象
    group.traverse(function(child) {
        // 检查对象是否有材质属性
        if (child.material) {
            // 对于多材质对象
            if (Array.isArray(child.material)) {
                child.material.forEach(material => {
                    material.opacity = opacity;
                    // 如果需要半透明效果，确保 transparent 属性为 true
                    material.transparent = opacity < 1;
                    material.needsUpdate = true; // 通知渲染器材质已更新
                });
            } else {
                // 单一材质对象
                child.material.opacity = opacity;
                child.material.transparent = opacity < 1;
                child.material.needsUpdate = true;
            }
        }
    });
}
   private async handleOriginModel() {
        const base = new THREE.Group()
        base.scale.set(
            position.scale.x,
            position.scale.y,
            position.scale.z,
        )
        this.wrapper.add(base)
        this.handleLoadUrl(position, base)
        console.log("position",position)
        const results = await this.runWithConcurrency(this.promiseFactories, 500)
        results.forEach(ele => {
            
            const { object, wrapper, position, roation, scale,name } = ele
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
            console.log("---name",name)
            if(this.handleGroupType(name) ==EGroupType.OUT_GROUP){
                this.outLineGroup.push(object.scene)
            }else if(this.handleGroupType(name) ==EGroupType.INNER_WALL) {
                // 代表是内墙
                this.innerGroup.push(object.scene)
            } else if(this.handleGroupType(name)===EGroupType.TOP_GRoup) {
                // debugger
                this.topGroup.push(object.scene)
            }
        })
        const size = this.calculateGroupDimensions(this.wrapper)

        const number = 600
        this.camera!.position.set(size.center.x, size.center.y - number, size.center.z)
        this.controls.target.set(size.center.x, size.center.y, size.center.z)
        this.outLineGroup.forEach(ele =>{
            ele.visible = false
        })
        // [...this.topGroup,...this.innerGroup].forEach(ele =>{
        //     ele.visible = true
        //     // debugger
        //     this.setGroupOpacity(ele,0.8)
             
        // })
        this.topGroup.forEach(ele =>{
            // ele.visible = false
            this.setGroupOpacity(ele,0.3)
        })
        this.innerGroup.forEach(ele =>this.setGroupOpacity(ele,0.8))
        //  const base1 = new THREE.Group()
    }
    private handleLoadUrl(object: any, parent: any) {
        if (object.url) {
            this.promiseFactories.push(() => {
                return new Promise((reslove) => {
                    this.loadGLTFResource(`/gltf/5/libary/${object.url}`).then(res => {
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
            let isPart = false

            // 
           
            let name = ""
            if(object.children && object.children.length > 0){
                 const children = object.children[0]
                name =children.name 
            }
            // if()
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
                        const code = object.code
                        
                        this.loadGLTFResource(`/gltf/5/libary/${code}.gltf`).then(res => {
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
    private handleGroupType(name:string){
        // 判断组件是不是墙
        if(name.indexOf("组件#9") !=-1) {
            // 代表是外墙
            return EGroupType.OUT_GROUP
        }
           const inner = [
                "组件#40",
                "组件#41",
                "组件#37",
                "组件#39",
            ]
        const result = inner.some(ele =>{
            return name.indexOf(ele) !=-1
        })
        if(result) {
            // 代表内墙
            return EGroupType.INNER_WALL
        }
        const top = ['组件#52']
        const result1 = top.some(ele =>{
            return name.indexOf(ele) !=-1
        })
        if(result1){
            return EGroupType.TOP_GRoup
        }
        return  EGroupType.UNKNOW
    }
    
}
export default ProcesTwo
