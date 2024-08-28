<template>
  <div class="w-100% h-100%">
    <BoxHeader title="设备用途" />

    <div class="box-container">
      <div v-show="!loading" ref="usesEcharts" class="w-100% h-100%"></div>
      <Loading :loading="loading" :absolute="true" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import BoxHeader from './BoxHeader.vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { Ref, ref, watch } from 'vue';
  import { Spin } from 'ant-design-vue';
  import { OverviewGetDeviceType } from '@/api/equipmentManagement/equipmentOverviewTidy';
  import { flitterObject } from '@/utils/simpleTools';
  import { Loading } from '@/components/Loading';

  const props = defineProps({
    queryParams: Object,
  });

  const loading = ref(false);
  const usesEcharts = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(usesEcharts as Ref<HTMLDivElement>);
  const chartData = ref<any[]>([]);

  // let chartData = [
  //   {
  //     value: 5,
  //     name: '闲置',
  //     unit: '台',
  //   },
  //   {
  //     value: 73,
  //     name: '禁用',
  //     unit: '台',
  //   },
  //   {
  //     value: 11,
  //     name: '在用',
  //     unit: '台',
  //   },
  //   {
  //     value: 2,
  //     name: '废再利用',
  //     unit: '台',
  //   },
  //   {
  //     value: 2,
  //     name: '出租',
  //     unit: '台',
  //   },
  // ];

  const initChart = () => {
    const center = ['50%', '50%'];
    const colorList = ['#9b1aff', '#e8c827', '#125bff', '#ff1a9b', '#1affa1', '#1afbff'];
    const sum =
      chartData.value.length > 0 ? chartData.value.reduce((per, cur) => per + cur.value, 0) : 0;
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
    for (let i = 0; i < chartData.value.length; i++) {
      if (!unit) unit = chartData.value[i].unit;
      // 第一圈数据
      pieData1.push({
        ...chartData.value[i],
      });
      pieData1.push(gapData);
      // 第二圈数据
      pieData2.push({
        ...chartData.value[i],
      });
      pieData2.push(gapData);
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
      // color: colorList,
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
  };

  const queryChartData = () => {
    loading.value = true;
    chartData.value = [];
    let urlParams: any = {};
    urlParams = flitterObject(props.queryParams, ['isQuery']);
    OverviewGetDeviceType({}, urlParams)
      .then((res: any) => {
        res &&
          res.forEach((item, index) => {
            chartData.value.push({
              value: item.num,
              name: item.status,
              unit: '台',
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
  }
</style>
