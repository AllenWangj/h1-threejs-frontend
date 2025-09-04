// import { useAuth } from '~~/composables/use-auth'
export default defineNuxtRouteMiddleware(async (to, _from) => {
  // try {
  //   const { isLogin, whitelist, autoJump, checkAuthentication } = useAuth()
  //   if (!isLogin.value && !whitelist.includes(to.path)) {
  //     return navigateTo('/login')
  //   }
  //   if (isLogin.value) {
  //     await checkAuthentication()
  //     if (to.path === '/') return autoJump()
  //   }
  // } catch (error) {
  //   return showError({ statusCode: 500 })
  // }
})
