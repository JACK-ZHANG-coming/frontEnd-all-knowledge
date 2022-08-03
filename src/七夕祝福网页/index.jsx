import React, { Component, useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import ReactPlayer from 'react-player'
import Present from './Present';
import './index.css'
// import { beFull, isFull } from 'be-full';

// if (system === "cmd") {
//   Module = require("@/store/modules/cmdWorkOrders");
//   WorkOrdersModule = Module.WorkOrdersModule;
// }
let Module = null;
let beFull = null;

try {
  Module = require("../../node_modules/be-full");
  beFull = Module.beFull;
}
catch {
  console.log('引用全屏插件失败');
}
const PageView = props => {

  const [showPresent, setShowPresent] = useState(false);
  const myInterval = useRef()
  const isNum = useRef();
  isNum.current = 3
  const [count, setCount] = useState(3)
  const [showTime, steShowTime] = useState(false)

  const interval = () => {
    let num = count
    myInterval.current = setInterval(() => {
      console.log(num);
      if (num <= 0) {
        console.log('小于等于0');
        areClearInterval()
        setShowPresent(true)
      }
      setCount(--num)
    }, 1000)
  }

  const areClearInterval = () => {
    clearInterval(myInterval.current)
    // setCount(3)
  }

  useEffect(
    () => {
      clearInterval(myInterval.current)
      //由于更新时清除了, 所以要重新模拟一下点击时的操作, 确保继续运行
      // interval()
      //更新时清除掉interval
      return () => clearInterval(myInterval.current)
    }, [])


  return (
    <>
      {
        showPresent
          ?
          null
          :
          <div className="printer-div">
            嘿，点击这个按钮，开启你的七夕礼物^_^
            &nbsp;
            <button onClick={() => {
              console.log('点了这个按钮');
              beFull && beFull();
              steShowTime(true);
              interval()
            }}>这个按钮</button>
          </div>
      }
      {
        showTime
          ?
          <div className='time-div'>{showPresent ? null : (count >= 1 ? <h3>还有：<b>{count}s</b></h3> : <h2>开始！</h2>)}</div>
          :
          null
      }
      {showPresent ? <Present></Present> : null}
    </>
  )
}

export default PageView;