import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';
import { RoleEnum } from '@/enums/roleEnum';

import { getIp } from '@/utils/simpleTools';

const IFrame = () => import('/@/views/sys/iframe/FrameBlank.vue');

const example: AppRouteModule = {
  path: '/example',
  name: 'Example',
  component: LAYOUT,
  redirect: '/example/upload',
  meta: {
    orderNo: 17,
    icon: 'hugeicons:flash', // 使用自定义svg图标
    title: t('routes.dashboard.example'),
    roles: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMINISTRATOR_ADMIN, RoleEnum.ADMIN],
  },
  children: [
    {
      path: 'upload',
      name: 'Upload',
      component: () => import('@/views/example/upload/index.vue'),
      meta: {
        title: t('routes.dashboard.upload'),
        roles: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMINISTRATOR_ADMIN, RoleEnum.ADMIN],
      },
    },
    {
      // path: `${getIp(0, false, 'auto')}/threejsDemo/`,
      path: 'doc',
      name: 'Doc',
      component: IFrame,
      meta: {
        title: '外链(嵌套页面)',
        frameSrc: 'https://doc.vvbin.cn/',
        roles: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMINISTRATOR_ADMIN, RoleEnum.ADMIN],
      },
    },
  ],
};

export default example;
