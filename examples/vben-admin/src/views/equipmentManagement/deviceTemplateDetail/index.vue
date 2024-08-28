<!--设备详情 -->
<template>
  <div class="p-4">
    <div class="h-52px text-20px bg-#FFFFFF top-box flex justify-between items-center pl-4 pr-4">
      <div>基本信息</div>
      <div class="back" @click="go('/equipmentManagement/deviceTemplate')"
        ><ArrowRightOutlined
      /></div>
      <!-- <a-button :size="'large'" type="link" @click="go('/equipmentManagement/deviceTemplate')"
        ><BackwardOutlined
      /></a-button> -->
    </div>
    <div class="w-100% mt-8px flex justify-between flex-wrap">
      <div class="left-page">
        <div class="h-1090px bg-#FFFFFF left-box1">
          <div class="m-15px h-265px bg-#FFFFFF left-box11">
            <LeftTop
              :realTimeList="realTimeList"
              :deviceUUId="deviceUUId"
              :staticDataDefineLinkInfo="staticDataDefineLinkInfo"
              :devideInfo="devideInfo"
            />
          </div>
          <div class="mt-35px">
            <LeftCenter
              :realTimeList="realTimeList"
              :deviceUUId="deviceUUId"
              :staticDataDefineLinkInfo="staticDataDefineLinkInfo"
            />
          </div>
        </div>
        <div class="h-346px mt-6px bg-#FFFFFF">
          <HistoryList
            :realTimeList="realTimeList"
            :deviceUUId="deviceUUId"
            :dynamicDefineLinkList="dynamicDefineLinkList"
          />
        </div>
      </div>
      <div class="right-page">
        <div class="h-162px bg-#FFFFFF">
          <GanttCharts :runType="runType" :deviceName="deviceName" />
        </div>
        <div class="h-200px mt-8px flex justify-between">
          <div class="w-49.5% bg-#FFFFFF">
            <UtilizationRate :deviceUUId="deviceUUId" :timeType="'日'" :runType="runType" />
          </div>
          <div class="w-49.5% bg-#FFFFFF"
            ><UtilizationRate :deviceUUId="deviceUUId" :timeType="'周'" :runType="runType" />
          </div>
        </div>
        <div class="h-260px mt-8px bg-#FFFFFF">
          <div class="h-42px title">
            <div class="flex items-center">
              <div class="blue-dot"></div>
              <span class="title-text">主轴转速</span>
              <Tooltip placement="right">
                <template #title>查看历史曲线</template>
                <div class="search ml-2" @click="openHistory('主轴实时数据-转速', 1)">
                  <ClockCircleOutlined class="text-18px" />
                </div>
              </Tooltip>
            </div>
            <RadioGroup
              v-model:value="radio1"
              size="small"
              @change="radioChange('主轴实时数据-转速', 1)"
            >
              <RadioButton value="week"> 周 </RadioButton>
              <RadioButton value="day"> 日 </RadioButton>
            </RadioGroup>
          </div>
          <div class="divider"></div>
          <div class="h-216px">
            <LineCharts
              :echartsData="lineData1"
              :lineType="lineType1"
              :unit="'r/min'"
              :title="'主轴实时数据-转速'"
            />
          </div>
        </div>

        <div class="h-260px mt-8px bg-#FFFFFF">
          <div class="h-42px title">
            <div class="flex items-center">
              <div class="blue-dot"></div>
              <span class="title-text">负载百分比</span>
              <Tooltip placement="right">
                <template #title>查看历史曲线</template>
                <div
                  class="search ml-2"
                  @click="openHistory('主轴/工作台/竖直轴/进给轴实时数据-负载百分比', 2)"
                >
                  <ClockCircleOutlined class="text-18px" />
                </div>
              </Tooltip>
            </div>
            <RadioGroup
              v-model:value="radio2"
              size="small"
              @change="radioChange('主轴/工作台/竖直轴/进给轴实时数据-负载百分比', 2)"
            >
              <RadioButton value="week"> 周 </RadioButton>
              <RadioButton value="day"> 日 </RadioButton>
            </RadioGroup>
          </div>
          <div class="divider"></div>
          <div class="h-216px">
            <LineCharts
              :echartsData="lineData2"
              :unit="'%'"
              :lineType="lineType2"
              :title="'主轴/工作台/竖直轴/进给轴实时数据-负载百分比'"
            />
          </div>
        </div>

        <div class="h-260px mt-8px bg-#FFFFFF">
          <div class="h-42px title">
            <div class="flex items-center">
              <div class="blue-dot"></div>
              <span class="title-text">电机温度</span>
              <Tooltip placement="right">
                <template #title>查看历史曲线</template>
                <div class="search ml-2" @click="openHistory('主轴/工作台实时数据-电机温度', 3)">
                  <ClockCircleOutlined class="text-18px" />
                </div>
              </Tooltip>
            </div>
            <RadioGroup
              v-model:value="radio3"
              size="small"
              @change="radioChange('主轴/工作台实时数据-电机温度', 3)"
            >
              <RadioButton value="week"> 周 </RadioButton>
              <RadioButton value="day"> 日 </RadioButton>
            </RadioGroup>
          </div>
          <div class="divider"></div>
          <div class="h-216px">
            <LineCharts
              :lineType="lineType3"
              :echartsData="lineData3"
              :unit="'℃'"
              :title="'主轴/工作台实时数据-电机温度'"
            />
          </div>
        </div>

        <div class="h-260px mt-8px bg-#FFFFFF">
          <div class="h-42px title">
            <div class="flex items-center">
              <div class="blue-dot"></div>
              <span class="title-text">进给轴速度</span>
              <Tooltip placement="right">
                <template #title>查看历史曲线</template>
                <div class="search ml-2" @click="openHistory('进给轴-速度', 4)">
                  <ClockCircleOutlined class="text-18px" />
                </div>
              </Tooltip>
            </div>
            <RadioGroup v-model:value="radio4" size="small" @change="radioChange('进给轴-速度', 4)">
              <RadioButton value="week"> 周 </RadioButton>
              <RadioButton value="day"> 日 </RadioButton>
            </RadioGroup>
          </div>
          <div class="divider"></div>
          <div class="h-216px">
            <LineCharts
              :echartsData="lineData4"
              :lineType="lineType4"
              :unit="'mm/s'"
              :title="'进给轴-速度'"
            />
          </div>
        </div>
      </div>
    </div>
    <HistoryDrawer @register="registerHistoryDrawer" />
  </div>
