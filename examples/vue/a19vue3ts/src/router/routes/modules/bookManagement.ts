import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';
import { RoleEnum } from '@/enums/roleEnum';

const bookManagement: AppRouteModule = {
  path: '/bookManagement',
  name: 'BookManagement',
  component: LAYOUT,
  redirect: '/bookManagement/myInformation',
  meta: {
    orderNo: 16,
    icon: 'ion:person-outline',
    title: '图书管理',
    roles: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMINISTRATOR_ADMIN, RoleEnum.ADMIN],
  },
  children: [
    {
      path: 'bookDetailManage',
      name: 'BookDetailManage',
      component: () => import('@/views/bookManagement/bookDetailManage/index.vue'),
      meta: {
        title: '图书信息管理',
        roles: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMINISTRATOR_ADMIN, RoleEnum.ADMIN],
      },
    },
  ],
};

export default bookManagement;
