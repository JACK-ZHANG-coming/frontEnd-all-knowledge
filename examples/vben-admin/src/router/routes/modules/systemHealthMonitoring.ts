import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';
import { RoleEnum } from '@/enums/roleEnum';

const systemHealthMonitoring: AppRouteModule = {
  path: '/systemHealthMonitoring',
  name: 'SystemHealthMonitoring',
  component: LAYOUT,
  redirect: '/systemHealthMonitoring/serverHealth',
  meta: {
    orderNo: 10,
    icon: 'ion:invert-mode',
    title: t('routes.dashboard.systemHealthMonitoring'),
    roles: [RoleEnum.SUPER_ADMIN],
  },
  children: [
    {
      path: 'serverHealth',
      name: 'ServerHealth',
      component: () => import('@/views/systemHealthMonitoring/serverHealth/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.dashboard.serverHealth'),
        roles: [RoleEnum.SUPER_ADMIN],
      },
    },
    {
      path: 'systemLog',
      name: 'SystemLog',
      component: () => import('@/views/systemHealthMonitoring/systemLog/index.vue'),
      meta: {
        title: t('routes.dashboard.systemLog'),
        roles: [RoleEnum.SUPER_ADMIN],
      },
    },
    {
      path: 'searchLog',
      name: 'searchLog',
      component: () => import('@/views/systemHealthMonitoring/searchLog/index.vue'),
      meta: {
        title: t('routes.dashboard.searchLog'),
        roles: [RoleEnum.SUPER_ADMIN],
      },
    },
  ],
};

export default systemHealthMonitoring;