</template>
<script lang="ts" setup>
  import {
    h,
    ref,
    computed,
    unref,
    toRaw,
    watch,
    onMounted,
    onUnmounted,
    provide,
    onActivated,
  } from 'vue';
  import { RadioButton, RadioGroup, Tooltip, message } from 'ant-design-vue';
  import { ArrowRightOutlined, ClockCircleOutlined } from '@ant-design/icons-vue';
  import { GetOneDevice, GetTimeData } from '@/api/equipmentManagement/deviceTemplateDetail';
  import { useRoute } from 'vue-router';

  import LeftTop from './components/LeftTop.vue';
  import HistoryList from './components/HistoryList.vue';
  import HistoryDrawer from './components/HistoryDrawer.vue';
  import UtilizationRate from './components/UtilizationRate.vue';
  import LeftCenter from './components/LeftCenter.vue';
  import LineCharts from './components/LineCharts.vue';
  import GanttCharts from './components/GanttCharts.vue';
  import { useGo } from '@/hooks/web/usePage';
  import { useTabs } from '@/hooks/web/useTabs';
  import { useDrawer } from '@/components/Drawer';

  import { useSocket } from './components/wesocket';

  import { getDateTime, formatDate } from '@/utils/simpleTools';
  import { useGlobSetting } from '@/hooks/setting';

  const { setTitle } = useTabs();
  // defineOptions({ name: 'DeviceTemplateDetail' });

  const go = useGo();
  const route = useRoute();
  console.log(route, 'route');
  const deviceUUId = ref<any>(route.params?.uuid);

  const deviceName = ref<any>();
  // const socket = ref<any>(null);
  const realTimeList = ref<any>([]);
  const radio1 = ref<string>('day');
  const radio2 = ref<string>('day');
  const radio3 = ref<string>('day');
  const radio4 = ref<string>('day');
  const devideInfo = ref<any>({});
  const staticDataDefineLinkInfo = ref<any>({});
  const runType = ref({ srcUUID: '', defUUID: '' });
  const lineType1 = ref<any>([]);
  const lineType2 = ref<any>([]);
  const lineType3 = ref<any>([]);
  const lineType4 = ref<any>([]);

  const lineData1 = ref<any>(null);
  const lineData2 = ref<any>(null);
  const lineData3 = ref<any>(null);
  const lineData4 = ref<any>(null);

  const dynamicDefineLinkList = ref<any>([]);
  const { wsUrl } = useGlobSetting();

  // console.log(wsUrl);
  // ws://dev.jridge.com:5000/ws
  const { socket, send, on, off } = useSocket(wsUrl ?? '');

  on('open', (event) => {
    console.log('webSocket连接上服务器时', event);

    send(deviceUUId.value);
  });

  socket.on('message', (data) => {
    if (data.includes('&*&')) {
      let arr2: any = [];
      let arr = data.split('&*&');
      // console.log(temp, 'xx');
      for (let i = 0; i < arr.length; i++) {
        let arr1: any = [];
        let temp = arr[i].split('@#@');
        for (let j = 0; j < temp.length; j++) {
          arr1.push(temp[j]);
        }
        arr2.push(arr1);
      }
      realTimeList.value = arr2;
      // console.log('收到的data:', data);
      console.log(arr2, 'arr2'); 
    } else {
      realTimeList.value = [];
    }
  });

  const [registerHistoryDrawer, { openDrawer: historyDrawer }] = useDrawer();

  const reload = () => {
    send(deviceUUId.value);
    getDeviceInfo(deviceUUId.value);
    // console.log('aaaa' + new Date());
  };

  provide('reload', reload);
  provide('deviceUUid', deviceUUId.value);
  const openHistory = (title: string, index: number) => {
    if (
      eval('lineType' + index).value?.srcUUID !== '' &&
      eval('lineType' + index).value?.defUUID !== ''
    ) {
      //打开弹窗操作
      historyDrawer(true, { lineType: eval('lineType' + index).value });
    } else {
      message.warning('请先绑定左边' + title);
    }
    // console.log();
  };
  const radioChange = (title: string, index: number) => {
    if (
      eval('lineType' + index).value?.srcUUID !== '' &&
      eval('lineType' + index).value?.defUUID !== ''
    ) {
      //根据index调接口getLineChartsData1~4接口
      eval('getLineChartsData' + index)();
    } else {
      message.warning('请先绑定左边' + title);
    }
  };
  const getDeviceInfo = (uuid: any) => {
    const params = {
      uuid,
    };
    GetOneDevice(params)
      .then((res) => {
        // console.log('res', res.staticDataDefineLink);
        devideInfo.value = res;
        deviceName.value = res.name;
        setTitle('设备详情_' + res?.deviceCode);
        staticDataDefineLinkInfo.value = res.staticDataDefineLink;
        let temp: any = [];
        for (let key in res.dynamicDefineLink) {
          temp.push({
            attributeName: key,
            srcUUID: res.dynamicDefineLink[key].item1,
            defUUID: res.dynamicDefineLink[key].item2,
            type: res.dynamicDefineLink[key].item3,
          });
        }
        dynamicDefineLinkList.value = temp;
        let percentTemp: any = [];
        let wenduTemp: any = [];

        for (let key in res.staticDataDefineLink) {
          if (key == '运行状态') {
            runType.value.srcUUID = res.staticDataDefineLink[key].item1;
            runType.value.defUUID = res.staticDataDefineLink[key].item2;
            console.log(runType.value, 'runType.value');
          } else if (key == '主轴实时数据-转速') {
            if (
              res.staticDataDefineLink[key].item1 !== '' &&
              res.staticDataDefineLink[key].item2 !== ''
            ) {
              lineType1.value[0] = {
                name: '主轴-转速',
                srcUUID: res.staticDataDefineLink[key].item1,
                defUUID: res.staticDataDefineLink[key].item2,
              };
              getLineChartsData1();
            } else {
              lineType1.value = [];
            }
          } else if (key == '进给轴实时数据-速度') {
            if (
              res.staticDataDefineLink[key].item1 !== '' &&
              res.staticDataDefineLink[key].item2 !== ''
            ) {
              lineType4.value[0] = {
                name: '进给轴-速度',
                srcUUID: res.staticDataDefineLink[key].item1,
                defUUID: res.staticDataDefineLink[key].item2,
              };
              getLineChartsData4();
            } else {
              lineType4.value = [];
            }
          } else if (key.includes('电机温度')) {
            if (
              res.staticDataDefineLink[key].item1 !== '' &&
              res.staticDataDefineLink[key].item2 !== ''
            ) {
              wenduTemp.push({
                name: key,
                srcUUID: res.staticDataDefineLink[key].item1,
                defUUID: res.staticDataDefineLink[key].item2,
              });
            }
          } else if (key.includes('负载百分比')) {
            if (
              res.staticDataDefineLink[key].item1 !== '' &&
              res.staticDataDefineLink[key].item2 !== ''
            ) {
              percentTemp.push({
                name: key,
                srcUUID: res.staticDataDefineLink[key].item1,
                defUUID: res.staticDataDefineLink[key].item2,
              });
            }
          }
        }
        lineType2.value = percentTemp;
        lineType3.value = wenduTemp;
        getLineChartsData2();
        getLineChartsData3();
      })
      .catch(() => {});
  };
  getDeviceInfo(deviceUUId.value);
  const getLineChartsData1 = (timeRange?, count?) => {
    if (lineType1.value[0]?.srcUUID !== '' && lineType1.value[0]?.defUUID !== '') {
      let startTime = '';
      let endTime = '';
      if (radio1.value == 'day') {
        startTime = getDateTime('before', 24 * 3600);
        endTime = getDateTime('current');
      } else if (radio1.value == 'week') {
        startTime = getDateTime('before', 7 * 24 * 3600);
        endTime = getDateTime('current');
      }

      const params = {
        SrcUUID: lineType1.value[0]?.srcUUID,
        DefUUID: lineType1.value[0]?.defUUID,
        startTime,
        endTime,
        count: count ? count : 288,
      };
      GetTimeData(params)
        .then((res) => {
          let dataX: any = [];
          let dataY: any = [];
          res.queryList.forEach((item: any) => {
            dataX.push(item?.dateTime ?? '');
            dataY.push(item.data !== '' ? item.data : 0);
          });
          lineData1.value = {
            dataX: dataX,
            主轴转速: dataY,
          };
        })
        .catch(() => {});
    } else {
      lineData1.value = null;
    }
  };
  const getLineChartsData2 = async () => {
    if (lineType2.value.length > 0) {
      let tempObj: any = {};
      let startTime = '';
      let endTime = '';

      if (radio2.value == 'day') {
        startTime = getDateTime('before', 24 * 3600);
        endTime = getDateTime('current');
      } else if (radio2.value == 'week') {
        startTime = getDateTime('before', 7 * 24 * 3600);
        endTime = getDateTime('current');
      }
      for (let i = 0; i < lineType2.value.length; i++) {
        const params = {
          SrcUUID: lineType2.value[i]?.srcUUID,
          DefUUID: lineType2.value[i]?.defUUID,
          startTime,
          endTime,
          count: 288,
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
                tempObj[lineType2.value[i].name.replace('实时数据', '')] = dataY;
              } else {
                tempObj.dataX = dataX;
                tempObj[lineType2.value[i].name.replace('实时数据', '')] = dataY;
              }
            }
          })
          .catch(() => {});
      }
      console.log(tempObj, 'tempObj');
      lineData2.value = tempObj;
      //循环调接口进行数据处理
    } else {
      lineData2.value = null;
    }
  };
  const getLineChartsData3 = async () => {
    if (lineType3.value.length > 0) {
      let tempObj: any = {};
      let startTime = '';
      let endTime = '';

      if (radio3.value == 'day') {
        startTime = getDateTime('before', 24 * 3600);
        endTime = getDateTime('current');
      } else if (radio3.value == 'week') {
        startTime = getDateTime('before', 7 * 24 * 3600);
        endTime = getDateTime('current');
      }
      for (let i = 0; i < lineType3.value.length; i++) {
        const params = {
          SrcUUID: lineType3.value[i]?.srcUUID,
          DefUUID: lineType3.value[i]?.defUUID,
          startTime,
          endTime,
          count: 288,
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
                tempObj[lineType3.value[i].name.replace('实时数据', '')] = dataY;
              } else {
                tempObj.dataX = dataX;
                tempObj[lineType3.value[i].name.replace('实时数据', '')] = dataY;
              }
            }
          })
          .catch(() => {});
      }

      JSON.stringify(tempObj) === '{}' ? (lineData3.value = null) : (lineData3.value = tempObj);

      //循环调接口进行数据处理
    } else {
      lineData3.value = null;
    }
  };
  const getLineChartsData4 = () => {
    if (lineType4.value[0]?.srcUUID !== '' && lineType4.value[0]?.defUUID !== '') {
      let startTime = '';
      let endTime = '';

      if (radio4.value == 'day') {
        startTime = getDateTime('before', 24 * 3600);
        endTime = getDateTime('current');
      } else if (radio4.value == 'week') {
        startTime = getDateTime('before', 7 * 24 * 3600);
        endTime = getDateTime('current');
      }

      const params = {
        SrcUUID: lineType4.value[0]?.srcUUID,
        DefUUID: lineType4.value[0]?.defUUID,
        startTime,
        endTime,
        count: 288,
      };
      GetTimeData(params)
        .then((res) => {
          let dataX: any = [];
          let dataY: any = [];
          res.queryList.forEach((item: any) => {
            dataX.push(item?.dateTime ?? '');
            dataY.push(item.data !== '' ? item.data : 0);
          });
          lineData4.value = {
            dataX: dataX,
            进给轴速度: dataY,
          };
        })
        .catch(() => {});
    } else {
      lineData4.value = null;
    }
  };
  // lineData1.value = {
  //   dataX: [
  //     '2024-08-06 11:11:11',
  //     '2024-08-06 12:11:11',
  //     '2024-08-06 13:11:11',
  //     '2024-08-06 14:11:11',
  //     '2024-08-06 15:11:11',
  //   ],
  //   主轴转速: [110, 123, 100, 72, 130],
  //   // 主轴转速2: [123,100,72,110, 123],
  // };
  // setTimeout(() => {
  //   lineData2.value = {
  //     dataX: [
  //       '2024-08-06 11:11:11',
  //       '2024-08-06 12:11:11',
  //       '2024-08-06 13:11:11',
  //       '2024-08-06 14:11:11',
  //       '2024-08-06 15:11:11',
  //     ],
  //     主轴负载百分比: [110, 123, 100, 72, 130],
  //     工作台负载百分比: [123, 100, 72, 82, 110],
  //     竖直轴负载百分比: [100, 72, 130, 123, 100],
  //     进给轴负载百分比: [90, 82, 120, 112, 79],

  //     // 主轴转速2: [123,100,72,110, 123],
  //   };
  // }, 5000);
  // setTimeout(() => {
  //   lineData2.value = null;
  // }, 10000);
  // lineData2.value = {
  //   dataX: [
  //     '2024-08-06 11:11:11',
  //     '2024-08-06 12:11:11',
  //     '2024-08-06 13:11:11',
  //     '2024-08-06 14:11:11',
  //     '2024-08-06 15:11:11',
  //   ],
  //   主轴负载百分比: [110, 123, 100, 72, 130],
  //   工作台负载百分比: [123, 100, 72, 82, 110],
  //   竖直轴负载百分比: [100, 72, 130, 123, 100],
  //   进给轴负载百分比: [90, 82, 120, 112, 79],

  //   // 主轴转速2: [123,100,72,110, 123],
  // };
  // lineData3.value = {
  //   dataX: [
  //     '2024-08-06 11:11:11',
  //     '2024-08-06 12:11:11',
  //     '2024-08-06 13:11:11',
  //     '2024-08-06 14:11:11',
  //     '2024-08-06 15:11:11',
  //   ],
  //   主轴温度: [110, 123, 100, 72, 130],
  //   工作台温度: [123, 100, 72, 82, 130],
  // };
  // lineData4.value = {
  //   dataX: [
  //     '2024-08-06 11:11:11',
  //     '2024-08-06 12:11:11',
  //     '2024-08-06 13:11:11',
  //     '2024-08-06 14:11:11',
  //     '2024-08-06 15:11:11',
  //   ],
  //   主轴转速: [110, 123, 100, 72, 130],
  //   // 主轴转速2: [123,100,72,110, 123],
  // };

  // console.log(deviceUUId.value, 'route');
  onMounted(() => {
    // console.log(deviceUUId.value, 'onMountedroute');
    let element: any = document.querySelector('.vben-layout-content');
    element.style.overflow = 'auto';
  });
  // onActivated(() => {
  //   let element: any = document.querySelector('.vben-layout-content');
  //   element.style.overflow = 'auto';
  // });
  // watch(
  //   () => deviceUUId.value,
  //   () => {
  //     if (deviceUUId.value !== '') {
  //       on('open', (event) => {
  //         console.log('webSocket连接上服务器时', event);
  //         send(deviceUUId.value);
  //       });
  //     }
  //   },
  // );
  onUnmounted(() => {
    // console.log(deviceUUId.value, 'onUnmounted');
  });
