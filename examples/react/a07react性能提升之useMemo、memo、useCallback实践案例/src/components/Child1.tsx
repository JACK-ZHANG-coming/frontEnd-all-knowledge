import React, { useState, useEffect } from 'react'


interface dataType {
  name: string;
  age: number;
}

interface ChildType {
  data?: dataType[];
}

const App: React.FC<ChildType> = (props: ChildType) => {
  const [smallComponentsId, setSmallComponentsId] = useState(0);
  let timerOne: any;

  const refreshTime = () => {
    console.log('启动timerOne')
    timerOne = setInterval(() => {
      console.log('timerOne-Interval', smallComponentsId);
      setSmallComponentsId(smallComponentsId => (smallComponentsId + 1) % 5) // 不知道为什么，这样写就可以
      // setSmallComponentsId((smallComponentsId + 1) % 5) // 这样写却不可以？？

    }, 1000);
  };


  useEffect(() => {
    console.log('smallComponentsId-->', smallComponentsId)
  }, [smallComponentsId])

  useEffect(() => {
    console.log('Child1');
    refreshTime();

    return () => {
      console.log('卸载了子组件timerOne')
      clearInterval(timerOne)
    }
  }, [])

  return (
    <div className="App-box-child1">
      <h4>我是子组件，并且接收了父组件传过来的值：</h4>
      <div>{JSON.stringify(props.data)}</div>
      <h4>子组件中定时器循环小组件：</h4>
      <h4 style={{ border: '1px solid red', margin: '0 20px' }}>小组件序号{smallComponentsId}</h4>

    </div>
  )
}

export default App
