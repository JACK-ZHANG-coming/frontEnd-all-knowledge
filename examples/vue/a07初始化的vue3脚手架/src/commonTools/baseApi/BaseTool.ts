import { ElNotification } from 'element-plus'
import Jrjobject from '../baseDataType/Jrjobject'
import 'moment/locale/zh-cn'
import moment from 'moment'
moment.locale('zh-cn')

export default class BaseTool {
  /**
   * 语音播报
   * @param msg 播报的信息
   */
  public SpeakVoice(msg: string) {
    var message = new SpeechSynthesisUtterance(msg)
    window.speechSynthesis.speak(message)
  }

  /**
   * 浏览器全屏
   */
  public FullScreen = () => {
    if (!document.fullscreen) {
      document.body.requestFullscreen()
    }
  }

  /**
   * 大屏自动适配分辨率
   * @param showDpi 是否显示屏幕分辨率 默认不显示
   */
  public AutoAdaptDpi = (showDpi = false): void => {
    if (showDpi) {
      let dpiW = document.documentElement.clientWidth
      let dpiH = document.documentElement.clientHeight
      ElNotification.success({ message: '当前显示分辨率为' + dpiW + 'x' + dpiH })
    }

    let w = document.documentElement.clientWidth // 获取浏览器宽度
    let d: any = document
    d.body.style.zoom = w / 1920
  }

  /**
   * 获取日期所在年份、月份、季度、星期的第一天和最后一天
   * @param dimension 维度 ----- 年份year、月份month、季度quarter、星期week、天day
   * @param showDetail 如果为true，返回的格式为YYYY-MM-DD HH:mm:ss，如果为false，返回的格式为YYYY-MM-DD，默认为false
   * @param date 日期，默认为当前日期，格式为YYYY-MM-DD，如2023-01-01
   */
  public GetBeginAndEndDate = (
    dimension: 'year' | 'month' | 'quarter' | 'week' | 'day',
    showDetail = false,
    date = moment(new Date()).format('YYYY-MM-DD')
  ) => {
    let formatStr = showDetail ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
    let startTime = moment(date).startOf(dimension).format(formatStr)
    let endTime = moment(date).endOf(dimension).format(formatStr)
    return {
      startTime,
      endTime
    }
  }

  /**
   * 获取一个自定义区间时间段
   *
   * 07:45:00 - 07:44:59
   * 如果获取当前的时间小于等于07:44:59，则获取昨天至今天的07:45:00 - 07:44:59
   * 如果获取当前的时间大于07:44:59，则获取今天至次天的07:45:00 - 07:44:59
   * @param startTime 开始时间
   * @param endTime 结束时间
   * @param sectionDay 间隔天数
   *
   * @returns startTime: '', endTime: ''  返回一个对象
   */
  public getSectionFormatTime = (
    startTime = '07:45:00',
    endTime = '07:44:59',
    sectionDay = 1
  ): { startTime: string; endTime: string } => {
    const currentTime = moment().format('HH:mm:ss')
    let timeObj = { startTime: '', endTime: '' }
    if (currentTime <= endTime) {
      timeObj = {
        startTime: moment().subtract(sectionDay, 'day').format('YYYY-MM-DD') + ` ${startTime}`,
        endTime: moment().format('YYYY-MM-DD') + ` ${endTime}`
      }
    } else {
      timeObj = {
        startTime: moment().format('YYYY-MM-DD') + ` ${startTime}`,
        endTime: moment().add(sectionDay, 'day').format('YYYY-MM-DD') + ` ${endTime}`
      }
    }

    return timeObj
  }

  /**
   * 生成一个指定长度的空数组
   * @param len 
   * @param value 
   * @returns 
   */
  public getLengthArray = <_, T>(len = 0, value: T = 1 as T): T[] => {
    let arr: T[] = []
    for (let i = 0; i < len; i++) {
      arr.push(value);
    }

    return arr;
  }

  /**
   * 判断输入的是否为数字型，即输入的是否为数字
   * 
   * e.g:
   * 
   *  '111'|111 ----> true
   * 
   *  '' | undefined | null | [] | {} ----> false
   */
  public isNumberText = (num: any) => {
    if (Number.isNaN(Number(num))) {
      return false
    }
    if (num === null || num === undefined || num === '' || typeof num === 'boolean' || typeof num === 'object') {
      return false
    }

    return true
  }

  /**
    * 精确显示小数点后n位，没有时补0
    * 
    * e.g:
    * 
    *  value:123.16，num:1 ----> 123.1
    * 
    *  value:123.16，num:3 ----> 123.160
    */
  public keepCustomDecimalStr = (value: number, num: number): string => {
    let s = value.toString();
    let rs = s.indexOf('.');
    if (rs < 0 && num > 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + num) {
      s += '0';
    }
    if (num > 0) {
      // 如果value的小数超过了num，进行截取
      s = s.slice(0, s.indexOf('.') + num + 1)
    }
    if (num === 0 && s.indexOf('.') >= 0) {
      // 舍去全部小数的情况
      s = s.slice(0, s.indexOf('.') + num)
    }

    return s;
  };

  public splitObj = (obj: Jrjobject, classType: string) => {
    let oldObj = new Jrjobject(obj), newObj = new Jrjobject()
    for (let key in oldObj.properties) {
      if (key.toLocaleLowerCase().startsWith(classType.toLocaleLowerCase())) {
        new Jrjobject(newObj).SetValue(key.split('__')[1], oldObj.properties[key])
      }
    }
    newObj.type = new Jrjobject(newObj).GetPropVal('classtype')
    newObj.id = new Jrjobject(newObj).GetPropFloat('objid')
    return newObj
  }
}
