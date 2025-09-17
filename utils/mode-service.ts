export const modeService = () => {
    /** 窗户模型名 */
    const windowData = () => {
        const names = new Array(23).fill(0).map((_, i) => `<组件#66>${i !== 0 ? '_' + i : ''}`)
        const names1 = ['Group_952', 'Group_927', 'Group_910', 'Group_986', 'Group_1023', 'Group_969']
        return [...names, ...names1]
    }
    /** 门模型名 */
    const doorData = () => {
        const names = new Array(19)
            .fill(0)
            .map((_, i) => `IfcDoor_-_单嵌板木门_14D-04455344<3ID151naX4SP9QZfy4vvW9#1>${i !== 0 ? '_' + i : ''}`)
        return [...names]
    }
    /** 屋面板模型名 */
    const roofData = () => {
        const names12 = new Array(32).fill(0).map((_, i) => `<组件#10>${i !== 0 ? '_' + i : ''}`)
        const names1 = new Array(19).fill(0).map((_, i) => `<组件#12>${i !== 0 ? '_' + i : ''}`)
        const names2 = [
            '<组件#19>',
            '<组件#8>',
            '<组件#107>',
            '<组件#107>_1',
            '<组件#107>_2',
            '<组件#77>',
            '<组件#77>_1',
            '<组件#77>_2',
            '<组件#77>_3',
            '<组件#79>',
            '<组件#79>_1',
            '<组件#79>_2',
            '<组件#79>_3',
            '<组件#105>',
            '<组件#105>_1',
            '<组件#109>',
            '<组件#109>_1',
            '<组件#111>',
            '<组件#58>',
            '<组件#45>',
            '<组件#47>',
            '<组件#21>',
            '<组件#25>',
            '<组件#75>',
            '<组件#64>',
            '<组件#67>',
            '<组件#11>',
            '<组件#69>',
            '<组件#71>',
            '<组件#73>'
        ]
        const names3 = new Array(12).fill(0).map((_, i) => `<组件#42>${i !== 0 ? '_' + i : ''}`)
        const names4 = new Array(6).fill(0).map((_, i) => `<组件#95>${i !== 0 ? '_' + i : ''}`)
        const names5 = new Array(9).fill(0).map((_, i) => `<组件#90>${i !== 0 ? '_' + i : ''}`)
        const names6 = new Array(9).fill(0).map((_, i) => `<组件#92>${i !== 0 ? '_' + i : ''}`)
        const names7 = new Array(9).fill(0).map((_, i) => `<组件#88>${i !== 0 ? '_' + i : ''}`)
        // 柱子的面板
        const names8 = ['<组件#113>', ...new Array(4).fill(0).map((_, i) => `<组件#83>${i !== 0 ? '_' + i : ''}`)]

        // 内部
        const names9 = new Array(19).fill(0).map((_, i) => `<组件#45>${i !== 0 ? '_' + i : ''}`)
        const names10 = new Array(18).fill(0).map((_, i) => `<组件#46>${i !== 0 ? '_' + i : ''}`)
        const names11 = new Array(19).fill(0).map((_, i) => `<组件#47>${i !== 0 ? '_' + i : ''}`)

        const names = [
            ...names1,
            ...names2,
            ...names3,
            ...names4,
            ...names5,
            ...names6,
            ...names7,
            ...names8,
            ...names9,
            ...names10,
            ...names11,
            ...names12
        ]

        return names
    }
    /** 屋顶模型名 */
    const roofTopData = () => {
        const names = [
            'Group_821',
            'Group_1053', // 屋顶房梁
            'Group_820',
            'Group_650'
        ]
        return names
    }
    /** 墙壁模型名 */
    const wallData = () => {
        const names1 = new Array(48).fill(0).map((_, i) => `<组件#40>${i !== 0 ? '_' + i : ''}`)
        const names2 = new Array(10).fill(0).map((_, i) => `<组件#44>${i !== 0 ? '_' + i : ''}`)
        const names3 = new Array(14).fill(0).map((_, i) => `<组件#41>${i !== 0 ? '_' + i : ''}`)
        const names4 = new Array(144).fill(0).map((_, i) => `<组件#37>${i !== 0 ? '_' + i : ''}`)
        const names5 = new Array(36).fill(0).map((_, i) => `<组件#39>${i !== 0 ? '_' + i : ''}`)
        const names6 = [
            'Group_110',
            'Group_41',
            'Group_621',
            'Group_591',
            'Group_168',
            'Group_237',
            'Group_487',
            'Group_419',
            'Group_548',
            'Group_518',
            'Group_294',
            'Group_363',
            'Group_694',
            'Group_705',
            'Group_768',
            'Group_816',
            'Group_883',
            'Group_673'
        ]
        const names = [...names1, ...names2, ...names3, ...names4, ...names5, ...names6]
        return names
    }
    /** 地板模型名 */
    const floorData = () => {
        // 地板
        const name = [
            'Group_119',
            'Group_120',
            'Group_69',
            'Group_56',
            'Group_49',
            'Group_51',
            'Group_246',
            'Group_247',
            'Group_197',
            'Group_183',
            'Group_176',
            'Group_178',
            'Group_600',
            'Group_601',
            'Group_648',
            'Group_636',
            'Group_631',
            'Group_629',
            'Group_496',
            'Group_497',
            'Group_447',
            'Group_434',
            'Group_427',
            'Group_429',
            'Group_527',
            'Group_528',
            'Group_575',
            'Group_563',
            'Group_556',
            'Group_558',
            'Group_372',
            'Group_373',
            'Group_323',
            'Group_309',
            'Group_302',
            'Group_304',
            'Group_678',
            'Group_702',
            'Group_774',
            'Group_775',
            'Group_815',
            'Group_879',
            'Group_654',
            'Group_698',
            'Group_1044',
            'Group_1045',
            'Group_905',
            'Group_888',
            'Group_944',
            'Group_670',
            'Group_851',
            'Group_827',
            'Group_812',
            'Group_779'
        ]
        // 钢筋
        const names1 = new Array(315).fill(0).map((_, i) => `<组件#15>${i !== 0 ? '_' + i : ''}`)
        const names2 = new Array(522).fill(0).map((_, i) => `<组件#16>${i !== 0 ? '_' + i : ''}`)
        const names3 = new Array(72).fill(0).map((_, i) => `<组件#31>${i !== 0 ? '_' + i : ''}`)
        const names4 = new Array(216).fill(0).map((_, i) => `<组件#29>${i !== 0 ? '_' + i : ''}`)
        const names5 = new Array(432).fill(0).map((_, i) => `<组件#35>${i !== 0 ? '_' + i : ''}`)
        const names6 = new Array(432).fill(0).map((_, i) => `<tuojian#1>${i !== 0 ? '_' + i : ''}`)
        const names7 = new Array(36).fill(0).map((_, i) => `<组件#33>${i !== 0 ? '_' + i : ''}`)
        const names8 = new Array(36).fill(0).map((_, i) => `<组件#32>${i !== 0 ? '_' + i : ''}`)
        const names9 = new Array(54).fill(0).map((_, i) => `<组件#61>${i !== 0 ? '_' + i : ''}`)
        const names10 = new Array(36).fill(0).map((_, i) => `<组件#34>${i !== 0 ? '_' + i : ''}`)

        const names = [
            ...name,
            ...names1,
            ...names2,
            ...names3,
            ...names4,
            ...names5,
            ...names6,
            ...names7,
            ...names8,
            ...names9,
            ...names10
        ]
        return names
    }
    /** 顶板模型名 */
    const floorTopData = () => {
        const names = [
            'Group_109',
            'Group_59',
            'Group_40',
            'Group_236',
            'Group_186',
            'Group_167',
            'Group_590',
            'Group_639',
            'Group_620',
            'Group_486',
            'Group_437',
            'Group_418',
            'Group_517',
            'Group_566',
            'Group_547',
            'Group_362',
            'Group_312',
            'Group_293',
            'Group_656',
            'Group_754',
            'Group_783',
            'Group_709',
            'Group_1043',
            'Group_903',
            'Group_669',
            'Group_848',
            'Group_826'
        ]
        return names
    }
    /** 柱模型名 */
    const pillarData = () => {
        const names = new Array(48).fill(0).map((_, i) => `<组件#26>${i !== 0 ? '_' + i : ''}`)
        const names1 = [
            'Group_2',
            'Group_14',
            'Group_8',
            'Group_20',
            'Group_72',
            'Group_78',
            'Group_84',
            'Group_90',
            'Group_217',
            'Group_205',
            'Group_199',
            'Group_211',
            'Group_135',
            'Group_147',
            'Group_129',
            'Group_141',
            'Group_854',
            'Group_866',
            'Group_872',
            'Group_860',
            'Group_743',
            'Group_731',
            'Group_725',
            'Group_737',
            'Group_788',
            'Group_800',
            'Group_806',
            'Group_794',
            'Group_1016',
            'Group_1009',
            'Group_1003',
            'Group_945',
            'Group_325',
            'Group_337',
            'Group_343',
            'Group_331',
            'Group_467',
            'Group_455',
            'Group_449',
            'Group_461',
            'Group_256',
            'Group_268',
            'Group_274',
            'Group_262',
            'Group_399',
            'Group_387',
            'Group_381',
            'Group_393'
        ]
        return [...names, ...names1]
    }
    /** 梁模型名 */
    const beamData = () => {
        const names = new Array(48).fill(0).map((_, i) => `<组件#27>${i !== 0 ? '_' + i : ''}`)
        const names1 = new Array(95).fill(0).map((_, i) => `<组件#28>${i !== 0 ? '_' + i : ''}`)
        const names2 = new Array(18).fill(0).map((_, i) => `<组件#30>${i !== 0 ? '_' + i : ''}`)
        return [...names, ...names1, ...names2]
    }
    /** 连接器模型名 */
    const connectorData = () => {
        const names = new Array(24).fill(0).map((_, i) => `<组件#53>${i !== 0 ? '_' + i : ''}`)
        const names1 = new Array(12).fill(0).map((_, i) => `<组件#57>${i !== 0 ? '_' + i : ''}`)
        const names2 = new Array(36).fill(0).map((_, i) => `<组件#59>${i !== 0 ? '_' + i : ''}`)
        const names3 = new Array(12).fill(0).map((_, i) => `<组件#54>${i !== 0 ? '_' + i : ''}`)
        const names4 = new Array(12).fill(0).map((_, i) => `<组件#56>${i !== 0 ? '_' + i : ''}`)
        const names5 = new Array(32).fill(0).map((_, i) => `<组件#63>${i !== 0 ? '_' + i : ''}`)
        const names6 = new Array(432).fill(0).map((_, i) => `<tuojian#1>${i !== 0 ? '_' + i : ''}`)
        return [...names, ...names1, ...names2, ...names3, ...names4, ...names5, ...names6]
    }

    return {
        windowData,
        doorData,
        roofData,
        roofTopData,
        wallData,
        floorData,
        floorTopData,
        pillarData,
        beamData,
        connectorData
    }
}
