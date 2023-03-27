import React, { useState, useEffect } from 'react'
import moment from 'moment'
import Child1 from './components/Child1';
import './App.less'

interface dataType {
  name: string;
  age: number;
}

const App: React.FC<{}> = () => {
  const [nowTime, setNowTime] = useState<string>('');
  const [data, setData] = useState<dataType[]>([{ name: '小a', age: 18 }, { name: '小b', age: 19 }])
  let timerOne: any;

  const getTime = () => {
    setNowTime(moment().format('YYYY-MM-DD HH:mm:ss'));
  }

  const refreshTime = () => {
    timerOne = setInterval(() => {
      getTime()
    }, 1000);
  };

  useEffect(() => {
    console.log('父组件')
    getTime();
    // refreshTime();

    // return () => {
    //   clearInterval(timerOne)
    // }
  }, [])

  return (
    <div className="App">
      <div className="App-box">
        <h3>我是父组件的定时器:</h3>
        <br />
        {nowTime}
        <br /><br /><br />
        <Child1 data={data}></Child1>
        {/* <Child1></Child1> */}
      </div>
    </div>
  )
}

export default App
