import React, { Component, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ReactPlayer from 'react-player'
import words from './data'
import './index.css'


const Present = props => {

  const [isStart, setIsStart] = useState(true)

  function randomNum(min, max) {
    var num = (Math.random() * (max - min + 1) + min).toFixed(2);
    return num;
  }

  const init = () => {
    let container = document.querySelector('.container');
    console.log('====', container);
    let f = document.createDocumentFragment();
    words.forEach(w => {
      let word_box = document.createElement('div');
      let word = document.createElement('div');
      word.innerText = w;
      word.classList.add('word');
      word.style.color = '#BAABDA';
      word.style.fontFamily = '楷体';
      word.style.fontSize = '20px'
      word_box.classList.add('word-box');
      word_box.style.setProperty("--margin-top", randomNum(-40, 20) + 'vh');
      word_box.style.setProperty("--margin-left", randomNum(6, 35) + 'vw');
      word_box.style.setProperty("--animation-duration", randomNum(8, 20) + 's');
      word_box.style.setProperty("--animation-delay", randomNum(-20, 0) + 's');

      word_box.appendChild(word);
      f.appendChild(word_box);


    })
    container.appendChild(f);
  }

  useEffect(() => {
    console.log('进入了这个页面');
    // document.getElementById('videofilm').innerHTML='<video src="./video/skystar.mp4" controls autoplay loop></video>'
    // 初始化旋转文字图层
    init();
    let textone = document.querySelector('.textone').querySelector('h1');
    let text = document.querySelector('.text').querySelector('h1');
    setTimeout(function () {
      textone.innerHTML = '今晚，整片星空将为你一人闪烁';
      textone.style.color = '#E8F9FD';
      textone.style.fontFamily = '楷体'
      text.innerHTML = '';
    }, 10000)
    setIsStart(false)
    setTimeout(() => {
      setIsStart(true)
    }, 1500)
    return
  },[])

  return (
    <>
      <div className="sky">
        <div className="videofilm">
          <ReactPlayer
            width={'auto'}
            height={'auto'}
            url={require('../七夕祝福网页/video/skystar.mp4').default}
            playing={isStart}
            loop={true}
            volume={0.5}
          // onReady={(e) => { console.log('准备好了', e); setIsStart(true) }}
          />
        </div>
        <div className="textone">
          <h1>look at the stars</h1>
        </div>
        <div className="text">
          <h1>look how they shine for u</h1>
        </div>

        <div className="container textContainer"></div>
      </div>
    </>
  )
}

export default Present;