/**
 * @description: 健康评分传参
 */
export interface SetSystemHealthParams {
  //cpu阈值，0-100
  CpuThreshold: number;
  //内存阈值
  MemThreshold: number;
  // 磁盘阈值
  DiskThreshold: number;
}
/**
 * @description: 四个曲线传参传参
 */
export interface LineParams {
  //开始时间
  startTime: string;
  //结束时间
  endTime: string;
  // 数据量
  count: number;
}