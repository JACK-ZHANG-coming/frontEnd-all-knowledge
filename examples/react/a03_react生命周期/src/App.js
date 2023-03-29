import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Child1 from './components/Child1'


class LifeDemo extends Component {
  /**
   * 构造器
   */
  constructor(props) {
    super(props)
    this.state = {
      a: 0
    }
    console.log('constructor执行了')
  }

  /**
   * 更新一次state值
   */
  updateState = () => {
    this.setState({
      a: this.state.a + 1
    })
  }

  /**
   * 卸载组件
   */
  areDeath = () => {
    ReactDOM.unmountComponentAtNode(document.getElementById('root'))
  }

  // 组件挂载完毕执行
  componentDidMount() {
    console.log('组件挂载完毕了')
    // 在此处请求接口数据，然后更新state
    this.setState({
      a: this.state.a + 1
    })
  }

  static getDerivedStateFromProps(props, state) {
    console.log('getDerivedStateFromProps---props, state:', props, state)
    // 如果return null 则依然以原来的规则更新state，否则会锁定更新state
    return null
    // return {a:11}
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('getSnapshotBeforeUpdate---prevProps:,prevState:', prevProps, prevState)
    return null
  }

  componentDidUpdate() {
    console.log('组件更新完毕了')
  }

  // 是否继续跟新render
  shouldComponentUpdate(nextProps, nextState) {
    console.log('shouldComponentUpdate---nextProps, nextState:', nextProps, nextState)
    return true
  }

  componentWillUnmount() {
    console.log('组件已经卸载')
  }

  render() {
    console.log('render执行了,props:', this.props, 'state:', this.state)
    return (
      <div>
        <div>react生命周期例子</div>
        <div>state的值：{this.state.a}</div>
        <button onClick={() => { this.updateState() }}>
          更新state值
        </button>&nbsp;&nbsp;
        <button onClick={() => { this.areDeath() }}>
          卸载组件
        </button>
        <div>----------</div>
        <Child1 val={1}></Child1>
      </div>
    )
  }
}

export default LifeDemo
