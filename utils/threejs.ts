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
        this.controls.enableDamping = true;
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

    protected calculateGroupDimensions(group) {
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
         // 可视化包围盒
        //  const boxHelper = new THREE.Box3Helper(box, 0xffff00);
        //  this.scene.add(boxHelper);
         
         // 可视化中心点
        //  const centerMarker = new THREE.Mesh(
        //      new THREE.SphereGeometry(0.3, 16, 16),
        //      new THREE.MeshBasicMaterial({ color: 0xff00ff })
        //  );
        //  centerMarker.position.copy(center);
        //  this.scene.add(centerMarker);
 
         // 使用Box3计算立方体的包围盒
        //  const box3 = new THREE.Box3();
        //  box3.setFromObject(cube);
        //  console.log("rect---",rect)
        return {
            width: size.x,    // X轴方向尺寸
            height: size.y,   // Y轴方向尺寸
            depth: size.z,    // Z轴方向尺寸
            center: center ,
            size:rect   // 大小
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
   protected disposeGLTFGroup(group:THREE.Group) {
        group.parent.remove(group)                             
        // 2. 递归遍历所有子对象并释放资源
        group.traverse((object:THREE.Mesh) => {
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
    protected disposeMaterial(material) {
        // 释放材质本身
        material.dispose();
        // 释放材质上的纹理
        for (const key in material) {
            if (material[key] instanceof THREE.Texture) {
                material[key].dispose();
            }
        }
    }

}
export default Three