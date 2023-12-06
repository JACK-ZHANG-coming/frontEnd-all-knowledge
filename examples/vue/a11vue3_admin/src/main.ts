import { createApp } from 'vue'

import '@/assets/css/global.scss'
import App from './App.vue'
import router from './router'

// 引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const app = createApp(App)

// 注册全局公共组件
const componentList = {}
for (const [key, component] of Object.entries({ ...ElementPlusIconsVue, ...componentList })) {
  app.component(key, component)
}

app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
  size: 'default'
})
app.mount('#app')
