<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="register"
    title="数据属性"
    :isDetail="true"
    @close="close"
  >
    <!-- <BasicForm @register="registerBasic" />
    <Divider style="height: 2px; background-color: #ccc" dashed />

    <BasicForm @register="registerMachine" /> -->

    <Card title="通用静态属性">
      <BasicForm @register="registerBasic" />
      <slot name="formFooter">
        <div class="flex justify-end">
          <a-button type="primary" @click="editOrSave">
            {{ basicState ? '编辑' : '保存' }}
          </a-button>
        </div>
      </slot>
    </Card>

    <!-- <Divider style="height: 2px; background-color: #7cb305" /> -->
    <Card title="机床静态属性" class="mt-4">
      <BasicForm @register="registerMachine" />
    </Card>
    <Card class="mt-4">
      <template #title>
        <div class="flex justify-start items-center">
          <span class="mr-4">动态属性</span>
          <a-button @click="addOrEditModal(true, { isEdit: false, uuid: deviceUUId, record: {} })"
            >添加</a-button
          >
        </div>
      </template>
      <Table
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        :scroll="{ y: tableHeight }"
        size="small"
        class="tableClass"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <a-button type="link" @click="editRow(record)">编辑</a-button>

            <Popconfirm
              title="确认删除?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="delRow(record)"
            >
              <a-button type="link">删除</a-button>
            </Popconfirm>
            <!-- <a-button type="link">删除</a-button> -->
          </template>
        </template>
      </Table>
      <AddEditDynamicModal
        @register="registerAddEditModal"
        @refresh-table="getDeviceInfo(deviceUUId)"
      />
    </Card>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicForm, useForm, FormSchema } from '@/components/Form';
  import { useModal } from '@/components/Modal';
  import {
    GetOneDevice,
    DeviceModifyStaticAttribute,
    DeviceDelDynamicAttributeLink,
    ModifyOneDevice,
  } from '@/api/equipmentManagement/deviceTemplateDetail';
  import AddEditDynamicModal from './AddEditDynamicModal.vue';

  import { Card, message, Table, Popconfirm, Divider } from 'ant-design-vue';
  import { FastForwardFilled, SearchOutlined } from '@ant-design/icons-vue';
  import { ref, inject, computed, onMounted, onUnmounted, onActivated, nextTick } from 'vue';
  import { useMessage } from '@/hooks/web/useMessage';

  import { compareObjects, oneCopyText } from '@/utils/simpleTools';

  import dayjs, { Dayjs } from 'dayjs';

  const { createConfirm } = useMessage();
  const reload: any = inject('reload');

  // setTimeout(() => {
  //   const deviceInfo: any = inject('deviceInfo');
  //   console.log(deviceInfo, 'deviceInfo');

  // });
  const tableHeight = ref(300);
  const historyBasicData = ref<any>({}); //存放通用静态属性修改前的值

  const historyMachineData = ref<any>(''); //存放机床静态属性修改前的值
  const basicState = ref<boolean>(true); //通用静态属性状态：编辑 、保存
  const tableData = ref([]);
  const deviceUUId = ref<any>('');
  const deviceInfo = ref<any>({});
  const [registerAddEditModal, { openModal: addOrEditModal }] = useModal();

  const [register] = useDrawerInner((data) => {
    data && onDataReceive(data);
  });
  const onDataReceive = (data) => {
    let e2: any = document.querySelector('.ant-drawer-body');
    e2.style.background = '#f4f4f4';
    deviceUUId.value = data.deviceUUId;
    getDeviceInfo(deviceUUId.value);
    nextTick(() => {
      initTableHeight();
    });
  };
  //获取单个设备信息并回显
  const getDeviceInfo = (uuid: any) => {
    const params = {
      uuid,
    };
    GetOneDevice(params)
      .then((res) => {
        console.log(res, 'res');
        deviceInfo.value = res;
        setBasicFieldsValue({
          name: deviceInfo.value?.name ?? '',
          deviceCode: deviceInfo.value?.deviceCode ?? '',
          deviceModel: deviceInfo.value?.deviceModel ?? '',
          manufacturer: deviceInfo.value?.manufacturer ?? '',
          exFactoryTime: deviceInfo.value?.exFactoryTime,
          deviceAddress: deviceInfo.value?.deviceAddress ?? '',
          description: deviceInfo.value?.description ?? '',
          isDataAccess: deviceInfo.value?.isDataAccess,
          warrantyTime: deviceInfo.value?.warrantyTime ?? '0',
          // name: deviceInfo.value?.name ?? '',
        });
        for (let key in deviceInfo.value?.staticAttribute) {
          if (key == 'PCU版本') {
            setMachineFieldsValue({ PCUVersion: deviceInfo.value?.staticAttribute[key] ?? '' });
          } else if (key == '操作系统') {
            setMachineFieldsValue({
              OperatingSystem: deviceInfo.value?.staticAttribute[key] ?? '',
            });
          } else if (key == '内存容量') {
            setMachineFieldsValue({ MemoryCapacity: deviceInfo.value?.staticAttribute[key] ?? '' });
          } else if (key == 'PLC版本') {
            setMachineFieldsValue({ PLCVersion: deviceInfo.value?.staticAttribute[key] ?? '' });
          } else if (key == 'CPU主频') {
            setMachineFieldsValue({ CPUFrequency: deviceInfo.value?.staticAttribute[key] ?? '' });
          } else if (key == '机床分类') {
            setMachineFieldsValue({
              MachineToolType: deviceInfo.value?.staticAttribute[key] ?? '',
            });
          }
        }
        let temp: any = [];
        for (let key in deviceInfo.value?.dynamicAttribute) {
          temp.push({
            attributeName: key,
            attributeValue: deviceInfo.value?.dynamicAttribute[key] ?? '',
          });
        }
        tableData.value = temp;
      })
      .catch(() => {});
  };
  //编辑机床静态数据
  const editMachineStaticValue = (nameCode: string, value: any, name: string) => {
    if (value !== historyMachineData.value) {
      const params = {
        uuid: deviceUUId.value,
        attributeName: name,
        attributeValue: value,
      };

      DeviceModifyStaticAttribute(params)
        .then((res: any) => {
          message.success(name + '修改成功！');
        })
        .catch((err) => {
          getDeviceInfo(deviceUUId.value);
        });
    }
  };
  const editOrSave = () => {
    if (!basicState.value) {
      //保存接口
      let tempObj = getBasicFieldsValue();

      const params = {
        options: compareObjects(tempObj, historyBasicData.value),
        uuid: deviceUUId.value,

        name: tempObj.name || '',
        description: tempObj.description || '',
        deviceAddress: tempObj.deviceAddress || '',
        deviceType: tempObj.deviceType || '',
        deviceCode: tempObj.deviceCode || '',
        manufacturer: tempObj.manufacturer || '',
        isDataAccess: tempObj.isDataAccess,
        deviceModel: tempObj.deviceModel || '',
        deviceBrand: tempObj.deviceBrand || '',
        exFactoryTime: tempObj.exFactoryTime,
        warrantyTime: tempObj.warrantyTime.toString(),
      };
      console.log(params, 'params');
      ModifyOneDevice(params)
        .then((res: any) => {
          message.success('保存成功！');
          getDeviceInfo(deviceUUId.value);
          basicState.value = !basicState.value;
        })
        .catch((err) => {
          getDeviceInfo(deviceUUId.value);
          // basicState.value = !basicState.value;
        });
    } else {
      historyBasicData.value = getBasicFieldsValue();
      console.log(historyBasicData.value, 'historyBasicData.value');
      basicState.value = !basicState.value;
    }
  };
  // //编辑基础静态数据
  // const editBasicStaticValue = (nameCode: string, value: any, name: string) => {
  //   console.log(nameCode, '-------', value, '-------', name);
  //   const params = {
  //     name: '',
  //     description: '',
  //     deviceAddress: '',
  //     deviceType: '',
  //     deviceCode: '',
  //     manufacturer: '',
  //     isDataAccess: false,
  //     deviceModel: '',
  //     deviceBrand: '',
  //     exFactoryTime: undefined,
  //     warrantyTime: undefined,
  //     uuid: deviceUUId.value,
  //     [nameCode]: value,
  //     options: [nameCode],
  //   };

  //   console.log(params, 'params========');

  //   ModifyOneDevice(params)
  //     .then((res: any) => {
  //       message.success(name + '修改成功！');
  //       getDeviceInfo(deviceUUId.value);
  //     })
  //     .catch((err) => {
  //       getDeviceInfo(deviceUUId.value);
  //     });
  // };
  const basicSchemas: FormSchema[] = [
    {
      field: 'name',
      component: 'Input',
      label: '设备名称',
      dynamicDisabled: computed(() => basicState.value) as any,
    },
    {
      field: 'deviceCode',
      component: 'Input',
      label: '设备编号',
      colProps: {
        offset: 2,
      },
      dynamicDisabled: computed(() => basicState.value) as any,
    },
    {
      field: 'deviceModel',
      component: 'Input',
      label: '设备型号',
      colProps: {
        offset: 2,
      },
      dynamicDisabled: computed(() => basicState.value) as any,
    },
    {
      field: 'manufacturer',
      component: 'Input',
      label: '生产厂家',
      dynamicDisabled: computed(() => basicState.value) as any,
    },

    {
      field: 'exFactoryTime',

      label: '生产日期',
      component: 'DatePicker',
      dynamicDisabled: computed(() => basicState.value) as any,

      componentProps: {
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        showTime: { format: 'HH:mm:ss' },
        allowClear: false,
      },
      colProps: {
        offset: 2,
      },
    },
    {
      field: 'warrantyTime',
      component: 'Input',
      label: '保修时长',
      dynamicDisabled: computed(() => basicState.value) as any,

      colProps: {
        offset: 2,
      },

      suffix: '天',
    },

    {
      field: 'deviceAddress',
      component: 'Input',
      label: '安装位置',
      dynamicDisabled: computed(() => basicState.value) as any,
    },
    {
      field: 'description',
      component: 'Input',
      label: '描述',
      dynamicDisabled: computed(() => basicState.value) as any,

      colProps: {
        offset: 2,
      },
    },
    {
      field: 'isDataAccess',
      component: 'Switch',
      label: '采集数据是否接入',
      dynamicDisabled: computed(() => basicState.value) as any,

      colProps: {
        offset: 2,
      },
    },
  ];
  const [
    registerBasic,
    { setFieldsValue: setBasicFieldsValue, getFieldsValue: getBasicFieldsValue },
  ] = useForm({
    layout: 'vertical',
    baseColProps: {
      span: 6,
    },
    schemas: basicSchemas,
    showActionButtonGroup: false,
  });
  const machineSchemas: FormSchema[] = [
    {
      field: 'MachineToolType',
      component: 'Input',
      label: '机床分类',
      componentProps: ({ formModel }) => {
        return {
          onFocus: () => {
            console.log(formModel.MachineToolType, 'MachineToolType');
            historyMachineData.value = formModel?.MachineToolType ?? '';
          },
          onBlur: (e: any) => {
            // console.log(formModel.MachineToolType, 'MachineToolType');
            editMachineStaticValue('MachineToolType', e.target.value, '机床分类');
          },
        };
      },
    },
    {
      field: 'PLCVersion',
      component: 'Input',
      label: 'PLC版本',
      colProps: {
        offset: 2,
      },
      componentProps: ({ formModel }) => {
        return {
          onFocus: () => {
            console.log(formModel.PLCVersion, 'PLCVersion');
            historyMachineData.value = formModel?.PLCVersion ?? '';
          },
          onBlur: (e: any) => {
            // console.log(formModel.MachineToolType, 'MachineToolType');
            editMachineStaticValue('PLCVersion', e.target.value, 'PLC版本');
          },
        };
      },
    },
    {
      field: 'PCUVersion',
      component: 'Input',
      label: 'PCU版本',
      colProps: {
        offset: 2,
      },
      componentProps: ({ formModel }) => {
        return {
          onFocus: () => {
            console.log(formModel.PCUVersion, 'PCUVersion');
            historyMachineData.value = formModel?.PCUVersion ?? '';
          },
          onBlur: (e: any) => {
            editMachineStaticValue('PCUVersion', e.target.value, 'PCU版本');
          },
        };
      },
    },
    {
      field: 'CPUFrequency',
      component: 'Input',
      label: 'CPU主频',
      componentProps: ({ formModel }) => {
        return {
          onFocus: () => {
            console.log(formModel.CPUFrequency, 'CPUFrequency');
            historyMachineData.value = formModel?.CPUFrequency ?? '';
          },
          onBlur: (e: any) => {
            editMachineStaticValue('CPUFrequency', e.target.value, 'CPU主频');
          },
        };
      },
    },

    {
      field: 'MemoryCapacity',
      component: 'Input',
      label: '内存容量',

      colProps: {
        offset: 2,
      },
      componentProps: ({ formModel }) => {
        return {
          onFocus: () => {
            console.log(formModel.MemoryCapacity, 'MemoryCapacity');
            historyMachineData.value = formModel?.MemoryCapacity ?? '';
          },
          onBlur: (e: any) => {
            editMachineStaticValue('MemoryCapacity', e.target.value, '内存容量');
          },
        };
      },
    },
    {
      field: 'OperatingSystem',
      component: 'Input',
      label: '操作系统',
      colProps: {
        offset: 2,
      },
      componentProps: ({ formModel }) => {
        return {
          onFocus: () => {
            console.log(formModel.OperatingSystem, 'OperatingSystem');
            historyMachineData.value = formModel?.OperatingSystem ?? '';
          },
          onBlur: (e: any) => {
            editMachineStaticValue('OperatingSystem', e.target.value, '操作系统');
          },
        };
      },
    },
  ];
  const [registerMachine, { setFieldsValue: setMachineFieldsValue }] = useForm({
    layout: 'vertical',
    baseColProps: {
      span: 6,
    },
    schemas: machineSchemas,
    showActionButtonGroup: false,
  });
  const columns = [
    {
      title: '属性名称',
      dataIndex: 'attributeName',
    },
    {
      title: '属性值',
      dataIndex: 'attributeValue',
    },

    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 200,
    },
  ];
  const close = () => {
    basicState.value = true;
    let element: any = document.querySelector('.vben-layout-content');
    element.style.overflow = 'auto';
    // if (basicState.value) {
    //   reload();
    //   let element: any = document.querySelector('.vben-layout-content');
    //   element.style.overflow = 'auto';
    //   visible.value = false;
    // } else {
    //   visible.value = true;

    //   createConfirm({
    //     iconType: 'warning',
    //     title: '提示',
    //     content: '通用静态还没保存，是否返回设备详情页？',
    //     // title: () => h('span', t('sys.app.logoutTip')),
    //     // content: () => h('span', t('sys.app.logoutMessage')),
    //     onOk: () => {
    //       reload();
    //       let element: any = document.querySelector('.vben-layout-content');
    //       element.style.overflow = 'auto';
    //       visible.value = true;
    //     },
    //   });
    // }
  };
  const editRow = (record) => {
    addOrEditModal(true, { isEdit: true, uuid: deviceUUId, record: record });
  };
  const delRow = (record) => {
    const params = {
      uuid: deviceUUId.value,
      attribute: [record.attributeName],
    };
    DeviceDelDynamicAttributeLink(params)
      .then((result) => {
        message.success('删除成功！');
        getDeviceInfo(deviceUUId.value);
      })
      .catch((err) => {});
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

<style lang="less" scoped>
  .tableDiv {
    /* height: calc(100% - 60px); */
    margin-top: 15px;
  }

  ::v-deep(.ant-picker) {
    width: 100%;
  }

  // ::v-deep(.ant-drawer-body) {
  //   background: red !important;
  // }
</style>
