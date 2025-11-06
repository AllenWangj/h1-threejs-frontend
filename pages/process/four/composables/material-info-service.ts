export const materialInfoService = (): any[] => {
    // 墙
    const wallData = [
        {
            no: 'LT1',
            spec: '内墙',
            length: 2900,
            quantity: 20,
            material: 'Q235B',
            weight: 52.052
        },
        {
            no: '屋架',
            spec: '外墙3200',
            length: 6000,
            quantity: 4,
            material: 'Q235B',
            weight: null
        },
        {
            no: 'QL1',
            spec: '外墙3204a',
            length: 2600,
            quantity: 20,
            material: 'Q235B',
            weight: 22.4
        },
        {
            no: 'QL1',
            spec: '外墙3209',
            length: 2600,
            quantity: 20,
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
    // 柱
    const columnData = [
        {
            no: 'GKZ1',
            spec: '脚柱1',
            length: 5800,
            quantity: 10,
            material: 'Q235B',
            weight: 76.2
        },
        {
            no: 'GZ1短',
            spec: '刚框柱1',
            length: 450,
            quantity: 10,
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
        name: '地板',
        value: 6,
        infoList: groundData
    },

    {
        name: '柱',
        value: 8,
        infoList: columnData
    },
  
    {
        name: '连接器',
        value: 10,
        infoList: connectorData
    }]
}