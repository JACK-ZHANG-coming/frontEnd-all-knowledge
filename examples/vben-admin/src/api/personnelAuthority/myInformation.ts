import { defHttp } from '@/utils/http/axios';

/**
 * @description: UpdatePersonNow
 */
export function UpdatePersonNow(params) {
  return defHttp.put<any>({ url: '/api/Person/UpdatePersonNow', params });
}

/**
 * @description: 取消设备订阅
 */
export function DelSubDevice(params: { PerUUID: string; DevUUID: string }) {
  return defHttp.delete<any>({ url: '/api/Person/DelSubDevice', params });
}
