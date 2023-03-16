import { Store, ViewAction } from 'plume2';

//需要被聚合的 actor
import commActor from './actor/comm-actor';

//reactive ui event 反应式ui事件
class AppViewAction extends ViewAction {
  getNum111 = (text: any) => {
    this.store.dispatch('login:Num', text)
  }
}

export default class AppStore extends Store {
  //聚合 actor
  bindActor() {
    return [new commActor()];
  }

  //bind ui event 绑定ui事件
  bindViewAction() {
    return {
      AppViewAction
    }
  }

  //执行的方法
  addNum = () => {
    let num = this.state().get('CountNum') + 1
    this.dispatch('login:addNum', num)
  }
  subNum = () => {
    let num = this.state().get('CountNum') - 1
    this.dispatch('login:subNum', num)
  }
  getNum = () => {
    this.dispatch('login:Num')
  }
}