import Three from "./threejs";
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
interface ICallBack {
    loadCbk: (objectList: ITree[]) => void
}
interface ITree {
    name: string,
    children?: ITree[]
}
class ExportThree extends Three {
    public containterList: THREE.Object3D[] = []
    public cbk: ICallBack
    private targetGrop:THREE.Object3D| null = null
    constructor(node: HTMLElement, cbk: ICallBack) {
        super(node)
        this.cbk = cbk
        // this.camera.position.set(1000, 1000, 1000)
    }
    public getObjectData(object: THREE.Object3D): ITree {
        const target: ITree = {
            name: object.name
        }
        if (object.children.length > 0) {
            // 代表存在子对象
            const children: ITree[] = []
            for (let index = 0; index < object.children.length; index++) {
                const element = object.children[index];
                const childObject = this.getObjectData(element)
                children.push(childObject)
            }
            target.children = children
        }
        return target
    }
    public loadExportMode(url: string) {
        const loader = new GLTFLoader();
        loader.load(url,
            (gltf) => {
                gltf.scene.position.set(2802, 2128, 0)
                this.scene.add(gltf.scene)
                // console.log("gltf---",gltf)
            }
        )
    }
    public loadSceneData(url: string) {
        return new Promise((resolve) => {
            const loader = new GLTFLoader();
            loader.load(url,
                (gltf) => {
                    const root = gltf.scene.getObjectByName("root")
                    const children = root.children
                    const group = new THREE.Group()
                    group.name ="wrapper"
                    this.containterList = [...children]
                    const objectList: ITree[] = []
                    for (let index = 0; index < this.containterList.length; index++) {
                        const element = this.containterList[index];
                        objectList.push(this.getObjectData(element))
                    }
                    this.cbk.loadCbk(objectList)
                    group.add(...children)
                    // }
                    const size = this.calculateGroupDimensions(group)
                    this.scene.add(group)
                    const number = 2000
                    this.camera!.position.set(size.center.x, size.center.y, size.center.z + number)
                    this.controls.target.set(size.center.x, size.center.y, size.center.z)
                    this.targetGrop = group
                    setTimeout(() => {
                        this.getChildModePostion()
                    }, 1000);
                    resolve(group)
                }, (xhr) => {
                    const progress = Math.round((xhr.loaded / xhr.total) * 100);
                    console.log("progress", progress)
                }, err => {
                    console.log("err", err)
                })
        })
    }
    public getChildModePostion(){
        const name = ["Group_37","Group_10","Group_6","Group_7","Group_8","Group_9",
        "Group_45", "Group_46", "Group_47",
        "Group_40", "Group_41", "Group_42",, "Group_43",

        "Group_26", "Group_27", "Group_28",, "Group_29",

        "Group_25",

        "Group_19",
        "Group_20", "Group_21", "Group_22",, "Group_23",

        "Group_51",
        "Group_53", "Group_54", "Group_55", "Group_56","Group_57",
        "Group_36",

        "Group_72","Group_73","Group_74","Group_75","Group_76",

        "Group_82","Group_83","Group_84","Group_85",

        "Group_80", "Group_70", "Group_77", "Group_79", "Group_78",

         "Group_14", "Group_15", "Group_16", "Group_17",
        "Group_32", "Group_33", "Group_34","Group_35", 

        "Group_13", "Group_31",
          "Group_1", "Group_2","Group_3",

    ]
        
        name.forEach((key) =>{
            const group =  this.targetGrop.getObjectByName(key)
            if(group) {
                let isTure = false
                let whileGroup = group
                let x = group.position.x
                let y = group.position.y
                while(!isTure) {
                    const parent = whileGroup.parent
                    if(parent.name =='wrapper') {
                        isTure = true
                    }else {
                        x+=parent.position.x
                        y+=parent.position.y
                        isTure = false
                    }
                    whileGroup=  parent

                }
            }
        })
    }

}
export default ExportThree