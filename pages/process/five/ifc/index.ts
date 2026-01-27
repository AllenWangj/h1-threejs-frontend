
import * as THREE from 'three'
const { getModelUrl, getModelMap } = useModelMap()
import {a} from "./a.ts"
// import { element } from "./sourceData"
const { BaseThree } = useThree()
class IFC extends BaseThree {
    constructor(node: HTMLElement) {
        super(node, {
            enableShadow: true,
            enableDamping: true
        })
        this.handleLoad(a)
    }
    public async handleLoad(element) {
        const promiseAll = []
        const urlData = []
        const codes = element.map(e => e.element_encode)
        console.log("'codes", codes)
        await getModelMap(codes)
        element.forEach((ele,index) => {
            const code = ele.element_encode
            const scenePath = getModelUrl(code)
            if(!scenePath) {
                console.log("scenePath",code)
            }
            // if(index ==0) {
            promiseAll.push(this.loadGLTFResource(`${scenePath}`))
            urlData.push(ele)
            // }
         
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
                // const xyz = data.transfer_params.corresponding_angles
                // container.rotation.x = THREE.MathUtils.degToRad(xyz[0]); // X轴旋转
                // container.rotation.y = THREE.MathUtils.degToRad(xyz[1]); // Y轴旋转
                // container.rotation.z = THREE.MathUtils.degToRad(xyz[2]); // Z轴旋转
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