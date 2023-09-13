import React, { useEffect,memo } from 'react';
import { getLengthArray } from '@jrj-front-end/tools'


const Child4 = memo((props, ref) => {

  useEffect(() => {
    console.log('===>11', getLengthArray(2));
  }, [])

  // console.log("props:", props);
  return (
    <>
      子组件4
    </>
  )

})

export default Child4;