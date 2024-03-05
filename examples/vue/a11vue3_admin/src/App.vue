<script setup lang="ts">
import { useRoute, useRouter, RouterView } from 'vue-router'

const route = useRoute()
window.addEventListener('unload', function () {
    // 在这里执行你想要的操作
    // 例如：清理资源、发送最终请求等
    localStorage.setItem('test', new Date().toString())
});
</script>

<template>
  <div class="main_box">
    <RouterView v-slot="{ Component }">
      <component :is="Component" :key="route.name" />
    </RouterView>
  </div>
</template>

<style scoped lang="scss">
.main_box {
  height: 100%;
}
</style>
