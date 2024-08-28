/**
 * @description: 设备列表查询参数
 */
export interface GetDeviceListParams {
  //分页大小
  pagesize: number;
  //当前页
  currentpage: number;
  DeviceCode?: string;
  Name?: string;
  DeviceForm?: number;
  DeviceType?: string;
  Description?: string;
  DeviceAddress?: string;
  Manufacturer?: string;
  isSubscribed ?: boolean;
}
/**
 * @description: 通用设备创建参数
 */
export interface CreateNormalDeviceParams {
  Name: string;
  Description: string;
  DeviceAddress: string;
  DeviceCode: string;
  Manufacturer: string;
  DeviceModel: string;
  DeviceBrand: string;
  ExFactoryTime: string;
  WarrantyTime: string;
}

/**
 * @description: 机器人设备创建参数
 */
export interface CreateRobotDeviceParams {
  Name: string;
  Description: string;
  DeviceAddress: string;
  DeviceCode: string;
  Manufacturer: string;
  DeviceModel: string;
  DeviceBrand: string;
  ExFactoryTime: string;
  WarrantyTime: string;
  NumOfAxis: number;
}

/**
 * @description: 机床设备创建参数
 */
export interface CreateOneDeviceParams {
  Name: string;
  Description: string;
  DeviceAddress: string;
  DeviceCode: string;
  Manufacturer: string;
  DeviceModel: string;
  DeviceBrand: string;
  ExFactoryTime: string;
  WarrantyTime: string;
  NumOfAxis: number;
}