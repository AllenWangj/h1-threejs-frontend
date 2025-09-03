const getEnvValue = (keyword: string) => process.env[`${process.env.MODE}_${keyword.toUpperCase()}`]
export default defineNuxtConfig({
  srcDir: './',
  ssr: false,
  modules: [
    '@nuxt/eslint',
    '@vueuse/nuxt',
    '@ez-ui/nuxt',
    '@nuxtjs/tailwindcss',
    '@sino/nuxt-exclude-pages'
  ],
  app: {
    head: {
      title: '管理平台'
    }
  },
  runtimeConfig: {
    public: {
      baseURL: getEnvValue('api'),
      convertApi: getEnvValue('convert_api')
    }
  },
  devtools: {
    enabled: true
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
  compatibilityDate: '2024-08-13'
})
