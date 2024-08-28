<template>
  <div class="w-100% h-100% serverHealth-ServeRate">
    <Card style="width: 100%; height: 100%">
      <template #title>
        <div class="w-100% h-100% flex justify-between">
          <div>服务器历史信息 </div>
          <RadioGroup v-model:value="radio" size="small" @change="dateChange">
            <RadioButton value="week"> 7*24小时 </RadioButton>
            <RadioButton value="day"> 24小时 </RadioButton>
          </RadioGroup>
          <!-- <div> </div> -->
        </div>
      </template>
      <!-- 卡片具体内容 -->
      <div class="ml-2 w-98% h-100% flex justify-around flex-wrap">
        <div class="w-49% h-50%"><LineCharts :echartsData="cpuData" :title="'CPU'" /></div>
        <div class="w-49% h-50%"><LineCharts :echartsData="diskData" :title="'磁盘IO'" /></div>
        <div class="w-49% h-50%"><LineCharts :echartsData="memData" :title="'内存'" /></div>
        <div class="w-49% h-50%"><LineCharts :echartsData="netData" :title="'网络IO'" /></div>
      </div>
    </Card>
  </div>
</template>
<script lang="ts" setup>
  import { PropType, Ref, ref, watch, computed, onMounted, onUnmounted } from 'vue';
  import { Tooltip, Card, RadioButton, RadioGroup } from 'ant-design-vue';

  import LineCharts from './LineCharts.vue';
  import {
    GetCpuData,
    GetMemData,
    GetNetData,
    GetDiskData,
  } from '@/api/systemHealthMonitoring/serverHealth';
  import { useGlobSetting } from '@/hooks/setting';

  const { ipList, virtualIp } = useGlobSetting();
  const server = ipList?.split(';');
  const IPList = ref(server ? server : []);
  const radio = ref<string>('day');
  const dateChange = (e: any) => {
    getData(radio.value);
    // console.log('ee', e, radio.value);
  };
  const cpuData = ref<any>({});
  const memData = ref<any>({});
  const netData = ref<any>({});
  const diskData = ref<any>({});
  const getDateString = (hours: number) => {
    // 获取当前时间
    const now = new Date();
    // 计算n 小时前的时间
    const last = new Date(now.getTime() - hours * 60 * 60 * 1000);
    // 格式化时间字符串，例如 "2023-09-02 10:00:00"
    const nowStr =
      now.getFullYear() +
      '-' +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      now.getDate().toString().padStart(2, '0') +
      ' ' +
      now.getHours().toString().padStart(2, '0') +
      ':' +
      now.getMinutes().toString().padStart(2, '0') +
      ':' +
      now.getSeconds().toString().padStart(2, '0');
    console.log(nowStr, 'nowStr');
    const lastStr =
      last.getFullYear() +
      '-' +
      (last.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      last.getDate().toString().padStart(2, '0') +
      ' ' +
      last.getHours().toString().padStart(2, '0') +
      ':' +
      last.getMinutes().toString().padStart(2, '0') +
      ':' +
      last.getSeconds().toString().padStart(2, '0');
    return {
      now: nowStr,
      last: lastStr,
    };
  };
  const getData = (val: string) => {
    let params = { startTime: '', endTime: '', count: 200 };
    if (val == 'day') {
      const { now, last } = getDateString(24);
      params.startTime = last;
      params.endTime = now;
    } else if (val == 'week') {
      const { now, last } = getDateString(7 * 24);
      params.startTime = last;
      params.endTime = now;
    }
    GetCpuData(params)
      .then((res) => {
        let temp: any = {};
        Reflect.set(temp, 'dataX', []);
        IPList.value.forEach((item) => {
          Reflect.set(temp, item, []);
        });
        res.forEach((item) => {
          temp.dataX.push(item.dateTime);
          item.cpuHistoryInfos.forEach((el) => {
            Object.keys(temp).forEach((v) => {
              if (el.nodeIp == v) {
                temp[v].push(Number(el.cpuUseRate));
              }
            });
          });
        });
        cpuData.value = temp;
      })
      .catch((err) => {
        console.log(err);
      });

    GetMemData(params)
      .then((res) => {
        let temp: any = {};
        Reflect.set(temp, 'dataX', []);
        IPList.value.forEach((item) => {
          Reflect.set(temp, item, []);
        });
        res.forEach((item) => {
          temp.dataX.push(item.dateTime);
          item.memHistoryInfos.forEach((el) => {
            Object.keys(temp).forEach((v) => {
              if (el.nodeIp == v) {
                temp[v].push(Number(el.memUseRate));
              }
            });
          });
        });
        memData.value = temp;
      })
      .catch((err) => {
        console.log(err);
      });

    GetDiskData(params)
      .then((res) => {
        let temp: any = {};
        Reflect.set(temp, 'dataX', []);
        IPList.value.forEach((item) => {
          Reflect.set(temp, item, []);
        });
        res.forEach((item) => {
          temp.dataX.push(item.dateTime);
          item.diskHistoryInfos.forEach((el) => {
            Object.keys(temp).forEach((v) => {
              if (el.nodeIp == v) {
                let value1 = Number(el.diskRecvByte) ? Number(el.diskRecvByte) : 0;
                let value2 = Number(el.diskSendByte) ? Number(el.diskSendByte) : 0;
                temp[v].push((value1 + value2).toFixed(2));
              }
            });
          });
        });
        diskData.value = temp;
      })
      .catch((err) => {
        console.log(err);
      });
    GetNetData(params)
      .then((res) => {
        let temp: any = {};
        Reflect.set(temp, 'dataX', []);
        IPList.value.forEach((item) => {
          Reflect.set(temp, item, []);
        });
        res.forEach((item) => {
          temp.dataX.push(item.dateTime);
          item.netHistoryInfos.forEach((el) => {
            Object.keys(temp).forEach((v) => {
              if (el.nodeIp == v) {
                let value1 = Number(el.netRecvByte) ? Number(el.netRecvByte) : 0;
                let value2 = Number(el.netSendByte) ? Number(el.netSendByte) : 0;
                temp[v].push((value1 + value2).toFixed(2));
              }
            });
          });
        });
        netData.value = temp;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  getData('day');
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
