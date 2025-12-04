
import * as THREE from 'three'
import { element } from "./sourceData"
const { BaseThree } = useThree()
class IFC extends BaseThree {
    constructor(node: HTMLElement) {
        super(node, {
            enableShadow: true,
            enableDamping: true
        })
        this.handleLoad()
    }
    private handleLoad() {
        const promiseAll = []
        const urlData = []
        element.forEach(ele => {
            promiseAll.push(this.loadGLTFResource(` /c/${ele.element_encode.slice(0, 9)}01.glb`))
            urlData.push(ele)
        })
        const wrapper = new THREE.Group()
        this.scene.add(wrapper)
            Promise.all(promiseAll).then(res => {
                res.forEach((group, index) => {
                    const data = urlData[index]
                    const mesh = group.scene
                    const container = new THREE.Group()
                    mesh.rotation.x = THREE.MathUtils.degToRad(90)
                    wrapper.add(container)
                    container.add(mesh)
                    const x = data.transfer_params.start_point_position[0] * 1
                    const y = data.transfer_params.start_point_position[1] * 1
                    const z = data.transfer_params.start_point_position[2] * 1
                    container.position.set(
                        x,
                        y,
                        z
                    )
                    const xyz = data.transfer_params.corresponding_angles
                    container.rotation.x = THREE.MathUtils.degToRad(xyz[0]); // X轴旋转
                    container.rotation.y = THREE.MathUtils.degToRad(xyz[1]); // Y轴旋转
                    container.rotation.z = THREE.MathUtils.degToRad(xyz[2]); // Z轴旋转
                    container.rotation.order = 'ZYX'; // 默认 XYZ，可改为 'ZYX'/'YZX' 等
                })
                const size = this.calculateGroupDimensions(wrapper)
                const distance = 1
                this.camera.position.set(size.center.x, size.center.y, size.center.z + distance)
                this.controls.target.copy(size.center)
            })
    }
}
export const useRender = () => {
    return { IFC }
}