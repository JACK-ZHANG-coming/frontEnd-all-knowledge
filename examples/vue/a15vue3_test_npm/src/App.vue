<script setup lang="ts">
import { onMounted } from 'vue'
import { DemoApi, JrjUtils, demoCom } from 'demo-component/lib/index'

onMounted(() => {
  JrjUtils.AutoAdaptDpi(true)
})

const fullScreen = () => {
  JrjUtils.FullScreen()
}
</script>

<template>
  <div class="my-app">
    <h3>组件测试</h3>
    <div class="content">
      <el-button @click="fullScreen">点击全屏</el-button>
    </div>
    <!-- <demo-com></demo-com> -->
  </div>
</template>

<style scoped>
.my-app {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  .content{
    padding: 20px;
  }
}
</style>
