import type { DictTree, DictItem } from '~/types/system'
import { useBaseFetch } from '~~/composables/use-base-fetch'
const baseUrl = '/system/'
/**
 * 获取字典树
 */
export const getDictTree = () => useBaseFetch().get<DictTree[]>(`${baseUrl}dict/v1/tree`)

/**
 * 创建字典
 */
export const createDict = (params) =>
  useBaseFetch().post<DictItem>(`${baseUrl}dict/v1/create`, params)

/**
 * 更新字典
 */
export const updateDict = (params) =>
  useBaseFetch().post<DictItem>(`${baseUrl}dict/v1/update`, params)

/**
 * 删除字典
 */
export const removeDict = (params) => useBaseFetch().post(`${baseUrl}dict/v1/remove`, params)

/**
 * 查询字典详情
 */
export const getDictDetail = (params) =>
  useBaseFetch().get<DictItem>(`${baseUrl}dict/v1/detail`, params)

/**
 * 获取字典
 */
export const getDict = (params) =>
  useBaseFetch().post<Record<string, DictItem[]>>(`${baseUrl}dict/v1/map`, params)
