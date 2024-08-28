import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';
import { RoleEnum } from '@/enums/roleEnum';

const dataDefinition: AppRouteModule = {
  path: '/dataDefinition',
  name: 'DataDefinition',
  component: LAYOUT,
  redirect: '/dataDefinition/dataDefinitionsOverview',
  meta: {
    orderNo: 13,
    icon: 'ion:git-branch-outline',
    title: t('routes.dashboard.dataDefinition'),
    roles: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMINISTRATOR_ADMIN],
  },
  children: [
    {
      path: 'dataDefinitionsOverview',
      name: 'DataDefinitionsOverview',
      component: () => import('@/views/dataDefinition/dataDefinitionsOverview/index.vue'),
      meta: {
        title: t('routes.dashboard.dataDefinitionsOverview'),
        roles: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMINISTRATOR_ADMIN],
      },
    },
    {
      path: 'dataDefinitionEditing',
      name: 'DataDefinitionEditing',
      component: () => import('@/views/dataDefinition/dataDefinitionEditing/index.vue'),
      meta: {
        title: t('routes.dashboard.dataDefinitionEditing'),
        roles: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMINISTRATOR_ADMIN],
      },
    },
  ],
};

export default dataDefinition;
