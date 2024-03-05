const routes: any[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      showHeader: false,
      showFooter: false
    }
  },
  {
    path: '/home',
    name: 'home',
    // component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页',
      showHeader: false,
      showFooter: false
    }
  },
  {
    path: '/testPage',
    name: 'testPage',
    component: () => import('@/views/testPage/index.vue'),
    meta: {
      title: '测试页面',
      showHeader: false,
      showFooter: false
    }
  },
]

export default routes