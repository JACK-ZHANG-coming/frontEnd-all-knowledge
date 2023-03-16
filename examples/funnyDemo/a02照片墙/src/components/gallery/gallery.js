import React, { Component, useState, useEffect } from 'react'
import ReactDom from 'react-dom'
import ImgsData from './imgsdata.json'
import Image from './image'
import Controller from './controller'
import './gallery.less'
import { Button, message } from 'antd';

// 获取图片数组相关信息，增加 URL
let ImgInfos = ImgsData.map((img) => {
  return Object.assign({},
    img,
    // { url: require(`../../../src/imgs/${img.filename}`).default }
    { url: img.filename }
  )
})

let getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

// 获取-30~30的随机数字
let getRandomDeg = () => {
  return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30))
}


/**
 * 整个 stage 分为左分区、右分区、上分区以及中间展示的 figure
 * 左右分区的 y 方向取值范围相同，因此设置不同的水平方向取值返回
 * 上分区另设自己的取值范围
 */
class Gallery extends Component {

  constructor(props) {
    super(props)
    //初始化 figure 的位置
    this.constantPos = {
      //中间展示 figure
      centerPos: {
        left: 0,
        top: 0
      },
      //水平方向取值范围
      horizontalRange: {
        leftSectionX: [0, 0], //左分区figure 的 x(水平)方向取值范围
        rightSectionX: [0, 0], //右分区figure 的 x(水平)方向取值范围
        y: [0, 0] // y 方向取值范围
      },
      //垂直方向取值范围
      verticalRange: {
        x: [0, 0],
        topSectionY: [0, 0]
      }
    }
    this.state = {
      //  存储每个 figure 的位置
      figureArrangeArr: [
        {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isReverse: false, // 是否翻转
          isCenter: false // 是否居中
        }
      ],
      nowClickedImageIndex: 0, // 当前被选中的图片id
      loadingKey: 'loadingKey', // 图片加载提示key
    }
  }

  /**
   * 图片居中
   * @param 需要居中图片的 index 值
   * @return 返回一个待执行函数
   */
  putFigureCenter(index) {
    // console.log('---', index);
    return function () {
      this.reArrangFigure(index)
    }.bind(this)
  }

  /**
   * 翻转图片  -- 2021.12.6功能更改，改成 放大图片 --
   * @param  index 需要翻转图片的 index 值  
   * 将该图片 isReverse 取反后触发 setState 进行重新渲染
   * @return 返回一个待执行函数
   */
  reverseFigure(index) {
    /**
     * 放大操作 
     * 思路： 使用全局dom 置顶显示
     */
    return function () {
      let figureArrangeArr = this.state.figureArrangeArr
      // console.log('---', figureArrangeArr[index])
      figureArrangeArr[index].isReverse = !figureArrangeArr[index].isReverse
      this.setState({
        figureArrangeArr: figureArrangeArr
      })
    }.bind(this)
  }

  // 重新排布图片
  reArrangFigure(centerIndex) {
    let constantPos = this.constantPos,
      centerPos = constantPos.centerPos,
      horizontalRange = constantPos.horizontalRange,
      verticalRange = constantPos.verticalRange,
      leftSectionX = horizontalRange.leftSectionX,
      rightSectionX = horizontalRange.rightSectionX
    let figureArrangeArr = this.state.figureArrangeArr,
      centerFigure = figureArrangeArr.splice(centerIndex, 1)

    // 居中图片
    centerFigure = {
      pos: centerPos,
      rotate: 0,
      isReverse: false,
      isCenter: true
    }
    // 上部区域图片
    let topArrNum = Math.floor(Math.random() * 2), // 上部图片数量 0~1
      topIndex = Math.floor(Math.random() * (figureArrangeArr.length - topArrNum)), // 上部图片起始 index
      figureTopArr = figureArrangeArr.splice(topIndex, topArrNum)

    figureTopArr.forEach((img, index) => {
      figureTopArr[index] = {
        pos: {
          left: getRandom(verticalRange.x[0], verticalRange.x[1]),
          top: getRandom(verticalRange.topSectionY[0], verticalRange.topSectionY[1])
        },
        rotate: getRandomDeg,
        isReverse: false,
        isCenter: false
      }
    })
    // 左右两边图片
    for (let i = 0, j = figureArrangeArr.length, k = j / 2; i < j; i++) {
      let LORSectionX = null
      if (i < k) {
        LORSectionX = leftSectionX
      } else {
        LORSectionX = rightSectionX
      }
      figureArrangeArr[i] = {
        pos: {
          left: getRandom(LORSectionX[0], LORSectionX[1]),
          top: getRandom(horizontalRange.y[0], horizontalRange.y[1])
        },
        rotate: getRandomDeg(),
        isReverse: false,
        isCenter: false
      }
    }
    if (figureTopArr && figureTopArr[0]) {
      figureArrangeArr.splice(topIndex, 0, figureTopArr[0])
    }
    figureArrangeArr.splice(centerIndex, 0, centerFigure)
    this.setState({
      figureArrangeArr: figureArrangeArr
    })
  }

