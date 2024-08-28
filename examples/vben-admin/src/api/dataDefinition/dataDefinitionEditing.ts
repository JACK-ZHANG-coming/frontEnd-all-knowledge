// 数据定义编辑页面接口

import { defHttp } from '@/utils/http/axios';

enum Api {
  GetCanvasLis = '/api/DataCanvas/GetCanvasList',
  CreateOneCanvas = '/api/DataCanvas/CreateOneCanvas',
  UpdateOneCanvas = '/api/DataCanvas/UpdateOneCanvas',
  DeleteOneCanvas = '/api/DataCanvas/DeleteOneCanvas',
}

/**
 * @description: 画布查询接口
 */
export const GetCanvasLis = async ({ ...args }) => {
  const params = {
    ...args,
  };
  const dataList = await defHttp.get<any>({
    url: Api.GetCanvasLis,
    params,
  });

  return {
    items: dataList.queryList,
    total: dataList.count,
  };
};

/**
 * @description: 画布新增接口
 */
export const CreateOneCanvas = async (params) => {
  const res = await defHttp.post<any>({
    url: Api.CreateOneCanvas,
    params,
  });

  return res;
};

/**
 * @description: 画布编辑接口
 */
export const UpdateOneCanvas = async (params) => {
  const res = await defHttp.post<any>({
    url: Api.UpdateOneCanvas,
    params,
  });

  return res;
};

/**
 * @description: 画布删除接口
 */
export const DeleteOneCanvas = async (params, urlParams) => {
  const res = await defHttp.delete<any>({
    url: Api.DeleteOneCanvas + urlParams,
    params,
  });

  return res;
};
