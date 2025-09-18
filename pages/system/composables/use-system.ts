import type { Dict } from '~/types/base'

export const useSystem = () => {
  const MENU_TYPES: Dict[] = [
    { label: '目录', value: 1 },
    { label: '菜单', value: 2 },
    { label: '按钮', value: 3 }
  ]
  return {
    MENU_TYPES
  }
}
