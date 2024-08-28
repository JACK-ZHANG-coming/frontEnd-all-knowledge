import { defHttp } from '@/utils/http/axios';
// import { GetDataSourceListParams } from './model/externalDataSourceModel';

enum Api {
  //数据源主列表接口
  GetInnerSourceList = '/api/Inner/GetInnerSourceList',
  //创建常量内部数据源，创建一个Src和三个Def
  CreateOneInnerSource = '/api/Inner/CreateOneInnerSource',
  //修改内部数据源
  ModifyOneInnerSource = '/api/Inner/ModifyOneInnerSource',
  //删除内部数据源
  DeleteOneInnerSource = '/api/Inner/DeleteOneInnerSource',
  //查询一个内部数据定义
  GetOneInnerDefine = '/api/Inner/GetOneInnerDefine',
  //修改一个数据定义（只能修改描述）
  ModifyOneInnerDef = '/api/Inner/ModifyOneInnerDef',
  //内部数据定义子节点列表
  GetInnerDefineChildList = '/api/Inner/GetInnerDefineChildList'
}
/**
 * @description: 数据源主列表接口
 */
export const GetInnerSourceList = async (params) => {
  const data = await defHttp.get<any>({
    url: Api.GetInnerSourceList,
    params,
  });
  return {
    items: data.queryList,
    total: data.count,
  };
};
/**
 * @description:创建一个常量内部数据源，创建一个Src和三个Def
 */
export const CreateOneInnerSource = async (params) => {
  const res = await defHttp.post<any>({
    url: Api.CreateOneInnerSource,
    params,
  });
  return res;
};
/**
 * @description: 内部数据源修改接口
 */
export const ModifyOneInnerSource = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.ModifyOneInnerSource,
    params,
  });
  return res;
};

/**
 * @description: 删除接口
 */
export const DeleteOneInnerSource = async (params, urlParams) => {
  const res = await defHttp.delete<any>({
    url: Api.DeleteOneInnerSource + urlParams,
    params,
  });
  return res;
};

/**
 * @description: 查询一个内部数据定义
 */
export const GetOneInnerDefine = async (params) => {
  const res = await defHttp.get<any>({
    url: Api.GetOneInnerDefine,
    params,
  });
  const dataList = [res];
  dataList &&
    dataList.map((item, index) => {
      item.children = [];
      item.key = item.uuid;
    });

  return { items: dataList };
};
/**
 * @description: 修改一个数据定义（只能修改描述）
 */
export const ModifyOneInnerDef = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.ModifyOneInnerDef,
    params,
  });
  return res;
};

/**
 * @description: 获取传入的节点的所有子节点数据
 */
export const GetInnerDefineChildList = async ({ ...args }) => {
  const params = {
    ...args,
  };
  const dataList = await defHttp.get<any>({
    url: Api.GetInnerDefineChildList,
    params,
  });

  dataList.queryList &&
    dataList.queryList.map((item) => {
      item.children = [];
      item.key = item.uuid;
    });

  return {
    items: dataList.queryList,
    total: dataList.queryList.length,
  };
};