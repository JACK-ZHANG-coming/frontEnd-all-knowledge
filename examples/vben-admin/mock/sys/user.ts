import { MockMethod } from 'vite-plugin-mock';
import { resultError, resultSuccess, getRequestToken, requestParams } from '../_util';

export function createFakeUserList() {
  return [
    {
      userId: '1',
      account: 'admin',
      UserName: 'admin',
      Password: 'string',
      avatar: '',
      desc: 'manager',
      token: 'fakeToken1',
      homePath: '/systemHealthMonitoring/serverHealth',
      roles: [
        {
          roleName: 'Super Admin',
          value: 'super',
        },
      ],
    },
    {
      userId: '2',
      account: 'admin2',
      UserName: 'admin2',
      Password: 'string2',
      realName: 'test user',
      avatar: '',
      desc: 'tester',
      token: 'fakeToken2',
      homePath: '/systemHealthMonitoring/serverHealth',
      roles: [
        {
          roleName: 'Tester',
          value: 'test',
        },
      ],
    },
  ];
}

const fakeCodeList: any = {
  '1': ['1000', '3000', '5000'],

  '2': ['2000', '4000', '6000'],
};
export default [
  // mock user login
  // {
  //   url: '/basic-api/api/Person/Login',
  //   method: 'post',
  //   response: ({ body }) => {
  //     const { Account, Password } = body;
  //     const checkUser = createFakeUserList().find(
  //       (item) => item.account === Account && Password === item.Password,
  //     );
  //     if (!checkUser) {
  //       return resultError('Incorrect account or Password！');
  //     }
  //     const { userId, account: _Account, token, realName, desc, roles } = checkUser;
  //     return resultSuccess({
  //       roles,
  //       userId,
  //       Account: _Account,
  //       token,
  //       realName,
  //       desc,
  //     });
  //   },
  // },
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
  {
    url: '/basic-api/getPermCode',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = createFakeUserList().find((item) => item.token === token);
      if (!checkUser) {
        return resultError('Invalid token!');
      }
      const codeList = fakeCodeList[checkUser.userId];

      return resultSuccess(codeList);
    },
  },
  {
    url: '/basic-api/logout',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = createFakeUserList().find((item) => item.token === token);
      if (!checkUser) {
        return resultError('Invalid token!');
      }
      return resultSuccess(undefined, { message: 'Token has been destroyed' });
    },
  },
  {
    url: '/basic-api/testRetry',
    statusCode: 405,
    method: 'get',
    response: () => {
      return resultError('Error!');
    },
  },
] as MockMethod[];
