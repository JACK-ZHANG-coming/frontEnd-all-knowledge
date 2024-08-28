<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="modalTitle"
    @ok="validateForm"
    @cancel="reset"
    :maskClosable="false"
    width="25%"
  >
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
    CreateOneDataSource,
    ModifyOneDataSource,
  } from '@/api/dataSourceManagement/externalDataSource';

  import { useMessage } from '@/hooks/web/useMessage';
  import { compareObjects } from '@/utils/simpleTools';

  const $emit = defineEmits(['refreshTable', 'register']);
  const { createMessage } = useMessage();

  const modalTitle = ref('');
  const isEdit = ref(false);
  const propsData = ref<any>({});

  const onDataReceive = (data) => {
    // console.log('接收到的data:', data);
    propsData.value = data;
    isEdit.value = data.isEdit;
    if (data.isEdit) {
      modalTitle.value = '编辑数据源';
      setFieldsValue({
        name: data?.record?.name,
        description: data?.record?.description,
      });
    } else {
      modalTitle.value = '新增数据源';
      reset();
    }
  };

  const modelRef = ref({});
  const schemas: FormSchema[] = [
    {
      field: 'name',
      component: 'Input',
      label: '数据源名称',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'description',
      component: 'InputTextArea',
      label: '数据源描述',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'idFieldValue',
      component: 'Input',
      label: '唯一识别字段值',
      colProps: {
        span: 24,
      },
      show: ({ values }) => {
        return !isEdit.value;
      },
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
        delete res.idFieldValue;
       
        const params = {
          options: compareObjects(res, propsData.value.record),
          uuid: propsData.value?.record?.uuid ?? '',
          name: res?.name ?? '',
          description: res?.description ?? '',
        };
        await ModifyOneDataSource(params);
        createMessage.success('修改成功！');
        changeOkLoading(false);
        $emit('refreshTable');
        closeModal();
      } else {
        // 新增
        const params = {
          name: res?.name ?? '',
          description: res?.description ?? '',
          idFieldValue: res?.idFieldValue ?? '',
        };
        await CreateOneDataSource(params);
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
