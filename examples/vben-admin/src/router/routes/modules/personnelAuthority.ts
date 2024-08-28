import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';
import { RoleEnum } from '@/enums/roleEnum';

const personnelAuthority: AppRouteModule = {
  path: '/personnelAuthority',
  name: 'PersonnelAuthority',
  component: LAYOUT,
  redirect: '/personnelAuthority/myInformation',
  meta: {
    orderNo: 16,
    icon: 'ion:person-outline',
    title: t('routes.dashboard.personnelAuthority'),
    roles: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMINISTRATOR_ADMIN, RoleEnum.ADMIN],
  },
  children: [
    {
      path: 'myInformation',
      name: 'MyInformation',
      component: () => import('@/views/personnelAuthority/myInformation/index.vue'),
      meta: {
        title: t('routes.dashboard.myInformation'),
        roles: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMINISTRATOR_ADMIN, RoleEnum.ADMIN],
      },
    },
    {
      path: 'personnelManagement',
      name: 'PersonnelManagement',
      component: () => import('@/views/personnelAuthority/personnelManagement/index.vue'),
      meta: {
        title: t('routes.dashboard.personnelManagement'),
        roles: [RoleEnum.SUPER_ADMIN],
      },
    },
  ],
};

export default personnelAuthority;
