import { defHttp } from '@/utils/http/axios';
import { buildUrl } from '@/utils/simpleTools';

enum Api {
  OverviewGetDeviceInAccessNum = '/api/Device/OverviewGetDeviceInAccessNum', // 已接入设备总数
  OverviewGetDeviceRunningStatus = '/api/Device/OverviewGetDeviceRunningStatus', // 运行情况
  OverviewGetDeviceHealth = '/api/Device/OverviewGetDeviceHealth', // 设备健康
  OverviewGetActivation = '/api/Device/OverviewGetActivation', // 平均稼动率统计
  OverviewGetFaultRank = '/api/Device/OverviewGetFaultRank', // 故障排名
  OverviewGetShutdownRank = '/api/Device/OverviewGetShutdownRank', // 停机排名
  OverviewGetDeviceType = '/api/Device/OverviewGetDeviceType', // 设备用途
  OverviewGetWarrantyTimeAsc = '/api/Device/OverviewGetWarrantyTimeAsc', // 保修到期时间
}

/**
 * @description: 已接入设备总数
 */
export const OverviewGetDeviceInAccessNum = async (params, urlParams) => {
  const res = await defHttp.get<any>({
    url: buildUrl(Api.OverviewGetDeviceInAccessNum, urlParams),
    params,
  });

  return res;
};

/**
 * @description: 运行情况
 */
export const OverviewGetDeviceRunningStatus = async (params, urlParams) => {
  const res = await defHttp.get<any>({
    url: buildUrl(Api.OverviewGetDeviceRunningStatus, urlParams),
    params,
  });

  return res;
};

/**
 * @description: 设备健康
 */
export const OverviewGetDeviceHealth = async (params, urlParams) => {
  const res = await defHttp.get<any>({
    url: buildUrl(Api.OverviewGetDeviceHealth, urlParams),
    params,
  });

  return res;
};

/**
 * @description: 平均稼动率统计
 */
export const OverviewGetActivation = async (params, urlParams) => {
  const res = await defHttp.get<any>({
    url: buildUrl(Api.OverviewGetActivation, urlParams),
    params,
  });

  return res;
};

/**
 * @description: 故障排名
 */
export const OverviewGetFaultRank = async (params, urlParams) => {
  const res = await defHttp.get<any>({
    url: buildUrl(Api.OverviewGetFaultRank, urlParams),
    params,
  });

  return res;
};

/**
 * @description: 停机排名
 */
export const OverviewGetShutdownRank = async (params, urlParams) => {
  const res = await defHttp.get<any>({
    url: buildUrl(Api.OverviewGetShutdownRank, urlParams),
    params,
  });

  return res;
};

/**
 * @description: 设备用途
 */
export const OverviewGetDeviceType = async (params, urlParams) => {
  const res = await defHttp.get<any>({
    url: buildUrl(Api.OverviewGetDeviceType, urlParams),
    params,
  });

  return res;
};

/**
 * @description: 保修到期时间
 */
export const OverviewGetWarrantyTimeAsc = async (params, urlParams) => {
  const res = await defHttp.get<any>({
    url: buildUrl(Api.OverviewGetWarrantyTimeAsc, urlParams),
    params,
  });

  return res;
};
