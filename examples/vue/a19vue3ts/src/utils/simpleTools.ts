import { useGlobSetting } from '@/hooks/setting';
import { useMessage } from '@/hooks/web/useMessage';

interface anyObj {
  [prop: string]: any;
}

const { jrjConfig } = useGlobSetting();
const jrjConfigObj = JSON.parse(jrjConfig || '{}');
const { createMessage } = useMessage();
/**
 * 获取当前ip地址
 * @port 是否获取端口号 0为自动获取端口号 其他数字为自定义端口号 ,不传则不返回端口号
 * @pathname 是否返回pathname，URL里面的路由地址，一般通过URL跳转页面时会用到，请求接口用不到，默认为false
 * @getType ip获取的形式，auto为自动获取形式（从浏览器地址里面获取），空字符串为原有逻辑，默认为''
 */
export const getIp = (
  port?: number | undefined,
  pathname: boolean = false,
  getType: '' | 'auto' = '',
) => {
  if (import.meta.env.DEV && getType === '') {
    return import.meta.env.VITE_SELF_IP;
    // @ts-ignore
  } else if (jrjConfigObj && jrjConfigObj?.setBaseUrl && getType === '') {
    // @ts-ignore
    return jrjConfigObj.setBaseUrl;
  } else {
    let ip = '';
    ip = window.document.location.protocol + '//' + window.document.location.hostname;
    if (typeof port === 'number') {
      ip = ip + ':' + (port === 0 ? window.document.location.port : port);
    }
    if (pathname) {
      ip = ip + window.document.location.pathname;
    }
    return ip;
  }
};

/**
 * 深度遍历一个对象，将其所有属性名转化为小写，再返回一个新的对象
 * @param obj 任意object | 任意array
 * @returns
 */
export const deepLowerCaseKeys = (obj: anyObj | any): anyObj => {
  if (Array.isArray(obj)) {
    // 如果是数组，则递归处理数组中的每个元素
    return obj.map((item) => deepLowerCaseKeys(item));
  } else if (typeof obj === 'object' && obj !== null) {
    // 如果是对象，则递归处理对象的每个属性
    const result: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        const lowerKey = key.toLowerCase();
        result[lowerKey] = deepLowerCaseKeys(value);
      }
    }
    return result;
  } else {
    // 其他情况下，保持值不变
    return obj;
  }
};

/**
 * 比较两个对象，返回不同的属性名数组 (返回A对象在B对象中变化的对应属性名)
 * eg:
 * A = {a: 1, b: 2, c: {d: 3, e: 4}}
 * B = {a: 1, b: 3, c: {d: 3, e: 5}}
 * compareObjects(A, B) ===> ['b', 'c']
 * @param A
 * @param B
 * @returns
 */
export const compareObjects = (A: anyObj, B: anyObj) => {
  // 创建一个数组来存储不同的属性名
  const differences: string[] = [];

  // 遍历对象 A 的每一个属性
  for (const key in A) {
    // 检查属性是否存在于对象 B 中，并且值是否不同
    if (Object.prototype.hasOwnProperty.call(B, key) && A[key] !== B[key]) {
      // 将不同的属性名添加到数组中
      differences.push(key);
    }
  }

  // 返回包含所有不同属性名的数组
  return differences;
};

/**
 * 格式化00000000-0000-0000-0000-000000000000
 * @text 传入uuid字符串
 *
 */
export const flitterUUID = (text?: string | undefined) => {
  if (text == '00000000-0000-0000-0000-000000000000') {
    return '';
  } else {
    return text;
  }
};

/**
 * 格式化0001-01-01 00:00:00
 * @text 传入日期字符串
 *
 */
export const flitterDate = (text?: string | undefined) => {
  if (text == '0001-01-01 00:00:00.00') {
    return '';
  } else {
    return text;
  }
};

/**
 * 格式化url传参
 * @param baseUrl
 * @param urlParams
 * @returns string
 *
 * e.g.
 * const baseUrl = '/basic-api/api/GetOneCanvas';
 *
 * const urlParams = { a: 1, b: 2 };
 *
 * const fullUrl = buildUrl(baseUrl, urlParams);
 *
 * console.log(fullUrl); // 输出: /basic-api/api/GetOneCanvas?a=1&b=2
 */
export const buildUrl = (baseUrl: string, urlParams: Record<string, any>): string => {
  const url = new URL(baseUrl, 'http://dummy-base'); // 使用虚拟基准 URL 来处理相对路径
  Object.keys(urlParams).forEach((key) => url.searchParams.append(key, urlParams[key]));
  return url.pathname + url.search; // 返回路径和查询参数部分
};

