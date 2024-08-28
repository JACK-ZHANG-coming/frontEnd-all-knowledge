/**
The routing of this file will not show the layout.
It is an independent new page.
the contents of the file still need to log in to access
该文件的路由将不显示布局。
这是一个独立的新页面。
文件的内容仍然需要登录才能访问
 */
import type { AppRouteModule } from '@/router/types';

// test
// http:ip:port/main-out
export const mainOutRoutes: AppRouteModule[] = [
  // {
  //   path: '/main-out',
  //   name: 'MainOut',
  //   component: () => import('@/views/demo/main-out/index.vue'),
  //   meta: {
  //     title: 'MainOut',
  //     ignoreAuth: true,
  //   },
  // },
  {
    path: '/dataDefinitionEditingConsole',
    name: 'DataDefinitionsOverviewConsole',
    component: () => import('@/views/dataDefinition/dataDefinitionEditingConsole/index.vue'),
    meta: {
      title: '数据定义编辑-控制台',
      ignoreAuth: true,
    },
  },
];

export const mainOutRouteNames = mainOutRoutes.map((item) => item.name);
