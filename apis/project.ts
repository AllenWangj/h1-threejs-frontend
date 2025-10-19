import { exp } from 'three/tsl'
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
 * 更新工具1（选址决策）的数据
*/
export const updateProjectSiteFile = (params) => useBaseFetch().post(`${baseUrl}site/v1/update-files`, params)
export const updateProjectSiteParams = (params) => useBaseFetch().post(`${baseUrl}site/v1/update-params`, params)

/**
 * 获取工具1（选址决策）的数据
*/
export const getProjectSiteDetail = (params) => useBaseFetch().get(`${baseUrl}site/v1/detail`, params)
/**
 * 工具1（选址决策）生产方案
*/
export const generateProjectSitePlan = (params) => useBaseFetch().post(`${baseUrl}site/v1/generate-plans`, params)
/**
 * 获取工具1（选址决策）中的规划布局数据方案详情
*/
export const getProjectSitePlanDetail = (params) => useBaseFetch().get(`${baseUrl}site/v1/plan/detail`, params)

/**
 * 更新工具2（规划布局）的数据
*/
export const updatePlanLayoutFiles = (params) => useBaseFetch().post(`${baseUrl}plan-layout/v1/update-files`, params)
export const updatePlanLayoutParams = (params) => useBaseFetch().post(`${baseUrl}plan-layout/v1/update-params`, params)
/**
 * 获取工具2（规划布局）的数据
*/
export const getPlanLayout = (params) => useBaseFetch().get(`${baseUrl}plan-layout/v1/detail`, params)
/**
 * 工具2（规划布局）方案生成
*/
export const generatePlanLayoutPlan = (params) => useBaseFetch().post(`${baseUrl}plan-layout/v1/generate-plans`, params)

/**
 * 更新工具3（内部布局）的数据

*/
export const updateInternalLayoutFiles = (params) => useBaseFetch().post(`${baseUrl}internal-layout/v1/update-files`, params)
export const updateInternalLayoutParams = (params) => useBaseFetch().post(`${baseUrl}internal-layout/v1/update-params`, params)
/**
 * 获取工具3（内部布局）的详情
*/
export const getInternalLayoutDetail = (params) => useBaseFetch().get(`${baseUrl}internal-layout/v1/detail`, params)
/**
 * 工具3（内部布局）方案生成
*/
export const generateInternalLayoutPlan = (params) => useBaseFetch().post(`${baseUrl}internal-layout/v1/generate-plans`, params)

/**
 * 更新工具4（结构设计）的数据

*/
export const updateStructuralDesignFiles = (params) => useBaseFetch().post(`${baseUrl}structural-design/v1/update-files`, params)
export const updateStructuralDesignParams = (params) => useBaseFetch().post(`${baseUrl}structural-design/v1/update-params`, params)
/**
 * 获取工具4（结构设计）的详情
*/
export const getStructuralDesignDetail = (params) => useBaseFetch().get(`${baseUrl}structural-design/v1/detail`, params)
/**
 * 工具4（结构设计）方案生成
 */
export const generateStructuralDesignPlan = (params) => useBaseFetch().post(`${baseUrl}structural-design/v1/generate-plans`, params)

/**
 * 更新工具5（部件生产）的生产数据
*/
export const updatePartsProductionFile = (params) => useBaseFetch().post(`${baseUrl}parts-production/v1/update-files`, params)
export const updatePartsProductionParams = (params) => useBaseFetch().post(`${baseUrl}parts-production/v1/update-params`, params)
/**
 * 获取工具5（部件生产）的详情
*/
export const getPartsProductionDetail = (params) => useBaseFetch().get(`${baseUrl}parts-production/v1/detail`, params)
/**
 * 工具5（部件生产）方案生成
*/
export const generatePartsProductionPlan = (params) => useBaseFetch().post(`${baseUrl}parts-production/v1/generate-plans`, params)



/**
 * 更新工具6（运输保障）的数据
*/
export const updatePackingFiles = (params) => useBaseFetch().post(`${baseUrl}packing/v1/update-files`, params)
export const updatePackingParams = (params) => useBaseFetch().post(`${baseUrl}packing/v1/update-params`, params)
/**
 * 获取工具6（运输保障）的详情
*/
export const getPackingDetail = (params) => useBaseFetch().get(`${baseUrl}packing/v1/detail`, params)
/**
 * 工具6（运输保障）方案生成
*/
export const generatePackingPlan = (params) => useBaseFetch().post(`${baseUrl}packing/v1/generate-plans`, params)



/**
 * 更新工具7（现场组装）的数据
*/
export const updateAssembleFiles = (params) => useBaseFetch().post(`${baseUrl}assemble/v1/update-files`, params)
export const updateAssembleParams = (params) => useBaseFetch().post(`${baseUrl}assemble/v1/update-params`, params)
/**
 * 获取工具7（现场组装）的详情
*/
export const getAssembleDetail = (params) => useBaseFetch().get(`${baseUrl}assemble/v1/detail`, params)
/**
 * 工具7（现场组装）方案生成
*/
export const generateAssemblePlan = (params) => useBaseFetch().post(`${baseUrl}assemble/v1/generate-plans`, params)



export const planDetail = (params) => useBaseFetch().get(`${baseUrl}record/v1/plan/detail`, params)
export const removePlan = (data) => useBaseFetch().post(`${baseUrl}/plan/v1/remove`, data)
export const createPlan = (data) => useBaseFetch().post(`${baseUrl}/plan/v1/create`, data)
export const updatePlan = (data) => useBaseFetch().post(`${baseUrl}/plan/v1/update`, data)


/**
 * 方案
*/
export const planList = (params) => useBaseFetch().get(`${baseUrl}plan/v1/list`, params)
export const planDetailInfo = (params) => useBaseFetch().get(`${baseUrl}plan/v1/detail`, params)

// /project/plan/v1/detail
