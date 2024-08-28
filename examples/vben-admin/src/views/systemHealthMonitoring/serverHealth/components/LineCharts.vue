<template>
  <div class="w-100% h-100%">
    <div ref="faultEcharts" class="w-100% h-100%"></div>
  </div>
</template>
<script lang="ts" setup>
  import { useECharts } from '@/hooks/web/useECharts';
  import { Ref, ref, watch, computed } from 'vue';
  import { useGlobSetting } from '@/hooks/setting';

  const { ipList, virtualIp } = useGlobSetting();
  const server = ipList?.split(';');
  const IPList = ref(server);

  // const radio = ref<string>('year');

  const props = defineProps({
    echartsData: Object,
    title: String,
  });
  const faultEcharts = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(faultEcharts as Ref<HTMLDivElement>);

  // 数据整理

  watch(
    () => props.echartsData,
    () => {
      if (!props.echartsData) {
        return;
      }
      let series: any = [];
      let color = ['#5ab1ef', '#b6a2de', '#67e0e3', '#2ec7c9'];
      let colorIndex = 0;
      let dataX = props.echartsData.dataX;

      for (let key in props.echartsData) {
        if (key !== 'dataX') {
          // console.log(key,props.echartsData[key], 'props.echartsData');
          let tempNumber = key?.lastIndexOf('.');

          series.push({
            name: key.slice(tempNumber + 1, key.length),
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
            data: props.echartsData[key],
          });
          colorIndex++;
        }
      }
      // console.log(,"@");
      setOptions({
        title: {
          text: props.title,
          top: 0,
          left: 0,
          textStyle: {
            color: '#35598d',
            fontSize: 13,
            fontWeight: 'normal',
          },
        },

        tooltip: {
          trigger: 'axis',
        },
        grid: {
          left: '4%',
          right: '9%',
          bottom: '3%',
          top: '20%',
          containLabel: true,
        },
        legend: {
          icon: 'rect',
          left: 'center',
          top: '1%',
          itemWidth: 15,
          itemHeight: 10,
          itemGap: 20,

          // data: IPList.value,
          textStyle: {
            color: '#555',
          },
        },
        xAxis: {
          type: 'category',
          data: dataX,
          axisLabel: {
            //坐标轴字体颜色

            color: '#9eaaba',
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

            color: '#9eaaba',
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
