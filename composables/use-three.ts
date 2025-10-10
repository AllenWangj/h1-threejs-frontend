import * as Three from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/Addons.js'

interface IOptions {
  sceneBackground?: number | string
  enableShadow?: boolean
  enableDamping?: boolean
  autoResize?: boolean
  pixelRatio?: number
  fov?: number
  near?: number
  far?: number
}

/**
 * 加载进度信息
 */
interface LoadProgress {
  url: string
  loaded: number
  total: number
  percentage: number
}

/**
 * 加载选项
 */
interface LoadOptions {
  onProgress?: (progress: LoadProgress) => void
  onStart?: (url: string) => void
  onComplete?: (gltf: GLTF) => void
  onError?: (error: Error) => void
  signal?: AbortSignal // 支持取消加载
}

class BaseThree {
  public scene: Three.Scene
  public camera: Three.PerspectiveCamera
  public renderer: Three.WebGLRenderer
  public controls: OrbitControls
  public options: IOptions
  private animateId: number
  private resizeObserver: ResizeObserver | null = null
  private isDestroyed: boolean = false

  constructor(
    public node: HTMLElement,
    options?: IOptions
  ) {
    // 合并默认配置
    this.options = {
      sceneBackground: 0xf0f0f0,
      enableShadow: false,
      enableDamping: true,
      autoResize: true,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      fov: 75,
      near: 0.1,
      far: 9000,
      ...options
    }

    this.animateId = -1
    this.initScene()
    this.initCamera()
    this.initRenderer()
    this.initControls()
    this.initLights()

    if (this.options.autoResize) {
      this.initResizeObserver()
    }

    this.animate()
  }

  /**
   * 初始化场景
   */
  private initScene(): void {
    this.scene = new Three.Scene()
    this.scene.background = new Three.Color(this.options.sceneBackground)
  }

  /**
   * 初始化相机
   */
  private initCamera(): void {
    const aspect = this.node.clientWidth / this.node.clientHeight
    this.camera = new Three.PerspectiveCamera(this.options.fov, aspect, this.options.near, this.options.far)
  }

