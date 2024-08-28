import { ErrorTypeEnum } from '@/enums/exceptionEnum';
import { MenuModeEnum, MenuTypeEnum } from '@/enums/menuEnum';
import { RoleInfo } from '@/api/sys/model/userModel';

// Lock screen information
export interface LockInfo {
  // Password required
  pwd?: string | undefined;
  // Is it locked?
  isLock?: boolean;
}

export interface ApiAddress {
  key: string;
  val: string;
}

// Error-log information
export interface ErrorLogInfo {
  // Type of error
  type: ErrorTypeEnum;
  // Error file
  file: string;
  // Error name
  name?: string;
  // Error message
  message: string;
  // Error stack
  stack?: string;
  // Error detail
  detail: string;
  // Error url
  url: string;
  // Error time
  time?: string;
}

export interface UserInfo {
  // 账号
  account: string | number;
  // 用户名
  userName: string;
  // 主页路径
  homePath?: string;
  // 账号ID
  uuid: string;
  // 介绍
  desc?: string;
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
  // 注册时间
  createTime: string;
  // 订阅设备列表
  deviceList: string[];
  // 头像 后面存入
  avatar: string;
}

export interface BeforeMiniState {
  menuCollapsed?: boolean;
  menuSplit?: boolean;
  menuMode?: MenuModeEnum;
  menuType?: MenuTypeEnum;
}

export interface TableSetting {
  size: Nullable<SizeType>;
  showIndexColumn: Recordable<Nullable<boolean>>;
  columns: Recordable<Nullable<Array<ColumnOptionsType>>>;
  showRowSelection: Recordable<Nullable<boolean>>;
}
