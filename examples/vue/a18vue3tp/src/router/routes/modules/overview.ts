import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';
import { RoleEnum } from '@/enums/roleEnum';

const overview: AppRouteModule = {
  path: '/overview',
  name: 'Overview',
  component: LAYOUT,
  redirect: '/overview/workspace',
  meta: {
    orderNo: 16,
    icon: 'menu-overview|svg', // 使用自定义svg图标
    title: t('routes.dashboard.overview'),
    roles: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMINISTRATOR_ADMIN, RoleEnum.ADMIN],
  },
  children: [
    {
      path: 'workspace',
      name: 'Workspace',
      component: () => import('@/views/overview/workspace/index.vue'),
      meta: {
        title: t('routes.dashboard.workspace'),
        roles: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMINISTRATOR_ADMIN, RoleEnum.ADMIN],
      },
    },
  ],
};

export default overview;