  /**
   * 初始化渲染器
   */
  private initRenderer(): void {
    this.renderer = new Three.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    })

    this.renderer.setSize(this.node.clientWidth, this.node.clientHeight)
    this.renderer.setPixelRatio(this.options.pixelRatio)

    if (this.options.enableShadow) {
      this.renderer.shadowMap.enabled = true
      this.renderer.shadowMap.type = Three.PCFSoftShadowMap
    }

    this.node.appendChild(this.renderer.domElement)
  }

  /**
   * 初始化控制器
   */
  private initControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = this.options.enableDamping
    this.controls.dampingFactor = 0.05
    this.controls.screenSpacePanning = false
    this.controls.minDistance = 0.1
    this.controls.maxDistance = this.options.far * 0.9
  }

  /**
   * 初始化灯光
   */
  private initLights(): void {
    // 环境光
    const ambientLight = new Three.AmbientLight(0xffffff, 0.6)
    this.scene.add(ambientLight)

    // 主方向光
    const directionalLight = new Three.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5000, 3000, 600)

    if (this.options.enableShadow) {
      directionalLight.castShadow = true
      directionalLight.shadow.mapSize.width = 2048
      directionalLight.shadow.mapSize.height = 2048
      directionalLight.shadow.camera.near = 0.5
      directionalLight.shadow.camera.far = 10000
    }

    this.scene.add(directionalLight)
  }

  /**
   * 初始化ResizeObserver以实现更好的性能
   */
  private initResizeObserver(): void {
    this.resizeObserver = new ResizeObserver((entries) => {
      if (this.isDestroyed) return

      for (const entry of entries) {
        if (entry.target === this.node) {
          this.onWindowResize()
        }
      }
    })

    this.resizeObserver.observe(this.node)
  }

  /**
   * 窗口尺寸变化处理
   */
  public onWindowResize(): void {
    if (!this.camera || !this.renderer || !this.node || this.isDestroyed) return

    const width = this.node.clientWidth
    const height = this.node.clientHeight

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  /**
   * 动画循环
   */
  public animate(): void {
    if (this.isDestroyed) return

    this.animateId = requestAnimationFrame(() => this.animate())

    if (this.controls.enableDamping) {
      this.controls.update()
    }

    this.renderer.render(this.scene, this.camera)
  }

  /**
   * 销毁资源
   */
  public destory(): void {
    if (this.isDestroyed) return

    this.isDestroyed = true

    // 取消动画帧
    if (this.animateId !== -1) {
      cancelAnimationFrame(this.animateId)
      this.animateId = -1
    }

    // 移除ResizeObserver
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }

    // 释放控制器
    if (this.controls) {
      this.controls.dispose()
    }

    // 释放渲染器
    if (this.renderer) {
      this.renderer.dispose()
      if (this.node && this.renderer.domElement) {
        this.node.removeChild(this.renderer.domElement)
      }
    }

    // 清理场景
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object instanceof Three.Mesh) {
          object.geometry?.dispose()
          if (object.material) {
            this.disposeMaterial(object.material)
          }
        }
      })
      this.scene.clear()
    }
  }

  /**
   * 计算组的边界尺寸
   * @param group - 要计算的3D对象组
   * @param showBoundingBox - 是否显示边界框（调试用）
   * @returns 包含尺寸、中心点等信息的对象
   */
  protected calculateGroupDimensions(group: Three.Object3D, showBoundingBox = false) {
    const box = new Three.Box3().setFromObject(group)
    const size = box.getSize(new Three.Vector3())
    const center = box.getCenter(new Three.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)

    // 可选：显示边界框用于调试
    if (showBoundingBox) {
      const boundingGeometry = new Three.BoxGeometry(size.x, size.y, size.z)
      const edgesGeometry = new Three.EdgesGeometry(boundingGeometry)
      const edgesMaterial = new Three.LineBasicMaterial({
        color: 0xff0000,
        linewidth: 2,
        depthTest: false,
        transparent: true,
        opacity: 0.8
      })
      const boundingBox = new Three.LineSegments(edgesGeometry, edgesMaterial)
      boundingBox.position.copy(center)
      this.scene.add(boundingBox)
    }

    return {
      width: size.x,
      height: size.y,
      depth: size.z,
      center,
      size,
      maxDim,
      min: box.min.clone(),
      max: box.max.clone()
    }
  }

  /**
   * 加载GLTF模型资源 - 支持多种进度监听方式
   * @param url - 模型URL
   * @param options - 加载选项（支持多个回调）
   * @returns Promise<GLTF>
   *
   * @example
   * // 方式1：简单回调
   * await loadGLTFResource(url, { onProgress: (p) => console.log(p.percentage) })
   *
   * // 方式2：完整回调
   * await loadGLTFResource(url, {
   *   onStart: (url) => console.log('开始加载:', url),
   *   onProgress: (p) => console.log('进度:', p.percentage),
   *   onComplete: (gltf) => console.log('加载完成'),
   *   onError: (err) => console.error('加载失败:', err)
   * })
   */
  protected async loadGLTFResource(url: string, options?: LoadOptions | ((progress: number) => void)): Promise<GLTF> {
    const loader = new GLTFLoader()

    // 兼容旧的函数形式和新的对象形式
    const opts: LoadOptions =
      typeof options === 'function' ? { onProgress: (p) => options(p.percentage) } : options || {}

    const { onProgress, onStart, onComplete, onError, signal } = opts

    // 触发开始回调
    onStart?.(url)

    try {
      // 检查是否已取消
      if (signal?.aborted) {
        throw new Error('加载已取消')
      }

      const gltf = await loader.loadAsync(url, (xhr) => {
        // 检查是否已取消
        if (signal?.aborted) {
          throw new Error('加载已取消')
        }

        if (xhr.total > 0) {
          const progressInfo: LoadProgress = {
            url,
            loaded: xhr.loaded,
            total: xhr.total,
            percentage: Math.round((xhr.loaded / xhr.total) * 100)
          }
          onProgress?.(progressInfo)
        }
      })
      onComplete?.(gltf)
      return gltf
    } catch (error) {
      const err = error instanceof Error ? error : new Error('未知错误')
      console.error(`❌ GLTF模型加载失败: ${url}`, err)
      onError?.(err)
      throw new Error(`加载模型失败: ${err.message}`)
    }
  }

  /**
   * 批量加载GLTF模型 - 带整体进度
   * @param urls - 模型URL数组
   * @param onProgress - 整体进度回调
   * @returns Promise<GLTF[]>
   */
  protected async loadMultipleGLTF(
    urls: string[],
    onProgress?: (progress: { current: number; total: number; percentage: number; currentUrl: string }) => void
  ): Promise<GLTF[]> {
    const total = urls.length
    let completed = 0

    const results = await Promise.all(
      urls.map(async (url) => {
        const gltf = await this.loadGLTFResource(url)
        completed++
        onProgress?.({
          current: completed,
          total,
          percentage: Math.round((completed / total) * 100),
          currentUrl: url
        })
        return gltf
      })
    )
    return results
  }

  /**
   * 释放GLTF模型资源
   * @param group - 要释放的GLTF模型组
   */
  protected disposeGLTFGroup(group: Three.Group): void {
    if (!group || !group.parent) {
      console.warn('⚠️ 尝试释放无效的组')
      return
    }

    // 从父对象移除
    group.parent.remove(group)

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
    group.parent = null
  }

  /**
   * 释放材质及其关联的纹理
   * @param material - 要释放的材质
   */
  protected disposeMaterial(material: Three.Material): void {
    if (!material) return

    // 释放所有纹理
    Object.keys(material).forEach((key) => {
      const value = material[key as keyof Three.Material]
      if (value instanceof Three.Texture) {
        value.dispose()
      }
    })

    // 释放材质本身
    material.dispose()
  }

  /**
   * 创建变换矩阵
   * @param position - 位置向量
   * @param rotation - 旋转（欧拉角或四元数，可选）
   * @param scale - 缩放向量（可选）
   * @returns 变换矩阵
   */
  protected createTransformMatrix(
    position: Three.Vector3,
    rotation?: Three.Euler | Three.Quaternion,
    scale?: Three.Vector3
  ): Three.Matrix4 {
    const matrix = new Three.Matrix4()

    // 应用缩放
    if (scale) {
      matrix.makeScale(scale.x, scale.y, scale.z)
    }

    // 应用旋转
    if (rotation) {
      const rotationMatrix = new Three.Matrix4()
      if (rotation instanceof Three.Euler) {
        rotationMatrix.makeRotationFromEuler(rotation)
      } else {
        rotationMatrix.makeRotationFromQuaternion(rotation)
      }
      matrix.multiply(rotationMatrix)
    }

    // 应用平移
    const translationMatrix = new Three.Matrix4().makeTranslation(position.x, position.y, position.z)
    matrix.multiply(translationMatrix)

    return matrix
  }

  /**
   * 将设备像素坐标转换为标准化设备坐标(NDC)
   * @param x - 屏幕X坐标
   * @param y - 屏幕Y坐标
   * @returns NDC坐标 { x: -1到1, y: -1到1 }
   */
  protected convertToNDC(x: number, y: number): { x: number; y: number } {
    const rect = this.renderer.domElement.getBoundingClientRect()

    return {
      x: ((x - rect.left) / rect.width) * 2 - 1,
      y: -((y - rect.top) / rect.height) * 2 + 1
    }
  }

  /**
   * 并发执行Promise数组，限制并发数量
   * @param tasks - Promise工厂函数数组
   * @param concurrency - 最大并发数
   * @returns Promise<T[]> 所有结果的数组
   */
  protected async runWithConcurrency<T>(tasks: (() => Promise<T>)[], concurrency: number = 3): Promise<T[]> {
    const results: T[] = []
    const executing: Promise<void>[] = []

    for (const [index, task] of tasks.entries()) {
      const promise = task()
        .then((result) => {
          results[index] = result
        })
        .catch((error) => {
          console.error(`Task ${index} failed:`, error)
          throw error
        })

      executing.push(promise)

      if (executing.length >= concurrency) {
        await Promise.race(executing)
        executing.splice(
          executing.findIndex((p) => p === promise),
          1
        )
      }
    }

    await Promise.all(executing)
    return results
  }
}
/**
 * 模型尺寸信息
 */
