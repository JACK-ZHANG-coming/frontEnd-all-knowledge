<template>
  <div class="w-100% h-100%">
    <BoxHeader title="已接入设备总数" />
    <div class="box-container">
      <div class="w-100% flex justify-center items-center">
        <!-- <Icon icon="ant-design:control-outlined" :size="45" /> -->
        <!-- <img :src="deviceCountImg" style="width: 55px; height:55px; margin-right: 5%" /> -->
        <div>
          <CountTo color="#3b82f6" :startVal="0" :endVal="150" class="text-5xl" />
          <span class="text-2xl color-#666666"> 台</span>
        </div>
      </div>
      <!-- <Empty style="margin-top: 40px" :image="simpleImage" /> -->
    </div>
  </div>
</template>
<script lang="ts" setup>
  import BoxHeader from './BoxHeader.vue';
  import Icon from '@/components/Icon/Icon.vue';

  import { CountTo } from '@/components/CountTo';

  import { Empty, Card, Row, Col } from 'ant-design-vue';
  import deviceCountImg from '@/assets/images/equipmentManagement/deviceCount.png';

  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
</script>
<style lang="less" scoped>
  .box-container {
    display: flex;
    justify-content: center;
    height: calc(100% - 30px);
    // min-height: 160px;
  }
</style>
