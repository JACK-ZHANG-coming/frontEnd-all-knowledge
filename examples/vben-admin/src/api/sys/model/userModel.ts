import { RoleEnum } from '@/enums/roleEnum';
/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  Account: string;
  Password: string;
}

export interface GetUserInfoParams {
  account: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  // 账号
  account: string;
  // 角色
  roleId: RoleEnum;
  token: string;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  // 账号
  account: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 性别 true男 false女
  isMale: true | false;
  // 密码
  password: string;
  // 角色Id 0: 超级管理员 1: 普通管理员 2: 普通用户
  roleId: 'SuperAdmin' | 'Admin' | 'User';
  // 角色名称
  roleName: string;
  // 工号
  jobNumber: string;
  // 地址
  address: string;
  // 电话
  phone: string;
  // 邮箱
  email: string;
  // 个人简介
  introduction: string;
  // 公司
  company: string;
  // 部门
  department: string;
  // 订阅设备列表
  deviceList: string[];
  // // 头像
  // avatar: string;
}
