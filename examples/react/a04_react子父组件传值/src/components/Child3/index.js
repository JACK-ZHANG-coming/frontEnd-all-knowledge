import React, {
  useState,
  useImperativeHandle,
  forwardRef
} from 'react';


const Child3 = (props, ref) => {

  // console.log("props:", props);
  return (
    <>
      <div style={{ width: '60%', margin: '30px auto', padding: '30px 5px', textAlign: 'center', border: '3px solid yellowgreen' }} >
        <h3>我是子组件3</h3>
        <button style={{ margin: '20px 0' }} onClick={() => { props.areGetChild2Value.current?.areSetChild2Value() }}>子组件3内置按钮（调用子组件2函数）</button>
      </div>
    </>
  )

}

export default Child3;