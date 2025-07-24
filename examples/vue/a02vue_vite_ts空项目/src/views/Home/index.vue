<script setup lang="ts" name="Home">
import { ref } from 'vue'
import { ElButton } from 'element-plus'
import axios from 'axios'
// import UAParser from 'ua-parser-js'

const msg = ref('首页')

const reMark = async () => {
  // const parser = new UAParser()
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  const networkInfo = connection
    ? {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      }
    : {}
  const screenInfo = {
    width: window.screen.width,
    height: window.screen.height,
    devicePixelRatio: window.devicePixelRatio
  }
  const param: any = {
    projectName: 'test',
    otherInfo: {
      networkInfo,
      screenInfo
    }
  }
  param.otherInfo = JSON.stringify(param.otherInfo)
  console.log('param', param)
  await axios
    .post('http://127.0.0.1:7501/api/v1/maidianInfo/recordMark', param)
    // .post('http://116.198.200.217:7501/api/v1/maidianInfo/recordMark', param)
    .then(response => {
      console.log('响应数据:', response)
    })
    .catch(error => {
      console.error('请求出错:', error)
    })
}

reMark()
setInterval(() => {
  reMark()
}, 10000)
</script>

<template>
  <h1>{{ msg }}</h1>
  <el-button @click="reMark">123</el-button>
</template>

<style scoped></style>
