import { getMenus } from '~/apis/account'
import type { MenuItem, MenuTree } from '~/types/account'
export const useAuth = () => {
  /** 权限菜单 */
  const menus = useState<MenuItem[] | null>('menus', () => [])
  const menuTree = computed(() => transfromTree(menus.value || []))
  /** 权限标签列表 */
  const permissions = useState<string[] | null>('permissions', () => null)
  /** 判断是否有权限 */
  const hasPermission = (permission) => {
    return (permissions.value || []).includes(permission)
  }
  /** 权限 token */
  const tokenCookie = useCookie<string | null>('TOKEN', {
    maxAge: 60 * 60 * 24 * 7
  })
  const token = useState('token', () => tokenCookie.value)
  /** 是否登录 */
  const isLogin = computed(() => !!token.value)
  /** 白名单不走页面鉴权处理 */
  const whitelist = ['/login']
  /** 更新 token */
  const updateToken = (value: string | null) => {
    token.value = value
    tokenCookie.value = value
  }
  /** 页面全部地址 */
  const allPaths = computed<string[]>(() => {
    if (!menus.value) return whitelist
    const pagesList = menus.value.filter((item) => [2, 3].includes(item.type) && item.path)
    const allList = pagesList.map((item) => item.path) || []
    return [...allList, ...whitelist]
  })
  /*
   * 转换菜单树
   */
  const transfromTree = (list: MenuItem[]) => {
    const map: { [key: string]: MenuTree } = {}
    const treeList: MenuTree[] = []
    // 创建所有节点的映射
    for (const item of list) {
      map[item.id] = { ...item, children: [] }
    }
    // 建立树结构
    for (const item of list) {
      const treeNode = map[item.id]
      if (item.parentId === null) {
        treeList.push(treeNode)
      } else {
        if (map[item.parentId]) {
          map[item.parentId].children.push(treeNode)
        }
      }
    }
    return treeList
  }
  /**
   * 清除登录状态
   */
  const clearLoginState = () => {
    updateToken(null)
    permissions.value = null
    menus.value = []
  }
  /**
   * 获取登录用户权限信息
   */
  const checkAuthentication = async () => {
    try {
      if (permissions.value) return
      const { data } = await getMenus()
      console.log('Fetched menus:', data)
      menus.value = [...data.flat()]
      permissions.value = menus.value.map((item) => item.code)
    } catch (_error) {
      clearLoginState()
    }
  }
  /**
   * 自动跳转
   * 查找并跳转到第一个可访问的页面
   */
  const autoJump = async () => {
    // 如果没有菜单数据，退出
    if (!menuTree.value || !Array.isArray(menuTree.value) || menuTree.value.length === 0) {
      console.warn('No menu data available for navigation')
      return
    }
    // 修复: 获取正确的菜单树结构
    const menuStructure = menuTree.value
    // 查找第一个可访问的页面(递归函数)
    const findFirstPage = (items: MenuTree[]): string | null => {
      if (!items || items.length === 0) return null
      // 遍历一级菜单
      for (const item of items) {
        // 如果是页面类型，直接返回
        if (item.type === 2 && item.path) {
          return item.path
        }
        // 如果是目录并且有子菜单，递归查找
        if (item.type === 1 && item.children && item.children.length > 0) {
          const childPath = findFirstPage(item.children)
          if (childPath) return childPath
        }
      }
      return null
    }
    // 查找第一个可访问页面
    const defaultPath = findFirstPage(menuStructure)
    // 如果找到页面，进行跳转
    if (defaultPath) {
      console.log('Navigating to:', defaultPath)
      return navigateTo(defaultPath, { replace: true })
    } else {
      console.warn('No accessible page found in the menu structure')
    }
  }
  /**
   * 退出登陆
   */
  const logOut = () => {
    clearLoginState()
    navigateTo(`/login?redirect=${window.location.href}`, { external: true })
  }
  return {
    allPaths,
    menus,
    menuTree,
    permissions,
    hasPermission,
    token,
    isLogin,
    updateToken,
    logOut,
    whitelist,
    checkAuthentication,
    clearLoginState,
    autoJump
  }
}
