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
 * 创建工具5（部件生产）的生产数据
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
