<template>
  <!-- 14_src_shallowRef和shallowReactive -->
  <!--vue3的组件模版结构可以没有根标签-->
  <button @click="isShowDemo = !isShowDemo">{{ isShowDemo ? '隐藏' : '显示'}}</button>
  <Demo v-if="isShowDemo"/>
</template>

<script>
import Demo from "./components/Demo";
import { ref } from "vue";
export default {
  name: 'App',
  components: {Demo},
  setup(){
    let isShowDemo = ref(true);
    return {
      isShowDemo
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
