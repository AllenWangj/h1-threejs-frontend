import Three from "./threejs";
import * as THREE from 'three';
import { Set75 } from "./utilsTwoSet/set75";
export enum EnumLayoutCategory {
    EnumLayoutCategory_75 = "75",
    EnumLayoutCategory_150 = "150",
    EnumLayoutCategory_300 = "300",
    EnumLayoutCategory_600 = "600",
}
interface IOptipn {
    enumLayoutCategory: EnumLayoutCategory, //规划布局的类型
    loadSceneCBK: (progress: number) => void,//加载大场景的进度回调
    loadCompleteSceneCBK: () => void //场景加载完成回调
    loadSceneErrorCBK: (err: string) => void //加载场景失败回调
}
class PlanAndLayout extends Three {
    private option: IOptipn //类的可选参数设置
    public isCompleteLoadScene = false //大的场景是否加载完成
    private wrapper: THREE.Group //元素包裹器
    private wrapperName = "__WRAPPER__"
    private defaultGroup: THREE.Group | null
    private raycaster: THREE.Raycaster;//发射射线
    private mouse: THREE.Vector2//鼠标坐标
    static DEFINE_SCENE_NAME = "root" //代表默认模型的所在位置
    private currentStartMoveMode: THREE.Object3D | null = null //代表选中的模型
    private previousMousePosition: THREE.Vector2 = new THREE.Vector2() //记录初始化移动位置
    private raycasterSaveData: THREE.Object3D[] = []
    private isDrag = true
    private isStopDrag = true //停止移动
    constructor(node: HTMLElement, option?: IOptipn) {
        super(node)
        this.option = Object.assign({
            enumLayoutCategory: EnumLayoutCategory.EnumLayoutCategory_75,
            loadSceneCBK: (progress) => { },
            loadCompleteSceneCBK: () => { },
            loadSceneErrorCBK: () => { },
        }, option)
        this.initRaycaster()
        this.addEventListeners()
        this.wrapper = new THREE.Group()
        this.wrapper.name = this.wrapperName
        this.scene.add(this.wrapper)
        this.handleLoadDefaultScene()
    }
    private initRaycaster(): void {
        this.raycaster = new THREE.Raycaster();
        this.raycaster.far = 10000; // 根据场景大小调整
        this.raycaster.ray.direction.normalize();
        this.mouse = new THREE.Vector2();
    }
    private handleLoadDefaultScene() {
        // this.isLoadAIStart = false
        const sceneGLTF = {
            [EnumLayoutCategory.EnumLayoutCategory_75]: "/test/75/base.gltf"
        }
        this.loadGLTFResource(`/gltf/${sceneGLTF[this.option.enumLayoutCategory]}`, (progress) => {
            this.option.loadSceneCBK(progress)
        }).then(res => {
            const root = res.scene.getObjectByName(PlanAndLayout.DEFINE_SCENE_NAME)
            this.defaultGroup = this.wrapper
            this.wrapper.add(...root.children)
            const size = this.calculateGroupDimensions(this.wrapper)
            // - number
            const number = 3000
            this.camera!.position.set(size.center.x, size.center.y - number, size.center.z + number)
            this.controls.target.set(size.center.x, size.center.y, size.center.z)
            // 移除模版中不要的小模块
            // this.handleRemoveMode(this.defaultGroup)
            this.handleScenMode()
        })
    }
    public handleAIData() {
        // 清楚默认场景的数据，释放内存
        this.disposeGLTFGroup(this.wrapper)
        this.defaultGroup = null
    }
    get raycasterList() {
        return this.raycasterSaveData
    }
    private addEventListeners(): void {
        this.renderer.domElement.addEventListener('mousedown', (e) => this.handleOnMouseDown(e));
        this.renderer.domElement.addEventListener('mousemove', (e) => this.handleOnMouseMove(e));
        this.renderer.domElement.addEventListener('mouseup', (e) => this.handleOnMouseUp(e));
    }
    private handleOnMouseDown(event: MouseEvent) {
        // 鼠标按下
        // this.controls.enabled = false
        const dpX = event.clientX;
        const dpY = event.clientY;
        const ndc = this.convertDpToNdc(dpX, dpY);
        this.mouse.x = ndc.x;
        this.mouse.y = ndc.y;
        // 更新射线投射器
        this.raycaster.setFromCamera(this.mouse, this.camera);
        // 检查射线与哪些物体相交
        const intersects = this.raycaster.intersectObjects(this.raycasterList, true);
        if (intersects.length > 0) {
            // 代表选中了目标
            const { object } = intersects[0]
            let selectObject = object
            let stop = false
            // selectObject.name.indexOf("Group") == -1 ||
            while (!stop) {
                // 代表没有找到目标元素
                selectObject = selectObject.parent
                if (selectObject.parent.parent.name === this.wrapperName) {
                    // 
                    stop = true
                }
            }
            // if (stop == true) {
            //     // 代表是没有找到的
            //     // todo 提示报错
            //     return
            // }
            // 代表找到了这个模型，需要移动了
            this.currentStartMoveMode = selectObject
            this.controls.enabled = false
            // 需要记录按下的时候位置信息，方便复位
            this.currentStartMoveMode.parent.userData.position = new THREE.Vector3(
                this.currentStartMoveMode.parent.position.x,
                this.currentStartMoveMode.parent.position.y,
                this.currentStartMoveMode.parent.position.z,

            )

            this.currentStartMoveMode.parent.userData.rotation = new THREE.Vector3(
                this.currentStartMoveMode.parent.rotation.x,
                this.currentStartMoveMode.parent.rotation.y,
                this.currentStartMoveMode.parent.rotation.z,
            )
            this.isStopDrag = false
            if (this.isDrag) {
                this.handleMousePosition(event)
            } else {
                this.previousMousePosition.x = event.clientX;
                this.previousMousePosition.y = event.clientY
            }
        }
    }
    private handleMousePosition(event: MouseEvent) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left)
        const mouseY = (event.clientY - rect.top)
        const worldPos = this.getWorldPositionFromScreen(mouseX, mouseY)
        const parent = this.currentStartMoveMode.parent
        const x = worldPos.x
        const y = worldPos.y
        const z = 0
        parent.position.set(x, y, z)
    }
    private handleMouseRotation(event: MouseEvent) {
        const deltaMove = {
            x: event.clientX - this.previousMousePosition.x,
            y: event.clientY - this.previousMousePosition.y
        };
        const parent = this.currentStartMoveMode.parent
        parent.rotation.z += deltaMove.x * 0.05;
        // 更新上一帧鼠标位置
        this.previousMousePosition.x = event.clientX
        this.previousMousePosition.y = event.clientY
    }

    private handleOnMouseUp(event: MouseEvent) {
        // 鼠标抬起
        this.controls.enabled = true
        if (this.isStopDrag) {
            return
        }
        if (this.isDrag) {
            this.isStopDrag = true
            this.handleOnMouseMove(event)
        } else {
            this.isStopDrag = true
        }
        // this.currentStartMoveMode = null
    }
    private handleOnMouseMove(event: MouseEvent) {
        // 鼠标移动
        if (!this.currentStartMoveMode) {
            return
        }
        if (this.isStopDrag) {
            return
        }
        if (this.isDrag) {
            this.handleMousePosition(event)
        } else {
            this.handleMouseRotation(event)

        }
        return

    }
     getResult(str) {
    // 匹配字符串末尾的数字（.gltf前的数字）
    const reg = /(\d+)\.gltf$/;
    const match = str.match(reg);
    if (match && match[1]) {
        // 提取数字并补零至2位，与前缀101组合
        const num = match[1].padStart(2, '0');
        return '101' + num;
    }
    return ''; // 匹配失败返回空
}
    private handleScenMode() {
        // 加载默认场景数据
        Set75.forEach((ele, index) => {
            this.loadGLTFResource(`/gltf/test/75/${ele.code}.gltf`).then(res => {
                if (index == 0) {
                    const xPos = ele.position.x
                    const yPos = ele.position.y
                    const group =res.scenes[0]
                    const size = this.calculateGroupDimensions(group)
                    group.position.set(xPos, yPos, 0)
                    this.wrapper.add(group)
                } else {
                    const group = res.scene.children[0] as THREE.Group
                    const size = this.calculateGroupDimensions(group)
                    const xPos = ele.position.x
                    const yPos = ele.position.y
                    const x = xPos
                    const y = yPos
                    const z = ele.position.z
                    group.name = ele.groupName
                    group.rotation.z = ele.deg * Math.PI / 180
                    const pivot = new THREE.Object3D();
                    pivot.position.set(x + size.width / 2, y + size.height / 2, z)
                    group.position.set(-size.width / 2, -size.height / 2, z)
                    pivot.add(group)
                    this.wrapper.add(pivot)
                    this.raycasterSaveData.push(pivot)
                }
            })
        })
    }
   
    private getWorldPositionFromScreen(x, y) {
        // 1. 将屏幕坐标转换为标准化设备坐标 (-1 到 1)
        const ndc = new THREE.Vector2();
        ndc.x = (x / this.renderer.domElement.clientWidth) * 2 - 1;
        ndc.y = -(y / this.renderer.domElement.clientHeight) * 2 + 1;
        // 2. 创建射线投射器
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(ndc, this.camera);
        // 3. 计算射线与物体的交点
        // 这里假设场景中有一个地面平面或其他物体
        const intersects = raycaster.intersectObjects(this.scene.children, true);
        if (intersects.length > 0) {
            // 返回第一个交点的位置
            return intersects[0].point;
        } else {
            // 如果没有交点，可以返回射线方向上的某个点
            const direction = new THREE.Vector3();
            this.camera.getWorldDirection(direction);
            const distance = 0; // 距离相机的距离
            return this.camera.position.clone().add(direction.multiplyScalar(distance));
        }
    }
    public handleThreeIsDrag() {
        // 设置移动

        this.isDrag = true
        this.currentStartMoveMode = null
    }
    public handleThreeIsNotDrag() {
        // 设置旋转
        this.currentStartMoveMode = null
        this.isDrag = false
    }
    public handleRestPosition() {
        // 复位
        if (this.currentStartMoveMode) {
            if (this.isDrag) {
                const position = this.currentStartMoveMode.parent.userData.position
                this.currentStartMoveMode.parent.position.set(
                    position.x,
                    position.y,
                    position.z,
                )
            } else {
                const rotation = this.currentStartMoveMode.parent.userData.rotation
                this.currentStartMoveMode.parent.rotation.set(
                    rotation.x,
                    rotation.y,
                    rotation.z,
                )
            }

        }
    }
    public handleDeleteMode() {
        this.currentStartMoveMode.parent.parent.remove(this.currentStartMoveMode.parent)
    }
}
export default PlanAndLayout