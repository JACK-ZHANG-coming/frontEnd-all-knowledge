import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  //全局变量
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "@/assets/css/variable.scss";`
        // additionalData: `@use "@/assets/css/variable.scss" as *;`,
        api: 'modern-compiler',
        silenceDeprecations: ["legacy-js-api"],
      }
    }
  }
})
