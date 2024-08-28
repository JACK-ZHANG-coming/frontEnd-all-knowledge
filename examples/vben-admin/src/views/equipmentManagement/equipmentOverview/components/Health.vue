<template>
  <div class="w-100% h-100%">
    <BoxHeader title="设备健康" />
    <div class="box-container">
      <div ref="healthEcharts" class="w-100% h-100%"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import BoxHeader from './BoxHeader.vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { Ref, ref, watch, computed } from 'vue';

  const props = defineProps({
    loading: Boolean,
  });
  const healthEcharts = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(healthEcharts as Ref<HTMLDivElement>);

  const data = [
    { value: 120, name: '正常', color: '#00EB47' }, // 第一个数据点，值为 20，颜色为红色
    { value: 29, name: '亚健康', color: '#FFC600' }, // 第二个数据点，值为 30，颜色为绿色
    { value: 20, name: '故障', color: '#FF604C' }, // 第二个数据点，值为 30，颜色为绿色
    { value: 20, name: '未知', color: '#00F2DD' }, // 第二个数据点，值为 30，颜色为绿色
  ];
  const maxData = computed(() => {
    let sum = 0,
      max = 0;
    data.forEach((item: any) => {
      sum = sum + item.value;
      if (max < item.value) {
        max = item.value;
      }
    });
    return max;
  });
  watch(
    () => props.loading,
    () => {
      if (props.loading) {
        return;
      }
      setOptions({
        grid: {
          left: '15%',
          right: '18%',
          bottom: '8%',
          top: '7%',
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
            max: maxData,
            type: 'value',
            show: false,
          },
        ],
        yAxis: [
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
            data: data.map((item) => ({
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
        series: [
          {
            name: '',
            type: 'bar',
            barWidth: 10, // Width of the bar
            // MaxSize: 0,
            showBackground: true,
            yAxisIndex: 0,
            borderRadius: [50, 50, 50, 50],
            backgroundStyle: {
              borderRadius: 5,
            },
            label: {
              show: false,
            },
            itemStyle: {
              borderRadius: [50, 50, 50, 50],
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
              },
            },
            data: data.map((item) => ({
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
