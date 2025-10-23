import { getDict } from '~/apis/system'
import type { Dict } from '~/types/base'

export const useDict = () => {
  const dictMap = useState<Map<string, Dict[]>>('dictMap', () => new Map())
  /**
   * 匹配字典值
   */
  const getLabel = (code: string, key: string | number, strict = false) => {
    const dictItem = dictMap.value.get(code)
    if (dictItem) {
      const labelItem = dictItem.find((i) => {
        return strict ? i.value === key : i.value.toString() === key?.toString()
      })
      return labelItem?.label
    }
    return
  }
  /**
   * 获取字典映射
   */
  const getDictMap = async (codes: string[]) => {
    try {
      const filterCodes = codes.filter((key) => !dictMap.value.has(key))
      if (filterCodes.length === 0) return
      const { data } = await getDict({ codes: filterCodes })
      if (data) {
        Object.keys(data).forEach((i) => {
          dictMap.value.set(i, data[i])
        })
      }
    } catch (error) {}
  }
  /**
   * 获取字典标签
   * @param key 字典key
   * @param array 字段数据
   * @returns 标签label
  */
  const getArrayLabel = (key: string, array: any[]): string => {
    const findItem = array.find((i: any) => i.value === key)
    return findItem?.label || ''
  }
  return { dictMap, getLabel, getDictMap, getArrayLabel }
}
