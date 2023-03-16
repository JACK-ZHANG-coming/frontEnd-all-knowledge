import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Count from './components/Count'
import store from './store'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Count />
  </React.StrictMode>,
  document.getElementById('root')
)
/**
 * 检测redux中状态的变化，只要变化，就调用一次subscribe函数 
 * 这里函数体的意思会重新更新组件
 */
store.subscribe(()=>{
  root.render(
    <React.StrictMode>
      {/* <App /> */}
      <Count />
    </React.StrictMode>,
    document.getElementById('root')
  )
})
