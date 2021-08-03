import React, {
  useRef,
  useState,
  useImperativeHandle,
  forwardRef
} from 'react';

const Child2 = (props, ref) => {
  useImperativeHandle(ref,()=>{
    return {
      add:()=>{

      }
    }
  })

}

export default forwardRef(Child2);