import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

const app = createApp(App)

// 注册全局公共组件
const componentList = {  }
for (const [key, component] of Object.entries({ ...ElementPlusIconsVue, ...componentList })) {
  app.component(key, component)
}

app.use(ElementPlus, {
  locale: zhCn,
  size: 'default'
})
app.use(VXETable)
app.mount('#app')
