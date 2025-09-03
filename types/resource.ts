import type { BaseItem } from '~/types/base'
export interface ScheduleTaskItem extends BaseItem {
  id: string
  /** cron 表达式 */
  cron: string
  /** 调用服务 */
  url: string
  /** 任务数据 */
  data: string
  /** 是否重复 0 不重复 1 重复 */
  repeat: number
  /** 简介 */
  intro: string
}
export interface ScheduleRecordItem extends BaseItem {
  id: string
  /** cron 表达式 */
  cron: string
  /** 调用服务 */
  target: string
  /** 任务id */
  taskId: string
  /** 任务数据 */
  data: Record<string, any>
  /** 任务反馈数据 */
  res: Record<string, any>
  /** 完成状态 0 失败 1 成功 */
  status: number
  /** 简介 */
  intro: string
}
