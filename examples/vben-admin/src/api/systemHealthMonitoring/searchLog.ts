import { defHttp } from '@/utils/http/axios';
import { getToken } from '@/utils/auth';
import axios from 'axios';

enum Api {
  GetSystemGetLogList = '/api/SystemLog/GetSystemGetLogList',
  GetSystemGetLogListToExcel = '/api/SystemLog/GetSystemGetLogListToExcel',
}
export const GetSystemGetLogList = async (params) => {
  console.log(params, 'params');
  let paramsTemp = {};
  if (params?.paramDef && params?.paramDef !== '') {
    paramsTemp = {
      pagesize: params.pagesize,
      currentpage: params.currentpage,
      startTime: params.startTime,
      endTime: params.endTime,
      controllerType: params.controllerType,
      ResFlag: params.resFlag,
      user: params.user,
      Param: params?.paramSrc + ',' + params?.paramDef,
    };
  } else {
    paramsTemp = params;
  }
  const data = await defHttp.get<any>({
    url: Api.GetSystemGetLogList,
    params: paramsTemp,
  });
  return {
    items: data.queryList,
    total: data.count,
  };
};

export const GetSystemGetLogListToExcel = async (params) => {
  let paramsTemp = {};
  if (params?.paramDef && params?.paramDef !== '') {
    paramsTemp = {
      pagesize: params.pagesize,
      currentpage: params.currentpage,
      startTime: params.startTime,
      endTime: params.endTime,
      controllerType: params.controllerType,
      ResFlag: params.resFlag,
      user: params.user,
      Param: params?.paramSrc + ',' + params?.paramDef,
    };
  } else {
    paramsTemp = params;
  }
  const data = await defHttp.get<any>(
    {
      url: Api.GetSystemGetLogListToExcel,
      responseType: 'blob',
      params,
    },
    { isReturnNativeResponse: true },
  );
  return data;
};
