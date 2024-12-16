import type { UserInfo } from '#/store';
import type { ErrorMessageMode } from '#/axios';
import { defineStore } from 'pinia';
import { store } from '@/store';
import { RoleEnum } from '@/enums/roleEnum';
import { PageEnum } from '@/enums/pageEnum';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY, USER_AVATAR_KEY } from '@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '@/utils/auth';
import { GetUserInfoModel, LoginResultModel, LoginParams } from '@/api/sys/model/userModel';
import { getUserAvatar, getUserInfo, loginApi } from '@/api/sys/user';
import { useI18n } from '@/hooks/web/useI18n';
import { useMessage } from '@/hooks/web/useMessage';
import { router } from '@/router';
import { usePermissionStore } from '@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';
import { h } from 'vue';
import userAvatarBase64 from '../../../mock/common/userAvatarBase64';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
  userAvatar: string;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
    // 用户头像
    userAvatar: '',
  }),
  getters: {
    getUserInfo(state): UserInfo {
      return state.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getUserAvatar(state): string {
      return state.userAvatar || getAuthCache<string>(USER_AVATAR_KEY);
    },
    getToken(state): string {
      return state.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(state): RoleEnum[] {
      return state.roleList.length > 0 ? state.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(state): boolean {
      return !!state.sessionTimeout;
    },
    getLastUpdateTime(state): number {
      return state.lastUpdateTime;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setUserAvatar(avatarString: string) {
      this.userAvatar = avatarString ? avatarString : '';
      setAuthCache(USER_AVATAR_KEY, avatarString);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: (UserInfo & { homePath?: string }) | any) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const data: LoginResultModel & { homePath?: string } = await loginApi(loginParams, mode);
        data.homePath = this.getHomePath(data.roleId);
        const token = data.token;
        // save token
        this.setToken(token);
        return this.afterLoginAction(goHome, data);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(
      goHome: boolean,
      data: LoginResultModel & { homePath?: string },
    ): Promise<GetUserInfoModel | null | any> {
      if (!this.getToken) return null;
      // get user info
      const userInfo = await this.getUserInfoAction(data);
      userInfo.homePath = this.getHomePath(data.roleId);

      // 获取用户头像
      // const userAvatar = await getUserAvatar();
      // const base64 = btoa(
      //   new Uint8Array(userAvatar.data).reduce(
      //     (data, byte) => data + String.fromCharCode(byte),
      //     '',
      //   ),
      // );
      // const imageSrc = `data:${userAvatar.headers['content-type'].toLowerCase()};base64,${base64}`;
      const imageSrc = userAvatarBase64; // 这里是mock数据，正式环境替换为接口或者其他方式
      this.setUserAvatar(imageSrc);

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();

        // 动态路由加载（首次）
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          [...routes, PAGE_NOT_FOUND_ROUTE].forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          // 记录动态路由加载完成
          permissionStore.setDynamicAddedRoute(true);
        }
        goHome && (await router.replace(data.homePath || PageEnum.BASE_HOME));
      }
      return userInfo;
    },
    async getUserInfoAction(
      data: LoginResultModel,
    ): Promise<(UserInfo & { homePath?: string }) | any> {
      if (!this.getToken) return null;
      const userInfo: GetUserInfoModel & { homePath?: string } = await getUserInfo({
        account: data.account,
      });
      const { roleId } = userInfo;
      if (roleId !== undefined) {
        this.setRoleList([roleId as RoleEnum]);
      } else {
        this.setRoleList([]);
      }
      userInfo.homePath = this.getHomePath(data.roleId);
      this.setUserInfo(userInfo);
      return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      // 请求退出登录接口 -- 如果需要退出是调用接口，则放开下面注释
      // if (this.getToken) {
      //   try {
      //     await doLogout();
      //   } catch {
      //     console.log('注销Token失败');
      //   }
      // }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      this.setUserAvatar('');
      if (goLogin) {
        // 直接回登陆页
        router.replace(PageEnum.BASE_LOGIN);
      } else {
        // 回登陆页带上当前路由地址
        router.replace({
          path: PageEnum.BASE_LOGIN,
          query: {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          },
        });
      }
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          // 主动登出，不带redirect地址
          await this.logout(true);
        },
      });
    },
    /**
     * 根据不同角色获取不同首页路径
     * @param roleId 角色ID
     * @returns
     */
    getHomePath(roleId: RoleEnum) {
      let homePath = '';
      switch (roleId) {
        case RoleEnum.SUPER_ADMIN:
          homePath = '/bookManagement/bookDetailManage';
          break;
        case RoleEnum.ADMINISTRATOR_ADMIN:
          homePath = '/bookManagement/bookDetailManage';
          break;
        case RoleEnum.ADMIN:
          homePath = '/bookManagement/bookDetailManage';
          break;
        default:
          homePath = '/bookManagement/bookDetailManage'; // 如果没有roleId，默认首页
          break;
      }
      return homePath;
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
