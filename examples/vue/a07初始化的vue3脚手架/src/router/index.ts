// @ts-nocheck
// 导入router所需的方法
import { createRouter, createWebHashHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useTabsStore } from '@/stores/modules/tabsPages'
import { storeToRefs } from 'pinia'
import routes from './routes'

// 路由参数配置
const router = createRouter({
  // 使用hash(createWebHashHistory)模式，(createWebHistory是HTML5历史模式，支持SEO)
  history: createWebHashHistory(),
  routes: routes
})
// 全局前置守卫，这里可以加入用户登录判断
router.beforeEach((to, from, next) => {
  // 判断是否登录
  if (!sessionStorage.getItem('USER_INFO') && to.path !== '/login' && to.matched.length !== 0) {
    ElMessage({
      message: '需要先登录',
      type: 'warning'
    })
    next('/login')
  } else {
    if (to.matched.length === 0) {
      // 如果未匹配到路由
      from.name ? next({ name: from.name }) : next('/login')
    } else {
      next() // 如果匹配到正确跳转
    }
  }
})

// 全局后置钩子，这里可以加入改变页面标题等操作
router.afterEach((to, from) => {
  const _title = to.meta.title
  if (_title) {
    window.document.title = _title
  }
  //缓存转跳的页面并记录
  const { currentTabs, currentTabsList } = storeToRefs(useTabsStore())
  if (to.path !== '/login') {
    if (to.path !== '/defaultPage') {
      //记录页面跳转
      if (sessionStorage.getItem('TABS_LIST')) {
        currentTabsList.value = JSON.parse(sessionStorage.getItem('TABS_LIST'))
      }
      currentTabs.value = to.name
      let flag = true
      currentTabsList.value.forEach((item: any) => {
        if (item.name === to.name) {
          flag = false
        }
      })
      if (flag) {
        currentTabsList.value.push({ name: to.name, title: to.meta.title })
        sessionStorage.setItem('TABS_LIST', JSON.stringify(currentTabsList.value))
      }
    }
  } else {
    currentTabs.value = 'index'
    currentTabsList.value = [{ name: 'index', title: '主页' }]
    sessionStorage.removeItem('CURRENT_TABS')
    sessionStorage.removeItem('TABS_LIST')
    sessionStorage.removeItem('USER_INFO')
  }
})

// 导出默认值
export default router
