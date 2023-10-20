import axios from 'axios'
import { ElMessage } from 'element-plus'
import BaseUrl from '@/commonTools/baseApi/BaseUrl'

export default class SApi {
  public baseUrl = import.meta.env.DEV
    ? import.meta.env.VITE_SELF_IP
    : new BaseUrl().getWithPortRootpath()
  // public baseUrl = import.meta.env.VITE_SELF_IP
  //获取登录人员信息
  public userInfo = JSON.parse(sessionStorage.getItem('USER_INFO') as string)
  public PostData = (url: string, param: object) => {
    return new Promise((resolve, reject) => {
      axios
        .post(this.baseUrl + url, JSON.stringify(param))
        .then((res) => {
          if (res.data.resFlag === 0) {
            resolve(res.data.result)
          } else {
            resolve(res.data.result)
            ElMessage({
              message: res.data.errMsg,
              type: 'warning'
            })
          }
        })
        .catch((err) => {
          ElMessage({
            message: err.message,
            type: 'error'
          })
          reject(err)
        })
    })
  }
  //post带有用户信息的方法
  public PostInfoData = (url: string, param: any) => {
    const params: any = {
      token: this.userInfo,
      user: {
        type: 'sysperson',
        id: this.userInfo.userId,
        properties: {}
      }
    }
    for (let key in param) {
      params[key] = param[key]
    }
    return new Promise((resolve, reject) => {
      axios
        .post(this.baseUrl + url, JSON.stringify(params))
        .then((res) => {
          if (res.data.resFlag === 0) {
            resolve(res.data.result)
          } else {
            ElMessage({
              message: res.data.errMsg,
              type: 'warning'
            })
            reject(res)
          }
        })
        .catch((err) => {
          ElMessage({
            message: err.message,
            type: 'error'
          })
          reject(err)
        })
    })
  }
  //调取假接口
  public GetData = (url: string) => {
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          ElMessage({
            message: err.message,
            type: 'error'
          })
          // reject(err)
        })
    })
  }
}
