// 公共字典

/**
 * 数据类型字典
 */
export enum staticValTypeDic {
  整型数据 = 'IntData',
  浮点型数据 = 'FloatData',
  布尔型数据 = 'BoolData',
  字符串型数据 = 'StringData',
  范围型数据 = 'RangeData',
  映射表数据 = 'MapData',
  空数据 = 'NullData',
  Root = 'Root',
}

/**
 * 外部数据定义-数据类型字典
 */
export enum dataTypeBaseDic {
  Root = 0,
  RootArray,
  IntData,
  FloatData,
  BoolData,
  ByteData,
  StringData,
  TimeStampSData,
  TimeStampMsData,
}

/**
 * 数据通道-计算方法字典
 */
export const dataCalMethodDic = {
  Addition: '加',
  Subtract: '减',
  Multiply: '乘',
  Divide: '除',
  Percent: '百分比计算',
  StrAdd: '字符串拼接',
  And: '与',
  Or: '或',
  Inverter: '非',
  BitAnd: '位与',
  BitOr: '位或',
  BitInverter: '位非',
  LeftShift: '左移',
  RightShift: '右移',
  Compare: '比较',
  Switch: '选择（映射）',
  UnDefine: '未定义',
};

/**
 * 内部数据定义-数据类型字典
 */
export const innerDataTypeBaseDic = {
  IntData: '整型数据',
  FloatData: '浮点型数据',
  BoolData: '布尔型数据',
  StringData: '字符串型数据',
  RangeData: '范围型数据',
  MapData: '映射表数据',
  NullData: '空数据',
};
