export const materialInfoService = (): any[] => {
    // 窗
    const windowData = [
        {
            no: 'LT1',
            spec: '宽度 ±2mm，高度 ±1mm',
            length: 2900,
            quantity: 23,
            material: 'Q235B',
            weight: 52.052
        }
    ]
    // 门
    const doorData = [
        {
            no: 'LT1',
            spec: '宽度 ±13mm，高度 ±11mm',
            length: Math.floor(Math.random() *10000) ,
            quantity: 1,
            material: 'Q235B',
            weight: 52.052
        }
    ]
    // 屋面板
    const housePanelData = [
        {
            no: 'LT1',
            spec: '宽度 ±8mm，高度 ±6mm',
            length:2000 ,
            quantity:8,
            material: 'Q235B',
            weight: 52.052
        }
    ]

    // 屋顶
    const roofPanelData = [
        {
            no: 'LT1',
            spec: '宽度 ±18mm，高度 ±16mm',
            length: 2600 ,
            quantity: 1,
            material: 'Q235B',
            weight: 52.052
        }
    ]

    // 墙
    const wallData = [
        {
            no: 'LT1',
            spec: '宽度 ±28mm，高度 ±36mm',
            length: 9000 ,
            quantity: 8,
            material: 'Q235B',
            weight: 52.052
        },
        {
            no: '屋架',
            spec: '宽度 ±28mm，高度 ±36mm',
            length: 9000,
            quantity: 3,
            material: 'Q235B',
            weight: null
        },
        {
            no: 'QL1',
            spec: '宽度 ±28mm，高度 ±36mm',
            length: 9000,
            quantity: 8,
            material: 'Q235B',
            weight: 22.4
        },
    ]
    // 地板
    const groundData = [
        {
            no: 'LT1',
            spec: '地板1',
            length: 2900,
            quantity: 20,
            material: 'Q235B',
            weight: 52.052
        },
    ]
    // 顶底板
    const floorData = [
        {
            no: 'LT1',
            spec: '顶底板',
            length: 2900,
            quantity: 20,
            material: 'Q235B',
            weight: 52.052
        },
    ]
    // 柱
    const columnData = [
        {
            no: 'GKZ1',
            spec: '宽度 ±3mm，高度 ±1mm',
            length: 5800,
            quantity: 8,
            material: 'Q235B',
            weight: 76.2
        },
        {
            no: 'GZ1短',
            spec: '宽度 ±3mm，高度 ±1mm',
            length: 5800,
            quantity: 8,
            material: 'Q235B',
            weight: 15.24
        },
    ]
    // 梁
    const beamData = [
        {
            no: 'GKL1长',
            spec: '刚框梁1',
            length: 5800,
            quantity: 8,
            material: 'Q235B',
            weight: 107.822
        },
        {
            no: 'GKL1短',
            spec: '刚框梁2',
            length: 2800,
            quantity: 12,
            material: 'Q235B',
            weight: 52.052
        },
        {
            no: 'GKL1',
            spec: '刚框梁',
            length: 2800,
            quantity: 33,
            material: 'Q235B',
            weight: 56.77
        },
        {
            no: 'GKL1',
            spec: '刚次梁',
            length: 2800,
            quantity: 33,
            material: 'Q235B',
            weight: 56.77
        }
    ]
    // 连接器
    const connectorData = [
        {
            no: 'LT1',
            spec: '连接器',
            length: 40,
            quantity: 900,
            material: 'Q235B',
            weight: 52.02
        }
    ]


    return [
    {
        name: '门',
        value: 1,
        infoList: doorData.map(ele =>{
            return {
                ...ele,

            }
        })
    },
    {
        name: '屋面板',
        value: 20,
        infoList: housePanelData.map(ele =>{
            return {
                ...ele,

            }
        })
    },
    {
        name: '屋顶',
        value: 1,
        infoList: roofPanelData.map(ele =>{
            return {
                ...ele,

            }
        })
    },
    {
        name: '墙',
        value: 5,
        infoList: wallData.map(ele =>{
            return {
                ...ele,
                length:Math.floor(Math.random() *10000) ,
                quantity:Math.floor(Math.random() *20) ,

            }
        })
    },
    {
        name: '地板',
        value: 6,
        infoList: groundData.map(ele =>{
            return {
                ...ele,

            }
        })
    },
    // {
    //     name: '顶底板',
    //     value: 7,
    //     infoList: floorData.map(ele =>{
    //         return {
    //             ...ele,

    //         }
    //     })
    // },
    {
        name: '柱',
        value: 8,
        infoList: columnData.map(ele =>{
            return {
                ...ele,

            }
        })
    }]
}