import React, { Component, useState } from 'react'
import {
  Image as AntdImage,
} from 'antd';

class Image extends Component {

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     styleObj: {}
  //   };
  // }

  handleClick(e) {
    if (this.props.arrange.isCenter) {
      // console.log(111);
      // this.props.reverse()
    } else {
      // console.log(222)
      this.props.center();
      this.props.record();
    }

    e.preventDefault()
  }

  componentDidMount() {
    // console.log("子组件渲染完毕");
  }

  render() {
    let styleObj = {}
    if (this.props.arrange.pos) {
      styleObj = { ...this.props.arrange.pos };
      // styleObj = this.props.arrange.pos; // 这句会报错，但是上面那个解构语句却不会报错
    }
    if (this.props.arrange.rotate) {
      styleObj["transform"] = `rotate(${this.props.arrange.rotate}deg)`
    }
    if (this.props.arrange.isCenter) {
      styleObj['zIndex'] = 11;
    }
    let figureClassName = "img-figure"
    figureClassName += this.props.arrange.isReverse ? ' is-reverse' : ''
    // this.setState({ styleObj: 1 });

    return (
      <>
        <figure
          className={figureClassName}
          id={this.props.id}
          style={styleObj}
          onClick={this.handleClick.bind(this)}
        // onClick={() => { console.log('点击了一次') }}
        >
          <div className="front" style={this.props.arrange.isCenter ? { top: '-125px' } : {}}>
            <AntdImage
              style={this.props.arrange.isCenter ? { width: '450px' } : {}}
              src={this.props.data.url}
              alt={this.props.data.title}
              preview={this.props.arrange.isCenter ? true : false}
              placeholder={
                <AntdImage
                  preview={false}
                  src={require('../../imgs/loading-2.jpeg').default}
                  style={this.props.arrange.isCenter ? { width: '450px' } : {}}
                >
                </AntdImage>
              }
            >
            </AntdImage>
            {this.props.arrange.isCenter ? <h3 className="img-title">{this.props.data.title}</h3> : ''}
          </div>
        </figure>
      </>
    )
  }
}
export default Image