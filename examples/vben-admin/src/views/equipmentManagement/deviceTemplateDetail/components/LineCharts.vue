<template>
  <div class="w-100% h-100%">
    <div v-show="showEcharts" ref="faultEcharts" class="w-100% h-100%"></div>
    <div v-show="!showEcharts" class="flex items-center justify-center w-100% h-100%">
      <Empty :image="simpleImage" :description="description" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { useECharts } from '@/hooks/web/useECharts';
  import { Ref, ref, watch, computed } from 'vue';
  import { Input, Popover, Pagination, Empty } from 'ant-design-vue';

  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

  // import echarts from '@/utils/lib/echarts';
  const showEcharts = ref(false);
  const props = defineProps({
    echartsData: Object,
    title: String,
    unit: String,
    lineType: Array,
  });
  const description = ref('请先在左侧绑定 ' + props.title);

  const faultEcharts = ref<HTMLDivElement | null>(null);
  const { setOptions, echarts } = useECharts(faultEcharts as Ref<HTMLDivElement>);

  // 数据整理

  watch(
    [() => props.echartsData, () => props.lineType],

    () => {
      // console.log(props.lineType?.length, 'props.lineType', props.lineType, props.title);
      if (props.lineType?.length < 1) {
        showEcharts.value = false;
        description.value = '请先在左侧绑定 ' + props.title;
        // console.log(description.value, ' description.value');
        return;
      }
      if (!props.echartsData) {
        showEcharts.value = false;
        description.value = '该范围内无数据，请修改时间范围！';
        return;
      }
      showEcharts.value = true;
      let series: any = [];
      let color = ['#7FD5EB', '#5AB1EF', '#B6A2DE', '#EBE57F'];
      let areaColor = [
        'rgba(127, 213, 235, 0.5)',
        'rgba(90, 177, 239, 0.5)',
        'rgba(182, 162, 222,0.5)',
        'rgba(235, 229, 127, 0.5)',
      ];

      let colorIndex = 0;
      let dataX = props.echartsData.dataX;

      for (let key in props.echartsData) {
        if (key !== 'dataX') {
          // console.log(key,props.echartsData[key], 'props.echartsData');
          series.push({
            name: key,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 1,
            itemStyle: {
              color: color[colorIndex],
            },
            lineStyle: {
              color: color[colorIndex],
            },
            areaStyle: {
              normal: {
                type: 'default',
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: areaColor[colorIndex], // 区域颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(255,255,255,0)', // 区域颜色
                    },
                  ],
                  false,
                ),
              },
            },
            data: props.echartsData[key],
          });
          colorIndex++;
        }
      }
      // console.log(,"@");
      setOptions({
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          left: '3%',
          right: '7%',
          bottom: '3%',
          top: '18%',
          containLabel: true,
        },
        legend: {
          icon: 'rect',
          left: 'center',
          top: '3%',
          itemWidth: 15,
          itemHeight: 5,
          itemGap: 20,

          // data: IPList.value,
          textStyle: {
            color: '#333333',
          },
        },
        xAxis: {
          type: 'category',
          data: dataX,
          axisLabel: {
            //坐标轴字体颜色

            color: '#333333',
            formatter: function (value) {
              // 使用正则表达式来判断是否需要换行
              return value.split(' ').join('\n');
            },
            interval: dataX && dataX.length > 1 ? dataX.length - 2 : 0,
          },
          axisLine: {
            lineStyle: {
              color: '#e5e5e5',
            },
          },
          axisTick: {
            //y轴刻度线
            show: false,
          },
          splitLine: {
            //网格
            show: false,
          },
          boundaryGap: false,
        },
        yAxis: {
          type: 'value',

          axisLabel: {
            //坐标轴字体颜色

            color: '#333333',
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            //y轴刻度线
            show: false,
          },
          splitLine: {
            //网格
            show: true,
            lineStyle: {
              color: '#dadde4',
              type: 'dashed',
            },
          },
        },

        series: series,
      });
    },
    { immediate: true, deep: true },
  );
</script>
<style lang="less" scoped></style>
