// 人员管理页面接口

import { defHttp } from '@/utils/http/axios';

enum Api {
  queryPersonList = '/api/Person/GetPersonList',
  createOnePerson = '/api/Person/CreateOnePerson',
  updatePerson = '/api/Person/UpdateOnePerson', // 修改用户信息
  deletePerson = '/api/Person/DeletePerson', // 删除用户
  updatePersonAccount = '/api/Person/UpdateAccount', // 人员账号继承
}

/**
 * @description: 人员管理查询接口
 */
export const queryPersonList = async ({ ...args }) => {
  const params = {
    ...args,
  };
  const dataList = await defHttp.get<any>({
    url: Api.queryPersonList,
    params,
  });

  return {
    items: dataList.queryList,
    total: dataList.count,
  };
};

/**
 * @description: 人员新增接口
 */
export const createOnePerson = async (params) => {
  const res = await defHttp.post<any>({
    url: Api.createOnePerson,
    params,
  });

  return res;
};

/**
 * @description: 人员编辑接口
 */
export const updatePerson = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.updatePerson,
    params,
  });

  return res;
};

/**
 * @description: 人员删除接口
 */
export const deletePerson = async (params, urlParams) => {
  const res = await defHttp.delete<any>({
    url: Api.deletePerson + urlParams,
    params,
  });

  return res;
};

/**
 * @description: 人员账号继承接口
 */
export const updatePersonAccount = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.updatePersonAccount,
    params,
  });

  return res;
};
