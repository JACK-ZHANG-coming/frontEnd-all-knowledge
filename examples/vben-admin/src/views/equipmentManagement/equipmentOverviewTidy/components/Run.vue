<template>
  <div class="w-100% h-100%">
    <BoxHeader title="运行情况" />
    <div class="box-container">
      <div v-show="!loading" ref="runEcharts" class="w-100% h-100%"></div>
      <Loading :loading="loading" :absolute="true" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import BoxHeader from './BoxHeader.vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { Ref, ref, watch } from 'vue';
  import { OverviewGetDeviceRunningStatus } from '@/api/equipmentManagement/equipmentOverviewTidy';
  import { flitterObject } from '@/utils/simpleTools';
  import { Spin } from 'ant-design-vue';
  import { Loading } from '@/components/Loading';

  const props = defineProps({
    queryParams: Object,
  });

  const loading = ref(false);
  const runEcharts = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(runEcharts as Ref<HTMLDivElement>);
  const chartData = ref<any[]>([]);

  const initChart = () => {
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
          avoidLabelOverlap: true,
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

          data: chartData.value,
          animationType: 'scale',
          animationEasing: 'exponentialInOut',
          animationDelay: function () {
            return Math.random() * 100;
          },
        },
      ],
    });
  };

  const queryChartData = () => {
    loading.value = true;
    chartData.value = [];
    let urlParams: any = {};
    urlParams = flitterObject(props.queryParams, ['isQuery']);
    OverviewGetDeviceRunningStatus({}, urlParams)
      .then((res: any) => {
        res &&
          res.forEach((item) => {
            chartData.value.push({
              value: item.num,
              name: item.status,
            });
          });
        loading.value = false;
        initChart();
      })
      .catch(() => {
        loading.value = false;
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
    // #runEcharts {
    //   width: 100%;
    //   height: 100%;
    // }
  }
</style>