interface ModelDimensions {
  len: number
  width: number
  height: number
}

class LibaryModal extends BaseThree {
  private wrapper = new Three.Group()

  constructor(
    node: HTMLElement,
    public opt: {
      progress: (progress: number) => void
    }
  ) {
    super(node, {})
    this.scene.add(this.wrapper)
  }

  /**
   * 通过URL加载模型并自动调整相机
   * @param url - 模型URL
   * @param onComplete - 完成回调，返回模型尺寸信息
   * @returns Promise<ModelDimensions>
   */
  public async handleLoadModelByUrl(
    url: string,
    onComplete?: (dimensions: ModelDimensions) => void
  ): Promise<ModelDimensions> {
    try {
      // 加载模型
      const gltf = await this.loadGLTFResource(url, {
        onProgress: (progress) => {
          this.opt.progress(progress.percentage)
        }
      })

      // 添加到场景
      this.wrapper.add(gltf.scene)

      // 计算尺寸
      const size = this.calculateGroupDimensions(this.wrapper)

      // 自动调整相机位置和焦点
      const distance = size.maxDim
      this.camera.position.set(size.center.x, size.center.y - distance, size.center.z + distance)
      this.controls.target.copy(size.center)
      this.controls.update()

      // 构建返回的尺寸信息
      const dimensions: ModelDimensions = {
        len: size.depth,
        width: size.width,
        height: size.height
      }

      // 触发完成回调
      onComplete?.(dimensions)

      return dimensions
    } catch (error) {
      console.error('❌ 加载模型失败:', error)
      throw error
    }
  }

  /**
   * 释放资源
   */
  public handleDestoryResource(): void {
    if (this.wrapper.children.length === 0) {
      console.warn('⚠️ 没有需要释放的资源')
      return
    }

    // 遍历所有子对象并释放
    this.wrapper.children.forEach((child) => {
      if (child instanceof Three.Group) {
        this.disposeGLTFGroup(child)
      }
    })

    // 清空包装组
    this.wrapper.clear()

    // 从场景移除
    if (this.wrapper.parent) {
      this.wrapper.parent.remove(this.wrapper)
    }
  }
}
export const useThree = () => {
  return {
    BaseThree,
    LibaryModal
  }
}
