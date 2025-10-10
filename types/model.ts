import type { BaseItem } from './base'

export interface ModelItem extends BaseItem {
  id: string
  height: number
  width: number
  length: number
  name: string
  url: string
  sourceUrl: string
  hash: string
  sourceHash: string
  material: string
  effect: string
  type: number
  code: string
}
