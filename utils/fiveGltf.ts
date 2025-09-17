import Three from "./threejs";
import * as THREE from 'three';
import {modeService} from "./mode-service"
class FiveExport extends Three {
    private wrapper =new THREE.Group()
    constructor(node:HTMLElement) {
        super(node,{
            
        })
        this.scene!.add(this.wrapper)
    }
    public handleLoadMode(url:string){
        this.loadGLTFResource(url).then(res=>{
             const root = res.scene.getObjectByName("root")
             console.log("root",root)
            // const service = modeService()
            // const {windowData,roofData,roofTopData,wallData} = service
            //  const name = wallData()
            // name.forEach(ele =>{
            //     const name = root.getObjectByName(ele)
            //     this.wrapper.add(name)
            // })
            //   const size = this.calculateGroupDimensions(this.wrapper)
            //    const number = 100
            // this.camera!.position.set(size.center.x, size.center.y - number, size.center.z + number)
            // this.controls.target.set(size.center.x, size.center.y, size.center.z)
        })
    }
    get exportObject(){
        return this.wrapper
    }
}
export default FiveExport