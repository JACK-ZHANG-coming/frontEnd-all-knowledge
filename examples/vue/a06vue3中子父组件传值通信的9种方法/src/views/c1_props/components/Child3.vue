<script setup lang="ts">
import { ref, onMounted } from 'vue'

const count = ref(0)

onMounted(() => {
  console.log('Child3加载完毕')
})
</script>

<template>
  <div class="main-child3">
    <div><b>我是旁白：</b></div>
    <hr />
    <div>
      <p>本场解说是vue3-props传参之王者英雄之战解说，以王者英雄战斗场景阐述了vue3使用props最全面的子父组件通信</p>
      <p></p>
      <p>重要知识点包含如下：</p>
      <p>1-父组件调用子组件函数</p>
      <p>2-父组件调用子组件参数</p>
      <p>3-子组件调用父组件函数</p>
      <p>4-子组件调用父组件参数</p>
      <p>5-子组件调用子组件函数</p>
      <p>6-子组件调用子组件参数</p>
      <hr />
      <p>ps:云樱必败，马可必胜</p>
      <p></p>
      <p></p>
      <p></p>
    </div>
  </div>
</template>

<style scoped>
.main-child3 {
  width: 100%;
  padding: 10px 80px;
  text-align: left;
  position: absolute;
  left: 0;
  bottom: 0;
}
</style>
