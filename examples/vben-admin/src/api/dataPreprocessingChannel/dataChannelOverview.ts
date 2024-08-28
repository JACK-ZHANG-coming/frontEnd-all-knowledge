// 数据通道总览页面接口

import { defHttp } from '@/utils/http/axios';
import { buildUrl } from '@/utils/simpleTools';

enum Api {
  CreateOneDataChannel = '/api/DataChannel/CreateOneDataChannel', // 创建数据通道
  EnableOneDataChannel = '/api/DataChannel/EnableOneDataChannel', // 激活数据通道 使能一个数据通道，使得该通道与入参相关的source和def关联上
  DisableOneDataChannel = '/api/DataChannel/DisableOneDataChannel', // 取消激活数据通道 去使能一个数据通道，使得该通道与入参相关的source和def解除关联
  DeleteOneDataChannel = '/api/DataChannel/DeleteOneDataChannel', // 删除数据通道
  ModifyOneDataChannel = '/api/DataChannel/ModifyOneDataChannel', // 修改数据通道
  GetDataChannelList = '/api/DataChannel/GetDataChannelList', // 查询数据通道
  AddStoreStgy = '/api/DataChannel/AddStoreStgy', // 存储计算结果
  DelStoreStgy = '/api/DataChannel/DelStoreStgy', // 不存储计算结果
}

/**
 * @description: 创建数据通道
 */
export const CreateOneDataChannel = async (params) => {
  const res = await defHttp.post<any>({
    url: Api.CreateOneDataChannel,
    params,
  });

  return res;
};

/**
 * @description: 激活数据通道
 */
export const EnableOneDataChannel = async (params, urlParams) => {
  const res = await defHttp.put<any>({
    url: buildUrl(Api.EnableOneDataChannel, urlParams),
    params,
  });

  return res;
};

/**
 * @description: 取消激活数据通道
 */
export const DisableOneDataChannel = async (params, urlParams) => {
  const res = await defHttp.put<any>({
    url: buildUrl(Api.DisableOneDataChannel, urlParams),
    params,
  });

  return res;
};

/**
 * @description: 删除数据通道
 */
export const DeleteOneDataChannel = async (params, urlParams) => {
  const res = await defHttp.delete<any>({
    url: buildUrl(Api.DeleteOneDataChannel, urlParams),
    params,
  });

  return res;
};

/**
 * @description: 修改数据通道
 */
export const ModifyOneDataChannel = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.ModifyOneDataChannel,
    params,
  });

  return res;
};

/**
 * @description: 查询数据通道
 */
export const GetDataChannelList = async ({ ...args }) => {
  const params = {
    ...args,
  };
  const dataList = await defHttp.get<any>({
    url: Api.GetDataChannelList,
    params,
  });

  return {
    items: dataList.queryList,
    total: dataList.count,
  };
};

/**
 * @description: 存储计算结果
 */
export const AddStoreStgy = async (params, urlParams) => {
  const res = await defHttp.put<any>({
    url: buildUrl(Api.AddStoreStgy, urlParams),
    params,
  });

  return res;
};

/**
 * @description: 不存储计算结果
 */
export const DelStoreStgy = async (params, urlParams) => {
  const res = await defHttp.put<any>({
    url: buildUrl(Api.DelStoreStgy, urlParams),
    params,
  });

  return res;
};
