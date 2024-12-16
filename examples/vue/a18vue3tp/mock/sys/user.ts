import { MockMethod } from 'vite-plugin-mock';
import { resultError, resultSuccess, getRequestToken, requestParams } from '../_util';
import { personList } from '../common/data';

export default [
  // mock Login
  {
    url: '/basic-api/api/Person/Login',
    method: 'post',
    response: ({ body }) => {
      const { Account, Password } = body;
      const checkUser = personList.find((item) => item.account === Account && Password === 'admin');
      if (!checkUser) {
        return resultError('Incorrect account or Password！');
      }
      const { roleId, account: _Account } = checkUser;
      return resultSuccess({
        roleId,
        Account: _Account,
        // token在mock中静态写死，实际开发中应该由服务端生成
        token: _Account,
      });
    },
  },
  // mock getUserInfo
  {
    url: '/basic-api/api/Person/QueryByAccount',
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = personList.find((item) => item.account === token);
      if (!checkUser) {
        return resultError('The corresponding user information was not obtained!');
      }
      return resultSuccess(checkUser);
    },
  },
] as MockMethod[];
