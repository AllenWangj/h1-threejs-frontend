import { getModelList } from '~/apis/resource'
import type { ModelItem } from '~/types/model'

export const useModelMap = () => {
  const modelMap = useState<Map<string, ModelItem>>('modelMap', () => new Map())
  const loadingCodes = new Set<string>() // 正在加载的 code 集合
  
  /**
   * 获取模型 URL
   * @param code - 模型编码
   * @returns 模型 URL 或空字符串
   */
  const getModelUrl = (code: string): string => {
    const modelItem = modelMap.value.get(code)
    return modelItem?.url || ''
  }
  
  /**
   * 获取模型信息
   * @param code - 模型编码
   * @returns 模型信息或 undefined
   */
  const getModelInfo = (code: string): ModelItem | undefined => {
    console.log(modelMap.value, code);
    return modelMap.value.get(code)
  }
  
  /**
   * 批量获取模型映射
   * @param codes - 模型编码数组
   */
  const getModelMap = async (codes: string[]): Promise<void> => {
    try {
      // 过滤掉已缓存和正在加载的模型
      const filterCodes = codes.filter((code) => 
        !modelMap.value.has(code) && !loadingCodes.has(code)
      )
      
      if (filterCodes.length === 0) {
        console.log('✅ 所有模型已缓存，无需重新加载')
        return
      }
      
      // 标记为正在加载
      filterCodes.forEach(code => loadingCodes.add(code))
      
      console.log(`📦 开始加载 ${filterCodes.length} 个模型映射...`)
      
      const { data } = await getModelList({ codes: filterCodes })
      
      if (data && Array.isArray(data)) {
        // 批量更新缓存
        data.forEach((modelItem) => {
          if (modelItem.code) {
            modelMap.value.set(modelItem.code, modelItem)
          }
        })
        
        console.log(`✅ 成功加载 ${data.length} 个模型映射`)
      }
      
      // 清理加载标记
      filterCodes.forEach(code => loadingCodes.delete(code))
    } catch (error) {
      console.error('❌ 加载模型映射失败:', error)
      // 清理加载标记
      codes.forEach(code => loadingCodes.delete(code))
      throw error
    }
  }
  
  /**
   * 清除缓存
   */
  const clearModelCache = (): void => {
    modelMap.value.clear()
    loadingCodes.clear()
    console.log('🗑️ 模型缓存已清空')
  }
  
  /**
   * 预加载模型
   * @param codes - 模型编码数组
   */
  const preloadModels = async (codes: string[]): Promise<void> => {
    await getModelMap(codes)
  }
  
  /**
   * 获取缓存统计
   */
  const getCacheStats = () => {
    return {
      total: modelMap.value.size,
      loading: loadingCodes.size,
      cached: Array.from(modelMap.value.keys())
    }
  }
  
  return { 
    modelMap, 
    getModelUrl, 
    getModelInfo,
    getModelMap,
    clearModelCache,
    preloadModels,
    getCacheStats
  }
}
