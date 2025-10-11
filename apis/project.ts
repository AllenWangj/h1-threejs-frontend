import { useBaseFetch } from '~~/composables/use-base-fetch'
const baseUrl = '/project/'

/**
 * 获取项目列表
*/
export const getProjectList = (params) => useBaseFetch().get(`${baseUrl}record/v1/page`, params)

/**
 * 创建项目
*/
export const createProject = (params) => useBaseFetch().post(`${baseUrl}record/v1/create`, params)

/**
 * 删除项目
 */
export const removeProject = (params) => useBaseFetch().post(`${baseUrl}record/v1/remove`, params)


/**
 * 获取项目详情
*/
export const getProjectDetail = (params) => useBaseFetch().get(`${baseUrl}record/v1/detail`, params)

/**
 * 更新项目
*/
export const updateProject = (params) => useBaseFetch().post(`${baseUrl}record/v1/update`, params)


/**
 * 更新工具2（规划布局）的数据
*/
export const updatePlanLayout = (params) => useBaseFetch().post(`${baseUrl}plan-layout/v1/update`, params)
/**
 * 获取工具2（规划布局）的数据
*/
export const getPlanLayout = (params) => useBaseFetch().get(`${baseUrl}plan-layout/v1/detail`, params)

/**
 * 更新工具3（内部布局）的数据

*/
export const updateInternalLayout = (params) => useBaseFetch().post(`${baseUrl}internal-layout/v1/update`, params)

/**
 * 获取工具3（内部布局）的详情
*/
export const getInternalLayoutDetail = (params) => useBaseFetch().get(`${baseUrl}internal-layout/v1/detail`, params)


/**
 * 更新工具4（结构设计）的数据

*/
export const updateStructuralDesign = (params) => useBaseFetch().post(`${baseUrl}structural-design/v1/update`, params)

/**
 * 获取工具4（结构设计）的详情
*/
export const getStructuralDesignDetail = (params) => useBaseFetch().get(`${baseUrl}structural-design/v1/detail`, params)


/**
 * 更新工具5（部件生产）的生产数据
*/
export const createPartsProduction = (params) => useBaseFetch().post(`${baseUrl}parts-production/v1/create`, params)

/**
 * 获取工具5（部件生产）的详情
*/
export const getPartsProductionDetail = (params) => useBaseFetch().get(`${baseUrl}parts-production/v1/detail`, params)

/**
 * 更新工具5（部件生产）的数据
*/
export const updatePartsProduction = (params) => useBaseFetch().post(`${baseUrl}parts-production/v1/update`, params)


/**
 * 更新工具6（运输保障）的数据
*/
export const updatePacking = (params) => useBaseFetch().post(`${baseUrl}packing/v1/update`, params)

/**
 * 获取工具6（运输保障）的详情
*/
export const getPackingDetail = (params) => useBaseFetch().get(`${baseUrl}packing/v1/detail`, params)

/**
 * 更新工具7（现场组装）的数据
*/
export const updateAssemble = (params) => useBaseFetch().post(`${baseUrl}assemble/v1/update`, params)

/**
 * 获取工具7（现场组装）的详情
*/
export const getAssembleDetail = (params) => useBaseFetch().get(`${baseUrl}assemble/v1/detail`, params)



export const planDetail = (params) => useBaseFetch().get(`${baseUrl}record/v1/plan/detail`, params)