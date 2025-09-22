import { useAuth } from '~~/composables/use-auth'
export default defineNuxtRouteMiddleware(async (to, _from) => {
  try {
    const { isLogin, whitelist, permissions, hasPermission, autoJump, checkAuthentication } = useAuth()
    if (!isLogin.value && !whitelist.includes(to.path)) {
      return navigateTo('/login')
    }
    if (isLogin.value) {
      await checkAuthentication()
      useUpload().fetchOssAuth()
      if (to.path === '/') {
        return autoJump()
      } else if (to.meta && to.meta.permissions && !hasPermission(to.meta.permissions as string)) {
        return showError({ statusCode: 403 })
      }
    }
  } catch (error) {
    return showError({ statusCode: 500 })
  }
})
