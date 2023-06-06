import { createApp } from 'vue'
import router from "./router";
import './style.scss'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'


const app = createApp(App)

app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
  size: 'default'
})

app.mount('#app')
