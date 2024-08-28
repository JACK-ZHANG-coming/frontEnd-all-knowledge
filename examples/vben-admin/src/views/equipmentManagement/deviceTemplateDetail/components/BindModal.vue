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
  import { DeviceModifyStaticDataDefineLink } from '@/api/equipmentManagement/deviceTemplateDetail';
  import { useMessage } from '@/hooks/web/useMessage';
  import { copyText } from '@/utils/copyTextToClipboard';
  import { CopyOutlined } from '@ant-design/icons-vue';
  import { getIp } from '@/utils/simpleTools';
  import { AppSearch } from '@/components/Application/index';

  const urlString = ref<any>('');
  const reload: any = inject('reload');
  // const $emit = defineEmits(['refreshTable', 'register']);
  const { createMessage } = useMessage();
  const modalTitle = ref('');
  const propsData = ref<any>({});
  const onDataReceive = (data) => {
    // console.log('接收到的data:', data);
    propsData.value = data;
    modalTitle.value = '绑定-' + propsData.value.name;

    setFieldsValue({
      item1: data?.item1,
      item2: data?.item2,
    });
    getURL();
  };
  const modelRef = ref({});
  const schemas: FormSchema[] = [
    {
      field: 'item1',
      component: 'Input',
      label: '数据源UUID',
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
      field: 'item2',
      component: 'Input',
      label: '数据定义UUID',
      colProps: {
        span: 24,
      },
      componentProps: ({ formModel }) => {
        return {
          onChange: (e) => {
            getURL();
            // formModel.f2 = e.target.value;
          },
        };
      },
    },
  ];
  const getURL = () => {
    if (getFieldsValue().item1 !== '' && getFieldsValue().item2 !== '') {
      urlString.value =
        getIp(0) +
        '/api/DataVision/GetLatestData' +
        '?SrcUUID=' +
        getFieldsValue().item1 +
        '&DefUUID=' +
        getFieldsValue().item2;
    } else {
      urlString.value = '';
    }
  };
  const [
    registerForm,
    { validateFields, clearValidate, resetFields, setFieldsValue, getFieldsValue },
  ] = useForm({
    labelWidth: 100,
    labelAlign: 'left',

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
        uuid: propsData.value?.uuid ?? '',
        attributeName: propsData.value?.name ?? '',
        srcUUID: res?.item1 ?? '',
        defUUID: res?.item2 ?? '',
      };

      DeviceModifyStaticDataDefineLink(params)
        .then((res) => {
          reload();
          createMessage.success('绑定成功！');
          changeOkLoading(false);
          closeModal();
        })
        .catch((err) => {});
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
