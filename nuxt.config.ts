const getEnvValue = (keyword: string) => process.env[`${process.env.MODE}_${keyword.toUpperCase()}`]
export default defineNuxtConfig({
  srcDir: './',
  ssr: false,
  modules: ['@vueuse/nuxt', '@maxtan/ez-ui-nuxt', '@nuxtjs/tailwindcss', '@maxtan/nuxt-exclude-pages'],
  app: {
    head: {
      title: '管理平台'
    }
  },
  runtimeConfig: {
    public: {
      baseURL: getEnvValue('api')
    }
  },
  devtools: {
    enabled: false
  },
  tailwindcss: {
    cssPath: [
      '~/assets/css/tailwind.css',
      {
        injectPosition: 'last'
      }
    ]
  },
  devServer: {
    port: 3200,
    host: '0.0.0.0'
  },
  nitro: {
    devProxy: {
      '/api/': {
        target: 'https://h1.maxtan.cn/api/',
        changeOrigin: true,
        prependPath: true
      }
    }
  },
  compatibilityDate: '2024-08-13'
})
