import { Action, Actor, IMap } from 'plume2'

export default class CounterActor extends Actor {
  defaultState() {
    return {
      CountNum: 0 // CountNum 初始值
    };
  }

  /**
   * Action消息响应函数
   * 响应store dispatch 的 'login:setLoading' 然后设置state的loading的值
   * 这里的state是immutable 的数据类型
   * @param state
   * @return state
   */
  @Action('login:addNum')
  addNum(state, count) {
    return state.set('CountNum', count)
  }

  @Action('login:subNum')
  subNum(state, count) {
    return state.set('CountNum', count)
  }
}