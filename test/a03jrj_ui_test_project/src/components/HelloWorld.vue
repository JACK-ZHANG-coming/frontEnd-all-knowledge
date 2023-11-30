<script setup lang="ts">
import { ref } from 'vue'
const header = ref('测试组件')
</script>

<template>
  <div class="HelloWorld">
    <div class="header">
      {{ header }}
    </div>
    <div class="content">111</div>
  </div>
</template>

<style scoped lang="scss">
$headerHeight: 30px;
.HelloWorld {
  height: 100%;
  width: 100%;
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: $headerHeight;
    border: 1px solid black;
  }
  .content {
    width: 100%;
    height: calc(100vh - $headerHeight);
    border: 1px solid yellowgreen;
  }
}
</style>
