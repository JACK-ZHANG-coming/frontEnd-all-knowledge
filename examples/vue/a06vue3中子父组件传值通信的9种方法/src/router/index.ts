import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/home/index.vue';
import C1_props from '../views/c1_props/c1_props.vue';
import C2_custom_event from '../views/c2_custom_event/c2_custom_event.vue';
import C3_eventBus from '../views/c3_event-bus/c3_event-bus.vue';
import C4_vModel from '../views/c4_v-model/c4_v-model.vue';
import C5_attrsListeners from '../views/c5_attrs-listeners/c5_attrs-listeners.vue';
import C6_refChildrenProps from '../views/c6_ref-children-props/c6_ref-children-props.vue';
import C7_provideInject from '../views/c7_provide-inject/c7_provide-inject.vue';
import C8_pinia from '../views/c8_pinia/c8_pinia.vue';
import C9_slot from '../views/c9_slot/c9_slot.vue';

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
    path: '/c1_props',
    name: 'c1_props',
    component: C1_props
  },
  {
    path: '/c2_custom_event',
    name: 'c2_custom_event',
    component: C2_custom_event
  },
  {
    path: '/c3_event-bus',
    name: 'c3_event-bus',
    component: C3_eventBus
  },
  {
    path: '/c4_v-model',
    name: 'c4_v-model',
    component: C4_vModel
  },
  {
    path: '/c5_attrs-listeners',
    name: 'c5_attrs-listeners',
    component: C5_attrsListeners
  },
  {
    path: '/c6_ref-children-props',
    name: 'c6_ref-children-props',
    component: C6_refChildrenProps
  },
  {
    path: '/c7_provide-inject',
    name: 'c7_provide-inject',
    component: C7_provideInject
  },
  {
    path: '/c8_pinia',
    name: 'c8_pinia',
    component: C8_pinia
  },
  {
    path: '/c9_slot',
    name: 'c9_slot',
    component: C9_slot
  },
  {
    path: '/:currentPath(.*)*', // 路由未匹配到，进入这个
    redirect: (_) => {
      return { path: '/home' };
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
