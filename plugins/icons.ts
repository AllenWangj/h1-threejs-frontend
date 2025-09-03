import * as icons from '@ez-ui/icons'

export default defineNuxtPlugin((nuxtApp) => {
  for (const [key, component] of Object.entries(icons)) {
    nuxtApp.vueApp.component(key, component)
  }
})
