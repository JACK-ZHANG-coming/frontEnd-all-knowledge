<template>
  <div class="w-100% h-100%">
    <BoxHeader title="平均稼动率统计" />
    <div class="box-container">
      <div v-show="!loading" ref="OperationRateStatistics" class="w-100% h-100%"></div>
      <Loading :loading="loading" :absolute="true" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import BoxHeader from './BoxHeader.vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { Ref, ref, watch } from 'vue';
  import { OverviewGetActivation } from '@/api/equipmentManagement/equipmentOverviewTidy';
  import 'echarts-liquidfill/src/liquidFill.js'; // 在需要水滴图的页面js引入
  import { flitterObject } from '@/utils/simpleTools';
  import { Loading } from '@/components/Loading';

  // echarts.use([liquidFill] as any);
  const props = defineProps({
    queryParams: Object,
  });

  const loading = ref(false);
  const OperationRateStatistics = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(OperationRateStatistics as Ref<HTMLDivElement>);
  const chartValue = ref(0);

  const initChart = () => {
    let value = chartValue.value;
    setOptions({
      // backgroundColor: '#000737',
      title: [
        {
          text: '平均稼动率统计',
          // x: '38%',
          left: 'center',
          y: '84%',
          textStyle: {
            fontSize: 14,
            fontWeight: '100',
            color: '#000737',
            lineHeight: 16,
            textAlign: 'center',
          },
        },
      ],
      series: [
        {
          type: 'liquidFill',
          radius: '75%',
          center: ['50%', '45%'],
          color: [
            {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#446bf5',
                },
                {
                  offset: 1,
                  color: '#2ca3e2',
                },
              ],
              globalCoord: false,
            },
          ],
          data: [value, value], // data个数代表波浪数
          backgroundStyle: {
            borderWidth: 1,
            color: 'RGBA(51, 66, 127, 0.7)',
          },
          label: {
            normal: {
              textStyle: {
                fontSize: 35,
                color: '#fff',
              },
              formatter: function (params) {
                return (params.value * 100).toFixed(1) + '%';
              },
            },
          },
          outline: {
            // show: false
            borderDistance: 0,
            itemStyle: {
              borderWidth: 2,
              borderColor: '#F0FFFF',
            },
          },
        },
      ],
    } as any);
  };

  const queryChartData = () => {
    loading.value = true;
    chartValue.value = 0;
    let urlParams: any = {};
    urlParams = flitterObject(props.queryParams, ['isQuery']);
    OverviewGetActivation({}, urlParams)
      .then((res: any) => {
        chartValue.value = isNaN(res) ? 0 : res;
        loading.value = false;
        initChart();
      })
      .catch(() => {
        loading.value = false;
        chartValue.value = 0;
        initChart();
      });
  };

  watch(
    () => props.queryParams,
    (val: any) => {
      if (val.isQuery) {
        // 初始化数据
        queryChartData();
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
    // #OperationRateStatistics {
    //   width: 100%;
    //   height: 100%;
    // }
  }
</style>
