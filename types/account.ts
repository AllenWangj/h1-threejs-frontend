import type { BaseItem } from '~/types/base'
export interface MenuItem extends BaseItem {
  pid: string
  id: string
  parentId: string
  code: string
  sort: number
  intro: string
  level: number
  name: string
  path: string
  target: string
  icon: string
  visible: number
  type: number
}

export interface MenuTree extends MenuItem {
  children: MenuTree[]
}

export interface UserItem extends BaseItem {
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
  roles: string[]
}
export interface LoginInfo {
  token: string
  userInfo: UserItem
}
export interface RoleItem extends BaseItem {
  id: string
  name: string
  intro: string
  status: number
  menus: string[]
}
