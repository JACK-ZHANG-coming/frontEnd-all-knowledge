// 数据定义总览页面接口

import { defHttp } from '@/utils/http/axios';

enum Api {
  GetDataDefineNoFatherList = '/api/DataDef/GetDataDefineNoFatherList', // 获取所有数据定义根节点数据
  GetDataDefineChildList = '/api/DataDef/GetDataDefineChildList', // 获取传入的节点的所有子节点数据
  GetDataDefineList = '/api/DataDef/GetDataDefineList', // 获取所有数据定义节点 - 带查询条件
}

const isDefineQuery = (data: any) => {
  let isQuery = false;
  if (Object.keys(data).length > 0) {
    Object.keys(data).forEach((key) => {
      if (data[key] && data[key] !== '' && data[key] !== null && data[key] !== undefined) {
        isQuery = true;
      }
    });
  }
  return isQuery;
};

/**
 * @description: 获取所有数据定义根节点数据
 */
export const GetDataDefineNoFatherList = async ({ page, pageSize, ...args }) => {
  const currentpage = page || args?.current || 1;
  const pagesize = pageSize || 10;
  delete args.current;
  delete args.showSizeChanger;
  delete args.size;
  delete args.total;
  if (isDefineQuery(args)) {
    // 带查询条件
    const params = {
      currentpage,
      pagesize,
      ...args,
    };
    const dataList = await defHttp.get<any>({
      url: Api.GetDataDefineList,
      params,
    });

    dataList.queryList &&
      dataList.queryList.map((item) => {
        if (item.childUUID && item.childUUID.length > 0) {
          item.children = [];
        }
        item.key = item.uuid;
      });

    return {
      items: dataList.queryList,
      total: dataList.count,
    };
  } else {
    const params = {
      currentpage,
      pagesize,
      ...args,
    };
    const dataList = await defHttp.get<any>({
      url: Api.GetDataDefineNoFatherList,
      params,
    });

    dataList.queryList &&
      dataList.queryList.map((item) => {
        if (item.childUUID && item.childUUID.length > 0) {
          item.children = [];
        }
        item.key = item.uuid;
      });

    return {
      items: dataList.queryList,
      total: dataList.count,
    };
  }
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
      if (item.childUUID && item.childUUID.length > 0) {
        item.children = [];
      }
      item.key = item.uuid;
    });

  return {
    items: dataList.queryList,
    total: dataList.queryList.length,
  };
};
