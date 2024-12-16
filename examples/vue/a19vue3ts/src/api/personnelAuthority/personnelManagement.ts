// 图书、读者管理页面接口

import { defHttp } from '@/utils/http/axios';

enum Api {
  queryPersonList = '/api/Person/GetPersonList',
  createOnePerson = '/api/Person/CreateOnePerson',
  updatePerson = '/api/Person/UpdateOnePerson', // 修改用户信息
  deletePerson = '/api/Person/DeletePerson', // 删除用户
  updatePersonAccount = '/api/Person/UpdateAccount', // 人员账号继承
}

const bookList = [
  {bookName:'大自然摄影',bookStatus:'在馆',bookType:'图书',bookLocation:'3楼东区12排3层',bookAuthor:'陈华',bookPrice:2,bookPublish:'java从入门到放弃'},
  {bookName:'Linux从入门到精通',bookStatus:'在馆',bookType:'图书',bookLocation:'3楼东区12排3层',bookAuthor:'光子',bookPrice:2},
  {bookName:'生活与美',bookStatus:'在馆',bookType:'图书',bookLocation:'3楼东区12排3层',bookAuthor:'海芬',bookPrice:3},
  {bookName:'政法之治',bookStatus:'在馆',bookType:'图书',bookLocation:'3楼东区12排3层',bookAuthor:'淮海',bookPrice:5},
  {bookName:'线条美',bookStatus:'在馆',bookType:'图书',bookLocation:'3楼东区12排3层',bookAuthor:'安迪',bookPrice:2},
  {bookName:'高数',bookStatus:'在馆',bookType:'图书',bookLocation:'3楼东区12排3层',bookAuthor:'韩寒',bookPrice:2},
  {bookName:'线条美',bookStatus:'在馆',bookType:'图书',bookLocation:'3楼东区12排3层',bookAuthor:'朱娜',bookPrice:3},
  {bookName:'大自然摄影',bookStatus:'在馆',bookType:'图书',bookLocation:'3楼东区12排3层',bookAuthor:'陈华',bookPrice:3,bookPublish:'java从入门到放弃'},
  {bookName:'Linux从入门到精通',bookStatus:'在馆',bookType:'图书',bookLocation:'3楼东区12排3层',bookAuthor:'光子',bookPrice:3},
  {bookName:'生活与美',bookStatus:'在馆',bookType:'图书',bookLocation:'3楼东区12排3层',bookAuthor:'海芬',bookPrice:3},
  {bookName:'政法之治',bookStatus:'在馆',bookType:'图书',bookLocation:'3楼东区12排3层',bookAuthor:'淮海',bookPrice:3},
  {bookName:'线条美',bookStatus:'在馆',bookType:'图书',bookLocation:'3楼东区12排3层',bookAuthor:'安迪',bookPrice:3},
  {bookName:'高数',bookStatus:'在馆',bookType:'图书',bookLocation:'3楼东区12排3层',bookAuthor:'韩寒',bookPrice:3},
  {bookName:'线条美',bookStatus:'在馆',bookType:'图书',bookLocation:'3楼东区12排3层',bookAuthor:'朱娜',bookPrice:5},
  {bookName:'Linux从入门到精通',bookStatus:'在馆',bookType:'图书',bookLocation:'3楼东区12排3层',bookAuthor:'光子',bookPrice:5},
  {bookName:'生活与美',bookStatus:'在馆',bookType:'图书',bookLocation:'3楼东区12排3层',bookAuthor:'海芬',bookPrice:5},
  {bookName:'政法之治',bookStatus:'在馆',bookType:'图书',bookLocation:'3楼东区12排3层',bookAuthor:'淮海',bookPrice:5},
  {bookName:'线条美',bookStatus:'在馆',bookType:'图书',bookLocation:'3楼东区12排3层',bookAuthor:'安迪',bookPrice:5},
  {bookName:'高数',bookStatus:'在馆',bookType:'图书',bookLocation:'3楼东区12排3层',bookAuthor:'韩寒',bookPrice:5},
  {bookName:'线条美',bookStatus:'在馆',bookType:'图书',bookLocation:'3楼东区12排3层',bookAuthor:'朱娜',bookPrice:5},
]

/**
 * @description: 图书管理查询接口
 */
export const queryBookList = async ({ ...args }) => {
  const params = {
    ...args,
  };
  const dataList = await defHttp.get<any>({
    url: Api.queryPersonList,
    params,
  });

  console.log('dataList',dataList);

  dataList.queryList = dataList.queryList.map((item,index) => {
    return {
      ...item,
      ...bookList[index],
    };
  });

  return {
    items: dataList.queryList,
    total: dataList.count,
  };
};

/**
 * @description: 图书新增接口
 */
export const createOneBook = async (params) => {
  const res = await defHttp.post<any>({
    url: Api.createOnePerson,
    params,
  });

  return res;
};

/**
 * @description: 图书编辑接口
 */
export const updateBook = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.updatePerson,
    params,
  });

  return res;
};

/**
 * @description: 图书删除接口
 */
export const deleteBook = async (params, urlParams) => {
  const res = await defHttp.delete<any>({
    url: Api.deletePerson + urlParams,
    params,
  });

  return res;
};


/**
 * @description: 读者管理查询接口
 */
export const queryPersonList = async ({ ...args }) => {
  const params = {
    ...args,
  };
  const dataList = await defHttp.get<any>({
    url: Api.queryPersonList,
    params,
  });

  return {
    items: dataList.queryList,
    total: dataList.count,
  };
};

/**
 * @description: 读者新增接口
 */
export const createOnePerson = async (params) => {
  const res = await defHttp.post<any>({
    url: Api.createOnePerson,
    params,
  });

  return res;
};

/**
 * @description: 读者编辑接口
 */
export const updatePerson = async (params) => {
  const res = await defHttp.put<any>({
    url: Api.updatePerson,
    params,
  });

  return res;
};

/**
 * @description: 读者删除接口
 */
export const deletePerson = async (params, urlParams) => {
  const res = await defHttp.delete<any>({
    url: Api.deletePerson + urlParams,
    params,
  });

  return res;
};