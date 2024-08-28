<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="新增设备"
    @ok="validateForm"
    @cancel="reset"
    width="50%"
    :maskClosable="false"
  >
    <div class="pt-3px pr-3px">
      <BasicForm @register="registerForm" :model="modelRef" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { ref } from 'vue';
  import { BasicModal, useModal } from '@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import {
    CreateNormalDevice,
    CreateRobotDevice,
    CreateOneDevice,
  } from '@/api/equipmentManagement/deviceTemplate';
  const $emit = defineEmits(['refreshTable']);

  const modelRef = ref({});
  const schemas: FormSchema[] = [
    {
      field: 'DeviceForm',
      component: 'Select',
      label: '设备类型',
      colProps: {
        span: 12,
      },
      dynamicRules: ({ values }) => {
        return [{ required: true, message: '必填项！' }];
      },
      componentProps: {
        options: [
          {
            label: '普通设备',
            value: 'Normal',
            key: 'Normal',
          },
          {
            label: '机器人',
            value: 'Robot',
            key: 'Robot',
          },
          {
            label: '机床',
            value: 'MachineTool',
            key: 'Robot',
          },
        ],
      },
      defaultValue: 'Normal',
    },
    {
      field: 'Name',
      component: 'Input',
      label: '设备名称',
      colProps: {
        span: 12,
      },
      dynamicRules: ({ values }) => {
        return [{ required: true, message: '必填项！' }];
      },
    },
    {
      field: 'DeviceCode',
      component: 'Input',
      label: '设备编号',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'DeviceModel',
      component: 'Input',
      label: '设备型号',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'Description',
      component: 'Input',
      label: '设备描述',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'DeviceType',
      component: 'Input',
      label: '设备用途',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'DeviceAddress',
      component: 'Input',
      label: '设备地址',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'DeviceBrand',
      component: 'Input',
      label: '设备品牌',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'Manufacturer',
      component: 'Input',
      label: '生产厂家',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'ExFactoryTime',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: { format: 'HH:mm:ss' },
      },
      label: '生产日期',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'WarrantyTime',
      component: 'InputNumber',
      label: '保修时间(天)',
      colProps: {
        span: 12,
      },
    },

    {
      field: 'NumOfAxis',
      component: 'InputNumber',
      label: '机器人轴数',
      colProps: {
        span: 12,
      },
      show: ({ values }) => {
        return values.DeviceForm == 'Robot';
      },
    },
    {
      field: 'MachineToolType',
      component: 'Input',
      label: '机床分类',
      colProps: {
        span: 12,
      },
      show: ({ values }) => {
        return values.DeviceForm == 'MachineTool';
      },
    },
    {
      field: 'PLCVersion',
      component: 'Input',
      label: 'PLC版本',
      colProps: {
        span: 12,
      },
      show: ({ values }) => {
        return values.DeviceForm == 'MachineTool';
      },
    },
    {
      field: 'PCUVersion',
      component: 'Input',
      label: 'PCU版本',
      colProps: {
        span: 12,
      },
      show: ({ values }) => {
        return values.DeviceForm == 'MachineTool';
      },
    },
    {
      field: 'CPUFrequency',
      component: 'Input',
      label: 'CPU主频',
      colProps: {
        span: 12,
      },
      show: ({ values }) => {
        return values.DeviceForm == 'MachineTool';
      },
    },
    {
      field: 'MemoryCapacity',
      component: 'Input',
      label: '内存容量',
      colProps: {
        span: 12,
      },
      show: ({ values }) => {
        return values.DeviceForm == 'MachineTool';
      },
    },
    {
      field: 'OperatingSystem',
      component: 'Input',
      label: '操作系统',
      colProps: {
        span: 12,
      },
      show: ({ values }) => {
        return values.DeviceForm == 'MachineTool';
      },
    },
  ];

  const [registerForm, { validateFields, clearValidate, resetFields }] = useForm({
    labelWidth: 100,
    schemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });
  const [register, { closeModal }] = useModal();

  //保存校验
  async function validateForm() {
    try {
      const res = await validateFields();
      if (res.DeviceForm == 'Normal') {
        //调创建普通设备接口
        const params: any = {
          Name: res.Name ? res.Name : '',
          Description: res.Description ? res.Description : '',
          DeviceAddress: res.DeviceAddress ? res.DeviceAddress : '',
          DeviceCode: res.DeviceCode ? res.DeviceCode : '',
          Manufacturer: res.Manufacturer ? res.Manufacturer : '',
          DeviceModel: res.DeviceModel ? res.DeviceModel : '',
          DeviceBrand: res.DeviceBrand ? res.DeviceBrand : '',
          DeviceType: res.DeviceType ? res.DeviceType : '',
        };
        if (res.ExFactoryTime !== undefined) {
          params.ExFactoryTime = res.ExFactoryTime;
        }
        if (res.WarrantyTime !== undefined) {
          params.WarrantyTime = res.WarrantyTime;
        }

        CreateNormalDevice(params)
          .then((res) => {
            message.success('添加设备成功！');
            $emit('refreshTable');
            reset();
            closeModal();
          })
          .catch((err) => {
            console.log(err);
            // message.error(err);
          });
      } else if (res.DeviceForm == 'Robot') {
        //调创建机器人设备接口
        const params: any = {
          Name: res.Name ? res.Name : '',
          Description: res.Description ? res.Description : '',
          DeviceAddress: res.DeviceAddress ? res.DeviceAddress : '',
          DeviceCode: res.DeviceCode ? res.DeviceCode : '',
          Manufacturer: res.Manufacturer ? res.Manufacturer : '',
          DeviceModel: res.DeviceModel ? res.DeviceModel : '',
          DeviceBrand: res.DeviceBrand ? res.DeviceBrand : '',
          DeviceType: res.DeviceType ? res.DeviceType : '',
          NumOfAxis: res.NumOfAxis === undefined ? 0 : res.NumOfAxis,
        };
        if (res.ExFactoryTime === undefined) {
          params.ExFactoryTime = res.ExFactoryTime;
        }
        if (res.WarrantyTime === undefined) {
          params.WarrantyTime = res.WarrantyTime;
        }
        console.log(params);
        CreateRobotDevice(params)
          .then((res) => {
            message.success('添加设备成功！');
            $emit('refreshTable');
            reset();
            closeModal();
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (res.DeviceForm == 'MachineTool') {
        //调创建机器人设备接口
        const params: any = {
          Name: res.Name ? res.Name : '',
          Description: res.Description ? res.Description : '',
          DeviceAddress: res.DeviceAddress ? res.DeviceAddress : '',
          DeviceCode: res.DeviceCode ? res.DeviceCode : '',
          Manufacturer: res.Manufacturer ? res.Manufacturer : '',
          DeviceModel: res.DeviceModel ? res.DeviceModel : '',
          DeviceBrand: res.DeviceBrand ? res.DeviceBrand : '',
          DeviceType: res.DeviceType ? res.DeviceType : '',

          MachineToolType: res.MachineToolType ? res.MachineToolType : '',
          PLCVersion: res.PLCVersion ? res.PLCVersion : '',
          PCUVersion: res.PCUVersion ? res.PCUVersion : '',
          CPUFrequency: res.CPUFrequency ? res.CPUFrequency : '',
          MemoryCapacity: res.MemoryCapacity ? res.MemoryCapacity : '',
          OperatingSystem: res.OperatingSystem ? res.OperatingSystem : '',
        };
        if (res.ExFactoryTime === undefined) {
          params.ExFactoryTime = res.ExFactoryTime;
        }
        if (res.WarrantyTime === undefined) {
          params.WarrantyTime = res.WarrantyTime;
        }
        console.log(params);
        CreateOneDevice(params)
          .then((res) => {
            message.success('添加设备成功！');
            reset();
            $emit('refreshTable');
            closeModal();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (error) {
      console.log('not passing', error);
    }
  }
  //取消重置
  async function reset() {
    clearValidate();
    resetFields();
  }
</script>
<style lang="less" scoped>
  ::v-deep .ant-picker {
    width: 100%;
  }
</style>
