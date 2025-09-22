import { useBaseFetch } from '~~/composables/use-base-fetch'
const baseUrl = '/resource/'

/**
 * 获取oss授权信息
 */
export const getOssAuth = () => useBaseFetch().get(`${baseUrl}oss/v1/token`)