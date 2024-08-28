<template>
  <div class="w-100% h-100%">
    <div class="h-42px title">
      <div class="flex items-center">
        <div class="blue-dot"></div>
        <span class="title-text mr-2">运行状态统计</span>
        <Tooltip placement="right">
          <template #title>
            <CopyOutlined class="copy" @click="copyText(urlString)" />
            <span @click="copyText(urlString)">{{ urlString }}</span>
          </template>
          <div class="search">
            <ShareAltOutlined />
          </div>
        </Tooltip>
      </div>
      <RangePicker
        v-model:value="timeRange"
        show-time
        :presets="rangePresets"
        :allowClear="false"
        @change="dateChange"
      />
    </div>
    <div class="divider"></div>

    <div v-show="showEcharts" ref="faultEcharts" class="faultEcharts"></div>
    <div v-show="!showEcharts" class="flex items-center justify-center w-100% h-85%">
      <Empty :image="simpleImage" :description="description" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { useECharts } from '@/hooks/web/useECharts';

  import { Ref, ref, watch, computed } from 'vue';
  import { CustomChart } from 'echarts/charts';
  import { RangePicker, Empty, Tooltip } from 'ant-design-vue';
  import { ShareAltOutlined, CopyOutlined } from '@ant-design/icons-vue';
  import { getDateTime, formatDate, getIp } from '@/utils/simpleTools';
  import { GetDataPeriodsInTime } from '@/api/equipmentManagement/deviceTemplateDetail';
  import { copyText } from '@/utils/copyTextToClipboard';

  import dayjs, { Dayjs } from 'dayjs';

  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
  const urlString = ref<any>('请先在左侧绑定运行状态');

  type RangeValue = [Dayjs, Dayjs];
  const showEcharts = ref(false);
  const description = ref('请先在左侧绑定运行状态');
  const props = defineProps({
    runType: Object,
    deviceName: String,
  });
  const faultEcharts = ref<HTMLDivElement | null>(null);
  const { setOptions, echarts, getInstance } = useECharts(faultEcharts as Ref<HTMLDivElement>);
  echarts.use([CustomChart]);

  const dateFormat = 'YYYY-MM-DD hh:mm:ss';

  const timeRange = ref<[Dayjs, Dayjs]>([
    dayjs(getDateTime('before', 24 * 60 * 60).slice(0, 10) + ' 08:00:00', dateFormat),
    dayjs(getDateTime('after', 1 * 24 * 60 * 60).slice(0, 10) + ' 08:00:00', dateFormat),
  ]);
  const rangePresets = ref([
    {
      label: '默认',
      value: [
        dayjs(getDateTime('before', 24 * 60 * 60).slice(0, 10) + ' 08:00:00', dateFormat),
        dayjs(getDateTime('after', 1 * 24 * 60 * 60).slice(0, 10) + ' 08:00:00', dateFormat),
      ],
    },
  ]);
  const dateChange = (dates, dateStrings: any) => {
    // getData(dateStrings[0], dateStrings[1]);
    getData(timeRange.value[0], timeRange.value[1]);

    //判断日期选择器是否有值
  };
  const getData = (startTime, endTime) => {
    showEcharts.value = true;
    getURL();
    if (props.runType?.srcUUID !== '' && props.runType?.defUUID !== '') {
      const params = {
        dataLocation: {
          srcUUID: props.runType?.srcUUID,
          defUUID: props.runType?.defUUID,
        },
        startTime: startTime,
        endTime: endTime,
        limit: [],
      };

      GetDataPeriodsInTime(params)
        .then((res) => {
          console.log(res, 'tempList11111111111======');
          if (res) {
            showEcharts.value = true;
            let tempList: any = [];

            let startTimeNumber = customDateStringToTimestamp(startTime);
            let endTimeNumber = customDateStringToTimestamp(endTime);
            for (let i = res.queryList.length - 1; i >= 0; i--) {
              let currentStartTime = customDateStringToTimestamp(res.queryList[i].startTime);
              let currentEndTime = customDateStringToTimestamp(res.queryList[i].endTime);

              tempList.push({
                startTime: currentStartTime,
                endTime: currentEndTime,
                lastTime: currentEndTime - currentStartTime,
                name: res.queryList[i].value,
              });
              if (
                i - 1 >= 0 &&
                customDateStringToTimestamp(res.queryList[i - 1].startTime) > currentEndTime
              ) {
                let nextStartTime = customDateStringToTimestamp(res.queryList[i - 1].startTime);
                tempList.push({
                  startTime: currentEndTime,
                  endTime: nextStartTime,
                  lastTime: nextStartTime - currentEndTime,
                  name: '未知',
                });
              }
            }
            if (endTimeNumber > tempList[tempList.length - 1].endTime) {
              tempList.push({
                startTime: tempList[tempList.length - 1].endTime,
                endTime: endTimeNumber,
                lastTime: endTimeNumber - tempList[tempList.length - 1].endTime,
                name: '未知',
              });
            }
            if (startTimeNumber < tempList[0].startTime) {
              tempList.unshift({
                startTime: startTimeNumber,
                endTime: tempList[0].startTime,
                lastTime: tempList[0].startTime - startTimeNumber,
                name: '未知',
              });
            }

            // console.log(tempList[0], tempList[tempList.length - 1], 'tempList======');
            draw(tempList);
          } else {
            showEcharts.value = false;
            description.value = '该范围内无数据，请修改时间范围！';
          }
        })
        .catch((err) => {
          console.log(err, 'err====');
        });
    } else {
      showEcharts.value = false;
      description.value = '请先在左侧绑定运行状态';
    }
  };

  const renderItem = (params: any, api: any) => {
    let categoryIndex = api.value(0);
    let start = api.coord([api.value(1), categoryIndex]);
    let end = api.coord([api.value(2), categoryIndex]);
    let height = api.size([0, 1])[1] * 0.7;

    let rectShape = echarts.graphic.clipRectByRect(
      {
        x: start[0],
        y: start[1] - height / 2,
        width: end[0] - start[0],
        height: height,
      },
      {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height,
      },
    );

    return (
      rectShape && {
        type: 'rect',
        shape: rectShape,
        style: {
          fill: api.visual('color'),
        },
      }
    );
  };
  //将日期字符串转成时间戳
  const customDateStringToTimestamp = (str) => {
    let temp = formatDate(str, true);
    const [year, month, day, hour, minute, second, ms]: any = temp.split(/[- : .]/);
    return new Date(year, month - 1, day, hour, minute, second, ms).getTime(); // 注意月份减1
  };

  const draw = (dataList: any) => {
    let data: any = [];

    let color = [
      { name: '运行', color: '#75d874' },
      { name: '空闲', color: '#9aa7b1' },
      { name: '停机', color: '#c12c1f' },
      { name: '空运行', color: '#ffee6f' },
    ];
    let categories = [props?.deviceName];
    if (dataList.length > 0) {
      for (let i = 0; i < dataList.length; i++) {
        let isOther = true;
        color.forEach((item) => {
          if (item.name == dataList[i].name) {
            isOther = false;
            data.push({
              name: item.name,
              value: [0, dataList[i].startTime, dataList[i].endTime, dataList[i].lastTime],
              itemStyle: {
                color: item.color,
              },
            });
          }
        });

        if (isOther) {
          data.push({
            name: dataList[i].name,
            value: [0, dataList[i].startTime, dataList[i].endTime, dataList[i].lastTime],
            itemStyle: {
              color: '#f5f3f2',
            },
          });
        }
      }
    } else {
      showEcharts.value = false;
      description.value = '该范围内无数据，请修改时间范围！';
      return;
    }

    console.log(data, '甘特图数据');
    //设定图形效果
    setOptions(
      {
        //鼠标提示
        tooltip: {
          formatter: function (params) {
            return `<div>
                  <div>${params.marker + params.name}</div>
                  <div>开始时间：${formatDate(params.value[1], true)}</div>
                  <div>结束时间：${formatDate(params.value[2], true)}</div>
                  <div>持续时长: ${(params.value[3] / 1000).toFixed(0)} s</div>
                </div>`;

            // return params.marker + params.name + ': ' +formatDate(params.value[1])+formatDate(params.value[2])+ formatDate(params.value[3]) ;
          },
          position: 'bottom',
        },
        //缩放
        dataZoom: [
          {
            type: 'slider',
            show: false,
            filterMode: 'weakFilter',
            showDataShadow: false,
            top: 550,
            height: 10,
            borderColor: 'transparent',
            backgroundColor: '#e2e2e2',
            handleIcon:
              'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', //jshint ignore:line
            handleSize: 20,
            handleStyle: {
              shadowBlur: 6,
              shadowOffsetX: 1,
              shadowOffsetY: 2,
              shadowColor: '#aaa',
            },
            labelFormatter: '',
            start: 0,
            end: 100,
          },
          {
            type: 'inside',
            filterMode: 'weakFilter',
          },
        ],
        grid: {
          left: '3%',
          right: '7%',
          bottom: '2%',
          top: '30%',
          containLabel: true,
        },
        xAxis: {
          show: false,
          scale: true,
          min: data[0].value[1],
          max: data[data.length - 1].value[2],
          axisLabel: {
            formatter: function (val) {
              return formatDate(val, true).split(' ').join('\n');
            },
          },
        },
        yAxis: {
          data: categories,
        },
        series: [
          {
            name: '运行',
            type: 'custom',
            renderItem: renderItem,
            itemStyle: {
              opacity: 0.8,
              color: '#75d874',
            },
            encode: {
              x: [1, 2],
              y: 0,
            },
            data: data,
          },
          {
            name: '故障',
            type: 'custom',
            renderItem: renderItem,
            itemStyle: {
              opacity: 0.8,

              color: '#bd6d6c',
              borderWidth: 2,
            },
            encode: {
              x: [1, 2],
              y: 0,
            },
            data: data,
          },
          {
            name: '等待',
            type: 'custom',
            renderItem: renderItem,
            itemStyle: {
              opacity: 0.8,

              color: '#e0bc78',
              borderWidth: 2,
            },
            encode: {
              x: [1, 2],
              y: 0,
            },
            data: data,
          },
          {
            name: '备用',
            type: 'custom',
            renderItem: renderItem,
            itemStyle: {
              opacity: 0.8,

              color: '#7b9ce1',
              borderWidth: 2,
            },
            encode: {
              x: [1, 2],
              y: 0,
            },
            data: data,
          },
        ],
      },
      true,
    );
  };
  const getURL = () => {
    if (props.runType?.srcUUID !== '' && props.runType?.defUUID !== '') {
      urlString.value =
        getIp(0) +
        '/api/DataVision/GetDataPeriodsInTime' +
        '?SrcUUID=' +
        props.runType?.srcUUID +
        '&DefUUID=' +
        props.runType?.defUUID +
        '&startTime=' +
        formatDate(timeRange.value[0]) +
        '&endTime=' +
        formatDate(timeRange.value[1]);
    } else {
      urlString.value = '请先在左侧绑定运行状态';
    }
  };
  watch(
    () => props.runType,
    () => {
      getURL();
      if (props.runType?.srcUUID !== '' && props.runType?.defUUID !== '') {
        getData(timeRange.value[0], timeRange.value[1]);
      } else {
        // return;
      }
    },
    { immediate: true, deep: true },
  );
</script>
<style lang="less" scoped>
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

  .faultEcharts {
    width: 100%;
    height: calc(100% - 45px);

    .search {
      display: inline-block;
      color: #0960bd;
      cursor: pointer;
    }

    .search:hover {
      color: #69b1ff;
    }

    .copy {
      margin-right: 0.5rem;
      color: #0960bd;
      cursor: pointer;
    }

    .copy:hover {
      color: #69b1ff;
    }
  }
</style>
