import { defHttp } from '@/utils/http/axios';
import {
  LoginParams,
  LoginResultModel,
  GetUserInfoModel,
  GetUserInfoParams,
} from './model/userModel';
import { AxiosProgressEvent } from 'axios';

import { ErrorMessageMode } from '#/axios';

enum Api {
  Login = '/api/Person/Login',
  Logout = '/logout',
  GetUserInfo = '/api/Person/QueryByAccount',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo(params: GetUserInfoParams) {
  return defHttp.get<GetUserInfoModel>(
    { url: Api.GetUserInfo, params },
    { errorMessageMode: 'none' },
  );
}

/**
 * @description: 获取用户头像
 */
export function getUserAvatar() {
  return defHttp.get<any>(
    { url: '/api/Person/GetAvatar', responseType: 'arraybuffer' },
    { isReturnNativeResponse: true, errorMessageMode: 'none' },
  );
}

/**
 * @description: 用户上传头像
 */
export function uploadAvatar(
  params,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void,
) {
  let url = '/basic-api/api/Person/UpdateAvatar';
  if (import.meta.env.DEV) {
    url = '/basic-api/api/Person/UpdateAvatar';
  } else {
    url = '/api/Person/UpdateAvatar';
  }
  return defHttp.uploadFile<any>({ url, onUploadProgress }, params, 'PUT', {
    name: 'Avatar',
  });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}
