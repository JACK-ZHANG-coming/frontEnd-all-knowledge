import React from 'react';
import { Button } from 'antd';
import './App.css';
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
  GetUrlQueryString, setToken, getToken, AutoAdaptDpi, FullScreen,

  // baseTools
  splitObj,

  // baseDataType
  areJrjobject,
} from '@jrj-front-end/tools'

const App = () => {
  // array
  console.log('getLengthArray:', getLengthArray(4));

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
  // console.log('GetUrlQueryString:', GetUrlQueryString('a'));
  // setToken('1122')
  // console.log('getToken', getToken());
  // setTimeout(() => {
  //   console.log('1', 1);
  //   AutoAdaptDpi()
  // }, 5000)
  // baseTools
  // let testObj = {
  //   "id": "218265",
  //   "type": "MesAssignSheet",
  //   "properties": {
  //     "RowNumber": "1",
  //     "MesAssignSheet__ChildAssignSheetCount": "0",
  //     "MesAssignSheet__ObjID": "218265",
  //     "MesAssignSheet__ClassType": "MesAssignSheet",
  //     "MesAssignSheet__Name": "QF550801",
  //     "MesAssignSheet__Creator": "admin",
  //     "MesSemiFinished__ObjID": "374815",
  //     "MesSemiFinished__ClassType": "MesSemiFinished",
  //     "MesSemiFinished__Name": "QF550801",
  //     "MesSemiFinished__Creator": "SYSTEM",
  //     "MesSemiFinished__CreationDate": "2023/9/28 11:03:21",
  //     "MesSemiFinished__Description": "",
  //     "MesPart__PlmPart_objId": "252393",
  //     "MesPart__OrderQuantity": "2",
  //     "MesPart__OriginOrderQuantity": "2",
  //     "MesPart__Order_OBJID": "5547",
  //     "MesPart__Product_OBJID": "18913",
  //     "MesPart__Creator": "SYSTEM",
  //   }
  // }
  // console.log('-->', splitObj(testObj, 'MesAssignSheet'));

  // baseDataType
  // console.log('areJrjobject---1:', areJrjobject());
  // console.log('areJrjobject---2:', areJrjobject(testObj));
  // console.log('areJrjobject---3:', areJrjobject(testObj).GetPropVal('MesPart__Creator'));

  return (
    <div className="App">
      npm包测试页面,详情见控制台
    </div>
  );
}

export default App;
