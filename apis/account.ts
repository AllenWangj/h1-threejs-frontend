import type { LoginInfo, MenuItem, RoleItem, UserItem, MenuTree } from '~/types/account'
import type { Page } from '~/types/base'
import { useBaseFetch } from '~~/composables/use-base-fetch'
const baseUrl = '/account/'
/**
 * 登录
 */
export const login = (params) => useBaseFetch().post<LoginInfo>(`${baseUrl}user/v1/login`, params)

/**
 * 获取权限
 */
export const getMenus = () => useBaseFetch().get<MenuItem[][]>(`${baseUrl}user/v1/menus`)

/**
 * 获取角色列表
 */
export const getRolePage = (params) =>
  useBaseFetch().get<Page<RoleItem>>(`${baseUrl}role/v1/page`, params)

/**
 * 创建角色
 */
export const createRole = (params) =>
  useBaseFetch().post<RoleItem>(`${baseUrl}role/v1/create`, params)

/**
 * 更新角色
 */
export const updateRole = (params) =>
  useBaseFetch().post<RoleItem>(`${baseUrl}role/v1/update`, params)

/**
 * 删除角色
 */
export const removeRole = (params) => useBaseFetch().post(`${baseUrl}role/v1/remove`, params)

/**
 * 查询角色详情
 */
export const getRoleDetail = (params) =>
  useBaseFetch().get<RoleItem>(`${baseUrl}role/v1/detail`, params)

/**
 * 获取用户列表
 */
export const getUserPage = (params) =>
  useBaseFetch().get<Page<UserItem>>(`${baseUrl}user/v1/page`, params)

/**
 * 创建用户
 */
export const createUser = (params) =>
  useBaseFetch().post<UserItem>(`${baseUrl}user/v1/create`, params)

/**
 * 更新用户
 */
export const updateUser = (params) =>
  useBaseFetch().post<UserItem>(`${baseUrl}user/v1/update`, params)

/**
 * 删除用户
 */
export const removeUser = (params) => useBaseFetch().post(`${baseUrl}user/v1/remove`, params)

/**
 * 查询用户详情
 */
export const getUserDetail = (params) =>
  useBaseFetch().get<UserItem>(`${baseUrl}user/v1/detail`, params)

/**
 * 获取菜单树
 */
export const getMenuTree = () => useBaseFetch().get<MenuTree[]>(`${baseUrl}menu/v1/tree`)

/**
 * 创建菜单
 */
export const createMenu = (params) =>
  useBaseFetch().post<MenuItem>(`${baseUrl}menu/v1/create`, params)

/**
 * 更新菜单
 */
export const updateMenu = (params) =>
  useBaseFetch().post<MenuItem>(`${baseUrl}menu/v1/update`, params)

/**
 * 删除菜单
 */
export const removeMenu = (params) => useBaseFetch().post(`${baseUrl}menu/v1/remove`, params)

/**
 * 查询菜单详情
 */
export const getMenuDetail = (params) =>
  useBaseFetch().get<MenuItem>(`${baseUrl}menu/v1/detail`, params)
