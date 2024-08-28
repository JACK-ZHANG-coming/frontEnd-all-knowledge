<template>
  <div class="w-100% h-100% serverHealth-ServeRate">
    <Card style="width: 100%; height: 100%">
      <template #title>
        <div class="w-100% h-100% flex justify-between">
          服务器负载占比
          <div>
            <a-button type="link" :size="'small'">更多</a-button>
          </div>
        </div>
      </template>

      <div
        ref="RateEcharts"
        id="RateEcharts"
        style="width: 100%; height: 100%; margin-top: -3%"
      ></div>
    </Card>
  </div>
</template>
<script lang="ts" setup>
  // import BoxHeader from './BoxHeader.vue';
  // import { useECharts } from '@/hooks/web/useECharts';
  import { Tooltip, Card, RadioButton, RadioGroup } from 'ant-design-vue';
  import { Ref, markRaw, ref, watch, computed, onMounted, onUnmounted, nextTick } from 'vue';

  import * as echarts from 'echarts';

  const props = defineProps({
    diskInfo: Array,
  });
  const echartsData = ref<any>([
    // { name: '71', read: 2, write: 2, value: 4 },
    // { name: '72', read: 2, write: 3, value: 5 },
    // { name: '73', read: 2, write: 3, value: 5 },
  ]);
  const RateEcharts = ref<any>(null);
  onMounted(() => {
    let chartDom: any = document.getElementById('RateEcharts');
    RateEcharts.value = markRaw(echarts.init(chartDom));
    // drawChart();
    window.addEventListener('resize', resizeChart);
  });
  const resizeChart = () => {
    if (RateEcharts.value) {
      RateEcharts.value.resize();
    }
  };
  onUnmounted(() => {
    window.removeEventListener('resize', resizeChart);
  });
  const drawChart = (nowData: any[]) => {
    // RateEcharts.value.clear();

    if (nowData.length <= 0) {
      return;
    }
    let Data: any = [];
    if (nowData.length > 0) {
      console.log(nowData);
      Data = [];
      Data.push({ name: '读取', value: nowData[0].read });
      Data.push({ name: '写入', value: nowData[0].write });
    }
    let option: any = {
      // backgroundColor: '#1f4279',
      color: ['#5ab1ef', '#b6a2de', '#67e0e3', '#EFB062', '#fa8c35'],
      tooltip: {
        show: false,
        backgroundColor: '#02132fC9',
        borderColor: '#0D97E460',

        textStyle: {
          fontSize: 16,
          color: '#DCDCDC',
        },
        formatter: (params) => {
          let read = (params.data.read / params.value) * 100;
          let write = (params.data.write / params.value) * 100;
          return `${params.name}:${params.value}次<br/>
          读取: ${params.data.read}次(${read.toFixed(2)}%)<br/>
          写入: ${params.data.write}次(${write.toFixed(2)}%)`;
        },
      },
      legend: {
        bottom: -5,
        type: 'scroll',
        textStyle: {
          fontSize: 10,
          color: '#666666',
        },
      },
      series: [
        {
          name: '',
          type: 'pie',
          center: ['45%', '40%'],
          radius: ['46%', '56%'],
          avoidLabelOverlap: false,

          label: {
            fontSize: 12,
            color: '#666666',
          },
          labelLine: {},
          data: nowData,
        },
        {
          name: '',
          type: 'pie',
          selectedMode: 'single',
          center: ['45%', '40%'],
          radius: [0, '38%'],
          label: {
            position: 'inner',

            fontSize: 10,
            color: '#fff',

            formatter: (params) => {
              return `${params.value}次`;
            },
          },
          data: Data,
        },
      ],
    };

    let currentIndex = 0;
    function animate() {
      let dataLen = option.series[0].data.length;
      // 取消之前高亮的图形
      RateEcharts.value.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndex,
      });
      // currentIndex = (currentIndex + 1) % dataLen;
      // 高亮当前图形
      RateEcharts.value.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: currentIndex,
      });
      option.series[1].data[0].value = option.series[0].data[currentIndex].read;
      option.series[1].data[1].value = option.series[0].data[currentIndex].write;
      RateEcharts.value.setOption(option, true);
    }
    animate();

    RateEcharts.value.on('mouseover', function (e) {
      if (e.seriesIndex == 0) {
        // clearInterval(timer);
        // 取消之前高亮的图形
        RateEcharts.value.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
        });
        RateEcharts.value.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: e.dataIndex,
        });
        option.series[1].data[0].value = option.series[0].data[e.dataIndex].read;
        option.series[1].data[1].value = option.series[0].data[e.dataIndex].write;
        RateEcharts.value.setOption(option, true);
      }
    });

    RateEcharts.value.on('mouseout', function (e) {
      if (e.seriesIndex == 0) {
        currentIndex = e.dataIndex;
        RateEcharts.value.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
        });
      }
    });
  };
  watch(
    () => props.diskInfo,
    () => {
      if (!props.diskInfo) {
        return;
      }
      let nowData = props.diskInfo || [];
      nextTick(() => {
        drawChart(nowData);
      });
      // if (props.diskInfo.length > 0) {
      //   // getInfo(currentIP.value);
      // }
    },
    { immediate: true },
  );
</script>
<style lang="less" scoped>
  .serverHealth-ServeRate {
    :deep(.ant-card) {
      .ant-card-head {
        height: 56px;
        padding: 0 10px;
        // background-color: yellowgreen;
      }

      .ant-card-body {
        height: calc(100% - 56px);
        padding: 0;
      }
    }
  }
</style>
