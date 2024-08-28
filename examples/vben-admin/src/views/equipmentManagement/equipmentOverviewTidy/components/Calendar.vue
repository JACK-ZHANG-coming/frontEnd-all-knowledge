<template>
  <div class="w-100% h-100% relative">
    <BoxHeader title="维保日历" />
    <div class="header-slot">
      <MonthPicker v-model:value="currentMonth" :size="'small'" :format="monthFormat" />
      <CaretLeftFilled @click="preMonth" />
      <CaretRightFilled @click="nextMonth" />
      <div></div>
      <div></div>
    </div>

    <div class="box-container">
      <div ref="faultEcharts" class="w-100% h-100%"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import BoxHeader from './BoxHeader.vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { Ref, ref, watch, computed } from 'vue';
  import { MonthPicker } from 'ant-design-vue';
  import * as echarts from 'echarts';
  import { CaretRightFilled, CaretLeftFilled } from '@ant-design/icons-vue';
  import dayjs, { Dayjs } from 'dayjs';

  const monthFormat = 'YYYY-MM';
  const preMonth = () => {
    let current = new Date(JSON.parse(JSON.stringify(currentMonth.value))); // 当前日期

    current.setMonth(current.getMonth() - 1); // 设置为下个月
    let m = current.getMonth() + 1 < 10 ? '0' + (current.getMonth() + 1) : current.getMonth() + 1;
    // console.log();
    currentMonth.value = dayjs(current.getFullYear() + '-' + m, monthFormat);
  };
  const nextMonth = () => {
    let current = new Date(JSON.parse(JSON.stringify(currentMonth.value))); // 当前日期

    current.setMonth(current.getMonth() + 1); // 设置为下个月
    let m = current.getMonth() + 1 < 10 ? '0' + (current.getMonth() + 1) : current.getMonth() + 1;
    // console.log();
    currentMonth.value = dayjs(current.getFullYear() + '-' + m, monthFormat);
  };
  const currentMonth = ref<Dayjs>(dayjs('2024-07', monthFormat));
  // value3.value = '2024-07';
  const props = defineProps({
    loading: Boolean,
  });
  const faultEcharts = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(faultEcharts as Ref<HTMLDivElement>);
  const cellSize = [45, 30];
  const pieRadius = 14;
  function getVirtualData() {
    const date = +echarts.time.parse('2024-07-01');
    const end = +echarts.time.parse('2024-08-01');
    const dayTime = 3600 * 24 * 1000;
    const data: any = [];
    for (let time = date; time < end; time += dayTime) {
      data.push([
        echarts.time.format(time, '{yyyy}-{MM}-{dd}', false),
        Math.floor(Math.random() * 10000),
      ]);
    }
    return data;
  }
  const scatterData = getVirtualData();
  const pieSeries = scatterData.map(function (item, index) {
    return {
      type: 'pie',
      id: 'pie-' + index,
      center: item[0],
      radius: pieRadius,
      coordinateSystem: 'calendar',
      label: {
        show: false,
        formatter: '{c}',
        position: 'inside',
      },

      data: [
        { name: '维修', value: Math.round(Math.random() * 24) },
        { name: '保养', value: Math.round(Math.random() * 24) },
        { name: '点检', value: Math.round(Math.random() * 24) },
        { name: '巡检', value: Math.round(Math.random() * 24) },
      ],
    };
  });
  watch(
    () => props.loading,
    () => {
      if (props.loading) {
        return;
      }
      setOptions({
        // grid: {
        //   top: '2%',
        //   left: '3%',
        //   right: '20%',
        //   bottom: '3%',
        //   // containLabel: true,
        // },
        tooltip: {},
        legend: {
          data: ['维修', '保养', '点检', '巡检'],
          top: 0,
          right: '5%',
          textStyle: {
            fontSize: 12,
          },
        },
        calendar: {
          top: '20%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          // height: '100%',

          // left: 'right',
          orient: 'vertical',
          // width: '100%',
          cellSize: cellSize,
          yearLabel: {
            show: false,
            fontSize: 12,
          },
          dayLabel: {
            margin: 3,
            firstDay: 1,
            nameMap: ['日', '一', '二', '三', '四', '五', '六', '日'],
            fontSize: 12,
            color: '#666666',
          },
          monthLabel: {
            show: false,
          },
          range: ['2024-07'],
        },
        series: [
          {
            id: 'label',
            type: 'scatter',
            coordinateSystem: 'calendar',
            symbolSize: 0,
            label: {
              show: true,
              formatter: function (params: any): any {
                return echarts.time.format(params.value[0], '{dd}', false);
              },
              offset: [-cellSize[0] / 2 + 2, -cellSize[1] / 2 + 5],
              fontSize: 8,
            },
            data: scatterData,
          },
          ...pieSeries,
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
