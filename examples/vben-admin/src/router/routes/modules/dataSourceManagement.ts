import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';
import { RoleEnum } from '@/enums/roleEnum';

const dataSourceManagement: AppRouteModule = {
  path: '/dataSourceManagement',
  name: 'DataSourceManagement',
  component: LAYOUT,
  redirect: '/dataSourceManagement/externalDataSource',
  meta: {
    orderNo: 12,
    icon: 'ion:git-commit-outline',
    title: t('routes.dashboard.dataSourceManagement'),
    roles: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMINISTRATOR_ADMIN],
  },
  children: [
    {
      path: 'externalDataSource',
      name: 'ExternalDataSource',
      component: () => import('@/views/dataSourceManagement/externalDataSource/index.vue'),
      meta: {
        title: t('routes.dashboard.externalDataSource'),
        roles: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMINISTRATOR_ADMIN],
      },
    },
    {
      path: 'internalDataSource',
      name: 'InternalDataSource',
      component: () => import('@/views/dataSourceManagement/internalDataSource/index.vue'),
      meta: {
        title: t('routes.dashboard.internalDataSource'),
        roles: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMINISTRATOR_ADMIN],
      },
    },
  ],
};

export default dataSourceManagement;
