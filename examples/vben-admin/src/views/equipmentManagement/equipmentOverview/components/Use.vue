<template>
  <div class="w-100% h-100%">
    <BoxHeader title="设备用途" />

    <div class="box-container">
      <div ref="usesEcharts" class="w-100% h-100%"></div>
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
  const usesEcharts = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(usesEcharts as Ref<HTMLDivElement>);
  let chartData = [
    {
      value: 5,
      name: '闲置',
      unit: '台',
    },
    {
      value: 73,
      name: '禁用',
      unit: '台',
    },
    {
      value: 11,
      name: '在用',
      unit: '台',
    },
    {
      value: 2,
      name: '废再利用',
      unit: '台',
    },
    {
      value: 2,
      name: '出租',
      unit: '台',
    },
  ];
  const center = ['50%', '50%'];
  const colorList = ['#9b1aff', '#e8c827', '#125bff', '#ff1a9b', '#1affa1', '#1afbff'];
  const sum = chartData.reduce((per, cur) => per + cur.value, 0);
  let unit = '';
  const gap = (1 * sum) / 100;
  const pieData1: any = [];
  const pieData2: any = [];
  const gapData = {
    silent: true,
    name: 'gap',
    value: gap,
    itemStyle: {
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
      color: 'transparent',
    },
  };
  for (let i = 0; i < chartData.length; i++) {
    if (!unit) unit = chartData[i].unit;
    // 第一圈数据
    pieData1.push({
      ...chartData[i],
    });
    pieData1.push(gapData);
    // 第二圈数据
    pieData2.push({
      ...chartData[i],
    });
    pieData2.push(gapData);
  }
  watch(
    () => props.loading,
    () => {
      if (props.loading) {
        return;
      }
      setOptions({
        tooltip: {
          show: true,
          backgroundColor: 'rgba(0, 0, 0,.8)',
          textStyle: {
            color: '#fff',
          },
          formatter: function (params) {
            if (params.name == 'gap') {
              return '';
            } else {
              return `${params.marker}${params.name}：${params.value}  占比:${params.percent}%`;
            }
          },
        },
        legend: {
          show: false,
        },
        grid: {
          // left: '15%',
          // right: '18%',
          bottom: '15%',
          top: '20%',
          // containLabel: true,
        },
        color: colorList,
        series: [
          {
            name: '',
            type: 'pie',
            // roundCap: true,

            radius: ['66%', '70%'],
            center: center,
            data: pieData1,
            labelLine: {
              show: true,
              length: 10,
              length2: 30,
              lineStyle: {
                // color: '#fff', // lineStyle不设置颜色，gap才能是透明的
                width: 1,
                type: 'solid',
              },
            },
            label: {
              // align: 'left',
              // padding: [0, -90, 0, -90],
              show: true,
              // position: 'outer',
              formatter: function (params) {
                if (params.name == 'gap') return '';
                return params.name + ' ' + params.value + unit;
                // return (
                //   '{name|' + params.name + params.value + unit + '占比' + params.percent + '%}'
                // );
              },
              rich: {
                name: {},
              },
            },
          },
          {
            type: 'pie',
            radius: '56%',
            center: center,

            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            silent: true,
            data: pieData2,
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
  }
</style>
