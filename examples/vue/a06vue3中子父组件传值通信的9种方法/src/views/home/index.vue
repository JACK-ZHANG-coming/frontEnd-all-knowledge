<script setup lang="ts">
import { ref } from "vue";

defineProps<{ msg: string }>();

const count = ref(0);
</script>

<template>
  <h1>这是首页，点击上方按钮切换不同页面</h1>
</template>

<style scoped></style>