  // 记录当前被选中图片的index
  recordImgIndex(index) {

    return function () {
      this.setState({
        nowClickedImageIndex: index,
      });
    }.bind(this)
  }

  // 跳转上一张图片
  jumpOnImg(index) {
    let nowIndex = index === 0 ? 0 : index - 1;
    if (index !== 0) {
      this.setState({
        nowClickedImageIndex: nowIndex,
      })
      this.recordImgIndex(nowIndex);
      this.reArrangFigure(nowIndex);
    }
  }

  // 跳转下一张图片
  jumpNextImg(index) {
    let nowIndex = index === ImgsData.length - 1 ? ImgsData.length - 1 : index + 1;
    if (index !== ImgsData.length - 1) {
      this.setState({
        nowClickedImageIndex: nowIndex,
      })
      this.recordImgIndex(nowIndex);
      this.reArrangFigure(nowIndex);
    }
  }

  // 在组件初次渲染之后触发，计算figure位置范围
  componentDidMount() {
    // 获取 stage 的宽高
    let stage = document.getElementById('stage'),
      stageWidth = stage.scrollWidth,
      stageHeight = stage.scrollHeight,
      halfStageWidth = Math.ceil(stageWidth / 2),
      halfStageHeight = Math.ceil(stageHeight / 2)
    // 获取 figure 的宽高
    let figure = document.getElementById('figure0'),
      figureWidth = figure.scrollWidth,
      figureHeight = figure.scrollHeight,
      halfFigureWidth = Math.ceil(figureWidth / 2),
      halfFigureHeight = Math.ceil(figureHeight / 2)
    this.constantPos = {
      // 中心 figure 位置
      centerPos: {
        left: halfStageWidth - halfFigureWidth,
        top: halfStageHeight - halfFigureHeight
      },
      horizontalRange: {
        leftSectionX: [-halfFigureWidth, halfStageWidth - 3 * halfFigureWidth],
        rightSectionX: [3 * halfFigureWidth + halfStageWidth, stageWidth - halfFigureWidth],
        y: [-halfFigureHeight, stageHeight - halfFigureHeight]
      },
      verticalRange: {
        x: [halfStageWidth - figureWidth, halfStageWidth],
        topSectionY: [-halfFigureHeight, halfStageHeight - 3 * halfFigureHeight]
      }
    }
    this.reArrangFigure(this.state.nowClickedImageIndex);
    // console.log("父组件渲染完毕");

    // 检查图片是否还在加载中
    let imgsFlag = 0;
    let imgDom = document.querySelectorAll('img.ant-image-img');
    message.loading({ content: '图片正在加载中，请稍后呀......', key: this.state.loadingKey, duration: 0 })
    let imgsLoading = setInterval(() => {
      imgDom = document.querySelectorAll('img.ant-image-img'); // 找到所有antd Image组件的图片dom结点
      imgsFlag = 0;
      for (let i = 0; i < imgDom.length; i++) {
        if (imgDom[i].complete) {
          imgsFlag++;
        }
      }
      console.log("===:", imgsFlag, imgDom.length);
      if (imgsFlag >= imgDom.length) {
        console.log("图片加载完了", imgsFlag);
        clearInterval(imgsLoading);
        message.success({ content: '图片加载完毕!', key: this.state.loadingKey, duration: 2 });
      }
    }, 1000);
  }

  render() {
    let navigators = []
    let imgFigures = []
    ImgInfos.forEach(function (imgInfo, index) {
      if (!this.state.figureArrangeArr[index]) {
        this.state.figureArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isReverse: false,
          isCenter: false
        }
      }
      imgFigures.push(
        <Image
          data={imgInfo} key={index} id={"figure" + index}
          arrange={this.state.figureArrangeArr[index]}
          reverse={this.reverseFigure(index)}
          center={this.putFigureCenter(index)}
          record={this.recordImgIndex(index)}
        />
      )
      navigators.push(
        <Controller
          key={index}
          arrange={this.state.figureArrangeArr[index]}
          reverse={this.reverseFigure(index)}
          center={this.putFigureCenter(index)}
          record={this.recordImgIndex(index)}
        />
      )
    }.bind(this))
    return (
      <>
        <div className="stage" id="stage">
          <div className="img-container">
            {imgFigures}
          </div>
          <div className='img-nav'>
            <Button type="primary" ghost onClick={() => { this.jumpOnImg(this.state.nowClickedImageIndex) }}>上一张</Button>
            <nav className="img-nav-content">
              {navigators}
            </nav>
            <Button type="primary" ghost onClick={() => { this.jumpNextImg(this.state.nowClickedImageIndex) }}>下一张</Button>
          </div>
        </div>
      </>
    )
  }
}
export default Gallery