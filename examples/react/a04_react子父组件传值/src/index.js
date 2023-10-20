import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
//#region 测试代码区域
import {
  // array
  getLengthArray,

  // moment
  GetBeginAndEndDate,
  GetDataReckon,

  // number
  keepCustomDecimalStr,
  transferFloat,

  // object
  areRinseObj,

  // otherUtil
  GetUrlQueryString,

  // baseTools
  splitObj,

  // baseDataType
  lstChartDataTwo, ChartDataTwo, lstChartDataThree, ChartDataThree,
  JrjGraph, JrjGraphNode, CascaderOption,
  Jrjobject,


} from '@jrj-front-end/tools'

// array
// console.log('getLengthArray:', getLengthArray(4));

// moment
// console.log('GetBeginAndEndDate:', GetBeginAndEndDate('week'));
// console.log('GetDataReckon:', GetDataReckon('近一周'));

// number
// console.log('keepCustomDecimalStr:', keepCustomDecimalStr(2.34567, 3))
// console.log('transferFloat:', transferFloat(2.34567, 3));
// console.log('transferFloat:', transferFloat(2.34567, 3, false));
// console.log('transferFloat:', transferFloat(2.3405, 3, false));

// object
// console.log('areRinseObj:', areRinseObj({ a: '', b: undefined, c: null, d: 'null', e: 123 }));

// otherUtil
console.log('GetUrlQueryString:', GetUrlQueryString('a'));

// baseTools


// baseDataType
// console.log('Jrjobject:', new Jrjobject());

//#endregion

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
  </React.StrictMode>
);
