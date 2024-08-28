<template>
  <div class="w-100% h-100%">
    <div class="h-42px title">
      <div class="flex items-center">
        <div class="blue-dot"></div>
        <span class="title-text">当{{ props.timeType }}平均稼动率</span>
      </div>
    </div>
    <div class="divider"></div>
    <div div v-show="showEcharts" ref="OperationRateStatistics" class="echartsDiv"></div>

    <div v-show="!showEcharts" class="flex items-center justify-center w-100% h-85%">
      <Empty :image="simpleImage" :description="description" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  // import BoxHeader from './BoxHeader.vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { RangePicker, Empty, Tooltip } from 'ant-design-vue';
  import { Ref, ref, watch } from 'vue';
  import { getDateTime, formatDate } from '@/utils/simpleTools';
  import { GetOneDeviceActivation } from '@/api/equipmentManagement/deviceTemplateDetail';
  import 'echarts-liquidfill/src/liquidFill.js'; // 在需要水滴图的页面js引入

  // echarts.use([liquidFill] as any);
  const props = defineProps({
    deviceUUId: String,
    runType: Object,
    timeType: String,
  });
  const OperationRateStatistics = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(OperationRateStatistics as Ref<HTMLDivElement>);
  const showEcharts = ref(false);
  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

  const description = ref('请先在左侧绑定运行状态');
  const initChart = (value) => {
    const color1 = ['#446bf5', '#2ca3e2'];
    const color2 = ['#2aa1e3', '#08bbc9'];

    setOptions({
      series: [
        {
          type: 'liquidFill',
          radius: '75%',
          center: ['50%', '45%'],
          color: [
            {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: props.timeType == '日' ? color1[0] : color2[0],
                },
                {
                  offset: 1,
                  color: props.timeType == '日' ? color1[1] : color2[1],
                },
              ],
              globalCoord: false,
            },
          ],
          data: [value, value], // data个数代表波浪数
          backgroundStyle: {
            borderWidth: 1,
            color: 'RGBA(51, 66, 127, 0.7)',
          },
          label: {
            fontSize: 20,
            color: '#fff',
            // formatter:
            formatter: function (value) {
              return parseFloat((value.data * 100).toFixed(2)) + '%';
            },
          },
          outline: {
            // show: false
            borderDistance: 0,
            itemStyle: {
              borderWidth: 2,
              borderColor: '#F0FFFF',
            },
          },
        },
      ],
    } as any);
  };
  const getData = () => {
    showEcharts.value = true;

    if (props.runType?.srcUUID !== '' && props.runType?.defUUID !== '') {
      // let startTime = '';
      // let endTime = '';
      // if (props.timeType == '日') {
      //   startTime = getDateTime('before', 24 * 3600);
      //   endTime = getDateTime('current');
      // } else if (props.timeType == '周') {
      //   startTime = getDateTime('before', 7 * 24 * 3600);
      //   endTime = getDateTime('current');
      // }
      // console.log(startTime, endTime);
      const params = {
        DevUUID: props.deviceUUId,
        TimePeriod: props.timeType == '日' ? 'Day' : 'Week',
        // StartTime: startTime,
        // EndTime: endTime,
      };
      GetOneDeviceActivation(params)
        .then((res) => {
          if (res == 'NaN') {
            showEcharts.value = false;
            description.value = '该设备暂无数据！';
            console.log(res, 'resNan');
          } else {
            showEcharts.value = true;
            //保留两位小数
            initChart(res);
          }
        })
        .catch(() => {});
    } else {
      showEcharts.value = false;
      description.value = '请先在左侧绑定运行状态';
    }
  };
  watch(
    () => props.runType,
    () => {
      if (props.runType?.srcUUID !== '' && props.runType?.defUUID !== '') {
        getData();
      } else {
        // return;
      }
    },
    { immediate: true, deep: true },
  );
  // watch(
  //   () => props.deviceUUId,
  //   () => {
  //     if (props.deviceUUId && props.deviceUUId !== '') {
  //       getData();
  //     } else {
  //       return;
  //     }
  //   },
  //   { immediate: true, deep: true },
  // );
</script>
<style lang="less" scoped>
  .echartsDiv {
    width: 100%;
    height: calc(100% - 42px);
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 17px;

    .blue-dot {
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: #0960bd;
    }

    .title-text {
      margin-left: 9px;
      color: #333;
      font-size: 18px;
      font-weight: 600;
    }
  }

  .divider {
    height: 1px;
    margin: 0 8px;
    background: #e8e8e8;
  }
</style>
