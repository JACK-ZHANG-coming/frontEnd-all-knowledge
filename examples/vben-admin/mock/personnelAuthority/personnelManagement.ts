/**
 *  人员管理页面mock接口
 *
 *
 */
// 要弄一下分页查询
import { MockMethod } from 'vite-plugin-mock';
import { resultError, resultSuccess, getRequestToken, requestParams } from '../_util';

const personList = [
  {
    deviceList: [],
    uuid: '6275cfef-dce3-481d-986c-1629ce1ec499',
    account: 'admin1',
    isMale: true,
    userName: '用户1',
    roleId: 'User',
    roleName: '操作员',
    jobNumber: '',
    phone: '',
    email: '',
    introduction: '',
    company: '',
    department: '',
    createTime: '2024-08-28 15:04:26.11',
  },
  {
    deviceList: [],
    uuid: '2060d44c-3238-44f2-9bfc-8b552d9f5abe',
    account: 'admin2',
    isMale: true,
    userName: '用户2',
    roleId: 'User',
    roleName: '平台用户',
    jobNumber: '',
    phone: '',
    email: '',
    introduction: '',
    company: '',
    department: '',
    createTime: '2024-08-28 15:04:55.69',
  },
  {
    deviceList: [],
    uuid: '9eff34f6-ceaa-42ec-a6c6-bc51a2d37e33',
    account: 'admin3',
    isMale: true,
    userName: '用户3',
    roleId: 'User',
    roleName: '操作员',
    jobNumber: '',
    phone: '',
    email: '',
    introduction: '',
    company: '',
    department: '',
    createTime: '2024-08-28 15:05:15.87',
  },
  {
    deviceList: [],
    uuid: 'dd42432b-b9fe-4319-90cd-65f21bb0754f',
    account: 'admin4',
    isMale: true,
    userName: '普管',
    roleId: 'User',
    roleName: '普通管理员',
    jobNumber: '',
    phone: '',
    email: '',
    introduction: '',
    company: '',
    department: '',
    createTime: '2024-08-28 15:09:03.26',
  },
  {
    deviceList: [],
    uuid: 'e3701c6d-493e-4e57-877b-077200045405',
    account: 'admin5',
    isMale: true,
    userName: '用户5',
    roleId: 'User',
    roleName: '操作员',
    jobNumber: '005',
    phone: '123123',
    email: '123123@qq.com',
    introduction: '',
    company: '',
    department: '',
    createTime: '2024-08-28 15:10:05.20',
  },
  {
    deviceList: [],
    uuid: 'e3701c6d-493e-4e57-877b-077200045406',
    account: 'admin6',
    isMale: true,
    userName: '用户6',
    roleId: 'User',
    roleName: '操作员',
    jobNumber: '006',
    phone: '123123',
    email: '123123@qq.com',
    introduction: '',
    company: '',
    department: '',
    createTime: '2024-08-28 15:10:05.20',
  },
  {
    deviceList: [],
    uuid: 'e3701c6d-493e-4e57-877b-077200045407',
    account: 'admin7',
    isMale: true,
    userName: '用户7',
    roleId: 'User',
    roleName: '操作员',
    jobNumber: '007',
    phone: '123123',
    email: '123123@qq.com',
    introduction: '',
    company: '',
    department: '',
    createTime: '2024-08-28 15:10:05.20',
  },
  {
    deviceList: [],
    uuid: 'e3701c6d-493e-4e57-877b-077200045408',
    account: 'admin8',
    isMale: true,
    userName: '用户8',
    roleId: 'User',
    roleName: '操作员',
    jobNumber: '008',
    phone: '123123',
    email: '123123@qq.com',
    introduction: '',
    company: '',
    department: '',
    createTime: '2024-08-28 15:10:05.20',
  },
  {
    deviceList: [],
    uuid: 'e3701c6d-493e-4e57-877b-077200045409',
    account: 'admin9',
    isMale: true,
    userName: '用户9',
    roleId: 'User',
    roleName: '操作员',
    jobNumber: '009',
    phone: '123123',
    email: '123123@qq.com',
    introduction: '',
    company: '',
    department: '',
    createTime: '2024-08-28 15:10:05.20',
  },
  {
    deviceList: [],
    uuid: 'e3701c6d-493e-4e57-877b-077200045410',
    account: 'admin10',
    isMale: true,
    userName: '用户10',
    roleId: 'User',
    roleName: '操作员',
    jobNumber: '0010',
    phone: '123123',
    email: '123123@qq.com',
    introduction: '',
    company: '',
    department: '',
    createTime: '2024-08-28 15:10:05.20',
  },
  {
    deviceList: [],
    uuid: 'e3701c6d-493e-4e57-877b-077200045411',
    account: 'admin11',
    isMale: true,
    userName: '用户11',
    roleId: 'User',
    roleName: '操作员',
    jobNumber: '0011',
    phone: '123123',
    email: '123123@qq.com',
    introduction: '',
    company: '',
    department: '',
    createTime: '2024-08-28 15:10:05.20',
  },
  {
    deviceList: [],
    uuid: 'e3701c6d-493e-4e57-877b-077200045412',
    account: 'admin12',
    isMale: true,
    userName: '用户12',
    roleId: 'User',
    roleName: '操作员',
    jobNumber: '0012',
    phone: '123123',
    email: '123123@qq.com',
    introduction: '',
    company: '',
    department: '',
    createTime: '2024-08-28 15:10:05.20',
  },
];

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
