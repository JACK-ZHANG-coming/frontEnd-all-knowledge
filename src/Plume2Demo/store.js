import { Store } from 'plume2/es5';

//需要被聚合的 actor
import commActor from './actor/comm-actor';

export default class AppStore extends Store {
  //聚合 actor
  bindActor() {
    return [new commActor()];
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
}