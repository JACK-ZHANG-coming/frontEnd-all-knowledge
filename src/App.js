import React, { useState } from 'react';


const App = () => {
  const [parentValue, setParentValue] = useState('我是父组件的值-');

  return (
    <div
      style={{ width: '60%', margin: '0 auto', textAlign: 'center', border: '1px solid red' }}
    >
      <h3>我是父组件</h3>
      <h4>{parentValue}</h4>
      <button style={{ margin: '20px 0' }} onClick={() => { setParentValue('我触发父组件函数了，' + parentValue); }}>父组件按钮</button>
    </div>
  );
}

export default App;
