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

  // 格式化文件大小
  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return size + 'B'
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(2) + 'KB'
    } else if (size < 1024 * 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(2) + 'MB'
    }
  }

  return {
    getLabel,
    formatTime,
    formatFileSize,
  }
}
