import Three from "./threejs";
import * as THREE from 'three';

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
    private isLoadAIStart = false//是否开始加载AI数据
    private wrapper: THREE.Group //元素包裹器
    private wrapperName = "__WRAPPER__"
    private defaultGroup: THREE.Group | null
    private raycaster: THREE.Raycaster;//发射射线
    private mouse: THREE.Vector2//鼠标坐标
    static DEFINE_SCENE_NAME = "root" //代表默认模型的所在位置
    private currentStartMoveMode: THREE.Object3D | null = null //代表选中的模型
    private previousMousePosition: THREE.Vector2 = new THREE.Vector2() //记录初始化移动位置
    private raycasterSaveData:THREE.Group[] = []
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

    private handleInitScene() {
        // 初始化大的场景
        this.loadGLTFResource("/gltf/test/75/landmark.gltf", (progress) => {
            this.option.loadSceneCBK(progress)
        }).then(res => {
            console.log("scene", res)
            this.wrapper.add(res.scene)
            const size = this.calculateGroupDimensions(this.wrapper)
            console.log("size.center", size.center)
            const number = 3000
            this.camera!.position.set(size.center.x, size.center.y, size.center.z + number)
            this.controls.target.set(size.center.x, size.center.y, size.center.z)
            this.isCompleteLoadScene = true
            this.option.loadCompleteSceneCBK()
        }, (err) => {
            this.option.loadSceneErrorCBK(err)
        })
    }
    private initRaycaster(): void {
        this.raycaster = new THREE.Raycaster();
        this.raycaster.far = 10000; // 根据场景大小调整
        this.raycaster.ray.direction.normalize();
        this.mouse = new THREE.Vector2();
    }
    private handleLoadDefaultScene() {
        this.isLoadAIStart = false
        const sceneGLTF = {
            [EnumLayoutCategory.EnumLayoutCategory_75]: "/75-test/75-test.skp.gltf"
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
            this.handleRemoveMode(this.defaultGroup)
            this.handleScenMode()
        })
    }
    public handleAIData() {
        // 开始AI数据
        this.isLoadAIStart = true
        // 清楚默认场景的数据，释放内存
        this.disposeGLTFGroup(this.wrapper)
        this.defaultGroup = null
    }
    get raycasterList() {
        return  this.raycasterSaveData
    }
    private addEventListeners(): void {
        // 窗口大小变化事件
        //  window.addEventListener('resize', () => this.onWindowResize());

        // 鼠标事件
        this.renderer.domElement.addEventListener('mousedown', (e) => this.handleOnMouseDown(e));
        this.renderer.domElement.addEventListener('mousemove', (e) => this.handleOnMouseMove(e));
        this.renderer.domElement.addEventListener('mouseup', (e) => this.handleOnMouseUp(e));
        // this.renderer.domElement.addEventListener('mouseleave', () => this.onMouseUp());

        // 按钮事件
        //this.addModelBtn.addEventListener('click', () => this.addNewModel());
        //this.rotateModeBtn.addEventListener('click', () => this.setInteractionMode('rotate'));
        //this.dragModeBtn.addEventListener('click', () => this.setInteractionMode('drag'));
    }
    private handleOnMouseDown(event: MouseEvent) {
        // 鼠标按下
        // this.controls.enabled = false
        const dpX = event.clientX;
        const dpY = event.clientY;

        // 转换为标准化设备坐标
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

            while (selectObject.name.indexOf("Group") == -1 || stop) {
                // 代表没有找到目标元素
                selectObject = selectObject.parent
                if (selectObject.name === this.wrapperName) {
                    // 
                    stop = true
                }
            }
            if (stop == true) {
                // 代表是没有找到的
                // todo 提示报错
                return
            }
            // 代表找到了这个模型，需要移动了
            this.currentStartMoveMode = selectObject
            this.previousMousePosition.copy(this.mouse);
            this.controls.enabled = false
            // 算出中心点
            // this.handleEventPosition(event)
             this.handleMousePosition(event)
        }
    }
    private handleMousePosition(event: MouseEvent) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left)
        const mouseY =( event.clientY - rect.top) 
        // console.log("mouseX---",mouseX,mouseY, window.devicePixelRatio)
       
        const size = this.calculateGroupDimensions(this.currentStartMoveMode)
        const worldPos  =  this.getWorldPositionFromScreen(mouseX,mouseY)
        console.log("size",worldPos)

        const x = worldPos.x +100 -size.width/2 // todo 需要明白为啥少了100
        const y = worldPos.y -size.height /2
        this.currentStartMoveMode.position.set(x,y,0)
    }
    private handleOnMouseUp(event: MouseEvent) {
        this.controls.enabled = true

        this.handleOnMouseMove(event)
        this.currentStartMoveMode = null
    }
    private handleOnMouseMove(event: MouseEvent) {
        
    
        // const plane = new THREE.Plane();
        // plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0));

        // // 计算射线与平面的交点
        // const intersectionPoint = new THREE.Vector3();
        // raycaster.setFromCamera(mouse, camera);
        // raycaster.ray.intersectPlane(plane, intersectionPoint);
    //    return

        // 代表需要移动了
        if (!this.currentStartMoveMode) {
            return
        }
        this.handleMousePosition(event)
        return
        const dpX = event.clientX;
        const dpY = event.clientY;
        const ndc = this.convertDpToNdc(dpX, dpY);
        // this.mouse.x = ndc.x;
        // this.mouse.y = ndc.y;
        const mouseX = ndc.x;
        const mouseY = ndc.y;
        const vector = new THREE.Vector3(mouseX, mouseY, 0.5);
        vector.unproject(this.camera);
        const dir = vector.sub(this.camera.position).normalize();
        const distance = -this.camera.position.z / dir.z;
        const pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
        this.currentStartMoveMode.position.x += (pos.x - this.currentStartMoveMode.position.x) * 0.1;
        this.currentStartMoveMode.position.y += (pos.y - this.currentStartMoveMode.position.y) * 0.1;
    }
    private handleEventPosition(event: MouseEvent) {
        return 
        // const mouse = new THREE.Vector2(0, 0)
        // const rect = this.renderer.domElement;
        // mouse.x = (event.clientX / rect.clientWidth) * 2 - 1;
        // mouse.y = -(event.clientY / rect.clientHeight) * 2 + 1;
        // //     const dpX = event.clientX;
        // //     const dpY = event.clientY;
        // //     const ndc = this.convertDpToNdc(dpX, dpY);

        // //    const mouseX =  ndc.x;
        // //    const mouseY = ndc.y;
        // //      mouse.x = mouseX;
        // //  mouse.y =mouseY;
        // debugger
        // const plane = new THREE.Plane();
        // plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0));
        // // 计算射线与平面的交点
        // const intersectionPoint = new THREE.Vector3();
        // this.raycaster.setFromCamera(mouse, this.camera);
        // this.raycaster.ray.intersectPlane(plane, intersectionPoint);
        // this.currentStartMoveMode.position.copy(intersectionPoint);
        const dpX = event.clientX;
        const dpY = event.clientY;
        const ndc = this.convertDpToNdc(dpX, dpY);
        const mouseX =  ndc.x;
        const mouseY = ndc.y;
         const vector = new THREE.Vector3(mouseX, mouseY, 0.5);
         vector.unproject(this.camera);
         const dir = vector.sub(this.camera.position).normalize();
         const distance = -this.camera.position.z / dir.z;
         const pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
         const {size} =  this.calculateGroupDimensions(this.currentStartMoveMode)
        //  this.currentStartMoveMode.position.x = pos.x
        //  this.currentStartMoveMode.position.y = pos.y
        console.log("pos---",pos)
        this.currentStartMoveMode.position.x += (pos.x - this.currentStartMoveMode.position.x) * 0.1;
        this.currentStartMoveMode.position.y += (pos.y - this.currentStartMoveMode.position.y) * 0.1;
        //  this.highlightObject( this.currentStartMoveMode)
    }
    // private highlightObject(object:THREE.Object3D) {
    //     // 保存原始材质
    // //   const   originalMaterials = [];
    //     object.traverse((child) => {
    //         if (child.isMesh) {
    //             // 创建高亮材质（半透明红色）
    //             child.material = new THREE.MeshBasicMaterial({
    //                 color: 0xff0000,
    //                 transparent: false,
    //                 opacity: 1,
    //                 wireframe: false
    //             });
    //         }
    //     });
    // }
    private convertDpToNdc(dpX: number, dpY: number) {
        // 获取渲染器元素的边界矩形
        const rect = this.renderer.domElement.getBoundingClientRect();
        // 计算相对于渲染器的dp坐标
        const relativeX = dpX - rect.left;
        const relativeY = dpY - rect.top;
        // 转换为0-1范围的坐标
        const normalizedX = relativeX / rect.width;
        const normalizedY = relativeY / rect.height;

        // 转换为Three.js的标准化设备坐标(-1到1)
        return {
            x: normalizedX * 2 - 1,
            y: -(normalizedY * 2 - 1)
        };
    }
    private handleScenMode(){
        // 加载场景的模型
        this.loadGLTFResource(`/gltf/test/75/75-test-Group_37.gltf`, (progress) => {
            // this.option.loadSceneCBK(progress)
        }).then(res => {
            const group = res.scene.children[0] as THREE.Group
            group.position.set(
                2700,
                2128,
                0
            )
            group.name = "Group_37"
            this.raycasterSaveData.push(group)
            this.wrapper.add(group)
        })
    }
    private handleRemoveMode(group: THREE.Group) {
        // 隐藏模型指定的模型
        const hiddenNamne = [
            'Group',
            'Group_37',
            'Group_4',
            'Group_38',
            'Group_24',
            'Group_24',
            'Group_18',
            'Group_11',
            'Group_36',
            'Group_50',
            'Group_60',
            'Group_80',
            'Group_81',
            'Group_76',
            'Group_77',
            'Group_79',
            'Group_70',
            'Group_71',
            'Group_70',
            'Group_70',
        ]
        hiddenNamne.forEach(ele => {
            const target = group.getObjectByName(ele)
            if (target) {
                target.parent.remove(target)

            } else {
                console.log("target---", target, ele)
            }
        })
    }
  private  getWorldPositionFromScreen(x, y) {
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

}
export default PlanAndLayout