import { defHttp } from '@/utils/http/axios';
import { SetSystemHealthParams, LineParams } from './model/serverHealthModel';

enum Api {
  GetCurrentHealth = '/api/SystemHealth/GetCurrentHealthInfo',
  SetSystemHealth = '/api/SystemHealth/SetSystemHealthTreshold',
  GetSystemHealth = '/api/SystemHealth/GetSystemHealthTreshold',

  GetServiceStatus = '/api/SystemHealth/GetServiceStatus',
  GetDailyAdd = '/api/SystemHealth/GetDailyAdd',
  GetCpuData = '/api/SystemHealth/GetCpuData',
  GetMemData = '/api/SystemHealth/GetMemData',
  GetNetData = '/api/SystemHealth/GetNetData',
  GetDiskData = '/api/SystemHealth/GetDiskData',
}
//健康概况数据
export function GetCurrentHealth() {
  return defHttp.get<any>({ url: Api.GetCurrentHealth });
}
// 返回日新增，日占用容量(健康概况数据)
export function GetDailyAdd() {
  return defHttp.get<any>({ url: Api.GetDailyAdd });
}
//获取健康评分
export function GetSystemHealth() {
  return defHttp.get<any>({ url: Api.GetSystemHealth });
}
//设置健康评分
export function SetSystemHealth(params: SetSystemHealthParams) {
  return defHttp.put<any>({ url: Api.SetSystemHealth, params });
}
// 返回服务器列表
export function GetServiceStatus() {
  return defHttp.get<any>({ url: Api.GetServiceStatus });
}
//获取cpu
export function GetCpuData(params: LineParams) {
  return defHttp.get<any>({ url: Api.GetCpuData, params });
}
//获取内存
export function GetMemData(params: LineParams) {
  return defHttp.get<any>({ url: Api.GetMemData, params });
}
//获取网络IO
export function GetNetData(params: LineParams) {
  return defHttp.get<any>({ url: Api.GetNetData, params });
}
//获取磁盘IO
export function GetDiskData(params: LineParams) {
  return defHttp.get<any>({ url: Api.GetDiskData, params });
}
