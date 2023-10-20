import React, { useEffect } from 'react';
import { getLengthArray } from '@jrj-front-end/tools'


const Child4 = (props, ref) => {
  useEffect(() => {
    console.log('===>11', getLengthArray(2));
  }, [props])

  // console.log("props:", props);
  return (
    <>
      子组件4
    </>
  )

}

export default Child4;