import * as Three from 'three'
const { BaseThree } = useThree()
const { getModelUrl, getModelMap } = useModelMap()
import  {Set75} from "./set75"
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
 * 模型配置接口
 */
interface ModelConfig {
  code: string
  groupName: string
  position: { x: number; y: number; z: number }
  deg: number
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
         // // 加载场景模型
      //  this.loadSceneModels(Set75)
    // this.loadDefaultScene()
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
      // 场景基础模型的 code
      const baseSceneCode = '02_75_scene'

      // 1. 先加载场景基础模型的映射
      await getModelMap([baseSceneCode])

      // 2. 获取场景模型 URL
      const scenePath = getModelUrl(baseSceneCode)

      if (!scenePath) {
        throw new Error('场景基础模型未找到')
      }

      const gltf = await this.loadGLTFResource(scenePath)

      const root = gltf.scene.getObjectByName(RenderPlanLayout.DEFAULT_SCENE_NAME)
      if (!root) {
        throw new Error('场景根节点未找到')
      }

      this.defaultGroup = this.wrapper
      this.wrapper.add(...root.children)

      // 设置相机位置
      this.setupCamera()

 

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
  public async loadSceneModels(data: any): Promise<void> {
    this.handleClearnJunk(this.wrapper)
    // debugger
    this.loadDefaultScene()
        try {
      // 1. 提取所有模型的 code
      const modelCodes = data.map(config => config.code)

      // 2. 批量获取模型映射（将 code -> url 的映射关系加载到缓存中）
      //    这一步只是加载映射关系，不加载实际的 3D 模型文件
      await getModelMap(modelCodes)

      // 3. 并行加载所有模型（通过 getModelUrl 从缓存获取 URL，然后加载 3D 文件）
      const loadPromises = data.map((config, index) =>
        this.loadSingleModel(config, index)
      )

      await Promise.all(loadPromises)
      console.log('✅ 所有场景模型加载完成')
    } catch (error) {
      console.error('❌ 加载场景模型失败:', error)
    }
  }

  /**
   * 加载单个模型
   */
  private async loadSingleModel(config: ModelConfig, index: number): Promise<void> {
    try {
      // 从缓存中获取模型 URL（由 getModelMap 预先加载到缓存）
      const modelUrl = getModelUrl(config.code)

      if (!modelUrl) {
        console.warn(`⚠️ 未找到模型 [${config.code}] 的 URL，请确认模型映射是否正确`)
        return
      }

      // 使用获取到的 URL 加载实际的 GLTF 模型文件
      const gltf = await this.loadGLTFResource(modelUrl)

      // if (index === 0) {
      //   this.addBaseModel(gltf, config)
      // } else {
      this.addInteractiveModel(gltf, config)
      // }

      console.log(`✅ 模型加载成功: ${config.code} -> ${modelUrl}`)
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
   protected handleClearnJunk(group: Three.Group): void {
      if (!group || !group.parent) {
        console.warn('⚠️ 尝试释放无效的组')
        return
      }
      // 递归释放所有资源
      group.traverse((object) => {
        if (object instanceof Three.Mesh) {
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
  
      // 清空引用
      group.clear()

      this.interactiveObjects = []
      // group.parent = null
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
