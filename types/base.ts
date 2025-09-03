export interface BaseItem {
  createTime: number
  createBy: string
  updateTime: number
  updateBy: string
}
export interface Dict {
  label: string
  value: string | number | boolean
}
export interface Page<T> {
  current: number
  pages: number
  records: T[]
  size: number
  total: number
}
export interface BaseFetchOptions {
  /** 原始请求 */
  original?: boolean
}
