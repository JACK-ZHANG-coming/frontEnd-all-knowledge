import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueSetupExtend from 'vite-plugin-vue-setup-extend-plus'
import ElementPlus from 'unplugin-element-plus/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueSetupExtend(),
    ElementPlus({
      useSource: true
    })
  ],
  base: './',
  root: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true,
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      }
    },
    terserOptions: {
      compress: {
        //生产环境时移除console
        drop_console: false,
        drop_debugger: true
      }
    }
  },
  //全局变量
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "@/assets/css/variable.scss";`
        additionalData: `@use "@/assets/css/variable.scss" as *;`
      }
    }
  }
})
