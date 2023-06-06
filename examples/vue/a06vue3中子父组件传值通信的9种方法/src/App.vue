<script setup lang="ts">
import { useRouter } from "vue-router";
let $router = useRouter();
</script>

<template>
  <h3>vue3中子父组件传值通信的9种方法</h3>
  <el-space>
    <el-button @click="$router.push('/home')">首页</el-button>
    <el-button @click="$router.push('/c01_props')">01props</el-button>
    <el-button @click="$router.push('/c02_custom_event')"
      >02自定义事件</el-button
    >
  </el-space>
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
  <router-view></router-view>
</template>

<style lang="scss"></style>
