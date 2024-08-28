<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="阈值设置"
    @ok="validateForm"
    @cancel="reset"
    :maskClosable="false"
    width="30%"
  >
    <div class="pt-3px pr-3px">
      <BasicForm @register="registerForm" :model="modelRef" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import { SetSystemHealth } from '@/api/systemHealthMonitoring/serverHealth';

  // const getSysHealth = (visible: boolean) => {
  //   console.log('aa');

  //   // if (visible) {
  //   // }
  // };
  // const $emit = defineEmits(['refreshTable']);
  const modelRef = ref({});
  const schemas: FormSchema[] = [
    {
      field: 'CpuThreshold',
      component: 'InputNumber',
      label: 'CPU阈值',
      required: true,
      componentProps: {
        placeholder: '请输入1~100',
        min: 1,
        max: 100,
      },
      colProps: {
        span: 24,
      },
    },
    {
      field: 'MemThreshold',
      component: 'InputNumber',
      label: '内存阈值',
      required: true,
      componentProps: {
        placeholder: '请输入1~100',
        min: 1,
        max: 100,
      },
      colProps: {
        span: 24,
      },
    },
    {
      field: 'DiskThreshold',
      component: 'InputNumber',
      label: '磁盘阈值',
      required: true,
      componentProps: {
        placeholder: '请输入1~100',
        min: 1,
        max: 100,
      },
      colProps: {
        span: 24,
      },
    },
  ];

  const [registerForm, { validateFields, clearValidate, resetFields }] = useForm({
    labelWidth: 100,
    schemas,
    showActionButtonGroup: false,
  });
  // const [register, { closeModal }] = useModal();
  const [register, { closeModal }] = useModalInner((data) => {
    data && onDataReceive(data);
  });

  function onDataReceive(data) {
    // console.log('Data Received', data);
    // // 方式2
    modelRef.value = {
      CpuThreshold: data.CpuThreshold,
      MemThreshold: data.MemThreshold,
      DiskThreshold: data.DiskThreshold,
    };
    clearValidate();
  }
  //保存校验
  async function validateForm() {
    try {
      const res = await validateFields();

      //调接口
      const params = {
        CpuThreshold: res.CpuThreshold,
        MemThreshold: res.MemThreshold,
        DiskThreshold: res.DiskThreshold,
      };
      SetSystemHealth(params)
        .then((res) => {
          message.success('阈值设置成功！');
          // $emit('refreshTable');
          closeModal();
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log('not passing', error);
    }
  }
  //取消重置
  async function reset() {
    clearValidate();
    resetFields();
  }
  // function handleVisibleChange(v) {
  //   console.log(v, 'v');
  //   // v && props.userData && nextTick(() => onDataReceive(props.userData));
  // }
</script>
