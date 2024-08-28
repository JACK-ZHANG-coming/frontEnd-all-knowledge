<template>
  <div class="w-100% h-100%">
    <BoxHeader title="运行情况" />
    <div class="box-container">
      <div ref="runEcharts" class="w-100% h-100%"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import BoxHeader from './BoxHeader.vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { Ref, ref, watch } from 'vue';

  const props = defineProps({
    loading: Boolean,
  });
  const runEcharts = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(runEcharts as Ref<HTMLDivElement>);
  watch(
    () => props.loading,
    () => {
      if (props.loading) {
        return;
      }
      setOptions({
        tooltip: {
          trigger: 'item',
        },
        legend: {
          bottom: '1%',
          left: 'center',
        },
        series: [
          {
            color: ['#5ab1ef', '#b6a2de', '#67e0e3', '#2ec7c9'],
            name: '设备状态',
            type: 'pie',
            radius: '70%',
            center: ['50%', '45%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 2,
              borderColor: '#fff',
              borderWidth: 2,
            },

            label: {
              show: true,
              formatter: function (params) {
                return params.percent + '%';
              },
            },
            labelLine: {
              show: true,
              length: 10,
              length2: 20,
              lineStyle: {
                // color: '#fff', // lineStyle不设置颜色，gap才能是透明的
                width: 1,
                type: 'solid',
              },
            },
            emphasis: {},

            data: [
              { value: 1048, name: '运行' },
              { value: 735, name: '待机' },
              { value: 580, name: '关机' },
            ],
            animationType: 'scale',
            animationEasing: 'exponentialInOut',
            animationDelay: function () {
              return Math.random() * 100;
            },
          },
        ],
      });
    },
    { immediate: true },
  );
</script>
<style lang="less" scoped>
  .box-container {
    height: calc(100% - 30px);
    // #runEcharts {
    //   width: 100%;
    //   height: 100%;
    // }
  }
</style>
