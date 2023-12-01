import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import vueSetupExtend from 'vite-plugin-vue-setup-extend-plus'
import ElementPlus from 'unplugin-element-plus/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // vueSetupExtend(),
    ElementPlus({
      useSource: true
    })
  ],
  base: './',
  root: './',
  server: {
    host: true,
    port: 3000,
    open: true
  },
})
