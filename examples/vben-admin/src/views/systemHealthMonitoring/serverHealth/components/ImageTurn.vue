4 1 2 3 4 1 2 3 4 1 2 3 4 自动切换 定时切换下一张。 TS
<template>
  <div class="w-100% h-100%">
    <Carousel class="w-100% h-100%" autoplay>
      <!-- <div><h3>1</h3></div>
      <div><h3>2</h3></div> -->
      <div v-for="item in imageList" :key="item">
        <img :src="item" style="width: 100%; height: 100%; object-fit: cover" />
      </div>
    </Carousel>
  </div>
</template>
<script lang="ts" setup>
  import { Carousel, Card, Empty, Image, Popconfirm } from 'ant-design-vue';
  import { ref } from 'vue';
  import image1 from '@/assets/svg/systemHealthMonitoring/demo1.svg';
  import image2 from '@/assets/svg/systemHealthMonitoring/demo2.svg';
  import image3 from '@/assets/svg/systemHealthMonitoring/demo3.svg';

  const imageList = ref([image1, image2, image3]);
</script>
<style scoped>
  /* For demo */
  :deep(.slick-slide) {
    height: 100%;
    overflow: hidden;
  }
  :deep(.slick-slide h3) {
    color: #fff;
  }
  :deep(.slick-dots li.slick-active) {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    opacity: 1;
  }
  :deep(.slick-dots li) {
    width: 5px;
    height: 5px;
    border-radius: 50%;
  }
</style>
