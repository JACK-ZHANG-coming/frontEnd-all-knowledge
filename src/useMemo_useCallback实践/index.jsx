/**
 * 需求，有这么一个计数容器，点击加一、减一按钮时，屏幕上对应的的数值会进行加一或者减一运算，并且后面会跟上操作的时间
 * 
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";

const formatTime = (tempTime) => {
  return tempTime.getFullYear() + '-' + (tempTime.getMonth() + 1) + '-' + tempTime.getDate() + ' ' + tempTime.getHours() + ':' + tempTime.getMinutes() + ':' + tempTime.getSeconds()
}

const UseMemoUseCallbackDemo = () => {
  const [commonValue, setCommonValue] = useState(0);
  const [highPoweredValue, setHighPoweredValue] = useState(0);
  const [nowTime, setNowTime] = useState(formatTime(new Date()));

  // const commonAdd = () =>{
  //   setCommonValue(commonValue+1)
  // }
  // const commonAdd = () =>{
  //   setCommonValue(commonValue+1)
  // }

  useEffect(() => {
    let timer = setInterval(() => {
      let tempTime = new Date();
      setNowTime(formatTime(tempTime))
    }, 1000);
    return () => {
      console.log('卸载timer计时器');
      clearInterval(timer);
    }
  }, [])

  return (
    <>
      <h3>普通的函数</h3>
      <div>计数容器：</div>
      <div><button>+1</button><button>-1</button></div>
      <br></br>
      <h3>useMemo提升性能后的函数</h3>

      <br></br>
      <h3>useCallback精简useMemo</h3>

      <br></br>

      <div>现在时间：{nowTime}</div>
    </>
  )
};

export default UseMemoUseCallbackDemo;