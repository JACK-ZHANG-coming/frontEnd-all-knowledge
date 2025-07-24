import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"; // 这个path用到了上面安装的@types/node

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  //这里进行配置别名
  resolve: {
    alias: {
      '@': path.resolve('./src') // @代替src
    }
  },
  // 配置跨域
  server: {
    port: 5188, // 自定义端口号
    proxy: {
      '/api': {
        target: 'http://116.198.200.217:7501',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
