<!-- 06_src_setup的两个注意点 -->
<template>
  <!--vue3的组件模版结构可以没有根标签-->
  <Demo @hello="showHelloMsg" msg="hello" school="wust">
    <!-- 
      v-slot 后面是跟的名字，然后在子组件里面可以用 <slot name="qwe"></slot> 的形式去调用
     -->
    <template v-slot:qwe>
      没事
    </template>
    <template v-slot:asd>
      love you
    </template>
  </Demo>
</template>

<script>
import Demo from "./components/Demo";
export default {
  name: 'App',
  components: {Demo},
  setup(){
    return {
      showHelloMsg(value){
        alert(`你好,${value}`);
      }
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
