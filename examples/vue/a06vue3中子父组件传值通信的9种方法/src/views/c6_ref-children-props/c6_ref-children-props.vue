<script setup lang="ts">
import { ref } from "vue";

defineProps<{ msg: string }>();

const count = ref(0);
</script>

<template>
  <h1>c6_ref-children-props{{ msg }}</h1>
</template>

<style scoped></style>
