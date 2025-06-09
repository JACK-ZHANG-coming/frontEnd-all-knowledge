<script setup lang="ts">
import img_github from '@/assets/github.png'

const githubLink =
  'https://github.com/JACK-ZHANG-coming/frontEnd-all-knowledge/tree/master/examples/funnyDemo/a09vue3%E9%AB%98%E6%80%A7%E8%83%BDpdf%E9%A2%84%E8%A7%88%E5%99%A8'
const handleClick = (file: string = '') => {
  const url = `${window.document.location.origin}/pdfView?file=${file}`
  window.open(url)
}
</script>

<template>
  <main style="text-align: center; position: relative; padding: 20px">
    <a
      style="display: inline-block; position: absolute; top: 10px; right: 20px"
      :href="githubLink"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img width="40px" :src="img_github" :href="''" alt="GitHub" />
    </a>
    <h3>Welcome to Vue 3 PDF Previewer</h3>
    <hr style="margin: 20px 0" />
    <el-button @click="handleClick('测试pdf文件1.pdf')">打开测试pdf1</el-button>
    <span style="margin: 0 10px"></span>
    <el-button @click="handleClick('阮一峰es6入门(第三版)新版-非商用.pdf')">打开测试pdf2</el-button>
  </main>
</template>

<style scoped></style>
