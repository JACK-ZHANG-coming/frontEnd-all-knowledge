<template>
  <!-- 22_src_vue3事件与回调函数传额外参数 -->
  <!--vue3的组件模版结构可以没有根标签-->
  <h1>我是app组件</h1>
  <button @click="handleClick($event, 111)">事件函数传递额外自定义参数</button>
  <button @click="callCallback">
    回调函数传递额外自定义参数
  </button>
</template>

<script>
import { ref, onMounted } from 'vue'
export default {
  name: 'App',
  setup() {
    const callback = ref(null) // 初始化回调函数

    const callCallback = () => {
      if (callback.value) {
        callback.value() // 调用回调函数
      }
    }

    const handleClick = (eventValue, cuntomValue) => {
      console.log('handleClick:', eventValue, cuntomValue)
    }

    const handleCallback = (a, b, customValue) => {
      console.log('handleCallback:', a, b, customValue)
    }

    // 在组件挂载后，设置回调函数
    onMounted(() => {
      callback.value = () => {
        console.log('回调函数被调用了！')
        // 在这里执行你想要的逻辑

        return { a: 1, b: 2 }
      }
    })

    //返回一个对象
    return {
      handleClick,
      callCallback,
      handleCallback
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
