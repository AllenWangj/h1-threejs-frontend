import type { BaseItem } from './base'

export interface ConvertUserItem extends BaseItem {
  id: string
  account: string
  name: string
  email: string
  mobile: string
  gender: number
  avatar: string
  sign: string
  intro: string
  status: number
}
export interface ConvertIntegralItem extends BaseItem {
  amount: number
  businessId: string
  code: string
  id: string
  intro: string
  month: number
  owner: string
  title: string
  type: number
  year: number
}
export interface ConvertCashItem extends BaseItem {
  amount: number
  businessId: string
  code: string
  id: string
  intro: string
  month: number
  owner: string
  title: string
  type: number
  year: number
}
export interface ConvertPayItem extends BaseItem {
  account: string
  amount: string
  id: string
  intro: string
  owner: string
  payTime: number
  refuseRemark: string
  status: number
  type: number
  verifyRemark: string
  verifyTime: number
}
export interface ConvertCpsOrderItem extends BaseItem {
  automatic: number
  commission: string
  verifyId: string
  id: string
  businessId: string
  orderTime: number
  platformSettleTime: number
  settleTime: number
  owner: string
  payPrice: string
  productName: string
  profit: string
  settle: string
  settleRatio: string
  ratio: string
  source: number
  status: number
  title: string
  verifyTime: number
}
export interface ConvertVerifyItem extends BaseItem {
  id: string
  orderId: string
  source: number
  owner: string
  status: number
  verifyTime: number
}