</script>
<style scoped lang="less">
  @media screen and (max-width: 960px) {
    .left-page {
      width: 100%;
    }

    .right-page {
      width: 100%;
      margin-top: 8px;
    }
  }
  //中
  @media screen and (min-width: 960px) and (max-width: 1380px) {
    .left-page {
      width: 100%;
    }

    .right-page {
      width: 100%;
      margin-top: 8px;
    }
  }

  //中
  @media screen and (min-width: 1380px) and (max-width: 1536px) {
    // .left-page {
    //   width: 100%;
    // }

    // .right-page {
    //   width: 100%;
    //   margin-top: 8px;
    // }
    .left-page {
      width: 61.5%;
    }

    .right-page {
      width: 38%;
      // margin-top: 8px;
    }
  }

  @media screen and (min-width: 1536px) {
    .left-page {
      width: 54.5%;
    }

    .right-page {
      width: 45%;
    }
  }

  .top-box {
    box-shadow: 0 2px 9px 0 rgb(229 229 229 / 32%);
  }

  .left-box1 {
    border: 1px solid #e9e9e9;
    box-shadow: 0 1px 21px 0 rgb(38 46 45 / 6%);

    .left-box11 {
      border: 1px solid rgb(230 230 230 / 80%);
      border-radius: 10px;
      box-shadow: 0 15px 9px 0 rgb(229 229 229 / 32%);
    }
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

  .back {
    color: #0960bd;
    cursor: pointer;
  }

  .back:hover {
    color: #69b1ff;
  }

  .search {
    display: inline-block;
    color: #0960bd;
    cursor: pointer;
  }

  .search:hover {
    color: #69b1ff;
  }
</style>
