import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';
import { RoleEnum } from '@/enums/roleEnum';

const equipmentManagement: AppRouteModule = {
  path: '/equipmentManagement',
  name: 'EquipmentManagement',
  component: LAYOUT,
  redirect: '/equipmentManagement/equipmentOverviewTidy',
  meta: {
    orderNo: 11,
    icon: 'ion:build-outline',
    title: t('routes.dashboard.equipmentManagement'),
    roles: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMINISTRATOR_ADMIN, RoleEnum.ADMIN],
  },
  children: [
    {
      path: 'equipmentOverview',
      name: 'EquipmentOverview',
      component: () => import('@/views/equipmentManagement/equipmentOverview/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.dashboard.equipmentOverview'),
        roles: [],
      },
    },
    {
      path: 'equipmentOverviewTidy',
      name: 'EquipmentOverviewTidy',
      component: () => import('@/views/equipmentManagement/equipmentOverviewTidy/index.vue'),
      meta: {
        title: t('routes.dashboard.equipmentOverviewTidy'),
        roles: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMINISTRATOR_ADMIN, RoleEnum.ADMIN],
      },
    },
    {
      path: 'deviceTemplate',
      name: 'DeviceTemplate',
      component: () => import('@/views/equipmentManagement/deviceTemplate/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.dashboard.deviceTemplate'),
        roles: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMINISTRATOR_ADMIN, RoleEnum.ADMIN],
      },
    },
    {
      path: 'deviceTemplateDetail/:uuid',
      name: 'DeviceTemplateDetail',
      component: () => import('@/views/equipmentManagement/deviceTemplateDetail/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.dashboard.deviceTemplateDetail'),
        roles: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMINISTRATOR_ADMIN],
        hideMenu: true,
        // dynamicLevel: 1,
        // carryParam: true,
      },
    },
  ],
};

export default equipmentManagement;
