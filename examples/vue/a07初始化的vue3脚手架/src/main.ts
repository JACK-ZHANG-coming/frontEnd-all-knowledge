import { createApp } from 'vue'

import store from './stores'
import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

// 自定义封装的通用全局组件
import VxeGridTable from '@/components/VxeGridTable.vue'
import CompleteTable from '@/components/CompleteTable/CompleteTable.vue'
import Container from '@/components/ContainerTemplate/Container.vue'

import '@/assets/css/global.scss'

const app = createApp(App)

// 注册全局公共组件
const componentList = { VxeGridTable, CompleteTable, Container }
for (const [key, component] of Object.entries({ ...ElementPlusIconsVue, ...componentList })) {
  app.component(key, component)
}

app.use(store)
app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
  size: 'default'
})
app.use(VXETable)
app.mount('#app')
