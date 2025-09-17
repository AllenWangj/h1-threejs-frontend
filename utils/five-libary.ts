import Three from "./threejs";
import * as THREE from 'three';
import { five } from "~~/utils/utilsTwoSet/five.ts"
const baseUrl = "/libary/"

class FiveLibary extends Three {
    private wrapper = new THREE.Group()
    static typeMap = {
        1: '3.gltf',
        2: '1.gltf',
        3: '2.gltf',
        4: '4.gltf',
        5: '5.gltf',

    }
    constructor(node: HTMLElement) {
        super(node, {
        })
        this.scene!.add(this.wrapper)
        this.handleFiveModel()
    }
    private handleFiveModel() {
        five.forEach(ele => {
            this.handleLoadModel(ele, this.wrapper)
        })
    }
    private handleLoadModel(object: any, parent) {
        // if(object.childr)
        if (object.children && object.children.length > 0) {
            const wrapper = new THREE.Group()
            parent.add(wrapper)
            object.children.forEach(ele => {
                this.handleLoadModel(ele, wrapper)
            })
        } else {
            const url = baseUrl + FiveLibary.typeMap[object.type]
            this.loadGLTFResource(url).then(res => {
                // console.log("res",res)
                const { position, rotation } = object
                res.scene.position.set(position.x, position.y, position.z)
                res.scene.rotation.set(rotation.x / 180 * Math.PI,
                    rotation.y / 180 * Math.PI,
                    rotation.z / 180 * Math.PI,
                )
                parent.add(res.scene)
                const size = this.calculateGroupDimensions(this.wrapper)
                const number = 1000
                this.camera!.position.set(size.center.x, size.center.y, size.center.z + number)
                this.controls.target.set(size.center.x, size.center.y, size.center.z)
            })
        }

    }
}
export default FiveLibary