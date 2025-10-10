import type { Page } from '~/types/base'
import type { ModelItem } from '~/types/model'
import type { FileItem } from '~/types/resource'
import { useBaseFetch } from '~~/composables/use-base-fetch'
const baseUrl = '/resource/'

/**
 * 获取oss授权信息
 */
export const getOssAuth = () => useBaseFetch().get(`${baseUrl}oss/v1/token`)

/**
 * 创建oss记录
 */
export const createOssRecord = (params) => useBaseFetch().post<FileItem>(`${baseUrl}oss/v1/create-record`, params)

/**
 * 新增构件
 */
export const createModel = (data) => useBaseFetch().post(`${baseUrl}model/v1/create`, data)

/**
 * 构件列表分页
 */
export const getModelPage = (params) => useBaseFetch().get<Page<ModelItem>>(`${baseUrl}model/v1/page`, params)

/**
 * 构件详情
 */
export const getModelDetail = (params) => useBaseFetch().get<ModelItem>(`${baseUrl}model/v1/detail`, params)

/**
 * 更新构件
 */
export const updateModal = (params) => useBaseFetch().post<ModelItem>(`${baseUrl}model/v1/update`, params)

/**
 * 删除构件
 */
export const removeModel = (params) => useBaseFetch().post(`${baseUrl}model/v1/remove`, params)

/**
 * 查询构件列表
 */
export const getModelList = (params) => useBaseFetch().post<ModelItem[]>(`${baseUrl}model/v1/list`, params)
