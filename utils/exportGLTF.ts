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
    private targetGrop: THREE.Object3D | null = null
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
                    group.name = "wrapper"
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
                    console.log("size---", size)
                    this.scene.add(group)
                    const number = 100
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
    public getChildModePostion() {
        /**75*/
        // const name = ["Group_37","Group_10","Group_6","Group_7","Group_8","Group_9",
        // "Group_45", "Group_46", "Group_47",
        // "Group_40", "Group_41", "Group_42",, "Group_43",

        // "Group_26", "Group_27", "Group_28",, "Group_29",

        // "Group_25",

        // "Group_19",
        // "Group_20", "Group_21", "Group_22",, "Group_23",

        // "Group_51",
        // "Group_53", "Group_54", "Group_55", "Group_56","Group_57",
        // "Group_36",

        // "Group_72","Group_73","Group_74","Group_75","Group_76",

        // "Group_82","Group_83","Group_84","Group_85",

        // "Group_80", "Group_70", "Group_77", "Group_79", "Group_78",

        //  "Group_14", "Group_15", "Group_16", "Group_17",
        // "Group_32", "Group_33", "Group_34","Group_35", 

        // "Group_13", "Group_31",
        //   "Group_1", "Group_2","Group_3",



        /**工具五*/

        // ]
        /**工具五*/
        /*
        
        {
            groupName: 'Group_37',
            url: "/gltf/test/75/75-test-Group_37.gltf",
            deg: 0,
            position: {
                x: 2800,
                y: 2128,
                z: 0
            }
        },
        **/
        const baseMame = '<组件#7>'
        const baseName1Url = "/gltf/test/6/tool_6-box.gltf"
        const base = [{
            name: baseMame,
            url: baseName1Url,
            degx: 0,
            degy: 0,
            degz: 0,
        }]
        for (let index = 1; index <= 9; index++) {
            base.push({
                name: `${baseMame}_${index}`,
                url: baseName1Url,
                degx: 0,
                degy: 0,
                degz: 0,
            })

        }

        const baseName1 = "Group"
        const baseName1Url1 = "/gltf/test/6/tool_6-Group_100.gltf"
        const pos = [11, 102, 119, 113, 110, 109, 106, 121, 100, 122]
        for (let index = 0; index < pos.length; index++) {
            const element = pos[index];
            base.push({
                name: `${baseName1}_${element}`,
                url: baseName1Url1,
                degx: 0,
                degy: 0,
                degz: 0,
            })
        }


        const baseName1Url2 = "/gltf/test/6/tool_6-Group_100.gltf"
        const pos2 = [20, 12, 43, 16, 40, 44, 66, 39]
        for (let index = 0; index < pos2.length; index++) {
            const element = pos[index];
            base.push({
                name: `${baseName1}_${element}`,
                url: baseName1Url2,
                degx: 0,
                degy: 90,
                degz: 0,
            })
        }



        const pos3 = [13, 71, 59, 36, 15, 55, 50, 24, 49, 21]
        for (let index = 0; index < pos3.length; index++) {
            const element = pos3[index];
            base.push({
                name: `${baseName1}_${element}`,
                url: baseName1Url2,
                degx: -90,
                degy: 90,
                degz: 0,
            })
        }


        const baseName1Url3 = "/gltf/test/6/tool_6-Group_27.gltf"
        const pos4 = [27, 25, 32, 64, 26, 17, 63, 28]
        for (let index = 0; index < pos4.length; index++) {
            const element = pos4[index];
            base.push({
                name: `${baseName1}_${element}`,
                url: baseName1Url3,
                degx: -90,
                degy: 90,
                degz: 0,
            })
        }


        const baseName1Url4 = "/gltf/test/6/tool_6-Group_77.gltf"
        const pos5 = [77, 78, 91, 74, 89, 85, 81, 76, 73, 84,]
        for (let index = 0; index < pos5.length; index++) {
            const element = pos5[index];
            base.push({
                name: `${baseName1}_${element}`,
                url: baseName1Url4,
                degx: 0,
                degy: 90,
                degz: 0,
            })
        }


        const baseName1Url5 = "/gltf/test/6/tool_6-Group_5.gltf"
        const pos6 = [5, 2, 3, 8, 18, 56, 67, 37, 4, 6, 7, 9, 10, 51, 31, 45, 65, 46, 42]
        for (let index = 0; index < pos6.length; index++) {
            const element = pos6[index];
            base.push({
                name: `${baseName1}_${element}`,
                url: baseName1Url5,
                degx: 0,
                degy: 90,
                degz: 0,
            })
        }
        base.push({
            name: `Group`,
            url: baseName1Url5,
            degx: 0,
            degy: 90,
            degz: 0,
        })


        const baseName1Url6 = "/gltf/test/6/tool_6-Group_69.gltf"
        const pos7 = [69, 23,]
        for (let index = 0; index < pos7.length; index++) {
            const element = pos7[index];
            base.push({
                name: `${baseName1}_${element}`,
                url: baseName1Url6,
                degx: -90,
                degy: 90,
                degz: 0,
            })
        }



        const baseName1Url7 = "/gltf/test/6/tool_6-Group_54.gltf"
        const pos8 = [54, 88, 87, 123, 125, 124, 127, 126, 128]
        for (let index = 0; index < pos8.length; index++) {
            const element = pos8[index];
            base.push({
                name: `${baseName1}_${element}`,
                url: baseName1Url7,

                degx: -90,
                degy: 90,
                degz: 0,
            })
        }


        const baseName1Url8 = "/gltf/test/6/tool_6-Group_29.gltf"
        const pos9 = [29, 60, 34, 35, 47, 48, 30, 62, 52, 33]
        for (let index = 0; index < pos9.length; index++) {
            const element = pos9[index];
            base.push({
                name: `${baseName1}_${element}`,
                url: baseName1Url8,
                degx: 0,
                degy: 90,
                degz: 0,
            })
        }
        base.push({
            name: `${baseName1}_${83}`,
            url: "/gltf/test/6/tool_6-Group_83.gltf",
            degx: -90,
            degy: 90,
            degz: 0,
        })

        const baseName1Url9 = "/gltf/test/6/tool_6-Group_38.gltf"
        const pos10 = [38, 14, 19, 70, 41, 68, 22, 58, 53, 57]
        for (let index = 0; index < pos10.length; index++) {
            const element = pos10[index];
            base.push({
                name: `${baseName1}_${element}`,
                url: baseName1Url9,
                degx: 0,
                degy: 90,
                degz: 0,
            })
        }




        const baseName1Url10 = "/gltf/test/6/tool_6-Group_86.gltf"
        const pos11 = [86, 82, 72, 80, 75, 79, 92, 90,]
        for (let index = 0; index < pos11.length; index++) {
            const element = pos11[index];
            base.push({
                name: `${baseName1}_${element}`,
                url: baseName1Url10,
                degx: 0,
                degy: 90,
                degz: 0,
            })
        }

        const baseName1Url11 = "/gltf/test/6/tool_6-Group_120.gltf"
        const pos12 = [120, 114, 105, 98, 99, 101, 118, 94, 115, 117]
        for (let index = 0; index < pos12.length; index++) {
            const element = pos12[index];
            base.push({
                name: `${baseName1}_${element}`,
                url: baseName1Url11,
                degx: -90,
                degy: 90,
                degz: 0,
            })
        }



        const baseName1Url12 = "/gltf/test/6/tool_6-Group_111.gltf"
        const pos13 = [111,
            96, 116, 103, 107, 97, 108, 95, 104, 112,
        ]
        for (let index = 0; index < pos13.length; index++) {
            const element = pos13[index];
            base.push({
                name: `${baseName1}_${element}`,
                url: baseName1Url12,
                degx: 90,
                degy: 90,
                degz: 0,
            })
        }

        base.push({
            name: `${baseName1}_${1}`,
            url: "/gltf/test/6/tool_6-Group_1.gltf",
            degx: 0,
            degy: 0,
            degz: 0,
        })


        const poosList = []
        const name = [...base]
        name.forEach((key) => {
            const group = this.targetGrop.getObjectByName(key.name)
            if (group) {
                let isTure = false
                let whileGroup = group
                let x = group.position.x
                let y = group.position.y
                let z = group.position.z

                while (!isTure) {
                    const parent = whileGroup.parent
                    if (parent.name == 'wrapper') {
                        isTure = true
                    } else {
                        x += parent.position.x
                        y += parent.position.y
                        z += parent.position.z
                        isTure = false
                    }
                    whileGroup = parent
                }
                poosList.push({
                    groupName: key.name,
                    url: key.url,
                    degx: key.degx,
            degy: key.degy,
            degz: key.degz,
                    position: {
                        x,
                        y,
                        z
                    }
                },)
            }
        })
        console.log("poosList=-", poosList)
    }

}
export default ExportThree