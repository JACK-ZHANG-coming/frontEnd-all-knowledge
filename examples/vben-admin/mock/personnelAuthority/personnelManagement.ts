/**
 *  人员管理页面mock接口
 *
 *
 */
// 要弄一下分页查询
import { MockMethod } from 'vite-plugin-mock';
import { resultError, resultSuccess, getRequestToken, requestParams } from '../_util';
import { personList } from '../common/data';

const getUrlParams = (url: string) => {
  // 创建 URL 对象
  const urlObj = new URL(url, 'http://dummy-base');
  // 使用 URLSearchParams 来获取参数
  const params = new URLSearchParams(urlObj.search);
  return params;
};

const GetPersonList = (requestUrl) => {
  console.log('requestUrl', requestUrl);
  const params = getUrlParams(requestUrl);
  // 获取单个参数
  const currentpage = Number(params.get('currentpage')) || 1;
  const pageSize = Number(params.get('pageSize')) || 10;
  console.log('currentpage', currentpage);
  const nowList = personList.slice((currentpage - 1) * pageSize, currentpage * pageSize);
  return nowList;
};

const updatePersonList = (requestBody) => {
  const findIndex = personList.findIndex((item) => item.uuid === requestBody.uuid);
  if (findIndex !== -1) {
    personList[findIndex] = { ...personList[findIndex], ...requestBody };
  }
};

const deletePersonList = (requestUrl) => {
  const params = getUrlParams(requestUrl);
  // 获取单个参数
  const UUID = params.get('UUID');
  const findIndex = personList.findIndex((item) => item.uuid === UUID);
  if (findIndex !== -1) {
    personList.splice(findIndex, 1);
  }
};

export default [
  // mock GetPersonList 获取人员列表
  {
    url: '/basic-api/api/Person/GetPersonList',
    method: 'get',
    response: (request: any) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const result = {
        count: personList.length,
        queryList: GetPersonList(request.url || ''),
        // queryList: personList,
      };
      return resultSuccess(result);
    },
  },
  // mock CreateOnePerson 新增人员
  {
    url: '/basic-api/api/Person/CreateOnePerson',
    method: 'post',
    response: (request: any) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      personList.push({ uuid: new Date().getTime().toString(), ...request.body });
      const result = {
        count: personList.length,
        queryList: personList,
      };
      return resultSuccess(result);
    },
  },
  // mock UpdateOnePerson 更新人员信息
  {
    url: '/basic-api/api/Person/UpdateOnePerson',
    method: 'put',
    response: (request: any) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      updatePersonList(request.body || {});
      const result = {
        count: personList.length,
        queryList: personList,
      };
      return resultSuccess(result);
    },
  },
  // mock deletePerson 删除人员信息
  {
    url: '/basic-api/api/Person/deletePerson',
    method: 'delete',
    response: (request: any) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      deletePersonList(request.url || '');
      const result = {
        count: personList.length,
        queryList: personList,
      };
      return resultSuccess(result);
    },
  },
] as MockMethod[];
