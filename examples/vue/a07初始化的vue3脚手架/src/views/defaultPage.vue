<script setup lang="ts">
import { useRouter } from 'vue-router'
import { House } from '@element-plus/icons-vue'

const router = useRouter()

function goIndex() {
  router.push('/index')
}
</script>

<template>
  <div class="container">
    <img src="../assets/picture/common/404.png" alt="" class="img" />
    <div class="text">当前页面不存在</div>
    <el-link type="primary" :icon="House" @click="goIndex">回到首页</el-link>
  </div>
</template>

<style scoped lang="scss">
.container {
  text-align: center;
  .img {
    height: calc(100vh - 130px);
  }
  .text {
    font-size: 24px;
    margin-bottom: 10px;
  }
}
</style>
