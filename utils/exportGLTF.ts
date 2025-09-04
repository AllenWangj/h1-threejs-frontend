import Three from "./threejs";
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
class ExportThree extends Three {
    constructor(node: HTMLElement) {
        super(node)
        this.camera.position.set(1000,1000,1000)
    }
    public loadSceneData(url:string){
        const loader = new GLTFLoader();
        loader.load( url,
            (gltf) => {
                this.scene.add(gltf.scene)
                const size= this.calculateGroupDimensions(gltf.scene)
                const object = gltf.scene.getObjectByName("mesh_29_1")
                const size1= this.calculateGroupDimensions(object)
                console.log("soze",gltf.scene)
            //     const clone = object.clone()
            //     clone.position.set(0,0,0)
            //     this.scene.add(clone)
            //    const size= this.calculateGroupDimensions(object)
            //    console.log("soze",size)
               const number = 30
               this.camera!.position.set(size.center.x+number,size.center.y+number,size.center.z+number)
               this.controls.target.set(size.center.x,size.center.y,size.center.z)
            },(xhr) =>{
                const progress = Math.round((xhr.loaded / xhr.total) * 100);
                console.log("progress",progress)
            },err=>{
                console.log("err",err)
            })
    }
}
export default ExportThree