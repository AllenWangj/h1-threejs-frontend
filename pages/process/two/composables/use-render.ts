import * as Three from 'three'
import { Set75 } from '~/utils/utilsTwoSet/set75'

const { BaseThree } = useThree()

/**
 * 场景布局类型
 */
enum SceneLayoutType {
  Layout_75 = '75'
}

/**
 * 操作模式
 */
enum OperationMode {
  Move = 'move',    // 移动模式
  Rotate = 'rotate' // 旋转模式
}

/**
 * 用户数据接口
 */
interface ObjectUserData {
  position?: Three.Vector3
  rotation?: Three.Vector3
}

class RenderPlanLayout extends BaseThree {
  // 场景状态
  private isCompleteLoadScene = false
  private wrapper: Three.Group
  private readonly wrapperName = '__WRAPPER__'
  private defaultGroup: Three.Group | null = null
  
  // 射线投射
  private raycaster: Three.Raycaster
  private mouse: Three.Vector2
  
  // 交互状态
  private selectedObject: Three.Object3D | null = null
  private previousMousePosition: Three.Vector2 = new Three.Vector2()
  private interactiveObjects: Three.Object3D[] = []
  private operationMode: OperationMode = OperationMode.Move
  private isDragging = false
  
  // 常量
  static readonly DEFAULT_SCENE_NAME = 'root'
  private readonly CAMERA_DISTANCE = 3000
  
  // 事件处理函数引用
  private handleMouseDownBound: (event: MouseEvent) => void
  private handleMouseMoveBound: (event: MouseEvent) => void
  private handleMouseUpBound: (event: MouseEvent) => void
  
  constructor(node: HTMLElement) {
    super(node, {
      enableShadow: true,
      enableDamping: true
    })
    
    // 绑定事件处理函数
    this.handleMouseDownBound = this.handleMouseDown.bind(this)
    this.handleMouseMoveBound = this.handleMouseMove.bind(this)
    this.handleMouseUpBound = this.handleMouseUp.bind(this)
    
    this.initializeScene()
    this.initRaycaster()
    this.addEventListeners()
    this.loadDefaultScene()
  }
  
  /**
   * 初始化场景
   */
  private initializeScene(): void {
    this.wrapper = new Three.Group()
    this.wrapper.name = this.wrapperName
    this.scene.add(this.wrapper)
  }
  
  /**
   * 初始化射线投射器
   */
  private initRaycaster(): void {
    this.raycaster = new Three.Raycaster()
    this.raycaster.far = 10000
    this.raycaster.ray.direction.normalize()
    this.mouse = new Three.Vector2()
  }
  
  /**
   * 加载默认场景
   */
  private async loadDefaultScene(): Promise<void> {
    try {
      const sceneMap: Record<string, string> = {
        [SceneLayoutType.Layout_75]: '/test/75/base.gltf'
      }
      
      const scenePath = `/gltf/${sceneMap[SceneLayoutType.Layout_75]}`
      const gltf = await this.loadGLTFResource(scenePath)
      
      const root = gltf.scene.getObjectByName(RenderPlanLayout.DEFAULT_SCENE_NAME)
      if (!root) {
        throw new Error('场景根节点未找到')
      }
      
      this.defaultGroup = this.wrapper
      this.wrapper.add(...root.children)
      
      // 设置相机位置
      this.setupCamera()
      
      // 加载场景模型
      await this.loadSceneModels()
      
      this.isCompleteLoadScene = true
    } catch (error) {
      console.error('❌ 加载默认场景失败:', error)
      ElMessage.error('场景加载失败')
    }
  }
  
  /**
   * 设置相机位置
   */
  private setupCamera(): void {
    const size = this.calculateGroupDimensions(this.wrapper)
    
    this.camera.position.set(
      size.center.x,
      size.center.y - this.CAMERA_DISTANCE,
      size.center.z + this.CAMERA_DISTANCE
    )
    
    this.controls.target.copy(size.center)
    this.controls.update()
  }
  
