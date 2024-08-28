import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';
import { RoleEnum } from '@/enums/roleEnum';

const customDataPresentation: AppRouteModule = {
  path: '/customDataPresentation',
  name: 'CustomDataPresentation',
  component: LAYOUT,
  redirect: '/customDataPresentation/customLargeScreen',
  meta: {
    orderNo: 15,
    icon: 'ion:flower-outline',
    title: t('routes.dashboard.customDataPresentation'),
    roles: [],
    // roles: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMINISTRATOR_ADMIN],
  },
  children: [
    {
      path: 'customLargeScreen',
      name: 'CustomLargeScreen',
      component: () => import('@/views/customDataPresentation/customLargeScreen/index.vue'),
      meta: {
        title: t('routes.dashboard.customLargeScreen'),
        roles: [],
        // roles: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMINISTRATOR_ADMIN],
      },
    },
    {
      path: 'customReportForm',
      name: 'CustomReportForm',
      component: () => import('@/views/customDataPresentation/customReportForm/index.vue'),
      meta: {
        title: t('routes.dashboard.customReportForm'),
        roles: [],
        // roles: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMINISTRATOR_ADMIN],
      },
    },
  ],
} as AppRouteModule;

export default customDataPresentation;
