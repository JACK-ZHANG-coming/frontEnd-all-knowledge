// @ts-nocheck
const routes = [
  {
    path: '/index',
    name: 'index',
    component: () => import('@/views/index.vue'),
    meta: {
      title: '首页',
      showHeader: true,
      showFooter: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
    meta: {
      title: '登录',
      showHeader: false,
      showFooter: false
    }
  },
  {
    path: '/otherLogin',
    name: 'otherLogin',
    component: () => import('@/views/otherLogin.vue'),
    meta: {
      title: '登录',
      showHeader: false,
      showFooter: false
    }
  },
  {
    path: '/defaultPage',
    name: 'defaultPage',
    component: () => import('@/views/defaultPage.vue'),
    meta: {
      title: '404',
      showHeader: false,
      showFooter: false
    }
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test.vue'),
    meta: {
      title: '测试',
      showHeader: true,
      showFooter: true
    }
  },
  {
    path: '/userCenter',
    name: 'userCenter',
    component: () => import('@/views/userCenter/index.vue'),
    meta: {
      title: '个人中心',
      showHeader: true
    }
  },
]
export default routes
