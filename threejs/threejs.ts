import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { saveAs } from 'file-saver';
import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';

interface IBasicSet {
    sceneBackground?: string
}
class Three {
    public scene: THREE.Scene
    public camera: THREE.PerspectiveCamera
    public renderer: THREE.WebGLRenderer
    public controls: OrbitControls
    public optionSet: IBasicSet
    private animateId: number
    constructor(public node: HTMLElement, option?: IBasicSet) {
        this.optionSet = Object.assign({
            sceneBackground: 0xf0f0f0
        }, option)
        this.animateId = -1
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(this.optionSet.sceneBackground);
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.node.clientWidth / this.node.clientHeight,
            0.1,
            9000
        );
        // this.scene.add(this.camera)
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(
            this.node.clientWidth,
            this.node.clientHeight
        );
        this.node.appendChild(this.renderer.domElement);

        // 添加控制器
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.scene.add(this.controls)
        this.controls.enableDamping = false;
        // this.controls.
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5000, 3000, 600);
        this.scene.add(directionalLight);
        // window.addEventListener('resize', this.onWindowResize);
        this.animate()
    }
    public onWindowResize() {
        if (!this.camera || !this.renderer || !this.node) return;
        this.camera.aspect = this.node.clientWidth / this.node.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(
            this.node.clientWidth,
            this.node.clientHeight
        );
    }
    public animate() {
        this.animateId = requestAnimationFrame(() => {
            this.animate()
        });
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    public destory() {
        window.removeEventListener('resize', this.onWindowResize);
        cancelAnimationFrame(this.animateId);

        if (this.renderer) {
            this.renderer.dispose();
        }

        if (this.controls) {
            this.controls.dispose();
        }

        if (this.node && this.renderer?.domElement) {
            this.node.removeChild(this.renderer.domElement);
        }
    }

    protected calculateGroupDimensions(group, isLoadBox = false) {
        // 创建包围盒
        const box = new THREE.Box3();

        // 扩展包围盒以包含整个组
        box.expandByObject(group);

        // 计算尺寸（长宽高）
        const size = new THREE.Vector3();
        box.getSize(size);
        // 计算中心点
        const center = new THREE.Vector3();
        box.getCenter(center);
        const rect = new THREE.Vector3()
        box.getSize(rect)
        const maxDim = Math.max(size.x, size.y, size.z);


        const box1 = new THREE.Box3().setFromObject(group);
        const size1 = box1.getSize(new THREE.Vector3());
        const center1 = box1.getCenter(new THREE.Vector3());
        // const min = new THREE.Vector3();

        console.log("min", rect)
        // 创建一个与边界匹配的立方体
        const boundingGeometry = new THREE.BoxGeometry(size1.x, size1.y, size1.z);
        // 使用EdgesGeometry提取边缘
        const edgesGeometry = new THREE.EdgesGeometry(boundingGeometry);
        const edgesMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 });

        const boundingBox = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        // 定位到组的中心
        boundingBox.position.copy(new THREE.Vector3(0, 0, 0));
        if (isLoadBox) {
            //   this.scene!.add(boundingBox)


        }
        return {
            width: size.x,    // X轴方向尺寸
            height: size.y,   // Y轴方向尺寸
            depth: size.z,    // Z轴方向尺寸
            center: center,
            size: rect,
            maxDim,  // 大小
            position: box1.min,

        };
    };
    protected loadGLTFResource(url: string, loadGltfCbk?: (progress: number) => void): Promise<GLTF> {
        return new Promise((reslove, reject) => {
            const loader = new GLTFLoader();
            loader.load(url,
                (gltf) => {
                    reslove(gltf)
                },
                (xhr) => {
                    const progress = Math.round((xhr.loaded / xhr.total) * 100);
                    loadGltfCbk && loadGltfCbk(progress)
                }, err => {
                    console.log("err--", err)
                    console.log("err--", url)

                    reject(err || '加载出错')
                }
            )
        })

    }
    /**
 * 释放GLTF模型资源
 * @param {THREE.Group} group - 要释放的GLTF模型组
 * @param {THREE.Scene} scene - 场景对象
 */
    protected disposeGLTFGroup(group: THREE.Group) {
        group.parent.remove(group)
        // 2. 递归遍历所有子对象并释放资源
        group.traverse((object: THREE.Mesh) => {
            // 释放几何体
            if (object.geometry) {
                object.geometry.dispose();
            }
            // 3. 释放材质和纹理
            if (object.material) {
                // 处理材质数组（如MeshFaceMaterial）
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => this.disposeMaterial(material));
                } else {
                    this.disposeMaterial(object.material);
                }
            }
        });

        // 4. 解除所有引用
        group.clear(); // 清空所有子对象
        group.parent = null;
    }

    /**
     * 释放材质及其关联的纹理
     * @param {THREE.Material} material - 要释放的材质
     */
    protected disposeMaterial(material: THREE.Material) {
        // 释放材质本身
        material.dispose();
        // 释放材质上的纹理
        for (const key in material) {
            if (material[key] instanceof THREE.Texture) {
                material[key].dispose();
            }
        }
    }
    protected calculateTransformMatrix(position: THREE.Vector3) {
        // const angle = THREE.MathUtils.degToRad(deg);

        // 2. 创建旋转矩阵 - 沿自定义轴旋转
        const matrix = new THREE.Matrix4()
        // 创建一个单位矩阵
        // const matrix = new THREE.Matrix4();

        // 平移参数：x=100, y=100, z=100
        const translation = position.clone();

        // 旋转参数：沿X轴旋转90度（转换为弧度）
        // const rotationX = THREE.MathUtils.degToRad(deg);
        // 先应用旋转，再应用平移
        // 注意：变换顺序很重要！先旋转后平移和先平移后旋转结果不同
        // matrix.makeRotationZ(Math.PI/2);  // 应用X轴旋转
        // matrix.makeRotationFromQuaternion()
        matrix.setPosition(translation);  // 应用平移
        return matrix;
    }
    protected convertDpToNdc(dpX: number, dpY: number) {
        // 转换为标准化设备坐标
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
    protected async runWithConcurrency<T>(
        promises: (() => Promise<T>)[],
        concurrency: number
    ): Promise<T[]> {
        const results: T[] = [];
        const total = promises.length;
        let index = 0;

        // 创建并发控制器
        async function executeNext() {
            if (index >= total) return;

            const currentIndex = index++;
            try {
                // 执行当前Promise
                const result = await promises[currentIndex]();
                results[currentIndex] = result;
            } catch (error) {
                // 可以根据需要处理错误，这里简单地将错误存储在结果中
                results[currentIndex] = error as T;
            }

            // 继续执行下一个
            return executeNext();
        }

        // 启动初始的并发任务
        const initialPromises = Array(Math.min(concurrency, total))
            .fill(0)
            .map(executeNext);

        // 等待所有任务完成
        await Promise.all(initialPromises);

        return results;
    }

}
export default Three