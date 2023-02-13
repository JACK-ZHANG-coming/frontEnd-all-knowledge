/**
 * 需求简述：
 * 实现两个文本框组件，
 * 一个组件为外边框为1px绿色、里面显示内容为当前浏览器的高宽；
 * 另一个组件为外边框2px红色、里面内容为当前浏览器的高宽。
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react'


const WithShowBodySize = (Component) => {

  const [xPos, setXPos] = useState('');
  const [yPos, setYPos] = useState('');

  const getPos = () => {
    setXPos(document.body.offsetWidth);
    setYPos(document.body.offsetHeight);
  }

  /**
   * 普通函数：每次更新dom都会更新
   * useMemo 只有监听的值变化时，才会更新函数里面的内容，提高性能
   * @returns 
   */
  const NoUesMemoTest = () => {
    console.log("NoUesMemoTest");
    return xPos
  }

  const isUesMemoTest = useMemo(() => {
    console.log("isUesMemoTest");
    return 'memo--' + xPos
  }, [xPos])

  // --- 函数形式  -- 函数形式的还没使用通透
  // const areUesMemoTest = useMemo(() => {
  //   return () => {
  //     console.log('areUesMemoTest');
  //     setYPos(xPos + 11)
  //   }
  // }, [xPos])
  // const areUseCallback = useCallback(() => {
  //   console.log("areUseCallback");
  //   setYPos(xPos + '**' + yPos)
  // }, [xPos])

  useEffect(() => {
    console.log('WithShowBodySize');
    getPos()
    window.addEventListener('resize', getPos);
    // window.addEventListener('resize', areUesMemoTest);
    return () => {
      window.removeEventListener('resize', () => {
        console.log('resize监听事件已移除');
      })
    }
  }, []);

  return (
    <>
      <Component xPos={xPos} yPos={yPos}></Component>
      {/* <div>{NoUesMemoTest()}</div>
      <div>{isUesMemoTest}</div> */}
    </>
  )
}

const ShowBodySizeA = (props) => {
  return <div style={{ border: '1px solid yellowGreen' }}>{props?.xPos}-{props?.yPos}</div>
}

const ShowBodySizeB = (props) => {
  return <div style={{ border: '3px solid red' }}>{props?.xPos}-{props?.yPos}</div>
}

const HOCDemo = (props) => {

  const A = WithShowBodySize(ShowBodySizeA);
  const B = WithShowBodySize(ShowBodySizeB);

  useEffect(() => {
    console.log('HOCDemo');
  }, [])

  return (
    <>
      高阶组件思想运用
      <br></br>
      <br></br>
      {A}
      <br></br>
      {B}
    </>
  )
};

export default HOCDemo;
