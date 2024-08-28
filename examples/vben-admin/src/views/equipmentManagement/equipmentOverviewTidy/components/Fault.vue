<template>
  <div class="w-100% h-100% relative">
    <BoxHeader title="故障排名" />
    <div class="header-slot">
      <RadioGroup v-model:value="radioTimePeriod" @change="queryChartData" size="small">
        <RadioButton :value="3"> 年 </RadioButton>
        <RadioButton :value="2"> 月 </RadioButton>
        <RadioButton :value="1"> 周 </RadioButton>
        <RadioButton :value="0"> 日 </RadioButton>
      </RadioGroup>
    </div>
    <div class="box-container">
      <div
        v-show="!loading && chartData.xData.length > 0"
        ref="faultEcharts"
        class="w-100% h-100%"
      ></div>
      <Empty v-show="!loading && chartData.xData.length === 0" :image="simpleImage" />
      <Loading :loading="loading" :absolute="true" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import BoxHeader from './BoxHeader.vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { Ref, ref, watch, computed } from 'vue';
  import { RadioButton, RadioGroup, Empty, Spin } from 'ant-design-vue';
  import { OverviewGetFaultRank } from '@/api/equipmentManagement/equipmentOverviewTidy';
  import { flitterObject, formatSeconds } from '@/utils/simpleTools';
  import { Loading } from '@/components/Loading';

  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

  const radioTimePeriod = ref<0 | 1 | 2 | 3>(3); // 0: 日 1: 周 2: 月 3: 年

  const props = defineProps({
    queryParams: Object,
  });

  const loading = ref(false);
  const faultEcharts = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(faultEcharts as Ref<HTMLDivElement>);
  const chartData = ref<any>({
    xData: [],
    yData: [],
  });

  const initChart = () => {
    const colorList = [
      'rgba(211, 68, 53, 1)',
      'rgba(228, 133, 48, 1)',
      'rgba(231, 185, 44, 1)',
      'rgba(23, 165, 213, 1)',
      'rgba(10, 190, 137, 1)',
      '#fab27b',
      '#e690d1',
      '#91c7ae',
      '#749f83',
      '#2a5caa',
      '#444693',
      '#726930',
      '#b2d235',
    ];
    // 数据整理
    // let xData = ['类别xxx1', '类xx别2', '1类别3', '类别4', '类别5', '类别6'];
    // let yData = [454, 254, 211, 154, 121, 111];
    let xData = chartData.value.xData;
    let yData = chartData.value.yData;
    let max = yData.length > 0 ? Math.max(...yData) : 100;
    // max = 10000000; // 临时测试加
    let flag = false;
    if (max == 0) {
      flag = true;
      max = 100;
    }
    let emptyData = yData.map((v, i) => {
      let color = i > colorList.length - 1 ? colorList[0] : colorList[i];

      let item: any = {
        value: max,
        label: {
          position: 'right',
          distance: 0,
          rich: {
            c: {
              color: color,
              padding: [0, 0, 2, 10],
              width: 60,
              height: 18,
              align: 'left',
              verticalAlign: 'middle',
              // backgroundColor: hexToRgba(color, 0.05)
            },
            a1: {
              color: '#fff',
              backgroundColor: colorList[0],
              width: 20,
              height: 20,
              align: 'center',
              borderRadius: 10,
            },
            a2: {
              color: '#fff',
              backgroundColor: colorList[1],
              width: 20,
              height: 20,
              align: 'center',
              borderRadius: 10,
            },
            a3: {
              color: '#fff',
              backgroundColor: colorList[2],
              width: 20,
              height: 20,
              align: 'center',
              borderRadius: 10,
            },
            b: {
              color: '#fff',
              backgroundColor: colorList[3],
              width: 20,
              height: 20,
              align: 'center',
              borderRadius: 10,
            },
          },
          formatter: function (params) {
            return ['{c|' + formatSeconds(v) + '}'];

            // console.log(params);
            // let index = i + 1;
            // if (index < 4) {
            //   return ['{c|' + v + '}' + '{a' + index + '|' + index + '}'];
            // } else {
            //   return ['{c|' + v + '}'];
            // }
          },
        },
      };
      return item;
    });

    const xDataFormat = xData.map((v, i) => {
      return v;
    });

    setOptions({
      grid: {
        top: '5%',
        left: '3%',
        right: '15%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'value',
          splitLine: {
            show: false,
          },

          axisLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          type: 'category',
          inverse: true,

          name: '',
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {},
          data: xDataFormat,
        },
        {
          type: 'category',
          name: '',
          inverse: true,

          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          data: xData,
        },
      ],
      series: [
        {
          type: 'bar',
          barWidth: 10,
          yAxisIndex: 1,
          itemStyle: {
            borderRadius: [0, 6, 6, 0],
            color: 'rgba(225,225,225,0.4)',
          },
          label: {
            show: true,
            position: 'right',
          },
          data: emptyData,
        },
        {
          type: 'bar',
          barWidth: 10,
          zlevel: 1,
          itemStyle: {
            borderRadius: [10, 10, 10, 10],
          },
          data: yData.map((item, i) => {
            let itemStyle: any = {};
            itemStyle.color = i > colorList.length - 1 ? colorList[0] : colorList[i];
            return {
              value: item,
              itemStyle: itemStyle,
            };
          }),
        },
      ],
    });
  };

  const queryChartData = () => {
    loading.value = true;
    chartData.value.xData = [];
    chartData.value.yData = [];
    let urlParams: any = {};
    urlParams = flitterObject(props.queryParams, ['isQuery']);
    urlParams['timePeriod'] = radioTimePeriod.value;
    OverviewGetFaultRank({}, urlParams)
      .then((res: any) => {
        res &&
          res.forEach((item) => {
            chartData.value.xData.push(item.status);
            chartData.value.yData.push(item.num);
          });
        loading.value = false;
        initChart();
      })
      .catch(() => {
        loading.value = false;
        chartData.value.xData = [];
        chartData.value.yData = [];
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

  .header-slot {
    position: absolute;
    top: 2px;
    right: 5px;
  }
</style>
