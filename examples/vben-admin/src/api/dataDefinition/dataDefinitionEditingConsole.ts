// 数据定义编辑-控制台页面接口

import { defHttp } from '@/utils/http/axios';
import { buildUrl } from '@/utils/simpleTools';

enum Api {
  CreateOneDataDefine = '/api/DataDef/CreateOneDataDefine', // 创建数据定义
  ModifyOneDataDefine = '/api/DataDef/ModifyOneDataDefine', // 修改数据定义
  ModifyIdField = '/api/DataDef/ModifyIdField', // 修改数据定义
  DeleteOneDataDefine = '/api/DataDef/DeleteOneDataDefine', // 删除数据定义
  GetOneCanvas = '/api/DataCanvas/GetOneCanvas', // 查询单个画布
  ComposeTwoDataDefine = '/api/DataDef/ComposeTwoDataDefine', // 关联两个节点
  DisComposeTwoDataDefine = '/api/DataDef/DisComposeTwoDataDefine', // 取消关联两个节点
}

/**
 * @description: 创建数据定义接口
 */
export const CreateOneDataDefine = async (params) => {
  return defHttp.post<any>({
    url: Api.CreateOneDataDefine,
    params,
  });
};

/**
 * @description: 编辑数据定义接口
 */
export const ModifyOneDataDefine = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.ModifyOneDataDefine,
    params,
  });

  return res;
};

/**
 * @description: 编辑数据定义唯一标识接口
 */
export const ModifyIdField = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.ModifyIdField,
    params,
  });

  return res;
};

/**
 * @description: 删除数据定义接口
 */
export const DeleteOneDataDefine = async (params, urlParams) => {
  const res = await defHttp.delete<any>({
    url: buildUrl(Api.DeleteOneDataDefine, urlParams),
    params,
  });

  return res;
};

/**
 * @description: 查询单个画布接口
 */
export const GetOneCanvas = async (params, urlParams) => {
  const res = await defHttp.get<any>({
    url: Api.GetOneCanvas + urlParams,
    params,
  });

  return res;
};

/**
 * @description: 关联两个节点接口
 */
export const ComposeTwoDataDefine = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.ComposeTwoDataDefine,
    params,
  });

  return res;
};

/**
 * @description: 取消关联两个节点接口
 */
export const DisComposeTwoDataDefine = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.DisComposeTwoDataDefine,
    params,
  });

  return res;
};
