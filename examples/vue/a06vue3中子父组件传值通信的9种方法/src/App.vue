<script setup lang="ts">
import { useRouter } from "vue-router";
let $router = useRouter();
</script>

<template>
  <h3>vue3中子父组件传值通信的9种方法</h3>
  <el-space>
    <el-button @click="$router.push('/home')">首页</el-button>
    <el-button @click="$router.push('/c1_props')">1props</el-button>
    <el-button @click="$router.push('/c2_custom_event')">2自定义事件</el-button>
    <el-button @click="$router.push('/c3_event-bus')">3_event-bus</el-button>
    <el-button @click="$router.push('/c4_v-model')">4_v-model</el-button>
    <el-button @click="$router.push('/c5_attrs-listeners')">5_attrs-listeners</el-button>
    <el-button @click="$router.push('/c6_ref-children-props')">6_ref-children-props</el-button>
    <el-button @click="$router.push('/c7_provide-inject')">7_provide-inject</el-button>
    <el-button @click="$router.push('/c8_pinia')">8_pinia</el-button>
    <el-button @click="$router.push('/c9_slot')">9_slot</el-button>
  </el-space>
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
  <router-view></router-view>
</template>

<style lang="scss"></style>
