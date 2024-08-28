<template>
  <div class="w-100% h-100%">
    <BoxHeader title="已接入设备总数" />
    <div class="box-container">
      <div v-show="!loading" class="w-100% flex justify-center items-center">
        <div>
          <CountTo
            color="#3b82f6"
            :startVal="0"
            :endVal="deviceValue"
            :duration="1000"
            class="text-5xl"
          />
          <span class="text-2xl color-#666666"> 台</span>
        </div>
      </div>
      <Loading :loading="loading" :absolute="true" />
      <!-- <Empty style="margin-top: 40px" :image="simpleImage" /> -->
    </div>
  </div>
</template>
<script lang="ts" setup>
  import BoxHeader from './BoxHeader.vue';
  import { OverviewGetDeviceInAccessNum } from '@/api/equipmentManagement/equipmentOverviewTidy';
  import { CountTo } from '@/components/CountTo';
  import { flitterObject } from '@/utils/simpleTools';
  import { Empty, Spin, Row, Col } from 'ant-design-vue';
  import { ref, watch } from 'vue';
  import { Loading } from '@/components/Loading';

  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

  const props = defineProps({
    queryParams: Object,
  });

  const loading = ref(false);
  const deviceValue = ref(0);

  const areOverviewGetDeviceInAccessNum = () => {
    let urlParams: any = {};
    urlParams = flitterObject(props.queryParams, ['isQuery']);
    loading.value = true;
    deviceValue.value = 0;
    OverviewGetDeviceInAccessNum({}, urlParams)
      .then((res) => {
        console.log('res', res);
        deviceValue.value = res || 0;
        loading.value = false;
      })
      .catch(() => {
        loading.value = false;
      });
  };

  watch(
    () => props.queryParams,
    (val: any) => {
      if (val.isQuery) {
        // 初始化数据
        areOverviewGetDeviceInAccessNum();
      }
    },
    {
      immediate: true,
      deep: true,
    },
  );
</script>
<style lang="less" scoped>
  .box-container {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    height: calc(100% - 30px);
    // min-height: 160px;
  }
</style>
