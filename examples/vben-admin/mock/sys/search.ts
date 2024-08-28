import { MockMethod } from 'vite-plugin-mock';
import { resultError, resultSuccess, getRequestToken, requestParams } from '../_util';

const searchTextTempData = [
  {
    uuid: '33cc9eae-b3f9-409c-8287-aaf92ae6ec7a',
    type: 'DeviceMemSync',
    info: '设备1设备1简介1设 备 1....',
  },
  {
    uuid: '33cc9eae-b3f9-409c-8287-aaf92ae6ec7a',
    type: 'DeviceMemSync',
    info: '设备2设备2简介2设 备 2简1介2简 介jie介....',
  },
  {
    uuid: 'a572d3c1-e73c-4ba6-b95e-47c931599cdb',
    type: 'DataDefMemSync',
    info: '外部数据定义11DataDefMemSync....',
  },
  {
    uuid: '03f0ae2c-49ec-4dd3-a8a3-b6e7b22651cf',
    type: 'InnerSourceMemSync',
    info: '内部数据源11InnerSourceMemSync....',
  },
  {
    uuid: 'e34a289a-b879-48d4-923c-50dce3c53747',
    type: 'DataSourceMemSync',
    info: '外部数据源11DataSourceMemSync....',
  },
  {
    uuid: 'dfa8ba2e-a7b6-4f89-9496-6ad730b07ce0',
    type: 'InnerDataDefMemSync',
    info: '内部数据定义11InnerDataDefMemSync....',
  },
  {
    uuid: 'd4a9e878-8873-44ce-ab6b-510b7aeab4d9',
    type: 'DataChannelMemSync',
    info: '数据通道11DataChannelMemSync....',
  },
];

const getFormatSearchData = (queryText: string) => {
  const tempArr: any = [];
  if (!queryText) {
    return [];
  }
  for (let i = 0; i < searchTextTempData.length; i++) {
    if (
      searchTextTempData[i].info.includes(queryText) ||
      searchTextTempData[i].type.includes(queryText) ||
      searchTextTempData[i].uuid.includes(queryText)
    ) {
      tempArr.push(searchTextTempData[i]);
    }
  }
  return tempArr;
};

export default [
  // {
  //   url: '/basic-api/getUserInfo',
  //   method: 'get',
  //   response: (request: requestParams) => {
  //     const token = getRequestToken(request);
  //     if (!token) return resultError('Invalid token');
  //     const checkUser = createFakeUserList().find((item) => item.token === token);
  //     if (!checkUser) {
  //       return resultError('The corresponding user information was not obtained!');
  //     }
  //     return resultSuccess(checkUser);
  //   },
  // },
  // {
  //   url: '/basic-api/api/getSearchData',
  //   method: 'post',
  //   response: ({ body }) => {
  //     const { queryText } = body;
  //     const searchTextData = getFormatSearchData(queryText);
  //     return resultSuccess(searchTextData);
  //   },
  // },
] as unknown as MockMethod[];
