<template>
  <div class="w-100% h-100% relative overflow-hidden">
    <BoxHeader title="保修到期时间" />
    <div class="header-slot">
      <RadioGroup v-model:value="radioTimePeriod" @change="init" size="small">
        <RadioButton :value="true"> 已到期 </RadioButton>
        <RadioButton :value="false"> 未到期 </RadioButton>
      </RadioGroup>
    </div>
    <div class="box-container">
      <!-- 自定义表格样式展示 -->
      <table v-show="!loading && tableData.length > 0" class="rounded-table">
        <thead>
          <tr :class="radioTimePeriod === false ? 'isRadioTimePeriod' : ''">
            <th>设备名称</th>
            <th>出厂时间</th>
            <th>保修到期时间</th>
            <th>{{ radioTimePeriod === false ? '保修剩余时间' : '已到期时间' }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in tableData.slice(0, MAX_SHOW_LENGTH)"
            :key="index"
            style="height: 30px"
            :class="radioTimePeriod === false ? 'isRadioTimePeriod' : ''"
          >
            <td>{{ item.status }}</td>
            <td>{{ item.exFactoryTime }}</td>
            <td>{{ item.warrantyDeadline }}</td>
            <td>{{ Math.abs(item.num) }}天</td>
          </tr>
        </tbody>
      </table>
      <div v-show="!loading && tableData.length === 0">
        <Empty :image="simpleImage" />
      </div>
      <Loading style="margin-top: 10px" :loading="loading" :absolute="true" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import BoxHeader from './BoxHeader.vue';
  import { onUnmounted, Ref, ref, watch } from 'vue';
  import { RadioButton, RadioGroup, Empty } from 'ant-design-vue';
  import { OverviewGetWarrantyTimeAsc } from '@/api/equipmentManagement/equipmentOverviewTidy';
  import { flitterObject } from '@/utils/simpleTools';
  import { Loading } from '@/components/Loading';

  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

  const radioTimePeriod = ref<true | false>(true); // 是否到期

  const MAX_SHOW_LENGTH = 7; // 最多显示的条目数

  // const tempData = [
  //   {
  //     status: '设备名称1',
  //     exFactoryTime: '2024-01-01',
  //     warrantyDeadline: '2025-01-01',
  //     num: '-35天',
  //   },
  //   {
  //     status: '设备名称2',
  //     exFactoryTime: '2024-01-01',
  //     warrantyDeadline: '2025-01-01',
  //     num: '-5天',
  //   },
  //   {
  //     status: '设备名称3',
  //     exFactoryTime: '2024-01-01',
  //     warrantyDeadline: '2025-01-01',
  //     num: '0天',
  //   },
  //   {
  //     status: '设备名称4',
  //     exFactoryTime: '2024-01-01',
  //     warrantyDeadline: '2025-01-01',
  //     num: '365天',
  //   },
  //   {
  //     status: '设备名称5',
  //     exFactoryTime: '2024-01-01',
  //     warrantyDeadline: '2025-01-01',
  //     num: '365天',
  //   },
  //   {
  //     status: '设备名称6',
  //     exFactoryTime: '2024-01-01',
  //     warrantyDeadline: '2025-01-01',
  //     num: '365天',
  //   },
  //   {
  //     status: '设备名称7',
  //     exFactoryTime: '2024-01-01',
  //     warrantyDeadline: '2025-01-01',
  //     num: '365天',
  //   },
  //   {
  //     status: '设备名称8',
  //     exFactoryTime: '2024-01-01',
  //     warrantyDeadline: '2025-01-01',
  //     num: '365天',
  //   },
  // ];

  const props = defineProps({
    queryParams: Object,
  });

  //表格配置
  const columns = [
    {
      title: '设备名称',
      dataIndex: 'status',
    },
    {
      title: '出厂时间',
      dataIndex: 'exFactoryTime',
    },
    {
      title: '保修到期时间',
      dataIndex: 'warrantyDeadline',
    },
    {
      title: '保修剩余时间',
      dataIndex: 'num',
    },
  ];

  let timerQuery; // 定时器
  const loading = ref(false);
  const tableData = ref<any[]>([]);

  const scrollList = () => {
    clearInterval(timerQuery);
    timerQuery = setInterval(() => {
      let lstResult: any = tableData.value;
      if (tableData.value.length > MAX_SHOW_LENGTH) {
        let tempValue1 = lstResult.shift();
        lstResult.push(tempValue1);
        tableData.value = lstResult;
      }
    }, 4000);
  };

  const init = () => {
    tableData.value = [];
    let urlParams: any = {};
    urlParams = flitterObject(props.queryParams, ['isQuery']);
    urlParams.ShowOutWarranty = radioTimePeriod.value;
    loading.value = true;
    OverviewGetWarrantyTimeAsc({}, urlParams)
      .then((res: any) => {
        // console.log('res------>', res);
        res &&
          res.forEach((item) => {
            tableData.value.push({
              status: item.status,
              warrantyDeadline: item.warrantyDeadline,
              exFactoryTime: item.exFactoryTime,
              num: item.num,
            });
          });
        loading.value = false;
        scrollList();
      })
      .catch(() => {
        loading.value = false;
        tableData.value = [];
        scrollList();
      });
  };

  onUnmounted(() => {
    clearInterval(timerQuery);
  });

  watch(
    () => props.queryParams,
    (val: any) => {
      if (val.isQuery) {
        // 初始化数据
        init();
      }
    },
    {
      immediate: true,
      deep: true,
    },
  );
</script>
<style lang="less" scoped>
  .box-container {
    display: flex;
    // position: relative; // 这里不加，因为没有高度，会影响加载组件位置
    align-items: center;
    justify-content: center;
    // height: calc(100% - 30px); // 这里不加高度，不然表格行高会被撑开
    padding: 5px 5px 0;
  }

  .header-slot {
    position: absolute;
    top: 2px;
    right: 5px;
  }

  table {
    width: 100%;
    height: 100%;

    thead {
      tr {
        height: 35px;
        // background: rgb(174 222 245 / 100%);
        //
        background: #f87c91e0;
        color: rgb(82 81 79);
        font-family: 'Source Han Sans CN', '微软雅黑';
        font-size: 14px;
        font-weight: bold;

        th {
          text-align: center;
        }

        &.isRadioTimePeriod {
          background: #63c3ffa6;
        }
      }
    }

    tbody {
      tr {
        flex-shrink: 0; // 表格高度不会因为flex 而撑高
        height: 28px;
        color: #0e0e0e;
        font-family: 'Source Han Sans CN', '微软雅黑';
        font-size: 14px;
        font-weight: 400;

        &:nth-child(2n) {
          // background: rgb(174 222 245 / 64.4%);
          background: #f87c90a8;
        }

        td {
          text-align: center;
        }

        &.isRadioTimePeriod {
          &:nth-child(2n) {
            background: #63c3ff65;
          }
        }
      }
    }
  }

  // .rounded-table {
  //   width: 100%;
  //   height: 100%;
  //   border-collapse: collapse;
  //   border: 2px solid #ccc0;
  //   border-radius: 5px; /* 设置整个表格的圆角 */
  // }

  // .rounded-table th,
  // .rounded-table td {
  //   height: 37px;
  //   padding: 8px;
  //   border: 1px solid #ccc0;
  //   text-align: left;
  // }

  // .rounded-table tr {
  //   height: 30px;
  // }

  // .rounded-table th:first-child {
  //   border-top-left-radius: 5px; /* 左上角圆角 */
  // }

  // .rounded-table th:last-child {
  //   border-top-right-radius: 5px; /* 右上角圆角 */
  // }

  // .rounded-table tr:last-child td:first-child {
  //   border-bottom-left-radius: 5px; /* 左下角圆角 */
  // }

  // .rounded-table tr:last-child td:last-child {
  //   border-bottom-right-radius: 5px; /* 右下角圆角 */
  // }
</style>