  /**
   * 加载场景模型
   */
  private async loadSceneModels(): Promise<void> {
    const loadPromises = Set75.map((config, index) => 
      this.loadSingleModel(config, index)
    )
    
    await Promise.all(loadPromises)
  }
  
  /**
   * 加载单个模型
   */
  private async loadSingleModel(config: any, index: number): Promise<void> {
    try {
      const gltf = await this.loadGLTFResource(`/gltf/test/75/${config.code}.gltf`)
      
      if (index === 0) {
        this.addBaseModel(gltf, config)
      } else {
        this.addInteractiveModel(gltf, config)
      }
    } catch (error) {
      console.error(`❌ 加载模型失败 [${config.code}]:`, error)
    }
  }
  
  /**
   * 添加基础模型
   */
  private addBaseModel(gltf: any, config: any): void {
    const group = gltf.scenes[0]
    group.position.set(config.position.x, config.position.y, 0)
    this.wrapper.add(group)
  }
  
  /**
   * 添加可交互模型
   */
  private addInteractiveModel(gltf: any, config: any): void {
    const group = gltf.scene.children[0] as Three.Group
    const size = this.calculateGroupDimensions(group)
    
    // 设置旋转和位置
    group.name = config.groupName
    group.rotation.z = (config.deg * Math.PI) / 180
    group.position.set(-size.width / 2, -size.height / 2, config.position.z)
    
    // 创建枢轴点
    const pivot = new Three.Object3D()
    pivot.position.set(
      config.position.x + size.width / 2,
      config.position.y + size.height / 2,
      config.position.z
    )
    pivot.add(group)
    
    this.wrapper.add(pivot)
    this.interactiveObjects.push(pivot)
  }
  
  /**
   * 添加事件监听
   */
  private addEventListeners(): void {
    const element = this.renderer.domElement
    
    element.addEventListener('mousedown', this.handleMouseDownBound)
    element.addEventListener('mousemove', this.handleMouseMoveBound)
    element.addEventListener('mouseup', this.handleMouseUpBound)
  }
  
  /**
   * 鼠标按下处理
   */
  private handleMouseDown(event: MouseEvent): void {
    const ndc = this.convertToNDC(event.clientX, event.clientY)
    this.mouse.set(ndc.x, ndc.y)
    
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true)
    
