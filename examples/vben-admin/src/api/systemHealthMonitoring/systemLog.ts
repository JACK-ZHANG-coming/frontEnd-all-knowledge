import { defHttp } from '@/utils/http/axios';
import { getToken } from '@/utils/auth';
import axios from 'axios';

enum Api {
  GetSystemLogList = '/api/SystemLog/GetSystemLogList',
  GetSystemLogListToExcel = '/api/SystemLog/GetSystemLogListToExcel',
}
export const GetSystemLogList = async (params) => {
  const data = await defHttp.get<any>({
    url: Api.GetSystemLogList,
    params,
  });
  return {
    items: data.queryList,
    total: data.count,
  };
};

export const GetSystemLogListToExcel = async (params) => {
  const data = await defHttp.get<any>(
    {
      url: Api.GetSystemLogListToExcel,
      responseType: 'blob',
      params,
    },
    { isReturnNativeResponse: true },
  );
  return data;
};
