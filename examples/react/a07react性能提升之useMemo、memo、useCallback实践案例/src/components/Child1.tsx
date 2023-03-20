import React, { useState, useEffect } from 'react'


interface dataType {
  name: string;
  age: number;
}

interface ChildType {
  data: dataType[];
}

const App: React.FC<ChildType> = (props: ChildType) => {
  const [smallComponentsId, setSmallComponentsId] = useState(0);
  let timerOne: any;

  const refreshTime = () => {
    timerOne = setInterval(() => {
      setSmallComponentsId((smallComponentsId + 1) % 5)
    }, 1000);
  };

  useEffect(() => {
    console.log('smallComponentsId-->', smallComponentsId)
    refreshTime();

    return () => {
      console.log('卸载了子组件timerOne')
      clearInterval(timerOne)
    }
  }, [smallComponentsId])

  useEffect(() => {
    console.log(props);
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