    if (intersects.length > 0) {
      const selectedObject = this.findParentObject(intersects[0].object)
      
      if (selectedObject) {
        this.startInteraction(selectedObject, event)
      }
    }
  }
  
  /**
   * 查找父级对象
   */
  private findParentObject(object: Three.Object3D): Three.Object3D | null {
    let current = object
    
    while (current) {
      if (current.parent?.parent?.name === this.wrapperName) {
        return current
      }
      current = current.parent
    }
    
    return null
  }
  
  /**
   * 开始交互
   */
  private startInteraction(object: Three.Object3D, event: MouseEvent): void {
    this.selectedObject = object
    this.controls.enabled = false
    this.isDragging = true
    
    // 保存初始状态
    const parent = object.parent as Three.Object3D
    parent.userData = {
      position: parent.position.clone(),
      rotation: new Three.Vector3().copy(parent.rotation as any)
    } as ObjectUserData
    
    if (this.operationMode === OperationMode.Move) {
      this.updateObjectPosition(event)
    } else {
      this.previousMousePosition.set(event.clientX, event.clientY)
    }
  }
  
  /**
   * 鼠标移动处理
   */
  private handleMouseMove(event: MouseEvent): void {
    if (!this.selectedObject || !this.isDragging) return
    
    if (this.operationMode === OperationMode.Move) {
      this.updateObjectPosition(event)
    } else {
      this.updateObjectRotation(event)
    }
  }
  
  /**
   * 鼠标抬起处理
   */
  private handleMouseUp(event: MouseEvent): void {
    this.controls.enabled = true
    this.isDragging = false
  }
  
  /**
   * 更新对象位置
   */
  private updateObjectPosition(event: MouseEvent): void {
    if (!this.selectedObject) return
    
    const rect = this.renderer.domElement.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top
    
    const worldPos = this.getWorldPositionFromScreen(mouseX, mouseY)
    const parent = this.selectedObject.parent as Three.Object3D
    
    parent.position.set(worldPos.x, worldPos.y, 0)
  }
  
  /**
   * 更新对象旋转
   */
  private updateObjectRotation(event: MouseEvent): void {
    if (!this.selectedObject) return
    
    const deltaMove = {
      x: event.clientX - this.previousMousePosition.x,
      y: event.clientY - this.previousMousePosition.y
    }
    
    const parent = this.selectedObject.parent as Three.Object3D
    parent.rotation.z += deltaMove.x * 0.05
    
    this.previousMousePosition.set(event.clientX, event.clientY)
  }
  
  /**
   * 屏幕坐标转世界坐标
   */
  private getWorldPositionFromScreen(x: number, y: number): Three.Vector3 {
    const ndc = new Three.Vector2(
      (x / this.renderer.domElement.clientWidth) * 2 - 1,
      -(y / this.renderer.domElement.clientHeight) * 2 + 1
    )
    
    const raycaster = new Three.Raycaster()
    raycaster.setFromCamera(ndc, this.camera)
    
    const intersects = raycaster.intersectObjects(this.scene.children, true)
    
    if (intersects.length > 0) {
      return intersects[0].point
    }
    
    // 如果没有交点，返回相机前方的点
    const direction = new Three.Vector3()
    this.camera.getWorldDirection(direction)
    return this.camera.position.clone().add(direction.multiplyScalar(0))
  }
  
  /**
   * 设置移动模式
   */
  public setMoveMode(): void {
    this.operationMode = OperationMode.Move
    this.selectedObject = null
  }
  
  /**
   * 设置旋转模式
   */
  public setRotateMode(): void {
    this.operationMode = OperationMode.Rotate
    this.selectedObject = null
  }
  
  /**
   * 重置对象位置
   */
  public resetObjectTransform(): void {
    if (!this.selectedObject) return
    
    const parent = this.selectedObject.parent as Three.Object3D
    const userData = parent.userData as ObjectUserData
    
    if (this.operationMode === OperationMode.Move && userData.position) {
      parent.position.copy(userData.position)
    } else if (this.operationMode === OperationMode.Rotate && userData.rotation) {
      parent.rotation.set(userData.rotation.x, userData.rotation.y, userData.rotation.z)
    }
  }
  
  /**
   * 删除选中对象
   */
  public deleteSelectedObject(): void {
    if (!this.selectedObject) {
      ElMessage.warning('请先选择要删除的对象')
      return
    }
    
    const parent = this.selectedObject.parent
    if (parent?.parent) {
      parent.parent.remove(parent)
      this.interactiveObjects = this.interactiveObjects.filter(obj => obj !== parent)
      this.selectedObject = null
      ElMessage.success('删除成功')
    }
  }
  
  /**
   * 清理AI数据
   */
  public clearAIData(): void {
    if (this.wrapper) {
      this.disposeGLTFGroup(this.wrapper)
      this.defaultGroup = null
    }
  }
  
  /**
   * 获取可交互对象列表
   */
  public get interactiveObjectList(): Three.Object3D[] {
    return this.interactiveObjects
  }
  
  /**
   * 获取场景加载状态
   */
  public get isSceneLoaded(): boolean {
    return this.isCompleteLoadScene
  }
  
  /**
   * 销毁资源
   */
  public override destory(): void {
    // 移除事件监听
    const element = this.renderer.domElement
    element.removeEventListener('mousedown', this.handleMouseDownBound)
    element.removeEventListener('mousemove', this.handleMouseMoveBound)
    element.removeEventListener('mouseup', this.handleMouseUpBound)
    
    // 清理资源
    this.clearAIData()
    
    // 调用父类销毁方法
    super.destory()
  }
}

export const useRender = () => {
  return { RenderPlanLayout }
}
