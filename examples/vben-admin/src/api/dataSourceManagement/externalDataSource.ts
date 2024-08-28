import { defHttp } from '@/utils/http/axios';
import { GetDataSourceListParams } from './model/externalDataSourceModel';

enum Api {
  //数据源主列表接口
  GetDataSourceList = '/api/DataSource/GetDataSourceList',
  //数据源新增接口
  CreateOneDataSource = '/api/DataSource/CreateOneDataSource',
  //数据源修改接口
  ModifyOneDataSource = '/api/DataSource/ModifyOneDataSource',
  //唯一识别字段值修改接口
  DataSourceModifyIdFieldValue = '/api/DataSource/DataSourceModifyIdFieldValue',
  //修改激活状态接口
  DataSourceEnable = '/api/DataSource/DataSourceEnable',
  //删除数据源接口
  DeleteOneDataSource = '/api/DataSource/DeleteOneDataSource',
  //绑定数据定义
  BindDataDefine = '/api/DataSource/BindDataDefine',
  //解绑数据定义
  UnbindDataDefine = '/api/DataSource/UnbindDataDefine',
  //链接LinkDataTimeStamp
  LinkDataTimeStamp = '/api/DataSource/LinkDataTimeStamp',
  //解除链接LinkDataTimeStamp
  UnLinkDataTimeStamp = '/api/DataSource/UnLinkDataTimeStamp',
  //添加存储规则
  DataSourceAddStoreStgy = '/api/DataSource/DataSourceAddStoreStgy',
  //删除存储规则
  DataSourceDelStoreStgy = '/api/DataSource/DataSourceDelStoreStgy',
  //获取单个数据源
  GetOneDataSource = '/api/DataSource/GetOneDataSource',
  //获取单个数据定义信息
  GetOneDataDefine = '/api/DataDef/GetOneDataDefine',
  //数据定义子节点列表
  GetDataDefineChildList = '/api/DataDef/GetDataDefineChildList', // 获取传入的节点的所有子节点数据
}
/**
 * @description: 数据源主列表接口
 */
export const GetDataSourceList = async (params: GetDataSourceListParams) => {
  const data = await defHttp.get<any>({
    url: Api.GetDataSourceList,
    params,
  });
  return {
    items: data.queryList,
    total: data.count,
  };
};
/**
 * @description: 数据源新增接口
 */
export const CreateOneDataSource = async (params) => {
  const res = await defHttp.post<any>({
    url: Api.CreateOneDataSource,
    params,
  });
  return res;
};
/**
 * @description: 数据源修改接口
 */
export const ModifyOneDataSource = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.ModifyOneDataSource,
    params,
  });
  return res;
};
/**
 * @description: 唯一识别字段值修改接口
 */
export const DataSourceModifyIdFieldValue = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.DataSourceModifyIdFieldValue,
    params,
  });
  return res;
};
/**
 * @description: 修改激活状态接口
 */
export const DataSourceEnable = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.DataSourceEnable,
    params,
  });
  return res;
};
/**
 * @description: 绑定数据定义
 */
export const BindDataDefine = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.BindDataDefine,
    params,
  });
  return res;
};
/**
 * @description: 解除数据定义
 */
export const UnbindDataDefine = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.UnbindDataDefine,
    params,
  });
  return res;
};
/**
 * @description: 删除接口
 */
export const DeleteOneDataSource = async (params, urlParams) => {
  const res = await defHttp.delete<any>({
    url: Api.DeleteOneDataSource + urlParams,
    params,
  });

  return res;
};
/**
 * @description: 获取单个数据源信息
 */
export const GetOneDataSource = async (params) => {
  const res = await defHttp.get<any>({
    url: Api.GetOneDataSource,
    params,
  });
  return res;
};

/**
 * @description: 获取单个数据定义根节点数据
 */
export const GetOneDataDefine = async (params) => {
  const res = await defHttp.get<any>({
    url: Api.GetOneDataDefine,
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
 * @description: 获取传入的节点的所有子节点数据
 */
export const GetDataDefineChildList = async ({ ...args }) => {
  const params = {
    ...args,
  };
  const dataList = await defHttp.get<any>({
    url: Api.GetDataDefineChildList,
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

/**
 * @description: 链接LinkDataTimeStamp
 */
export const LinkDataTimeStamp = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.LinkDataTimeStamp,
    params,
  });
  return res;
};
/**
 * @description: 解除链接LinkDataTimeStamp
 */
export const UnLinkDataTimeStamp = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.UnLinkDataTimeStamp,
    params,
  });
  return res;
};

/**
 * @description: 添加存储规则
 */
export const DataSourceAddStoreStgy = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.DataSourceAddStoreStgy,
    params,
  });
  return res;
};
/**
 * @description: 删除存储规则
 */
export const DataSourceDelStoreStgy = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.DataSourceDelStoreStgy,
    params,
  });
  return res;
};
