<script setup lang="ts">
import { onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { DemoApi, JrjUtils, demoCom, Jrjobject } from 'demo-component/lib/index'
import { tempObj, tempJrjObject, tempJrjObjectGroup, tempSelectObj, tempSelectArr } from '../mock/defaultData'

onMounted(() => {
  JrjUtils.AutoAdaptDpi()
})

const fullScreen = () => {
  JrjUtils.FullScreen()
}

const getIp = () => {
  ElMessage({
    message: 'ip:' + JrjUtils.getIp(0),
    type: 'success'
  })
}

const objToJrjObject = () => {
  console.log('当前obj:', tempObj)
  console.log('转换之后的jrjObject:', JrjUtils.dataStructureConversion(tempObj))
  ElMessage({
    message: 'objToJrjObject转换成功，详细信息见控制台',
    type: 'success'
  })
}

const jrjObjectToObj = () => {
  console.log('当前jrjObject:', tempJrjObject)
  console.log('转换之后的obj:', JrjUtils.dataStructureConversion(tempJrjObject))
  ElMessage({
    message: 'jrjObjectToObj转换成功，详细信息见控制台',
    type: 'success'
  })
}

const getSingleJrjObject = () => {
  console.log('当前组合的JrjObject对象:', tempJrjObjectGroup)
  console.log('获取类为MesMaintainListTemplate的对象为:', JrjUtils.splitObj(tempJrjObjectGroup as Jrjobject, 'MesMaintainListTemplate'))
  ElMessage({
    message: '获取单个JrjObject对象成功，详细信息见控制台',
    type: 'success'
  })
}

const objToSelectArr = () => {
  console.log('当前字典对象:', tempSelectObj)
  console.log('转换完的:', JrjUtils.objToSelectArr(tempSelectObj))
  ElMessage({
    message: '对象字典转select数组，详细信息见控制台',
    type: 'success'
  })
}

const selectArrToObj = () => {
  console.log('当前select数组对象:', tempSelectArr)
  console.log('转换完的:', JrjUtils.selectArrToObj(tempSelectArr))
  ElMessage({
    message: 'select数组转对象字典成功，详细信息见控制台',
    type: 'success'
  })
}
</script>

<template>
  <div class="my-app">
    <h3>组件测试</h3>
    <div class="content">
      <el-button @click="fullScreen">点击全屏</el-button>
      <el-button @click="getIp">获取当前ip</el-button>
      <div style="margin-top: 10px"></div>
      <el-button @click="objToJrjObject">数据结构转换ObjToJrjObject</el-button>
      <el-button @click="jrjObjectToObj">数据结构转换JrjObjectToObj</el-button>
      <el-button @click="getSingleJrjObject">提取单个JrjObject对象</el-button>
      <div style="margin-top: 10px"></div>
      <el-button @click="objToSelectArr">对象字典转select数组</el-button>
      <el-button @click="selectArrToObj">select数组转对象字典</el-button>
    </div>
    <div>{{ JrjUtils.getIp(0) }}</div>
    <div>{{ new Date() }}</div>
  </div>
</template>

<style scoped>
.my-app {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  .content {
    padding: 50px 20px 20px;
  }
}
</style>
