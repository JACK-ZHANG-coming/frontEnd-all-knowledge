import  React,{Component} from 'react'
import store from '../../redux/store';

export default class Count extends Component{

  state ={
    count:0
  }

  componentDidMount(){
    console.log('组件挂载完毕');
  }

  componentDidUpdate(){
    console.log('组件更新完毕');
  }

  increment = ()=>{
    console.log('====');
    const {value}=this.selectNumber
    // const {count}=this.state
    store.dispatch({type:'increment',data:value*1})
    // this.setState({})
  }
  decrement = ()=>{

  }
  incrementIfOdd = ()=>{

  }
  incrementAsync = ()=>{

  }

  render(){
    return(
      <div>
        <h2>redux计算求和案例-精简版</h2>
        <div>当前求和的值为：{store.getState()}</div>
        <select ref={c=>this.selectNumber=c}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>&nbsp;
        <button onClick={this.increment}>+</button>
        <button onClick={this.decrement}>-</button>
        <button onClick={this.incrementIfOdd}>当前求和为奇数再加</button>
        <button onClick={this.incrementAsync}>异步加</button>
      </div>
    )
  }
}