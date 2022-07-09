import React from 'react'
  import ReactDOM from 'react-dom'
// import store from './redux/store'
// import App from './App'
// import Count from './components/Count'
import LifeDemo from '../src/生命周期demo/index'

ReactDOM.render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <Count /> */}
    <LifeDemo></LifeDemo>
  </React.StrictMode>,
  document.getElementById('root')
)

// store.subscribe(()=>{
//   ReactDOM.render(
//     <React.StrictMode>
//       {/* <App /> */}
//       <Count />
//     </React.StrictMode>,
//     document.getElementById('root')
//   )
// })