<script setup lang="ts">
const handleClick = (file: string = '') => {
  const url = `${window.document.location.origin}/pdfView?file=${file}`
  window.open(url)
}
</script>

<template>
  <main style="text-align: center; padding: 20px">
    <h3>Welcome to Vue 3 PDF Previewer</h3>
    <hr style="margin: 20px 0" />
    <el-button @click="handleClick('测试pdf文件1.pdf')">打开测试pdf1</el-button>
    <span style="margin: 0 10px"></span>
    <el-button @click="handleClick('阮一峰es6入门(第三版)新版-非商用.pdf')">打开测试pdf2</el-button>
  </main>
</template>

<style scoped></style>
