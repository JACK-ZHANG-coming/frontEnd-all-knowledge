<template>
  <div class="w-100% h-100%">
    <BoxHeader title="设备健康" />
    <div class="box-container">
      <div v-show="!loading" ref="healthEcharts" class="w-100% h-100%"></div>
      <Loading :loading="loading" :absolute="true" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import BoxHeader from './BoxHeader.vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { flitterObject } from '@/utils/simpleTools';
  import { Ref, ref, watch, computed } from 'vue';
  import { OverviewGetDeviceHealth } from '@/api/equipmentManagement/equipmentOverviewTidy';
  import { Loading } from '@/components/Loading';

  const props = defineProps({
    queryParams: Object,
  });

  const loading = ref(false);
  const healthEcharts = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(healthEcharts as Ref<HTMLDivElement>);
  const chartData = ref<any[]>([]);
  const sumData = ref(0);

  const colorList = ['#00EB47', '#FFC600', '#FF604C', '#00F2DD'];

  const initChart = () => {
    setOptions({
      grid: {
        left: '7%',
        right: '8%',
        bottom: '15%',
        top: '20%',
        // containLabel: true,
      },
      tooltip: {
        show: false,
      },
      legend: {
        show: false,
      },
      xAxis: [
        {
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          type: 'category',
          axisTick: {
            show: false,
          },
          inverse: true,
          axisLabel: {
            show: false,
          },
        },
        {
          type: 'category',
          inverse: true,
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          show: true,
          axisLabel: {
            color: '#645f61',
            fontSize: 14,
            margin: 10,
            fontWeight: 500,
            formatter: function (value) {
              return value;
            },
            align: 'left', // Align the labels to the left
          },
          data: chartData.value.map((item) => ({
            value: item.value,
            name: item.name,
            itemStyle: {
              color: item.color, // Set color for each data point
            },
            label: {
              show: true,
              position: 'right', // Place the label on the right side of the bar
              formatter: '{b}', // Use the data item's name for label content
            },
          })),
        },
      ],
      yAxis: [
        {
          splitLine: {
            show: false,
          },
          max: sumData.value as any,
          type: 'value',
          show: false,
        },
      ],
      series: [
        {
          name: '',
          type: 'bar',
          barWidth: 30, // Width of the bar
          // MaxSize: 0,
          showBackground: true,
          yAxisIndex: 0,
          borderRadius: [10, 10, 10, 10],
          backgroundStyle: {
            borderRadius: 5,
          },
          label: {
            show: false,
          },
          itemStyle: {
            borderRadius: [10, 10, 10, 10],
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
            },
          },
          data: chartData.value.map((item) => ({
            value: item.value,
            name: item.name,
            itemStyle: {
              color: item.color, // Set color for each data point
            },
            label: {
              show: true,
              position: 'left', // Place the label on the right side of the bar
              formatter: '{b}', // Use the data item's name for label content
            },
          })),
        },
      ],
    } as any);
  };

  const queryChartData = () => {
    loading.value = true;
    chartData.value = [];
    sumData.value = 0;
    let urlParams: any = {};
    urlParams = flitterObject(props.queryParams, ['isQuery']);
    OverviewGetDeviceHealth({}, urlParams)
      .then((res: any) => {
        res &&
          res.forEach((item, index) => {
            chartData.value.push({
              value: item.num,
              name: item.status,
              color: colorList[index],
            });
            sumData.value = sumData.value + item.num;
          });
        chartData.value.reverse(); // 为了让第一个数据点在最上面
        loading.value = false;
        initChart();
      })
      .catch(() => {
        loading.value = false;
        sumData.value = 0;
        chartData.value = [];
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
  }
</style>
