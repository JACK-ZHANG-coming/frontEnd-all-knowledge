// 模糊搜索接口
import { defHttp } from '@/utils/http/axios';
import { buildUrl } from '@/utils/simpleTools';

enum Api {
  getSearchData = '/api/ElasticSearch/GetESQuery',
  // getSearchData = '/api/getSearchData', // 本地测试用
  GetOneDevice = '/api/Device/GetOneDevice',
  GetOneDataSource = '/api/DataSource/GetOneDataSource',
  GetOneInnerSource = '/api/Inner/GetOneInnerSource',
  GetOneDataChannel = '/api/DataChannel/GetOneDataChannel',
  GetOneDataDefine = '/api/DataDef/GetOneDataDefine',
  GetOneInnerDefine = '/api/Inner/GetOneInnerDefine',
}

interface GetOneParams {
  uuid: string;
}

/**
 * @description: getSearchData
 */
export function getSearchData(params: any, urlParam: any) {
  return defHttp.get({ url: buildUrl(Api.getSearchData, urlParam) });
}

/**
 * @description: 设备类型获取详细数据 获取单个设备信息
 */
export const GetOneDevice = async (params: {}, urlParam: GetOneParams) => {
  const data = await defHttp.get<any>({
    url: buildUrl(Api.GetOneDevice, urlParam),
    params,
  });
  return data;
};

/**
 * @description: 获取单个外部数据源
 */
export const GetOneDataSource = async (params: {}, urlParam: GetOneParams) => {
  const data = await defHttp.get<any>({
    url: buildUrl(Api.GetOneDataSource, urlParam),
    params,
  });
  return data;
};

/**
 * @description: 获取单个内部数据源
 */
export const GetOneInnerSource = async (params: {}, urlParam: GetOneParams) => {
  const data = await defHttp.get<any>({
    url: buildUrl(Api.GetOneInnerSource, urlParam),
    params,
  });
  return data;
};

/**
 * @description: 查询单个数据通道
 */
export const GetOneDataChannel = async (params: {}, urlParam: GetOneParams) => {
  const data = await defHttp.get<any>({
    url: buildUrl(Api.GetOneDataChannel, urlParam),
    params,
  });
  return data;
};

/**
 * @description: 查询单个外部数据定义
 */
export const GetOneDataDefine = async (params: {}, urlParam: GetOneParams) => {
  const data = await defHttp.get<any>({
    url: buildUrl(Api.GetOneDataDefine, urlParam),
    params,
  });
  return data;
};

/**
 * @description: 查询单个内部数据定义
 */
export const GetOneInnerDefine = async (params: {}, urlParam: GetOneParams) => {
  const data = await defHttp.get<any>({
    url: buildUrl(Api.GetOneInnerDefine, urlParam),
    params,
  });
  return data;
};
