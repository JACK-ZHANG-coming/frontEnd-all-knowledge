<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="register"
    title="历史告警信息"
    width="60%"
    :maskClosable="false"
  >
    <div class="flex justify-start">
      <RangePicker
        v-model:value="timeRange"
        show-time
        :presets="rangePresets"
        :allowClear="false"
        @change="dateChange"
      />
    </div>
    <div class="show w-99.5% h-260px mt-2">
      <div class="h-30px flex items-end justify-center font-600 text-18px">告警信息统计</div>
      <div v-show="showEcharts" ref="faultEcharts" class="w-100% h-230px"></div>
      <div v-show="!showEcharts" class="flex items-center justify-center w-100% h-230px">
        <Empty :image="simpleImage" :description="description" />
      </div>
    </div>
    <div class="tableDiv" ref="warningRef">
      <Table
        style="width: 100%"
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="{
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条数据`,
          size: 'small',
          total: total,
        }"
        @change="handleChange"
        :scroll="{ y: tableHeight }"
        class="tableClass"
        :size="'small'"
      >
        <!-- <template #bodyCell="{ column, record }">
          
           
          </template> -->
      </Table>
    </div>
  </BasicDrawer>
</template>
<script lang="tsx" setup>
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { useECharts } from '@/hooks/web/useECharts';

  import { CustomChart } from 'echarts/charts';
  import { RangePicker, Empty, Table } from 'ant-design-vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import { ref, Ref, nextTick } from 'vue';
  import { getDateTime, formatSeconds } from '@/utils/simpleTools';
  import {
    GetDataPeriodsInTime,
    GetOneDeviceAlarmCode,
  } from '@/api/equipmentManagement/deviceTemplateDetail';
  import dayjs, { Dayjs } from 'dayjs';

  const loading = ref(false);

  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
  const showEcharts = ref(false);
  const description = ref('暂无数据');
  const total = ref(0);
  const currentPage = ref(1);
  const pageSize = ref(10);
  const tableData = ref<any>([]);
  const warningRef = ref<any>(null);

  type RangeValue = [Dayjs, Dayjs];
  const propsData = ref<any>({});
  const deviceUUId = ref<any>('');
  const tableHeight = ref(550);
  const faultEcharts = ref<HTMLDivElement | null>(null);
  const { setOptions, echarts, getInstance } = useECharts(faultEcharts as Ref<HTMLDivElement>);
  echarts.use([CustomChart]);
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
    deviceUUId.value = data.deviceUUId;
    propsData.value = data.obj;
    pageSize.value = 10;
    currentPage.value = 1;
    showEcharts.value = false;
    getTableData(timeRange.value[0], timeRange.value[1]);
    getPieData(timeRange.value[0], timeRange.value[1]);

    nextTick(() => {
      initTableHeight();
    });
  };
  const dateChange = (dates, dateStrings: any) => {
    // console.log(dates, 'dates');
    // console.log(dateStrings, 'dateStrings');
    getTableData(dateStrings[0], dateStrings[1]);
    getPieData(dateStrings[0], dateStrings[1]);

    //判断日期选择器是否有值
  };
  const handleChange = (params) => {
    pageSize.value = params.pageSize;
    currentPage.value = params.current;
    getTableData(timeRange.value[0], timeRange.value[1]);
  };

  const getTableData = (startTime, endTime) => {
    loading.value = true;
    const params = {
      dataLocation: {
        srcUUID: propsData.value?.item1,
        defUUID: propsData.value?.item2,
      },
      startTime: startTime,
      endTime: endTime,
      pagesize: pageSize.value,
      currentpage: currentPage.value,
      limit: [],
    };
    // console.log(params, 'getTableData');
    GetDataPeriodsInTime(params)
      .then((res) => {
        console.log(res, 'res');
        if (res) {
          total.value = res.count;
          tableData.value = res.queryList;
          loading.value = false;
        } else {
          tableData.value = [
            // { startTime: 'q', endTime: 's', value: '12' },
          ];
          loading.value = false;
        }
        // showEcharts.value = true;
      })
      .catch(() => {
        loading.value = false;

        // showEcharts.value = true;
      });
  };
  const getPieData = (startTime, endTime) => {
    const params = {
      DevUUID: deviceUUId.value,
      StartTime: startTime,
      EndTime: endTime,
    };
    GetOneDeviceAlarmCode(params)
      .then((res) => {
        if (res.length > 0) {
          draw(res);
        } else {
          //暂无数据
        }
      })
      .catch((err) => {
        console.log(err, 'err====');
      });
  };
  const draw = (data) => {
    showEcharts.value = true;
    let legendData: any = [];
    let seriesData: any = [];
    data.forEach((item: any) => {
      legendData.push(item.status);
      seriesData.push({
        name: item.status,
        value: item.num,
      });
    });
    setOptions(
      {
        // title: {
        //   text: '告警信息统计',

        //   left: 'center',
        // },

        tooltip: {
          trigger: 'item',
          // formatter: function (a, b, c, d) {
          //   console.log(a.data, 'ccccccccc');
          //   return;
          //   // return `{a}: {b}<br/>告警时长：${formatSeconds(c)}<br/> 时长占比：{d}%`;
          // },
          formatter: `{a}: {b}<br/>告警时长：{c}s<br/> 时长占比：{d}%`,
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: '2%',
          top: '10%',
          bottom: '10%',
          data: legendData,
        },
        series: [
          {
            name: '告警编号',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      },
      true,
    );
  };
  const columns = [
    {
      title: '编号',
      dataIndex: 'value',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
    },
  ];
  const initTableHeight = () => {
    let customDiv = document.querySelector('.customDiv');
    tableHeight.value = window.innerHeight - (customDiv?.scrollHeight || 0) - 220;
  };
</script>
<style>
  .tableDiv {
    /* height: calc(100% - 60px); */
    margin-top: 15px;
  }

  .show {
    border-radius: 5px;
    box-shadow: 5px 5px 6px 2px #ccc;
  }
</style>
