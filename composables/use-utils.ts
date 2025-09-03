import dayjs from 'dayjs'
import type { Dict } from '~/types/base'
export const useUtils = () => {
  const formatTime = (timestamp: number, format = 'YYYY-MM-DD HH:mm') => {
    return timestamp ? dayjs(timestamp).format(format) : ''
  }
  const getLabel = (key: unknown, list: Dict[]) => {
    const findOne = list.find((item) => item.value.toString() === key.toString())
    return findOne.label
  }
  return {
    getLabel,
    formatTime
  }
}
