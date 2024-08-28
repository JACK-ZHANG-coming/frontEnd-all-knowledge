<template>
  <div class="w-100% h-100% relative">
    <BoxHeader title="设备维保" />
    <div class="header-slot">
      <RadioGroup v-model:value="radio" size="small">
        <RadioButton value="year"> 年 </RadioButton>
        <RadioButton value="month"> 月 </RadioButton>
        <RadioButton value="week"> 周 </RadioButton>
        <RadioButton value="day"> 日 </RadioButton>
      </RadioGroup>
    </div>
    <div class="box-container">
      <div class="w-22% left-box">
        <div class="w-100% h-20% text-center">工单总数</div>
        <div class="w-100% h-35% text-center text-9 text-blue-500">0</div>
        <div class="w-100% h-5% text-center"> </div>
      </div>
      <div class="w-76% right-box">
        <div class="w-32% h-48% bg1">
          <div class="ml-4 mt-2">
            <div class="text-#fbf9fb text-14px">已提单</div>
            <div class="text-#fbf9fb mt-2 text-22px">0</div>
          </div>
        </div>
        <div class="w-32% h-48% bg2">
          <div class="ml-4 mt-2">
            <div class="text-#fbf9fb text-14px">已接单</div>
            <div class="text-#fbf9fb mt-2 text-22px">0</div>
          </div>
        </div>
        <div class="w-32% h-48% bg3">
          <div class="ml-4 mt-2">
            <div class="text-#fbf9fb text-14px">已挂起</div>
            <div class="text-#fbf9fb mt-2 text-22px">0</div>
          </div>
        </div>
        <!-- <div class="w-32% h-48% bg4">
          <div class="ml-4 mt-2">
            <div class="text-#fbf9fb text-14px">已处理</div>
            <div class="text-#fbf9fb mt-2 text-22px">0</div>
          </div>
        </div> -->
        <div class="w-32% h-48% bg5">
          <div class="ml-4 mt-2">
            <div class="text-#fbf9fb text-14px">已验收</div>
            <div class="text-#fbf9fb mt-2 text-22px">0</div>
          </div>
        </div>
        <div class="w-32% h-48% bg6">
          <div class="ml-4 mt-2">
            <div class="text-#fbf9fb text-14px">已关闭</div>
            <div class="text-#fbf9fb mt-2 text-22px">0</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import BoxHeader from './BoxHeader.vue';
  import { RadioButton, RadioGroup } from 'ant-design-vue';
  import { ref } from 'vue';
  import imgUrl from '@/assets/images/equipmentManagement/weibao_gongdan.png';

  const radio = ref<string>('year');
</script>
<style lang="less" scoped>
  .box-container {
    height: calc(100% - 30px);
    display: flex;
    justify-content: space-between;
    align-self: center;
    padding: 5px 5px 5px 10px;
    .left-box {
      display: flex;
      align-content: center;
      flex-wrap: wrap;
      // background-color: red;
      margin: 0.5% 0 2% 0;
      border-radius: 5px;
      box-shadow: 5px 5px 8px 2px #cccccc;
    }
    .right-box {
      display: flex;
      justify-content: start;
      align-content: space-between;
      flex-wrap: wrap;
    }
  }

  .header-slot {
    position: absolute;
    top: 2px;
    right: 5px;
  }
  .bg1 {
    background: url('@/assets/images/equipmentManagement/weibao_icon1.png') no-repeat;
    background-size: 100% 100%;
  }
  .bg2 {
    background: url('@/assets/images/equipmentManagement/weibao_icon2.png') no-repeat;
    background-size: 100% 100%;
  }
  .bg3 {
    background: url('@/assets/images/equipmentManagement/weibao_icon3.png') no-repeat;
    background-size: 100% 100%;
  }
  .bg4 {
    background: url('@/assets/images/equipmentManagement/weibao_icon4.png') no-repeat;
    background-size: 100% 100%;
  }
  .bg5 {
    background: url('@/assets/images/equipmentManagement/weibao_icon5.png') no-repeat;
    background-size: 100% 100%;
  }
  .bg6 {
    background: url('@/assets/images/equipmentManagement/weibao_icon6.png') no-repeat;
    background-size: 100% 100%;
  }
</style>
