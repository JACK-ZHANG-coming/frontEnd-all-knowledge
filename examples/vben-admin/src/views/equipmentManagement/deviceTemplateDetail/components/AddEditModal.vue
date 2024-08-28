<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    @ok="validateForm"
    @cancel="reset"
    width="25%"
    :maskClosable="false"
  >
    <template #title>
      {{ modalTitle }}
      <div style="display: inline-block"><AppSearch /></div>
    </template>
    <div class="pt-3px pr-3px">
      <BasicForm @register="registerForm" :model="modelRef" />
      <div v-show="urlString !== ''">
        <CopyOutlined class="copy" @click="copyText(urlString)" />
        <span @click="copyText(urlString)">{{ urlString }}</span>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { computed, nextTick, ref, watch, inject } from 'vue';
  import { BasicModal, useModal, useModalInner } from '@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import {
    DeviceAddDynamicDefineLink,
    DeviceModifyDynamicDefineLink,
  } from '@/api/equipmentManagement/deviceTemplateDetail';
  import { copyText } from '@/utils/copyTextToClipboard';
  import { CopyOutlined } from '@ant-design/icons-vue';

  import { useMessage } from '@/hooks/web/useMessage';
  import { getIp } from '@/utils/simpleTools';
  import { AppSearch } from '@/components/Application/index';

  const { createMessage } = useMessage();
  const urlString = ref<any>('');

  const modalTitle = ref('');
  const isEdit = ref(false);
  const propsData = ref<any>({});
  const reload: any = inject('reload');

  const onDataReceive = (data) => {
    // console.log('接收到的data:', data);
    propsData.value = data;
    isEdit.value = data.isEdit;
    if (data.isEdit) {
      modalTitle.value = '编辑';
    } else {
      modalTitle.value = '新增';
      reset();
    }
    setFieldsValue({
      attributeName: data?.record?.attributeName ?? '',
      srcUUID: data?.record?.srcUUID ?? '',
      defUUID: data?.record?.defUUID ?? '',
    });
    getURL();
  };

  const modelRef = ref({});
  const schemas: FormSchema[] = [
    {
      field: 'attributeName',
      component: 'Input',
      label: '数据名称',
      colProps: {
        span: 24,
      },
      dynamicDisabled: computed(() => isEdit.value) as any,

      // dynamicDisabled: true,
    },
    {
      field: 'srcUUID',
      component: 'Input',
      label: '对应数据源',
      colProps: {
        span: 24,
      },
      componentProps: ({ formModel }) => {
        return {
          onChange: (e) => {
            getURL();
          },
        };
      },
    },
    {
      field: 'defUUID',
      component: 'Input',
      label: '对应数据定义',
      colProps: {
        span: 24,
      },
      componentProps: ({ formModel }) => {
        return {
          onChange: (e) => {
            getURL();
          },
        };
      },
    },
  ];
  const getURL = () => {
    if (getFieldsValue()?.srcUUID !== '' && getFieldsValue()?.defUUID !== '') {
      urlString.value =
        getIp(0) +
        '/api/DataVision/GetLatestData' +
        '?SrcUUID=' +
        getFieldsValue().srcUUID +
        '&DefUUID=' +
        getFieldsValue().defUUID;
    } else {
      urlString.value = '';
    }
  };
  const [
    registerForm,
    { getFieldsValue, validateFields, clearValidate, resetFields, setFieldsValue },
  ] = useForm({
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
      const params = {
        uuid: propsData.value?.uuid,
        attributeName: res?.attributeName ?? '',
        srcUUID: res?.srcUUID ?? '',
        defUUID: res?.defUUID ?? '',
        showHistory: true,
      };

      if (isEdit.value) {
        // 编辑

        DeviceModifyDynamicDefineLink(params)
          .then((res) => {
            reload();
            createMessage.success('修改成功！');
            changeOkLoading(false);
            closeModal();
          })
          .catch((err) => {
            changeOkLoading(false);
          });
      } else {
        //新增

        DeviceAddDynamicDefineLink(params)
          .then((res) => {
            reload();
            createMessage.success('添加成功！');
            changeOkLoading(false);
            closeModal();
          })
          .catch((err) => {
            changeOkLoading(false);
          });
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
<style scoped>
  .copy {
    margin-right: 0.5rem;
    color: #0960bd;
    cursor: pointer;
  }

  .copy:hover {
    color: #69b1ff;
  }
</style>
