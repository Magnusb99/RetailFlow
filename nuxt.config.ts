// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/hints', '@nuxt/ui', '@nuxt/eslint', "@pinia/nuxt"],
   css: ['~/assets/css/tailwind.css'],
   nitro: {
    serverAssets: [{
      baseName: 'data',
      dir: resolve('./server/data')
    }]
  }
})