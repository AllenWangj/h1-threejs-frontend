import Three from "./threejs";
import * as THREE from 'three';

class FiveLibary extends Three {
    private wrapper = new THREE.Group()
    constructor(node: HTMLElement) {
        super(node, {
        })
        this.scene!.add(this.wrapper)
        // this.handleFiveModel()
    }
    public handleLoadModel(url) {
        if(this.wrapper.children.length > 0){
            this.wrapper.children.forEach(ele =>{
                ele.parent.remove(ele)
            })
        }
        this.loadGLTFResource(url).then(res => {
                res.scene.position.set(0,0,0)
                res.scene.rotation.set(0,0,0 )
                this.wrapper.add(res.scene)
                const size = this.calculateGroupDimensions(this.wrapper)
                const number = size.maxDim
                this.camera!.position.set(size.center.x, size.center.y, size.center.z + number)
                this.controls.target.set(size.center.x, size.center.y, size.center.z)
            })


    }
}
export default FiveLibary