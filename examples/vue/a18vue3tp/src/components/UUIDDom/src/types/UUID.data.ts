export enum UUIDTypeEnum {
  /**人员UUID  // z暂无 */
  Person_UUID = 'Person_UUID',
  /**设备UUID */
  DeviceMemSync = 'DeviceMemSync',
  /**外部数据定义UUID */
  DataDefMemSync = 'DataDefMemSync',
  /**外部数据源UUID */
  DataSourceMemSync = 'DataSourceMemSync',
  /**数据通道UUID */
  DataChannelMemSync = 'DataChannelMemSync',
  /**内部数据源UUID */
  InnerSourceMemSync = 'InnerSourceMemSync',
  /**内部数据定义UUID */
  InnerDataDefMemSync = 'InnerDataDefMemSync',
  /**自定义大屏UUID  // z暂无 */
  CustomLargeScreen_UUID = 'CustomLargeScreen_UUID',
  /**自定义报表UUID  // z暂无 */
  CustomReportForm_UUID = 'CustomReportForm_UUID',
  /**默认UUID */
  Default_UUID = 'Default_UUID',
}

export type uuidModalConfigType = {
  visible: boolean;
  uuid: string;
  uuidType: UUIDTypeEnum | '';
  title: string;
  record: any;
  key?: number | string;
};