/**
 * 将一组value:label对象转换成
 * ====>
 * [
 *  {value:x1,label:y1},
 *  {value:x2,label:y2},
 *  {value:x3,label:y3},
 * ]
 * @param obj 传入对象
 * @param noFormatKeyArr 不需要格式化的key数组 如果传入这个key，则最终返回不会包括这个key
 * @returns
 */
export const formatSelectArr = (obj: any, noFormatKeyArr: string[] = []) => {
  const tempArr: any = [];
  if (obj) {
    Object.keys(obj).map((item) => {
      if (!noFormatKeyArr.includes(item)) {
        tempArr.push({ value: item, label: obj[item] });
      }
    });
  }
  return tempArr;
};

/**
 * 通过value获取下拉框字典中对应的label
 * @param selectDicArr
 * @param value
 * @returns
 */
export const getSelectLabel = <T>(
  selectDicArr: { label: T; value: string | number }[],
  value: string | number,
): T | undefined => {
  const findIndex = selectDicArr.findIndex((ele) => ele.value === value);
  if (findIndex === -1) {
    return undefined;
  } else {
    return selectDicArr[findIndex]['label'];
  }
};

/**
 * 一键复制
 * @param text 文本内容
 */
export const oneCopyText = (text: string) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          createMessage.success('复制成功');
        })
        .catch(() => {
          createMessage.error('复制失败');
        });
    } else {
      // 创建text area
      const textArea = document.createElement('textarea');
      // console.log('textArea', textArea);
      textArea.value = text;
      // 使text area不在viewport，同时设置不可见
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      createMessage.success('复制成功');
      textArea.remove();
    }
  } catch (e) {
    createMessage.error('复制失败');
  }
};
/*
 * 获取当前时间 或者 过去/未来n秒的日期时间字符串
 * @param type current before after
 * @param val 秒
 * @returns 'YYYY-MM-DD hh:mm:ss'
 *
 * e.g.
 * const type = 'before';
 * const val = 12*60*60;
 * 输出:当前时间前12h的字符串（YYYY-MM-DD hh:mm:ss格式）
 */

export const getDateTime = (type: string, val?: number) => {
  let date: any = new Date();
  if (type == 'before') {
    date = new Date(date.getTime() - (val || 0) * 1000);
  } else if (type == 'after') {
    date = new Date(date.getTime() + (val || 0) * 1000);
  }
  const str =
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    '-' +
    date.getDate().toString().padStart(2, '0') +
    ' ' +
    date.getHours().toString().padStart(2, '0') +
    ':' +
    date.getMinutes().toString().padStart(2, '0') +
    ':' +
    date.getSeconds().toString().padStart(2, '0');
  return str;
};

/**
 * 日期格式转YYYY-MM-DD hh:mm:ss格式
 * @param val 日期格式
 * @returns YYYY-MM-DD hh:mm:ss格式
 */

export const formatDate = (val: any, ms?: boolean) => {
  const date: any = new Date(val);
  const string =
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    '-' +
    date.getDate().toString().padStart(2, '0') +
    ' ' +
    date.getHours().toString().padStart(2, '0') +
    ':' +
    date.getMinutes().toString().padStart(2, '0') +
    ':' +
    date.getSeconds().toString().padStart(2, '0');
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
  if (ms) {
    return string + '.' + milliseconds;
  } else {
    return string;
  }
};

/**
 * 过滤object
 * @param obj 要过滤的object
 * @param noKey 特定需要过滤的key，尽管这些key的value是有值的也会被过滤掉
 * @returns
 */
export const flitterObject = (obj = {}, noKey: string[] = []): anyObj => {
  const params: any = {};
  obj &&
    Object.keys(obj).forEach((key) => {
      if (obj?.[key] !== undefined && obj[key] !== '' && obj[key] !== null && !noKey.includes(key))
        params[key] = obj[key];
    });

  return params;
};

/**
 * 根据传入的秒数返回格式化后的字符串（ 天/小时/分钟 ）
 * @param seconds 秒数
 * @returns
 * e.g.
 * console.log(formatSeconds(3661)); // 输出 "1小时1分钟1秒"
 * console.log(formatSeconds(86400)); // 输出 "1天"
 * console.log(formatSeconds(3600)); // 输出 "1小时"
 * console.log(formatSeconds(61)); // 输出 "1分钟1秒"
 * console.log(formatSeconds(1)); // 输出 "1秒"
 */
export const formatSeconds = (seconds) => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const remainingSeconds = seconds % 60;
  let result = '';
  if (days > 0) {
    result += `${days}天`;
  }
  if (hours > 0) {
    result += `${hours}小时`;
  }
  if (minutes > 0 || result === '') {
    // 确保至少返回分钟数或秒数
    result += `${minutes}分`;
  }
  if (remainingSeconds > 0 || result === '') {
    // 如果剩余秒数大于0，或者结果字符串为空（即没有天、小时、分钟）
    result += `${remainingSeconds}秒`;
  }
  return result;
};
