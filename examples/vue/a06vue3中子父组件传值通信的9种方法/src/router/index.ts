import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/home/index.vue';
import C01_props from '../views/c1_props/c1_props.vue';
import C02_custom_event from '../views/c2_custom_event/c2_custom_event.vue';

// @ts-ignore
const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: (_) => {
      return { path: '/home' };
    }
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/c01_props',
    name: 'c01_props',
    component: C01_props
  },
  {
    path: '/c02_custom_event',
    name: 'c02_custom_event',
    component: C02_custom_event
  },
  {
    path: '/:currentPath(.*)*', // 路由未匹配到，进入这个
    redirect: (_) => {
      return { path: '/404' };
    }
  }
];
const router = createRouter({
  history: createWebHistory(''),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return {
      el: '#app',
      top: 0,
      behavior: 'smooth'
    };
  }
});
export default router;
