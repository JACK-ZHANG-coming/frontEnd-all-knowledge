<script setup lang="ts">
import { reactive } from 'vue'

const data = reactive({})
</script>

<template>
  <div><b>我是子组件1友方马可波罗</b></div>
  <br />
  <div>当前血量:<b></b></div>
  <div>4-俺看到的父组件蔡文姬的血量(子组件调用父组件参数)：<b></b></div>
  <div>6-俺看到的子组件2敌方云樱的血量(子组件1调用子组件2参数)：<b></b></div>
  <el-button>5-俺攻击一下子组件2敌方英雄云樱(子组件1调用调用子组件2函数)</el-button>
</template>

<style scoped></style>
