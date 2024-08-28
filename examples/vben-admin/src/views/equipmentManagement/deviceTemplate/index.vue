<!-- 设备列表 -->
<template>
  <BaseContainer>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button type="primary" @click="addDevice" style="margin-left: 2px">
          <template #icon><PlusOutlined /></template>新增设备</a-button
        >
        <a-button style="margin-left: 10px" @click="downloadExcel">
          <template #icon><VerticalAlignBottomOutlined /></template>当前查询数据</a-button
        >
        <a-button style="margin-left: 10px" @click="downloadAllExcel">
          <template #icon><VerticalAlignBottomOutlined /></template>全部数据</a-button
        >
      </template>
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'isSubscribed'">
          <div v-show="!record.isSubscribed">
            <Popconfirm
              title="确认订阅该设备?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="subDevice('add', record.uuid)"
            >
              <span class="text-yellow">
                <Icon icon="ant-design:star-outlined" :size="22" />
              </span>
            </Popconfirm>
          </div>
          <div v-show="record.isSubscribed">
            <Popconfirm
              title="确认取消订阅该设备?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="subDevice('del', record.uuid)"
            >
              <span class="text-yellow">
                <Icon icon="ant-design:star-filled" :size="22" />
              </span>
            </Popconfirm>
          </div>
        </template>
        <template v-if="column.key === 'imageUrl'">
          <TableImg :size="30" :simpleShow="true" :imgList="text" />
        </template>
        <template v-if="column.key === 'exFactoryTime'">
          {{ flitterDate(text) }}
        </template>
        <template v-if="column.key === 'warrantyDeadline'">
          {{ flitterDate(text) }}
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '详情',
                onClick: handleDetail.bind(null, record),
                disabled: record.deviceForm !== 'MachineTool', //
              },
              {
                label: '删除',
                popConfirm: {
                  title: '是否删除？',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>

    <Modal @register="registerModal" @refresh-table="refreshTable" />
  </BaseContainer>
</template>
<script lang="ts" setup>
  import Modal from './Modal.vue';
  import Icon from '@/components/Icon/Icon.vue';
  import BaseContainer from '@/components/BaseContainer.vue';
  import { useModal } from '@/components/Modal';
  import { FormSchema } from '@/components/Form';
  import { message, Popconfirm } from 'ant-design-vue';
  import { downloadByData } from '@/utils/file/download';
  import { BasicTable, useTable, BasicColumn, TableImg, TableAction } from '@/components/Table';
  import { VerticalAlignBottomOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { h, ref, computed } from 'vue';
  import { useUserStore } from '@/store/modules/user';
  import { flitterDate, flitterUUID, getIp } from '@/utils/simpleTools';
  import {
    AddSubDevice,
    DelSubDevice,
    GetDeviceList,
    DeleteOneDevice,
    GetDeviceListToExcel,
  } from '@/api/equipmentManagement/deviceTemplate';
  import { useGo } from '@/hooks/web/usePage';
  import { dataCalMethodDic } from '@/utils/commonDic';
  import { UUIDDiv, UUIDTypeEnum } from '@/components/UUIDDom';

  const go = useGo();
  const userStore = useUserStore();
  const userInfo: any = computed(() => {
    return userStore.getUserInfo || {};
  });
  const [registerModal, { openModal: addDevice }] = useModal();
  const refreshTable = () => {
    reload();
  };

  //Form字段配置
  const getSchamas = (): FormSchema[] => {
    return [
      {
        field: 'DeviceCode',
        component: 'Input',
        label: '设备编号',
        colProps: {
          span: 8,
        },
      },
      {
        field: 'Name',
        component: 'Input',
        label: '设备名称',
        colProps: {
          span: 8,
        },
      },
      {
        field: 'DeviceForm',
        component: 'Select',
        label: '设备类型',
        colProps: {
          span: 8,
        },
        componentProps: {
          options: [
            {
              label: '通用',
              value: 'Normal',
              key: 0,
            },
            {
              label: '机器人',
              value: 'Robot',
              key: 1,
            },
            {
              label: '机床',
              value: 'MachineTool',
              key: 2,
            },
          ],
        },
      },
      {
        field: 'DeviceModel',
        component: 'Input',
        label: '设备型号',
        colProps: {
          span: 8,
        },
      },
      {
        field: 'isSubscribed',
        component: 'Select',
        label: '是否订阅',
        colProps: {
          span: 8,
        },
        componentProps: {
          options: [
            {
              label: '订阅',
              value: true as any,
              key: 0,
            },
            {
              label: '未订阅',
              value: false as any,
              key: 1,
            },
          ],
        },
      },
      {
        field: 'DeviceType',
        component: 'Input',
        label: '设备用途',
        colProps: {
          span: 8,
        },
      },
      {
        field: 'Description',
        component: 'Input',
        label: '描述',
        colProps: {
          span: 8,
        },
      },
      {
        field: 'DeviceAddress',
        component: 'Input',
        label: '安装位置',
        colProps: {
          span: 8,
        },
      },
      {
        field: 'Manufacturer',
        component: 'Input',
        label: '生产厂家',
        colProps: {
          span: 8,
        },
      },
    ];
  };

  //表格配置
  const columns: BasicColumn[] = [
    {
      title: '订阅',
      dataIndex: 'isSubscribed',
      align: 'left',
      width: 70,
    },
    {
      title: 'UUID',
      dataIndex: 'uuid',

      customRender: ({ value, text, record }) => {
        if (!record?.uuid) {
          return h('span', '');
        }
        return h(UUIDDiv, {
          uuidType: UUIDTypeEnum.DeviceMemSync,
          uuid: record?.uuid,
          record: record,
        });
      },
    },
    {
      title: '设备照片',
      dataIndex: 'imageUrl',
      align: 'center',
    },
    {
      title: '设备编号',
      dataIndex: 'deviceCode',
      align: 'left',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: '设备类型',
      dataIndex: 'deviceForm',
      align: 'left',
      format: (text: any): any => {
        if (text == 'Normal') {
          return '通用';
        } else if (text == 'Robot') {
          return '机器人';
        } else if (text == '2') {
          return 'AGV';
        } else if (text == 'MachineTool') {
          return '机床';
        }
      },
    },
    {
      title: '设备型号',
      dataIndex: 'deviceModel',
      align: 'left',
    },
    {
      title: '设备用途',
      dataIndex: 'deviceType',
      align: 'left',
    },
    {
      title: '描述',
      dataIndex: 'description',
      align: 'left',
    },
    {
      title: '安装位置',
      dataIndex: 'deviceAddress',
      align: 'left',
    },
    {
      title: '生产厂家',
      dataIndex: 'manufacturer',
      align: 'left',
    },
    {
      title: '出厂时间',
      dataIndex: 'exFactoryTime',
      align: 'left',
    },
    {
      title: '保修截止时间',
      dataIndex: 'warrantyDeadline',
      align: 'left',
    },
    // {
    //   title: '运行状态',
    //   dataIndex: '',
    // },
    // {
    //   title: '健康状况',
    //   dataIndex: '',
    // },
  ];
  const [registerTable, { reload, getForm }] = useTable({
    api: GetDeviceList,
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
    actionColumn: {
      width: 120,

      title: '操作',
      dataIndex: 'action',
    },
  });
  const subDevice = (type, uuid) => {
    const params = { PerUUID: userInfo.value.uuid, DevUUID: uuid };
    if (type == 'add') {
      AddSubDevice(params)
        .then((res) => {
          message.success('订阅设备成功！');
          reload();
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (type == 'del') {
      DelSubDevice(params)
        .then((res) => {
          message.success('取消订阅设备成功！');
          reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const downloadExcel = () => {
    const params = getForm().getFieldsValue();
    let excelName = '';

    for (let key in params) {
      if (key == 'DeviceCode') {
        excelName = excelName + '-C' + params[key];
      }
      if (key == 'Name') {
        excelName = excelName + '-N' + params[key];
      }
      if (key == 'DeviceForm') {
        if (params[key] == 'Normal') {
          excelName = excelName + '-F通用';
        } else if (params[key] == 'Robot') {
          excelName = excelName + '-F机器人';
        } else if (params[key] == 'MachineTool') {
          excelName = excelName + '-F机床';
        }
      }
      if (key == 'DeviceModel') {
        excelName = excelName + '-M' + params[key];
      }

      if (key == 'DeviceType') {
        excelName = excelName + '-T' + params[key];
      }

      if (key == 'Description') {
        excelName = excelName + '-D' + params[key];
      }
      if (key == 'DeviceAddress') {
        excelName = excelName + '-A' + params[key];
      }
      if (key == 'Manufacturer') {
        excelName = excelName + '-M' + params[key];
      }
      if (key == 'isSubscribed') {
        if (params[key]) {
          excelName = excelName + '-S订阅';
        } else {
          excelName = excelName + '-S未订阅';
        }
      }
    }
    console.log('设备列表' + excelName + '.xlsx');
    GetDeviceListToExcel(params)
      .then((res) => {
        downloadByData(res.data, '设备列表' + excelName + '.xlsx');
      })
      .catch((err) => {});
  };
  const downloadAllExcel = () => {
    GetDeviceListToExcel({})
      .then((res) => {
        downloadByData(res.data, '设备列表.xlsx');
      })
      .catch((err) => {});
  };
  //删除
  const handleDelete = (record) => {
    // console.log('删除：', record);
    const params = {};
    const urlParams = `?uuid=${record.uuid}`;
    DeleteOneDevice(params, urlParams).then(() => {
      message.success('删除成功！');
      reload();
    });
  };
  //详情
  const handleDetail = (record) => {
    // go(`${getIp(0, true)}#/equipmentManagement/deviceTemplateDetail?uuid=${record.uuid}`);

    //跳转页面
    go('/equipmentManagement/deviceTemplateDetail/' + record.uuid);
  };
</script>
<style lang="less" scoped></style>
