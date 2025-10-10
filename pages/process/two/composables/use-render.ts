import * as Three from 'three'
const data = [
  {
    groupName: 'Group_37',
    deg: 0,
    position: {
      x: 2800,
      y: 2128,
      z: 0
    },
    code: '02_75_10137'
  },
  {
    groupName: 'Group_10',
    deg: 0,
    position: {
      x: 4077,
      y: 2404.431396484375,
      z: 0
    },
    code: '02_75_10110'
  },
  {
    groupName: 'Group_6',
    deg: 0,
    position: {
      x: 3841.28393554687,
      y: 2561.9117126464844,
      z: 0
    },
    code: '02_75_10106'
  },
  {
    groupName: 'Group_7',
    deg: 0,
    position: {
      x: 3841.28393554687,
      y: 2483.1715545654297,
      z: 0
    },
    code: '02_75_10106'
  },
  {
    groupName: 'Group_8',
    deg: 0,
    position: {
      x: 3841.28393554687,
      y: 2404.431396484375,
      z: 0
    },
    code: '02_75_10106'
  },
  {
    groupName: 'Group_9',
    deg: 0,
    position: {
      x: 3841.28393554687,
      y: 2640.651870727539,
      z: 0
    },
    code: '02_75_10106'
  },
  {
    groupName: 'Group_45',
    deg: 0,
    position: {
      x: 4983.016227722168,
      y: 2561.5931854248047,
      z: 0
    },
    code: '02_75_10145'
  },
  {
    groupName: 'Group_46',
    deg: 0,
    position: {
      x: 4983.016227722168,
      y: 2482.85302734375,
      z: 0
    },
    code: '02_75_10145'
  },
  {
    groupName: 'Group_47',
    deg: 0,
    position: {
      x: 4983.016227722168,
      y: 2640.3333435058594,
      z: 0
    },
    code: '02_75_10145'
  },
  {
    groupName: 'Group_40',
    deg: 0,
    position: {
      x: 5101.12646484375,
      y: 2483.1716399788857,
      z: 0
    },
    code: '02_75_10140'
  },
  {
    groupName: 'Group_41',
    deg: 0,
    position: {
      x: 5888.528015136719,
      y: 2483.1716399788857,
      z: 0
    },
    code: '02_75_10140'
  },
  {
    groupName: 'Group_42',
    deg: 0,
    position: {
      x: 6282.2288818359375,
      y: 2483.1716399788857,
      z: 0
    },
    code: '02_75_10140'
  },
  {
    groupName: 'Group_43',
    deg: 0,
    position: {
      x: 5494.827239990234,
      y: 2483.1716399788857,
      z: 0
    },
    code: '02_75_10140'
  },
  {
    groupName: 'Group_26',
    deg: 0,
    position: {
      x: 5416.086975097656,
      y: 3113.0927734375,
      z: 0
    },
    code: '02_75_10140'
  },
  {
    groupName: 'Group_27',
    deg: 0,
    position: {
      x: 5770.417724609375,
      y: 3113.0927734375,
      z: 0
    },
    code: '02_75_10140'
  },
  {
    groupName: 'Group_28',
    deg: 0,
    position: {
      x: 5061.756271362305,
      y: 3113.0927734375,
      z: 0
    },
    code: '02_75_10140'
  },
  {
    groupName: 'Group_29',
    deg: 0,
    position: {
      x: 6124.7484130859375,
      y: 3113.0927734375,
      z: 0
    },
    code: '02_75_10140'
  },
  {
    groupName: 'Group_25',
    deg: 0,
    position: {
      x: 6479.0791015625,
      y: 3113.0927734375,
      z: 0
    },
    code: '02_75_10125'
  },
  {
    groupName: 'Group_19',
    deg: 0,
    position: {
      x: 6479.0791015625,
      y: 3601.28173828125,
      z: 0
    },
    code: '02_75_10125'
  },
  {
    groupName: 'Group_20',
    deg: 0,
    position: {
      x: 5416.086975097656,
      y: 3601.28173828125,
      z: 0
    },
    code: '02_75_10140'
  },
  {
    groupName: 'Group_21',
    deg: 0,
    position: {
      x: 5770.417724609375,
      y: 3601.28173828125,
      z: 0
    },
    code: '02_75_10140'
  },
  {
    groupName: 'Group_22',
    deg: 0,
    position: {
      x: 5061.756271362305,
      y: 3601.28173828125,
      z: 0
    },
    code: '02_75_10140'
  },
  {
    groupName: 'Group_23',
    deg: 0,
    position: {
      x: 6124.7484130859375,
      y: 3601.2817382812,
      z: 0
    },
    code: '02_75_10140'
  },
  {
    groupName: 'Group_51',
    deg: 0,
    position: {
      x: 7408.212890625,
      y: 4113.110725402832,
      z: 0
    },
    code: '02_75_10151'
  },
  {
    groupName: 'Group_53',
    deg: 0,
    position: {
      x: 8208.212890625,
      y: 4743.0319900512695,
      z: 0
    },
    code: '02_75_10153'
  },
  {
    groupName: 'Group_54',
    deg: 0,
    position: {
      x: 8208.212890625,
      y: 4428.071357727051,
      z: 0
    },
    code: '02_75_10153'
  },
  {
    groupName: 'Group_55',
    deg: 0,
    position: {
      x: 8208.212890625,
      y: 4585.55167388916,
      z: 0
    },
    code: '02_75_10153'
  },
  {
    groupName: 'Group_56',
    deg: 0,
    position: {
      x: 8208.212890625,
      y: 4270.591041564941,
      z: 0
    },
    code: '02_75_10153'
  },
  {
    groupName: 'Group_57',
    deg: 0,
    position: {
      x: 8208.212890625,
      y: 4113.110725402832,
      z: 0
    },
    code: '02_75_10153'
  },
  {
    groupName: 'Group_72',
    deg: 0,
    position: {
      x: 4943.64599609375,
      y: 4743.014312744141,
      z: 0
    },
    code: '02_75_10174'
  },
  {
    groupName: 'Group_73',
    deg: 0,
    position: {
      x: 4943.64599609375,
      y: 4861.124542236328,
      z: 0
    },
    code: '02_75_10174'
  },
  {
    groupName: 'Group_74',
    deg: 0,
    position: {
      x: 4943.64599609375,
      y: 4388.68359375,
      z: 0
    },
    code: '02_75_10174'
  },
  {
    groupName: 'Group_75',
    deg: 0,
    position: {
      x: 4943.64599609375,
      y: 4506.793830871582,
      z: 0
    },
    code: '02_75_10174'
  },
  {
    groupName: 'Group_76',
    deg: 0,
    position: {
      x: 4943.64599609375,
      y: 4624.904067993164,
      z: 0
    },
    code: '02_75_10174'
  },
  {
    groupName: 'Group_82',
    deg: 0,
    position: {
      x: 4313.724792480469,
      y: 4743.014312744141,
      z: 0
    },
    code: '02_75_10174'
  },
  {
    groupName: 'Group_83',
    deg: 0,
    position: {
      x: 3841.298095703125,
      y: 4388.68359375,
      z: 0
    },
    code: '02_75_10174'
  },
  {
    groupName: 'Group_84',
    deg: 0,
    position: {
      x: 3841.298095703125,
      y: 4743.014312744141,
      z: 0
    },
    code: '02_75_10184'
  },
  {
    groupName: 'Group_85',
    deg: 0,
    position: {
      x: 4313.724792480469,
      y: 4388.68359375,
      z: 0
    },
    code: '02_75_10174'
  },
  {
    groupName: 'Group_36',
    deg: 0,
    position: {
      x: 5494.8271484375,
      y: 4388.68359375,
      z: 0
    },
    code: '02_75_10136'
  },
  {
    groupName: 'Group_80',
    deg: 0,
    position: {
      x: 3198.208984375,
      y: 4388.68359375,
      z: 0
    },
    code: '02_75_10174'
  },
  {
    groupName: 'Group_70',
    deg: 0,
    position: {
      x: 2961.988525390625,
      y: 4388.68359375,
      z: 0
    },
    code: '02_75_10174'
  },
  {
    groupName: 'Group_77',
    deg: 0,
    position: {
      x: 3198.208984375,
      y: 4743.01416015625,
      z: 0
    },
    code: '02_75_10174'
  },
  {
    groupName: 'Group_79',
    deg: 0,
    position: {
      x: 2961.988525390625,
      y: 4743.01416015625,
      z: 0
    },
    code: '02_75_10174'
  },
  {
    groupName: 'Group_78',
    deg: 0,
    position: {
      x: 2489.547607421875,
      y: 4743.01416015625,
      z: 0
    },
    code: '02_75_10174'
  },
  {
    groupName: 'Group_14',
    deg: 0,
    position: {
      x: 3526.3231811523438,
      y: 3113.0927734375,
      z: 0
    },
    code: '02_75_10140'
  },
  {
    groupName: 'Group_15',
    deg: 0,
    position: {
      x: 3880.6539306640625,
      y: 3113.0927734375,
      z: 0
    },
    code: '02_75_10140'
  },
  {
    groupName: 'Group_16',
    deg: 0,
    position: {
      x: 3171.992477416992,
      y: 3113.0927734375,
      z: 0
    },
    code: '02_75_10140'
  },
  {
    groupName: 'Group_17',
    deg: 0,
    position: {
      x: 4234.984619140625,
      y: 3113.0927734375,
      z: 0
    },
    code: '02_75_10140'
  },
  {
    groupName: 'Group_32',
    deg: 0,
    position: {
      x: 3526.3231811523438,
      y: 3601.28173828125,
      z: 0
    },
    code: '02_75_10140'
  },
  {
    groupName: 'Group_33',
    deg: 0,
    position: {
      x: 3880.6539306640625,
      y: 3601.28173828125,
      z: 0
    },
    code: '02_75_10140'
  },
  {
    groupName: 'Group_34',
    deg: 0,
    position: {
      x: 3171.992477416992,
      y: 3601.28173828125,
      z: 0
    },
    code: '02_75_10140'
  },
  {
    groupName: 'Group_35',
    deg: 0,
    position: {
      x: 4234.984619140625,
      y: 3601.28173828125,
      z: 0
    },
    code: '02_75_10140'
  },
  {
    groupName: 'Group_13',
    deg: 0,
    position: {
      x: 2975.14208984375,
      y: 3113.0927734375,
      z: 0
    },
    code: '02_75_10125'
  },
  {
    groupName: 'Group_31',
    deg: 0,
    position: {
      x: 2975.14208984375,
      y: 3601.28173828125,
      z: 0
    },
    code: '02_75_10125'
  },
  {
    groupName: 'Group_1',
    deg: 0,
    position: {
      x: 2345.2207725048065,
      y: 3581.596710205078,
      z: 0
    },
    code: '02_75_10102'
  },
  {
    groupName: 'Group_2',
    deg: 0,
    position: {
      x: 2345.2207725048065,
      y: 3113.0927734375,
      z: 0
    },
    code: '02_75_10102'
  },
  {
    groupName: 'Group_3',
    deg: 0,
    position: {
      x: 2345.2207725048065,
      y: 3368.998291015625,
      z: 0
    },
    code: '02_75_10102'
  }
]
const { BaseThree } = useThree()
const { getModelUrl, getModelMap } = useModelMap()

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
      
      if (index === 0) {
        this.addBaseModel(gltf, config)
      } else {
        this.addInteractiveModel(gltf, config)
      }
      
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
