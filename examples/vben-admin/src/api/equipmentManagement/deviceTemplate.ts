import { defHttp } from '@/utils/http/axios';
import {
  GetDeviceListParams,
  CreateNormalDeviceParams,
  CreateRobotDeviceParams,
  CreateOneDeviceParams,
} from './model/deviceTemplateModel';
import { ErrorMessageMode } from '#/axios';
import { getIp } from '@/utils/simpleTools';

enum Api {
  GetDeviceList = '/api/Device/GetDeviceList',
  CreateNormalDevice = '/api/Device/CreateOneDevice',
  CreateRobotDevice = '/api/Robot/CreateOneDevice',
  CreateOneDevice = '/api/MachineTool/CreateOneDevice', //机床
  DeleteOneDevice = '/api/Device/DeleteOneDevice',
  GetDeviceListToExcel = '/api/Device/GetDeviceListToExcel',
}
export const GetDeviceList = async (params: GetDeviceListParams) => {
  const data = await defHttp.get<any>({
    url: Api.GetDeviceList,
    params,
  });
  console.log(data);
  data.queryList.forEach((item) => {
    item.imageUrl = [getIp(0) + '/api/Device/GetImage?uuid=' + item.uuid];
  });
  return {
    items: data.queryList,
    total: data.count,
  };
};

export function CreateNormalDevice(params: CreateNormalDeviceParams) {
  return defHttp.post<any>({
    url: Api.CreateNormalDevice,
    params,
  });
}
export function CreateRobotDevice(params: CreateRobotDeviceParams) {
  return defHttp.post<any>({
    url: Api.CreateRobotDevice,
    params,
  });
}
export function CreateOneDevice(params: CreateOneDeviceParams) {
  return defHttp.post<any>({
    url: Api.CreateOneDevice,
    params,
  });
}
/**
 * @description: 删除接口
 */
export const DeleteOneDevice = async (params, urlParams) => {
  const res = await defHttp.delete<any>({
    url: Api.DeleteOneDevice + urlParams,
    params,
  });

  return res;
};
/**
 * @description: 下载限制条件下所有设备
 */
export const GetDeviceListToExcel = async (params) => {
  const data = await defHttp.get<any>(
    {
      url: Api.GetDeviceListToExcel,
      responseType: 'blob',
      params,
    },
    { isReturnNativeResponse: true },
  );
  return data;
};

/**
 * @description: 取消订阅设备
 */
export function DelSubDevice(params: { PerUUID: string; DevUUID: string }) {
  return defHttp.delete<any>({ url: '/api/Person/DelSubDevice', params });
}
/**
 * @description: 订阅设备
 */
export function AddSubDevice(params: { PerUUID: string; DevUUID: string }) {
  return defHttp.post<any>({ url: '/api/Person/AddSubDevice', params });
}
