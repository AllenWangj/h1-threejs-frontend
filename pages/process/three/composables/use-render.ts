import { type GLTF } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
const { BaseThree } = useThree()
const { getModelUrl, getModelMap } = useModelMap()
enum EGroupType {
    OUT_GROUP = 1, //外墙
    INNER_WALL = 2, //内墙
    UNKNOW = -1,//未知道类型
    TOP_GRoup = 3,//顶部
}
// con
class ProcessThree extends BaseThree {
    private wrapper = new THREE.Group()
    private outLineGroup: THREE.Group[] = []
    private innerGroup: THREE.Group[] = []
    private topGroup: THREE.Group[] = []
    private gltfCodes: string[] = []

    // 射线投射
    private raycaster: THREE.Raycaster
    private mouse: THREE.Vector2
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
        this.initRaycaster()
        this.addEventListeners()
        // this.handleOriginModel(plan)
    }

    private initRaycaster(): void {
        this.raycaster = new THREE.Raycaster()
        this.raycaster.far = 10000
        this.raycaster.ray.direction.normalize()
        this.mouse = new THREE.Vector2()
    }
    private addEventListeners(): void {
        const element = this.renderer.domElement

        element.addEventListener('mousedown', (event: MouseEvent) => {
            const ndc = this.convertToNDC(event.clientX, event.clientY)
            this.mouse.set(ndc.x, ndc.y)

            this.raycaster.setFromCamera(this.mouse, this.camera)
            const intersects = this.raycaster.intersectObjects(this.wrapper.children, true)

            if (intersects.length > 0) {
                console.log("intersects", intersects)
            }
        })

    }

    private setGroupOpacity(group, opacity) {
        // 遍历组内所有子对象
        group.traverse(function (child) {
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
    public async handleOriginModel(data: any) {
        this.handleClearnJunk(this.wrapper)
        const base = new THREE.Group()
        if (data.scale) {
            base.scale.set(
                data.scale.x,
                data.scale.y,
                data.scale.z,
            )
        }
        this.wrapper.add(base)

        this.gltfCodes = []
        this.handleLoadUrl(data, base)
        const codes = Array.from(new Set(this.gltfCodes))
        await getModelMap(codes)
        const results = await this.runWithConcurrency(this.promiseFactories, 200)
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
            if (this.handleGroupType(name) == EGroupType.OUT_GROUP) {
                this.outLineGroup.push(object.scene)
            } else if (this.handleGroupType(name) == EGroupType.INNER_WALL) {
                this.innerGroup.push(object.scene)
            } else if (this.handleGroupType(name) === EGroupType.TOP_GRoup) {
                this.topGroup.push(object.scene)
            }
        })
        const size = this.calculateGroupDimensions(this.wrapper)
        const number = 600
        this.camera!.position.set(size.center.x, size.center.y, size.center.z - number)
        this.controls.target.set(size.center.x, size.center.y, size.center.z)
        this.outLineGroup.forEach(ele => {
            ele.visible = false
        })



        this.topGroup.forEach(ele => {
            this.setGroupOpacity(ele, 0.3)
        })
        //     const group1 = this.wrapper.getObjectByName("Group_1")
        // group1.visible = false


        // const group2 = this.wrapper.getObjectByName("Group_27")
        this.innerGroup.forEach(ele => this.setGroupOpacity(ele, 0.8))
    //     if (group2) {
    //         const sprite =this.createTextSprite("生活区",{
    //     fontSize: 40,
    //     font: '微软雅黑, Arial', // 支持中文字体（确保系统有该字体）
    //     color: '#ffffff',
    //     bgColor: '#568FCC', // 半透明橙色背景
    //     position: [group2.position.x-200, group2.position.y+800, group2.position.z-250]
    //   })
    //   this.wrapper.add(sprite)
    //         group2.traverse((child) => {
    //             if (child instanceof THREE.Mesh) {
    //                 child.material.color.setRGB(0, 0, 1); // 改为蓝色
    //             }
    //         })
    //     }

    }
    private handleLoadUrl(object: any, parent: any) {
        if (object.code) {
            let code = object.code
            this.gltfCodes.push(code)
            this.promiseFactories.push(() => {
                const modelUrl = getModelUrl(code)
                return new Promise((reslove) => {
                    this.loadGLTFResource(modelUrl).then(res => {
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
    private handleGroupType(name: string) {
        // 判断组件是不是墙
        const out = [
            "组件#13",
            "组件#43",
            "组件#70",
            "组件#43",
            "组件#18",
            "组件#17",
            "组件#9",
            "组件#55",
            "组件#50",
            "组件#48",
            "组件#49",
            "组件#60",
            "组件#106",
            "组件#110",
            "组件#108",
            "组件#24",
            "组件#89",
            "组件#93",
            "组件#91",
            "组件#10",
            "组件#47",
            "组件#25",
        ]
        const result2 = out.some(ele => {
            return name.indexOf(ele) != -1
        })
        if (result2) {
            // 代表是外墙
            return EGroupType.OUT_GROUP
        }
        const inner = [
            "组件#40",
            "组件#41",
            "组件#37",
            "组件#39",
        ]
        const result = inner.some(ele => {
            return name.indexOf(ele) != -1
        })
        if (result) {
            // 代表内墙
            return EGroupType.INNER_WALL
        }
        const top = ['组件#52']
        const result1 = top.some(ele => {
            return name.indexOf(ele) != -1
        })
        if (result1) {
            return EGroupType.TOP_GRoup
        }
        return EGroupType.UNKNOW
    }

    protected handleClearnJunk(group: THREE.Group): void {
        if (!group || !group.parent) {
            console.warn('⚠️ 尝试释放无效的组')
            return
        }
        // 递归释放所有资源
        group.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                // 释放几何体
                object.geometry?.dispose()

                // 释放材质
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach((material) => this.disposeMaterial(material))
                    } else {
                        this.disposeMaterial(object.material)
                    }
                }
            }
        })
        group.clear()
    }
}
export const useRender = () => {
    return { ProcessThree }
}