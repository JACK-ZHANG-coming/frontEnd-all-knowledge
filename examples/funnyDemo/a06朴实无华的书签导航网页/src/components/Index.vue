<script setup lang="ts">
import { ref } from 'vue'
import {ElButton} from 'element-plus'

const msg = ref('首页')
</script>

<template>
    <h1>{{ msg }}</h1>
    <el-button>123</el-button>
</template>


<style scoped>

</style>