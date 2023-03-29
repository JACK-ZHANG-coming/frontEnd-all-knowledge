<script setup lang="ts">
import { ref } from 'vue'
import { ElButton } from 'element-plus'

let testValue = ref(0)
</script>

<template>
  <div>123---{{ testValue }}</div>
  <el-button @click="testValue++">Default</el-button>
</template>
