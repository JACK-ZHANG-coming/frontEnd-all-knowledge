<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="register"
    title="历史曲线"
    width="100%"
    @close="closeDrawer"
  >
    <div class="w-100% h-100%">
      <div class="flex justify-start">
        <RangePicker
          class="mt-3 mr-6"
          v-model:value="timeRange"
          show-time
          :presets="rangePresets"
          :allowClear="false"
          @change="dateChange"
          :size="'small'"
        />

        <div class="mt-3 flex items-center justify-between">
          <div class="text-18px text-nowrap">数据量：</div>
          <InputNumber v-model:value="count" @blur="countChange" :min="2" :step="1" />
        </div>
      </div>

      <div class="w-100% h-400px">
        <div v-show="showEcharts" ref="faultEcharts" class="w-100% h-100%"></div>
        <div v-show="!showEcharts" class="flex items-center justify-center w-100% h-100%">
          <Empty :image="simpleImage" :description="description" />
        </div>
      </div>
      <div class="w-100% mt-2">
        <Table
          :columns="columns"
          :data-source="urlStringList"
          :pagination="false"
          :scroll="{ y: tableHeight }"
          size="small"
          class="tableClass"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'url'">
              <CopyOutlined class="copy" @click="copyText(record.url)" />
              <span @click="copyText(record.url)">{{ record.url }}</span>
            </template>
          </template>
        </Table>
      </div>
    </div>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { useECharts } from '@/hooks/web/useECharts';
  import { copyText } from '@/utils/copyTextToClipboard';

  import { RangePicker, Empty, InputNumber, Table } from 'ant-design-vue';
  import { CopyOutlined } from '@ant-design/icons-vue';
  import { Ref, ref, onActivated, nextTick } from 'vue';
  import { getDateTime, formatDate, getIp } from '@/utils/simpleTools';
  import { GetTimeData } from '@/api/equipmentManagement/deviceTemplateDetail';
  import dayjs, { Dayjs } from 'dayjs';

  const tableHeight = ref(300);
  const urlStringList = ref<any>([]);
  const lineType = ref<any>([]);
  const showEcharts = ref(false);
  const description = ref('此时间范围内无数据，请修改时间！');
  const count = ref<number>(288);
  const warningRef = ref<any>(null);
  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
  type RangeValue = [Dayjs, Dayjs];
  const propsData = ref<any>({});
  const echartsData = ref<any>(null);
  const faultEcharts = ref<HTMLDivElement | null>(null);

  const { setOptions, echarts } = useECharts(faultEcharts as Ref<HTMLDivElement>);

  const dateFormat = 'YYYY-MM-DD hh:mm:ss';

  const timeRange = ref<[Dayjs, Dayjs]>([
    dayjs(getDateTime('before', 24 * 60 * 60).slice(0, 10) + ' 08:00:00', dateFormat),
    dayjs(getDateTime('current').slice(0, 10) + ' 08:00:00', dateFormat),
  ]);
  const rangePresets = ref([
    {
      label: '默认',
      value: [
        dayjs(getDateTime('before', 24 * 60 * 60).slice(0, 10) + ' 08:00:00', dateFormat),
        dayjs(getDateTime('current').slice(0, 10) + ' 08:00:00', dateFormat),
      ],
    },
  ]);
  const [register] = useDrawerInner((data) => {
    data && onDataReceive(data);
  });
  const onDataReceive = (data) => {
    propsData.value = data;
    console.log(propsData.value, 'propsData.value');
    lineType.value = data?.lineType;
    if (lineType.value.length > 0) {
      getData(formatDate(timeRange.value[0]), formatDate(timeRange.value[1]));
    }
    nextTick(() => {
      initTableHeight();
    });
    // console.log('data.lineType', data);
  };
  const getUrlString = () => {
    let tempList: any = [];
    lineType.value.forEach((item) => {
      if (item.srcUUID !== '' && item.defUUID !== '') {
        let url =
          getIp(0) +
          '/api/DataVision/GetTimeData' +
          '?SrcUUID=' +
          item.srcUUID +
          '&DefUUID=' +
          item.defUUID +
          '&startTime=' +
          formatDate(timeRange.value[0]) +
          '&endTime=' +
          formatDate(timeRange.value[1]) +
          '&count=' +
          count.value;
        tempList.push({
          name: item.name,
          url: url,
        });
      }
    });
    urlStringList.value = tempList;
  };
  const columns: any = [
    {
      title: '数据名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
    },
  ];
  const dateChange = (dates, dateStrings: any) => {
    getData(dateStrings[0], dateStrings[1]);
    //判断日期选择器是否有值
  };
  const countChange = () => {
    getData(formatDate(timeRange.value[0]), formatDate(timeRange.value[1]));
  };
  const getData = async (startTime, endTime) => {
    let tempObj: any = {};
    getUrlString();
    // echartsData.valu
    for (let i = 0; i < lineType.value.length; i++) {
      let params = {
        SrcUUID: lineType.value[i].srcUUID,
        DefUUID: lineType.value[i].defUUID,
        startTime: startTime,
        endTime: endTime,
        count: count.value,
      };

      await GetTimeData(params)
        .then((res) => {
          if (res) {
            let dataX: any = [];
            let dataY: any = [];
            res.queryList.forEach((item: any) => {
              dataX.push(item?.dateTime ?? '');
              dataY.push(item.data !== '' ? item.data : 0);
            });
            if (tempObj.dataX) {
              tempObj[lineType.value[i].name.replace('实时数据', '')] = dataY;
            } else {
              tempObj.dataX = dataX;
              tempObj[lineType.value[i].name.replace('实时数据', '')] = dataY;
            }
          }
        })
        .catch(() => {});
      JSON.stringify(tempObj) === '{}' ? (echartsData.value = null) : (echartsData.value = tempObj);
      draw();
    }
  };
  const draw = () => {
    if (!echartsData.value) {
      showEcharts.value = false;
      description.value = '此时间范围内无数据，请修改时间！';
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
    let dataX = echartsData.value.dataX;

    for (let key in echartsData.value) {
      if (key !== 'dataX') {
        // console.log(key,echartsData.value[key], 'echartsData.value');
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
          data: echartsData.value[key],
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
  };
  const closeDrawer = () => {
    timeRange.value = [
      dayjs(getDateTime('before', 24 * 60 * 60).slice(0, 10) + ' 08:00:00', dateFormat),
      dayjs(getDateTime('current').slice(0, 10) + ' 08:00:00', dateFormat),
    ];
    // 离开该页面需要移除这个监听的事件，不然会报错
    // resizeObserver.unobserve(warningRef.value);
  };

  const initTableHeight = () => {
    let customDiv = document.querySelector('.customDiv');
    tableHeight.value = window.innerHeight - (customDiv?.scrollHeight || 0) - 320;
  };

  onActivated(() => {
    nextTick(() => {
      initTableHeight();
      window.onresize = () => {
        initTableHeight();
      };
    });
  });
</script>
<style scoped>
  .tableDiv {
    /* height: calc(100% - 60px); */
    margin-top: 15px;
  }

  .text-nowrap {
    white-space: nowrap;
  }

  .copy {
    margin-right: 0.5rem;
    color: #0960bd;
    cursor: pointer;
  }

  .copy:hover {
    color: #69b1ff;
  }
</style>
