// #ifndef VUE3
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import uView from './uni_modules/vk-uview-ui';
import {
	createSSRApp
} from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus' //添加
import 'element-plus/dist/index.css' //添加
// import locale from 'element-plus/es/locale/lang/zh-cn' //切换为中文版本


export function createApp() {
	const app = createSSRApp(App)
	app.use(uView)
	app.use(ElementPlus)
	return {
		app
	}
}
// #endif