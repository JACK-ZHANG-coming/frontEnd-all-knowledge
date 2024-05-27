<script setup lang="ts">
import { ref } from 'vue'
import ChildComponents from './Child.vue'
const list = ref(['JavaScript', 'HTML', 'CSS'])
</script>
<template>
  <!-- 父组件 -->
  <ul class="parent list-group">
    <li class="list-group-item" v-for="i in list" :key="i">{{ i }}</li>
  </ul>
  <!-- 子组件 -->
  <child-components v-model:list="list"></child-components>
</template>
<style>
/* 子组件样式 */
.child-wrap {
  width: 50%;
  margin: 20px auto 0;
  border: 2px solid #3498db; /* 浅蓝色边框 */
  background-color: #ecf0f1; /* 浅蓝色背景 */
  padding: 10px;
  border-radius: 10px;
}

.child-wrap input {
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  height: 40px; /* 输入框高度 */
  padding: 10px; /* 输入框内边距 */
}

.child-wrap button {
  border-radius: 4px;
  border: none;
  background-color: #3498db; /* 浅蓝色 */
  color: #fff;
  height: 40px; /* 按钮高度 */
  padding: 0 20px; /* 按钮内边距 */
}
</style>
