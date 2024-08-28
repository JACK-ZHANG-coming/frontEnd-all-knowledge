<!-- 系统日志 -->

<template>
  <BaseContainer>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button style="margin-left: 10px" @click="downloadExcel">
          <template #icon><VerticalAlignBottomOutlined /></template>当前查询数据</a-button
        >
        <a-button style="margin-left: 10px" @click="downloadAllExcel">
          <template #icon><VerticalAlignBottomOutlined /></template>全部数据</a-button
        >
      </template>
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'time'">
          {{ flitterDate(text) }}
        </template>
      </template>
    </BasicTable>
  </BaseContainer>
</template>
<script lang="ts" setup>
  import Icon from '@/components/Icon/Icon.vue';
  import BaseContainer from '@/components/BaseContainer.vue';
  import { FormSchema } from '@/components/Form';
  import { BasicTable, useTable, BasicColumn, TableImg } from '@/components/Table';
  import {
    GetSystemLogList,
    GetSystemLogListToExcel,
  } from '@/api/systemHealthMonitoring/systemLog';
  import { VerticalAlignBottomOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { h, ref, computed, unref, toRaw, inject, watch, useAttrs, useSlots } from 'vue';
  import { flitterDate, flitterUUID } from '@/utils/simpleTools';
  import {
    downloadByUrl,
    downloadByData,
    downloadByBase64,
    downloadByOnlineUrl,
  } from '@/utils/file/download';
  //Form字段配置
  const getSchamas = (): FormSchema[] => {
    return [
      {
        field: 'startTime',
        component: 'DatePicker',
        componentProps: {
          format: 'YYYY-MM-DD HH:mm:ss',
          showTime: { format: 'HH:mm:ss' },
        },
        label: '开始时间',
        colProps: {
          span: 8,
        },
      },
      {
        field: 'endTime',
        component: 'DatePicker',
        componentProps: {
          format: 'YYYY-MM-DD HH:mm:ss',
          showTime: { format: 'HH:mm:ss' },
        },
        label: '结束时间',
        colProps: {
          span: 8,
        },
      },
      {
        field: 'controllerType',
        component: 'Select',
        label: '控制器类型',
        colProps: {
          span: 8,
        },
        componentProps: {
          options: [
            {
              label: '系统健康',
              value: 'SystemHealth',
              key: 0,
            },
            {
              label: '数据通道',
              value: 'DataChannel',
              key: 1,
            },
            {
              label: '数据源',
              value: 'DataSource',
              key: 2,
            },
            {
              label: '数据定义',
              value: 'DataDef',
              key: 3,
            },
            {
              label: '设备',
              value: 'Device',
              key: 4,
            },
            {
              label: '数据采集',
              value: 'DataVision',
              key: 5,
            },
            {
              label: '内部数据',
              value: 'InnerData',
              key: 6,
            },
            {
              label: '人员',
              value: 'Person',
              key: 7,
            },
            {
              label: '权限',
              value: 'Role',
              key: 8,
            },
          ],
        },
      },
      {
        field: 'resFlag',
        component: 'Input',
        label: '请求结果',
        colProps: {
          span: 8,
        },
      },
      {
        field: 'user',
        component: 'Input',
        label: '用户',
        colProps: {
          span: 8,
        },
      },
    ];
  };

  //表格配置
  const columns: BasicColumn[] = [
    {
      title: '用户',
      dataIndex: 'user',
      align: 'left',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      align: 'left',
    },

    {
      title: '接口行为',
      dataIndex: 'path',
      align: 'left',
    },
    {
      title: '请求结果',
      dataIndex: 'resFlag',
      align: 'left',
    },
    {
      title: '网络请求状态码',
      dataIndex: 'statusCode',
      align: 'left',
    },
    {
      title: '响应时间(ms)',
      dataIndex: 'duration',
      align: 'left',
    },
    {
      title: '日期',
      dataIndex: 'time',
      align: 'left',
    },
  ];
  const [registerTable, { getForm }] = useTable({
    api: GetSystemLogList,
    columns: columns,
    formConfig: {
      labelWidth: 90,
      schemas: getSchamas(),
      labelAlign: 'left',
      actionColOptions: { span: 24 },
      rowProps: {
        gutter: [60, 10],
      },
    },
    // bordered: true,
    showTableSetting: true,
    useSearchForm: true,
    tableSetting: { fullScreen: true },
    rowKey: 'uuid',
  });
  const downloadExcel = () => {
    const params = getForm().getFieldsValue();
    let excelName = '';
    for (let key in params) {
      if (key == 'startTime') {
        excelName = excelName + '-S' + params[key].replace(/[\s:-]/g, '').slice(2);
      }
      if (key == 'endTime') {
        excelName = excelName + '-E' + params[key].replace(/[\s:-]/g, '').slice(2);
      }

      if (key == 'controllerType') {
        excelName = excelName + '-CO' + params[key];
      }
      if (key == 'resFlag') {
        excelName = excelName + '-R' + params[key];
      }
      if (key == 'user') {
        excelName = excelName + '-U' + params[key];
      }
    }
    GetSystemLogListToExcel(params)
      .then((res) => {
        downloadByData(res.data, 'SystemLog' + excelName + '.xlsx');
      })
      .catch((err) => {});
  };
  const downloadAllExcel = () => {
    GetSystemLogListToExcel({})
      .then((res) => {
        downloadByData(res.data, 'SystemLog.xlsx');
      })
      .catch((err) => {});
  };
</script>
<style lang="less" scoped>
  ::v-deep(.ant-picker) {
    width: 100%;
  }
</style>
