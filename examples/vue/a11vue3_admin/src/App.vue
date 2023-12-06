<script setup lang="ts">
import { useRoute, useRouter, RouterView } from 'vue-router'

const route = useRoute()
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
