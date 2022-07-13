import React, { useState, useRef, useEffect } from 'react';
import { add, areDataReckon } from '@hlyy-front/master-tool';
import Child1 from './components/Child1/index';
import Child2 from './components/Child2/index';
import Child3 from './components/Child3/index';

const App = () => {
  const [parentValue, setParentValue] = useState('我是父组件的值-');
  const [isChild2value, setIsChild2value] = useState('');
  const Child2Ref = useRef(null); // 给Child2一个ref，让外层的父组件可以调用子组件里面的函数

  useEffect(() => {
    setIsChild2value(Child2Ref?.current?.areGetChild2Value());
    console.log('---本日：', areDataReckon('本日'));
    console.log(add(1, 2));
  }, [])

  return (
    <>
      <div style={{ width: '60%', margin: '0 auto', textAlign: 'center', border: '3px solid red' }}>
        <h2>我是父组件</h2>
        <h4>{parentValue}</h4>
        <button style={{ margin: '20px 0' }} onClick={() => { setParentValue('我触发父组件函数了，' + parentValue); }}>父组件按钮</button>
        <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', margin: '20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', width: '50%', margin: '0' }}>
            <button
              onClick={() => {
                Child2Ref?.current?.areSetChild2Value();
                setTimeout(() => {
                  setIsChild2value(Child2Ref?.current?.areGetChild2Value());
                }, 100); // 延迟函数 因为useState是异步
              }}
            >
              父组件调用子组件2函数
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', width: '50%', margin: '0' }}>
            <p>父组件显示子组件2内容：{isChild2value}</p>
          </div>
        </div>
        <Child1 parentValue={parentValue} setParentValue={setParentValue}></Child1>
        <Child2 ref={Child2Ref}></Child2>
        <Child3 areGetChild2Value={Child2Ref}></Child3>

      </div>
    </>
  );
}

export default App;
