<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    @ok="validateForm"
    @cancel="reset"
    width="50%"
    :maskClosable="false"
  >
    <template #title>
      {{ modalTitle }}
      <div style="display: inline-block"><AppSearch /></div>
    </template>
    <div class="pt-3px pr-3px">
      <BasicForm @register="registerForm" :model="modelRef" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { computed, nextTick, ref, watch } from 'vue';
  import { BasicModal, useModal, useModalInner } from '@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import {
    CreateOneDataChannel,
    DeleteOneDataChannel,
    ModifyOneDataChannel,
  } from '@/api/dataPreprocessingChannel/dataChannelOverview';
  import { RoleEnum } from '@/enums/roleEnum';
  import { useMessage } from '@/hooks/web/useMessage';
  import { compareObjects, formatSelectArr } from '@/utils/simpleTools';
  import { outDataType } from './data';
  import { dataCalMethodDic } from '@/utils/commonDic';
  import { AppSearch } from '@/components/Application/index';

  const $emit = defineEmits(['refreshTable', 'register']);
  const { createMessage } = useMessage();

  const modalTitle = ref('');
  const isEdit = ref(false);
  const propsData = ref<any>({});

  const onDataReceive = (data) => {
    console.log('接收到的data:', data);
    propsData.value = data;
    isEdit.value = data.isEdit;
    if (data.isEdit) {
      modalTitle.value = '编辑数据通道';
      setFieldsValue({
        name: data?.record?.name,
        description: data?.record?.description,
        enable: data?.record?.enable,
        method: data?.record?.method,
        dataSrc1UUID: data?.record?.inParam1?.key,
        dataDef1UUID: data?.record?.inParam1?.value,
        dataSrc2UUID: data?.record?.inParam2?.key,
        dataDef2UUID: data?.record?.inParam2?.value,
        outDataDescription: data?.record?.outDataDescription,
        outDataType: data?.record?.outDataType,
        outDataTypeSub: data?.record?.outDataTypeSub,
        outDataUnitName: data?.record?.outDataUnitName,
      });
    } else {
      modalTitle.value = '新增数据通道';
      reset();
    }
  };

  const modelRef = ref({});
  const schemas: FormSchema[] = [
    {
      field: 'name',
      component: 'Input',
      label: '数据通道名称',
      colProps: {
        span: 12,
      },
      dynamicRules: ({ values }) => {
        return [{ required: true, message: '必填项！' }];
      },
    },
    {
      field: 'description',
      component: 'Input',
      label: '描述',
      colProps: {
        span: 12,
      },
    },
    // {
    //   field: 'enable',
    //   component: 'Switch',
    //   label: '激活状态',
    //   colProps: {
    //     span: 12,
    //   },
    //   defaultValue: false,
    //   dynamicDisabled: computed(() => isEdit.value) as any,
    // },
    {
      field: 'dataSrc1UUID',
      component: 'Input',
      label: '参数1数据源',
      colProps: {
        span: 12,
      },
      dynamicDisabled: computed(() => isEdit.value) as any,
    },
    {
      field: 'dataDef1UUID',
      component: 'Input',
      label: '参数1数据定义',
      colProps: {
        span: 12,
      },
      dynamicDisabled: computed(() => isEdit.value) as any,
    },
    {
      field: 'dataSrc2UUID',
      component: 'Input',
      label: '参数2数据源',
      colProps: {
        span: 12,
      },
      dynamicDisabled: computed(() => isEdit.value) as any,
    },
    {
      field: 'dataDef2UUID',
      component: 'Input',
      label: '参数2数据定义',
      colProps: {
        span: 12,
      },
      dynamicDisabled: computed(() => isEdit.value) as any,
    },
    {
      field: 'method',
      component: 'Select',
      label: '计算方法',
      colProps: {
        span: 12,
      },
      componentProps: {
        options: formatSelectArr(dataCalMethodDic, ['UnDefine']),
      },
      defaultValue: Object.keys(dataCalMethodDic)[0],
      dynamicDisabled: computed(() => isEdit.value) as any,
    },
    // {
    //   field: 'outDataDescription',
    //   component: 'Input',
    //   label: '计算结果',
    //   colProps: {
    //     span: 12,
    //   },
    //   dynamicDisabled: computed(() => isEdit.value) as any,
    // },
    {
      field: 'outDataType',
      component: 'Select',
      label: '结果数据类型',
      colProps: {
        span: 12,
      },
      componentProps: {
        options: formatSelectArr(outDataType),
        allowClear: true,
      },
      dynamicDisabled: computed(() => isEdit.value) as any,
      // defaultValue: Object.keys(outDataType)[0],
    },
    {
      field: 'outDataTypeSub',
      component: 'Input',
      label: '结果次级类型',
      colProps: {
        span: 12,
      },
      dynamicDisabled: computed(() => isEdit.value) as any,
    },
    {
      field: 'outDataUnitName',
      component: 'Input',
      label: '结果单位',
      colProps: {
        span: 12,
      },
      dynamicDisabled: computed(() => isEdit.value) as any,
    },
  ];

  const [registerForm, { validateFields, clearValidate, resetFields, setFieldsValue }] = useForm({
    labelWidth: 120,
    schemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });
  const [register, { closeModal, changeOkLoading }] = useModalInner((data) => {
    data && onDataReceive(data);
  });

  //保存校验
  const validateForm = async () => {
    try {
      const res = await validateFields();
      changeOkLoading(true);
      if (isEdit.value) {
        // 编辑
        const params = {
          options: compareObjects(res, propsData.value.record),
          name: res?.name ?? '',
          description: res?.description ?? '',
          uuid: propsData.value.record?.uuid ?? '',
        };
        await ModifyOneDataChannel(params);
        createMessage.success('修改成功！');
        changeOkLoading(false);
        $emit('refreshTable');
        closeModal();
      } else {
        // 新增
        const params = {
          name: res?.name ?? '',
          description: res?.description ?? '',
          enable: res?.enable ?? '',
          method: res?.method ?? '',
          dataSrc1UUID: res?.dataSrc1UUID ?? '',
          roleName: res?.roleName ?? '',
          dataDef1UUID: res?.dataDef1UUID ?? '',
          dataSrc2UUID: res?.dataSrc2UUID ?? '',
          dataDef2UUID: res?.dataDef2UUID ?? '',
          outDataDescription: res?.outDataDescription ?? '',
          outDataType: res?.outDataType ?? '',
          outDataTypeSub: res?.outDataTypeSub ?? '',
          outDataUnitName: res?.outDataUnitName ?? '',
        };
        await CreateOneDataChannel(params);
        createMessage.success('新增成功！');
        changeOkLoading(false);
        $emit('refreshTable');
        closeModal();
      }
    } catch (error) {
      // console.log('not passing', error);
      changeOkLoading(false);
    }
  };
  //取消重置
  async function reset() {
    clearValidate();
    resetFields();
  }
</script>
