<!-- 设备总览 -->
<template>
  <div class="main-container">
    <div class="row1">
      <!-- <div class="box w-24.5%"><Health :loading="loading" /></div>
      <div class="box w-24.5%"><Run :loading="loading" /></div>
      <div class="box w-24.5%"><WeiBao /></div>
      <div class="box w-24.5%"><Info /></div> -->
      <div class="box w-15%"><Info /></div>

      <div class="box w-25%"><Health :loading="loading" /></div>
      <div class="box w-25%"><Run :loading="loading" /></div>
      <div class="box w-33%"><WeiBao /></div>
    </div>
    <div class="row2">
      <div class="box w-32.5%"><Use :loading="loading" /></div>
      <div class="box w-33%"><Fault :loading="loading" /></div>
      <div class="box w-33%"><Closed :loading="loading" /></div>
    </div>
    <div class="row3">
      <div class="box w-32.5%"><Replace /></div>
      <div class="w-33% box-out">
        <div class="bg-white rd-8px w-100% h-49%"><DianJian /></div>
        <div class="bg-white rd-8px w-100% h-49%"><XunJian /></div>
      </div>
      <div class="box w-33%"><Calendar :loading="loading" /></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import Health from './components/Health.vue';
  import Run from './components/Run.vue';
  import WeiBao from './components/WeiBao.vue';
  import Info from './components/Info.vue';
  import Use from './components/Use.vue';
  import Fault from './components/Fault.vue';
  import Closed from './components/Closed.vue';
  import Replace from './components/Replace.vue';
  import DianJian from './components/DianJian.vue';
  import XunJian from './components/XunJian.vue';
  import Calendar from './components/Calendar.vue';
  import { ref } from 'vue';

  const loading = ref(true);
  setTimeout(() => {
    loading.value = false;
  }, 1500);
</script>
<style lang="less" scoped>
  .main-container {
    height: 100%;
    padding: 1rem;
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    // .row1,
    // .row2 {
    //   // margin: 0.5rem;
    // }
    .row1,
    .row2,
    .row3 {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .box {
        height: 100%;
        border-radius: 8px;
        background-color: white;
      }

      .box-out {
        display: flex;
        flex-wrap: wrap;
        align-content: space-between;
      }
    }

    .row1 {
      height: 27%;
    }

    .row2 {
      height: 30%;
    }

    .row3 {
      height: 40%;
    }
  }
</style>
