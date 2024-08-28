<template>
  <div class="w-100% h-100%">
    <BoxHeader title="巡检情况" />
    <div class="box-container">
      <div class="box">
        <div class="w-100% h-20% text-center">任务完成率</div>
        <div class="w-100% h-45% text-center text-8 text-orange-600">2%</div>
        <div class="w-100% h-5% text-center text-#666666 text-12px">完成数量：23 </div>
      </div>
      <div class="box">
        <div class="w-100% h-42% text-center">
          <img :src="xSumImg" style="width: 40px; height: 40px" />
        </div>
        <div class="w-100% h-22% text-center text-12px text-#666666">巡检单总数</div>
        <div class="w-100% h-30% text-center text-22px text-#45abff">759</div>
      </div>
      <div class="box">
        <div class="w-100% h-42% text-center">
          <img :src="okImg" style="width: 40px; height: 40px" />
        </div>
        <div class="w-100% h-22% text-center text-12px text-#666666">已完成数</div>
        <div class="w-100% h-30% text-center text-22px text-#c061e7">759</div>
      </div>
      <div class="box">
        <div class="w-100% h-42% text-center">
          <img :src="weiImg" style="width: 40px; height: 40px" />
        </div>
        <div class="w-100% h-22% text-center text-12px text-#666666">未完成数</div>
        <div class="w-100% h-30% text-center text-22px text-#6a6a6a">759</div>
      </div>
      <div class="box">
        <div class="w-100% h-42% text-center">
          <img :src="timeImg" style="width: 40px; height: 40px" />
        </div>
        <div class="w-100% h-22% text-center text-12px text-#666666">平均时长</div>
        <div class="w-100% h-30% text-center text-22px text-#40d7c1">759</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import BoxHeader from './BoxHeader.vue';
  import xSumImg from '@/assets/images/equipmentManagement/x_sum.png';
  import okImg from '@/assets/images/equipmentManagement/dx_ok.png';
  import weiImg from '@/assets/images/equipmentManagement/dx_wei.png';
  import timeImg from '@/assets/images/equipmentManagement/dx_time.png';
</script>
<style lang="less" scoped>
  .box-container {
    height: calc(100% - 30px);
    display: flex;
    justify-content: space-between;
    padding: 5px 10px;
    .left-box {
      border-radius: 5px;
      box-shadow: 5px 5px 8px 2px #cccccc;
    }
    .box {
      width: 18%;
      display: flex;
      flex-wrap: wrap;
      align-content: center;
    }
  }
</style>
