import React, { useState } from 'react';
import Child1 from './components/Child1/index';

const App = () => {
  const [parentValue, setParentValue] = useState('我是父组件的值-');

  return (
    <div
      style={{ width: '60%', margin: '0 auto', textAlign: 'center', border: '3px solid red' }}
    >
      <h2>我是父组件</h2>
      <h4>{parentValue}</h4>
      <button style={{ margin: '20px 0' }} onClick={() => { setParentValue('我触发父组件函数了，' + parentValue); }}>父组件按钮</button>
      <Child1 parentValue={parentValue} setParentValue={setParentValue}></Child1>
    </div>
  );
}

export default App;
