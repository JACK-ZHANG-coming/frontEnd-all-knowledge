import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';
import { RoleEnum } from '@/enums/roleEnum';

const dataPreprocessingChannel: AppRouteModule = {
  path: '/dataPreprocessingChannel',
  name: 'DataPreprocessingChannel',
  component: LAYOUT,
  redirect: '/dataPreprocessingChannel/dataChannelOverview',
  meta: {
    orderNo: 14,
    icon: 'ion:git-compare-outline',
    title: t('routes.dashboard.dataPreprocessingChannel'),
    roles: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMINISTRATOR_ADMIN],
  },
  children: [
    {
      path: 'dataChannelOverview',
      name: 'DataChannelOverview',
      component: () => import('@/views/dataPreprocessingChannel/dataChannelOverview/index.vue'),
      meta: {
        title: t('routes.dashboard.dataChannelOverview'),
        roles: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMINISTRATOR_ADMIN],
      },
    },
    // 这个目前暂时不用
    // {
    //   path: 'dataChannelEditing',
    //   name: 'DataChannelEditing',
    //   component: () => import('@/views/dataPreprocessingChannel/dataChannelEditing/index.vue'),
    //   meta: {
    //     title: t('routes.dashboard.dataChannelEditing'),
    //     roles: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMINISTRATOR_ADMIN],
    //   },
    // },
  ],
};

export default dataPreprocessingChannel;
