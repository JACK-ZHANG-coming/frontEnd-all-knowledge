import { defHttp } from '@/utils/http/axios';

enum Api {
  GetOneDevice = '/api/Device/GetOneDevice',
  ImportImage = '/api/Device/ImportImage',
  ModifyOneDevice = '/api/Device/ModifyOneDevice',
  DeviceModifyStaticDataDefineLink = '/api/Device/DeviceModifyStaticDataDefineLink',
  DeviceAddDynamicDefineLink = '/api/Device/DeviceAddDynamicDefineLink',
  DeviceModifyDynamicDefineLink = '/api/Device/DeviceModifyDynamicDefineLink',
  DeviceDelDynamicDefineLink = '/api/Device/DeviceDelDynamicDefineLink',
  GetTimeData = '/api/DataVision/GetTimeData',
  GetDataPeriodsInTime = '/api/DataVision/GetDataPeriodsInTime',
  DeviceModifyStaticAttribute = '/api/Device/DeviceModifyStaticAttribute',
  DeviceAddDynamicAttribute = '/api/Device/DeviceAddDynamicAttribute',
  DeviceModifyDynamicAttributeLink = '/api/Device/DeviceModifyDynamicAttributeLink',
  DeviceDelDynamicAttributeLink = '/api/Device/DeviceDelDynamicAttributeLink',
  GetOneDeviceActivation = '/api/Device/GetOneDeviceActivation',
  GetOneDeviceAlarmCode = '/api/Device/GetOneDeviceAlarmCode',
}

/**
 * @description: 获取单个设备信息
 */
export const GetOneDevice = async (params) => {
  const res = await defHttp.get<any>({
    url: Api.GetOneDevice,
    params,
  });
  return res;
};
/**
 * @description: 修改单个设备信息
 */
export const ModifyOneDevice = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.ModifyOneDevice,
    params,
  });
  return res;
};
/**
 * @description: 上传设备图片
 */
export function ImportImage(urlParams, params) {
  let url = '/basic-api/api/Device/ImportImage' + urlParams;
  if (import.meta.env.DEV) {
    url = '/basic-api/api/Device/ImportImage' + urlParams;
  } else {
    url = '/api/Device/ImportImage' + urlParams;
  }
  return defHttp.uploadFile<any>({ url }, params, 'POST', {});
}
/**
 * @description: 用户静态数据定义链接修改接口
 */
export const DeviceModifyStaticDataDefineLink = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.DeviceModifyStaticDataDefineLink,
    params,
  });
  return res;
};
/**
 * @description: 查询一段时间内的数据，并根据要求的数据量平均返回
 */
export const GetTimeData = async (params) => {
  const res = await defHttp.get<any>({
    url: Api.GetTimeData,
    params,
  });
  return res;
};
/**
 * @description: 查询一段时间内,某数据限制条件下持续的时间段
 */
export const GetDataPeriodsInTime = async (params) => {
  const res = await defHttp.post<any>({
    url: Api.GetDataPeriodsInTime,
    params,
  });
  return res;
};
/**
 * @description: 用户自定义动态数据定义链接添加
 */
export const DeviceAddDynamicDefineLink = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.DeviceAddDynamicDefineLink,
    params,
  });
  return res;
};
/**
 * @description: 用户自定义动态数据定义链接修改
 */
export const DeviceModifyDynamicDefineLink = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.DeviceModifyDynamicDefineLink,
    params,
  });
  return res;
};
/**
 * @description: 用户自定义动态数据定义链接删除，仅判断传入key，value（UUID）不进行判断
 */
export const DeviceDelDynamicDefineLink = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.DeviceDelDynamicDefineLink,
    params,
  });
  return res;
};

/**
 * @description: 用户静态属性修改
 */
export const DeviceModifyStaticAttribute = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.DeviceModifyStaticAttribute,
    params,
  });
  return res;
};
/**
 * @description: 用户自定义动态属性添加
 */
export const DeviceAddDynamicAttribute = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.DeviceAddDynamicAttribute,
    params,
  });
  return res;
};
/**
 * @description: 用户自定义动态属性修改
 */
export const DeviceModifyDynamicAttributeLink = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.DeviceModifyDynamicAttributeLink,
    params,
  });
  return res;
};
/**
 * @description: 用户自定义动态属性删除，仅判断传入key，value不进行判断
 */
export const DeviceDelDynamicAttributeLink = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.DeviceDelDynamicAttributeLink,
    params,
  });
  return res;
};
/**
 * @description: 获取单个设备稼动率信息
 */
export const GetOneDeviceActivation = async (params) => {
  const res = await defHttp.get<any>({
    url: Api.GetOneDeviceActivation,
    params,
  });
  return res;
};
/**
 * @description: 获取单个设备告警信息（饼图）
 */
export const GetOneDeviceAlarmCode = async (params) => {
  const res = await defHttp.get<any>({
    url: Api.GetOneDeviceAlarmCode,
    params,
  });
  return res;
};
