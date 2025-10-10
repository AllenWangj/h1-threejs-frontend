import Three from "./threejs";
import * as THREE from 'three';
import { modeService } from "./mode-service"
class FiveExport extends Three {
    private wrapper = new THREE.Group()
    private modeWrapp: THREE.Group | null = null
    constructor(node: HTMLElement) {
        super(node, {

        })
        this.scene!.add(this.wrapper)
    }
    public handleLoadMode(url: string) {
        this.loadGLTFResource(url).then(res => {
            console.log("res---",res)
            const root = res.scene.getObjectByName("root") as THREE.Group
            this.modeWrapp = root
            this.wrapper.add(root)
            const size = this.calculateGroupDimensions(this.wrapper)
            console.log("size:------",size)
            const number = size.maxDim
            this.camera!.position.set(size.center.x, size.center.y - number, size.center.z + number)
            this.controls.target.set(size.center.x, size.center.y, size.center.z)
        })
    }
    public handleLoadShowMode(name) {
        const object = this.modeWrapp.getObjectByName(name)
        const child = this.wrapper.children[0]
        if (child) {
            child.parent.remove(child)
        }
        const clone = object.clone(true)
        clone.name = name
        clone.position.set(0, 0, 0)
        clone.rotation.set(0, 0,0)
        clone.scale.set(1, 1, 1)
        this.wrapper.add(clone)
        const size = this.calculateGroupDimensions(this.wrapper, true)
        // const group1 = 
        // this.wrapper.add(clone)
        // this.wrapper.position.set(0, 0, 0)
        // this.wrapper.rotation.set(0, 0, 0)
        // const size = this.calculateGroupDimensions(this.wrapper, true)
        // clone.position.sub(size.position)

        const number = size.maxDim
        this.camera!.position.set(size.center.x, size.center.y - number, size.center.z + number)
        this.controls.target.set(size.center.x, size.center.y, size.center.z)
        return clone
    }
    get exportObject() {
        return this.wrapper.children[0]
    }
    private handleLoadGlbMode(){

    }
}
export default FiveExport