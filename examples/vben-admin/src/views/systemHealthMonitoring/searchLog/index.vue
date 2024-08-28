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
          {{ expendTime(text) }}
        </template>
      </template>
    </BasicTable>
  </BaseContainer>
</template>
<script lang="ts" setup>
  import BaseContainer from '@/components/BaseContainer.vue';
  import { FormSchema } from '@/components/Form';
  import { BasicTable, useTable, BasicColumn, TableImg } from '@/components/Table';
  import {
    GetSystemGetLogList,
    GetSystemGetLogListToExcel,
  } from '@/api/systemHealthMonitoring/searchLog';

  // import { message } from '@ant-design';
  import { message } from 'ant-design-vue';

  import { VerticalAlignBottomOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { h, ref, computed, unref, toRaw, inject, watch, useAttrs, useSlots } from 'vue';
  import { flitterDate, formatDate } from '@/utils/simpleTools';
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
        field: 'paramSrc',
        component: 'Input',
        label: '参数-数据源',

        colProps: {
          span: 8,
        },
        componentProps: ({ formModel }) => {
          return {
            onChange: (e) => {
              // getURL();
              getForm()
                .validateFields()
                .then((res) => {})
                .catch((err) => {});
            },
          };
        },
        dynamicRules: ({ values }) => {
          if (values?.paramDef && values?.paramDef !== '') {
            console.log(values?.defineParam, 'console.log(values?.defineParam)');
            return [{ required: true, message: '请输入参数-数据源！' }];
          } else {
            return [{ required: false }];
          }
        },
      },
      {
        field: 'paramDef',
        component: 'Input',
        label: '参数-数据定义',
        colProps: {
          span: 8,
        },
        componentProps: ({ formModel }) => {
          return {
            onChange: (e) => {
              // getURL();
              getForm()
                .validateFields()
                .then((res) => {})
                .catch((err) => {});
            },
          };
        },
        dynamicRules: ({ values }) => {
          if (values?.paramSrc && values?.paramSrc !== '') {
            return [{ required: true, message: '请输入参数-数据定义！' }];
          } else {
            return [{ required: false }];
          }
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
      width: 100,
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      align: 'left',
      width: 100,
    },
    {
      title: '参数-数据源',
      dataIndex: 'paramSrc',
      align: 'left',
      width: 260,
    },
    {
      title: '参数-数据定义',
      dataIndex: 'paramDef',
      align: 'left',
      width: 260,
    },
    {
      title: '接口行为',
      dataIndex: 'path',
      align: 'left',
      width: 180,
    },

    {
      title: '请求结果',
      dataIndex: 'resFlag',
      align: 'left',
      width: 100,
    },
    {
      title: '网络请求状态码',
      dataIndex: 'statusCode',
      align: 'left',
      width: 130,
    },
    {
      title: '查询次数',
      dataIndex: 'count',
      align: 'left',
      width: 80,
    },
    // {
    //   title: '频率(次/min)',
    //   dataIndex: 'count',
    //   align: 'left',
    //   width: 100,
    // },

    {
      title: '日期',
      dataIndex: 'time',
      align: 'left',
      width: 260,
    },
  ];
  // validateFields, clearValidate, getFieldsValue
  const [registerTable, { getForm }] = useTable({
    api: GetSystemGetLogList,
    columns: columns,
    formConfig: {
      labelWidth: 110,
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
    // rowKey: 'uuid',
  });
  const downloadExcel = () => {
    getForm()
      .validateFields()
      .then((res) => {
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
          if (key == 'paramSrc') {
            excelName = excelName + '-PS' + params[key];
          }
          if (key == 'paramDef') {
            excelName = excelName + '-PD' + params[key];
          }
        }
        GetSystemGetLogListToExcel(params)
          .then((res) => {
            downloadByData(res.data, 'SearchLog' + excelName + '.xlsx');
          })
          .catch((err) => {});
      })
      .catch((err) => {
        message.warning('请先完善查询条件！');
      });
  };
  const downloadAllExcel = () => {
    GetSystemGetLogListToExcel({})
      .then((res) => {
        downloadByData(res.data, 'SearchLog.xlsx');
      })
      .catch((err) => {});
  };
  const expendTime = (time) => {
    let timeTemp = new Date(time);
    let afterOneMin = formatDate(timeTemp.setMinutes(timeTemp.getMinutes() + 1));
    return time + '~' + afterOneMin.slice(-5) + '.000';
    // console.log(time, 'time', afterOneMin.slice(-5));
  };
</script>
<style lang="less" scoped>
  ::v-deep(.ant-picker) {
    width: 100%;
  }
</style>
