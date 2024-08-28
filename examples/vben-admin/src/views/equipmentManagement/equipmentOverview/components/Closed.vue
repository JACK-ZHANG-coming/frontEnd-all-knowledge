<template>
  <div class="w-100% h-100% relative">
    <BoxHeader title="停机排名" />
    <div class="header-slot">
      <RadioGroup v-model:value="radio" size="small">
        <RadioButton value="year"> 年 </RadioButton>
        <RadioButton value="month"> 月 </RadioButton>
        <RadioButton value="week"> 周 </RadioButton>
        <RadioButton value="day"> 日 </RadioButton>
      </RadioGroup>
    </div>
    <div class="box-container"><div ref="closedEcharts" class="w-100% h-100%"></div></div>
  </div>
</template>
<script lang="ts" setup>
  import BoxHeader from './BoxHeader.vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { Ref, ref, watch, computed } from 'vue';
  import { RadioButton, RadioGroup } from 'ant-design-vue';
  import { AnyNormalFunction } from 'packages/types/src';

  const radio = ref<string>('year');

  const props = defineProps({
    loading: Boolean,
  });
  const closedEcharts = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(closedEcharts as Ref<HTMLDivElement>);

  // 数据整理
  let xData = ['类别xxx1', '类xx别2', '1类别3', '类别4', '类别5', '类别6'];
  let yData = [454, 254, 211, 154, 121, 111];
  let max = Math.max(...yData);
  var colorList = [
    'rgba(211, 68, 53, 1)',
    'rgba(228, 133, 48, 1)',
    'rgba(231, 185, 44, 1)',
    'rgba(23, 165, 213, 1)',
  ];
  let labelColor = ['#FD5360', '#e48530', '#FFAA00'];
  let emptyData = yData.map((v, i) => {
    let color = i > 2 ? '#1890FF' : labelColor[i];

    let item = {
      value: max,
      label: {
        position: 'right',
        distance: 0,
        rich: {
          c: {
            color: color,

            padding: [0, 0, 2, 0],
            width: 60,
            height: 18,
            align: 'center',
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
          return ['{c|' + v + '}'];

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

  let xDataFormat = xData.map((v, i) => {
    return v;
  });

  watch(
    () => props.loading,
    () => {
      if (props.loading) {
        return;
      }
      setOptions({
        grid: {
          top: '5%',
          left: '3%',
          right: '5%',
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

            data: yData.map((item, i) => {
              let itemStyle: any = {};
              itemStyle.color = i < 3 ? colorList[i] : colorList[3];
              return {
                value: item,
                itemStyle: itemStyle,
              };
            }),
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

  .header-slot {
    position: absolute;
    top: 2px;
    right: 5px;
  }
</style>
