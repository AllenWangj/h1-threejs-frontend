import Three from "./threejs";
import * as THREE from 'three';
import { position ,position1,position2} from "./utilsTwoSet/five-position"
class PositionLayout extends Three {
    public wrapper = new THREE.Group()
    public meshName: string[] = []
    constructor(node: HTMLElement) {
        super(node)
        this.scene.add(this.wrapper)
        // this.handleOriginModel()
        this.handleInitModel()
    }
    handleOriginModel() {
        const base = new THREE.Group()
        base.scale.set(
            position.scale.x,
            position.scale.y,
            position.scale.z,
        )
        this.wrapper.add(base)
        this.handleLoadUrl(position,base)
         const base1 = new THREE.Group()
        // this.wrapper.add(base1)
          base1.scale.set(
            position1.scale.x,
            position1.scale.y,
            position1.scale.z,
        )
         this.wrapper.add(base1)
        this.handleLoadUrl(position1,base1)
          const base2 = new THREE.Group()
        //  this.wrapper.add(base2)
          base2.scale.set(
            position2.scale.x,
            position2.scale.y,
            position2.scale.z,
        )
        base2.rotation.set(
            position2.roation.x,
            position2.roation.y,
            position2.roation.z,
        )
         base2.position.set(
            position2.position.x,
            position2.position.y,
            position2.position.z,
        )
        this.handleLoadUrl(position2,base2)
        setTimeout(() =>{
             const size = this.calculateGroupDimensions(this.wrapper)
             console.log(
                "siz",size
             )
            const number = 300
            this.camera!.position.set(size.center.x, size.center.y, size.center.z + number)
            this.controls.target.set(size.center.x, size.center.y, size.center.z)
        },1000*10)
    }
    handleLoadUrl(object: any, parent: any) {
        if(object.url) {
            //  
            this.loadGLTFResource(`/gltf/5/libary/${object.url}`, (progress) => {
            }).then(res => {
                 res.scene.position.set(
                object.position.x,
                object.position.y,
                object.position.z,
            )
            res.scene.rotation.set(
                object.roation.x,
                object.roation.y,
                object.roation.z,
            )
             res.scene.scale.set(
                object.scale.x,
                object.scale.y,
                object.scale.z,
            )
                parent.add(res.scene)
            })
        }
        else if(object.name.indexOf("<组件#") !=-1) {  
        const children = object.children[0]
        if(children.name.indexOf("<组件#") !=-1){
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
        }else {
              // 说明需要加载组件
            const result = object.name.replace(/<组件#(\d+)>.*/, "model$1");
            this.loadGLTFResource(`/gltf/5/libary/${result}.gltf`, (progress) => {
            }).then(res => {
                 res.scene.position.set(
                object.position.x,
                object.position.y,
                object.position.z,

            )
            res.scene.rotation.set(
                object.roation.x,
                object.roation.y,
                object.roation.z,
            )

             res.scene.scale.set(
                object.scale.x,
                object.scale.y,
                object.scale.z,
            )
                parent.add(res.scene)
            })
    }
    }
       else if (object.children &&object.children.length > 0) {
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
    handleInitModel() {
        // this.loadGLTFResource("/gltf/5/three.skp.gltf", (progress) => {
        // this.loadGLTFResource("/six/six.gltf", (progress) => {
        // this.loadGLTFResource("/gltf/originsix/six.gltf", (progress) => {
        this.loadGLTFResource("/four/four.gltf", (progress) => {



        }).then(res => {
            // const root = res.scene.getObjectByName("Group_127") as THREE.Group
            // const root = res.scene.getObjectByName("Group_576") as THREE.Group
            //  const root = res.scene.getObjectByName("Group") as THREE.Group
            const root = res.scene.getObjectByName("root") as THREE.Group
            root.scale.set(1, 1, 1)
            this.wrapper.add(root)
            const name  =new Set<string>()
            root.traverse((object) => {
                if(object.name.indexOf("<组件#") !=-1) {
                    const result = object.name.split("_")
                   name.add(result[0]+"_1") 
                }
                if (object instanceof THREE.Mesh) {

                } else {
                    if (object.children.length > 0) {
                        const child = object.children[0]
                        if (child.children.length === 0) {
                            this.meshName.push(object.name)
                        }
                    }
                }
            })
            console.log("name",name)
            const size = this.calculateGroupDimensions(this.wrapper)
            const number = 3000
            this.camera!.position.set(size.center.x, size.center.y, size.center.z + number)
            this.controls.target.set(size.center.x, size.center.y, size.center.z)
            const target = {
                name: '箱体',
                children: [],
                position: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                roation: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            }
            this.handleComputedPosition(root, target)
            console.log("target---", target)

        })
    }
    handleComputedPosition(object: any, parent: any) {
        const objectTarget = {
            name: object.name,//名字
            position: object.position.clone(),//位置信息
            roation: {
                x: object.rotation.x,
                y: object.rotation.y,
                z: object.rotation.z,
            },
            scale:{
                  x: object.scale.x,
                y: object.scale.y,
                z: object.scale.z,
            },
            children: []
        }
        parent.children.push(objectTarget)
        if (object.children.length > 0) {
            object.children.forEach(ele => {
                this.handleComputedPosition(ele, objectTarget)
            })

        }


    }
}
export default PositionLayout