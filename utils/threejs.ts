import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { saveAs } from 'file-saver';
import * as THREE from 'three';

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
            1000000
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
            this. controls.enableDamping = true;
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        // directionalLight.position.set(1000, 1000, 1000);
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
        this.animateId = requestAnimationFrame(() =>{
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
     calculateGroupDimensions (group) {
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
        
        // // 可视化包围盒
        // const boxHelper = new THREE.Box3Helper(box, 0xffff00);
        // this.scene.add(boxHelper);
        
        // // 可视化中心点
        // const centerMarker = new THREE.Mesh(
        //     new THREE.SphereGeometry(0.3, 16, 16),
        //     new THREE.MeshBasicMaterial({ color: 0xff00ff })
        // );
        // centerMarker.position.copy(center);
        // this.scene.add(centerMarker);
        // const diagle = 
        return {
            width: size.x,    // X轴方向尺寸
            height: size.y,   // Y轴方向尺寸
            depth: size.z,    // Z轴方向尺寸
            center: center    // 中心点坐标
        };
    };

}
export default Three