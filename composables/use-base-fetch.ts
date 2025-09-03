import { Http } from '@sino/fetch'
import type { BaseFetchOptions } from '~/types/base'
import { ElMessage } from 'element-plus'
const instanceMap = new Map<string, Http>()
interface Response<T> {
  code: number
  data: T
  message: string
  success: boolean
  timestamp: number
}
export const useBaseFetch = (options: BaseFetchOptions = { original: false }) => {
  const mapKey = JSON.stringify(options)
  let createInstance: Http
  const { baseURL } = useRuntimeConfig().public
  const { logOut } = useAuth()
  if (!instanceMap.get(mapKey)) {
    createInstance = new Http().create({
      baseURL,
      onRequest({ options }) {
        const accessToken = useCookie('TOKEN').value
        if (accessToken) {
          options.headers = new Headers(options.headers)
          options.headers.set('access-token', accessToken)
        }
      },
      onResponse(ctx) {
        const { status, _data } = ctx.response
        if (status === 401) {
          ElMessage.error('登录状态失效，请重新登录！')
          return logOut()
        }
        const { code, message } = _data
        if (_data && code !== 200) {
          ElMessage.error(message || '服务调用异常')
          throw new Error(message)
        }
      }
    })
  } else {
    createInstance = instanceMap.get(mapKey)
  }

  type Get = typeof createInstance.get
  type Post = typeof createInstance.post
  type Put = typeof createInstance.put
  type Delete = typeof createInstance.delete

  return {
    options: createInstance.options,
    create: createInstance.create,
    get: <D = any>(...args: Parameters<Get>) => createInstance.get<Response<D>>(...args),
    post: <D = any>(...args: Parameters<Post>) => createInstance.post<Response<D>>(...args),
    put: <D = any>(...args: Parameters<Put>) => createInstance.put<Response<D>>(...args),
    delete: <D = any>(...args: Parameters<Delete>) => createInstance.delete<Response<D>>(...args)
  }
}
