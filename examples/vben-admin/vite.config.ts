import { defineApplicationConfig } from '@vben/vite-config';

export default defineApplicationConfig({
  overrides: {
    optimizeDeps: {
      include: [
        'echarts/core',
        'echarts/charts',
        'echarts/components',
        'echarts/renderers',
        'qrcode',
        '@iconify/iconify',
        'ant-design-vue/es/locale/zh_CN',
        'ant-design-vue/es/locale/en_US',
      ],
    },
    server: {
      proxy: {
        '/basic-api': {
          // target: 'http://192.168.88.130:5154', // 万聪的Ip地址
          target: 'http://192.168.124.75:5154', // 测试环境的Ip地址
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/basic-api`), ''),
          // only https
          // secure: false
        },
        // '/upload': {
        //   target: 'http://localhost:3300/upload',
        //   changeOrigin: true,
        //   ws: true,
        //   rewrite: (path) => path.replace(new RegExp(`^/upload`), ''),
        // },
      },
      open: true, // 项目启动后，自动打开
      warmup: {
        clientFiles: ['./index.html', './src/{views,components}/*'],
      },
    },
  },
});