import type { MenuItem, MenuTree } from '~/types/account'

export const useMenu = () => {
  const expand = useState('menu-expand', () => true)
  const updateExpand = (value: boolean) => {
    expand.value = value
  }
  return {
    expand,
    updateExpand
  }
}
