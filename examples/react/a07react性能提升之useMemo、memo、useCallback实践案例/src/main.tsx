import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App'
import App from './components/Child1'
import './index.less'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
