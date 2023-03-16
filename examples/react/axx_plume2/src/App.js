import React from 'react';
import { StoreProvider } from 'plume2';
import AppStore from './store';

//关联 AppStore
@StoreProvider(AppStore)
export default class Demo extends React.Component {
  // 设置Appstore别名
  store: AppStore;

  render() {
    // 方法和数据都是从 Appstore 中拿到的
    //获取数据
    const countNum = this.store.state().get('CountNum');
    //获取方法
    let addNum = this.store.addNum;
    let subNum = this.store.subNum;
    return (
      <>
        <h3>plume2例子</h3>
        <br />
        <button onClick={addNum}>+1按钮</button>&nbsp;&nbsp;
        <button onClick={subNum}>-1按钮</button>
      </>
    )
  }
}
