import React, {
  useState,
  useImperativeHandle,
  forwardRef
} from 'react';


const Child2 = (props, ref) => {
  const [child2Value, setChild2Value] = useState('子组件2数值')
  useImperativeHandle(ref, () => {
    return {
      child2Value, // 对象简写，全写为child2Value: child2Value,
      areGetChild2Value: () => {
        return child2Value
      },
      areSetChild2Value: () => {
        // console.log(11111111);
        setChild2Value(child2Value + '子组件2数值-变了！')
      }
    }
  })

  return (
    <>
      <div style={{ width: '60%', margin: '30px auto', padding: '30px 5px', textAlign: 'center', border: '3px solid yellowgreen' }} >
        <h3>我是子组件2</h3>
        <div>子组件2的值：{child2Value}</div>
        <button style={{ margin: '20px 0' }} onClick={() => { setChild2Value(child2Value + '子组件2数值-变了！'); }}>子组件2内置按钮</button>
      </div>
    </>
  )

}

export default forwardRef(Child2);