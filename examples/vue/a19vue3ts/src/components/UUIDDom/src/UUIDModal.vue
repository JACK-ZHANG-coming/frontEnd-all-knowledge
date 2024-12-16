<!--  UUIDModal -->
<template>
  <div>
    <DeviceModal @register="registerDeviceModal" />
    <DataDefineModal @register="registerDataDefineModal" />
    <DataSourceModal @register="registerDataSourceModal" />
    <InternalDataSourceModal @register="registerInternalDataSourceModal" />
    <DataChannelModal @register="registerDataChannelModal" />
    <InnerDataDefineModal @register="registerInnerDataDefineModal" />
  </div>
</template>
<script lang="ts" setup>
  import { computed, nextTick, ref, watch } from 'vue';
  import { useModal } from '@/components/Modal';
  import DeviceModal from './DeviceModal.vue';
  import DataDefineModal from './DataDefineModal.vue';
  import DataSourceModal from './DataSourceModal.vue';
  import DataChannelModal from './DataChannelModal.vue';
  import InternalDataSourceModal from './InternalDataSourceModal.vue';
  import InnerDataDefineModal from './InnerDataDefineModal.vue';
  import { UUIDTypeEnum, uuidModalConfigType } from './types/UUID.data';

  defineOptions({ name: 'UUIDModal' });

  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({
        visible: false,
        uuid: '',
        uuidType: UUIDTypeEnum,
        title: '',
        record: {},
      }),
    },
  });
  const emits = defineEmits(['update:modelValue']);
  const modelValue = computed<any>({
    get: () => props.modelValue,
    set: () => emits('update:modelValue', modelValue),
  });

  const [registerDeviceModal, { openModal: openDeviceModal }] = useModal();
  const [registerDataDefineModal, { openModal: openDataDefineModal }] = useModal();
  const [registerDataSourceModal, { openModal: openDataSourceModal }] = useModal();
  const [registerInternalDataSourceModal, { openModal: openInternalDataSourceModal }] = useModal();
  const [registerDataChannelModal, { openModal: openDataChannelModal }] = useModal();
  const [registerInnerDataDefineModal, { openModal: openInnerDataDefineModal }] = useModal();

  //保存校验
  const validateForm = async () => {
    // console.log('保存');
  };
  //取消重置
  const reset = async () => {
    // console.log('取消');
  };
  watch(modelValue.value, (val: uuidModalConfigType) => {
    // console.log('val=====>', val);
    if (val && (val as uuidModalConfigType).visible && (val as uuidModalConfigType).uuidType) {
      switch ((val as uuidModalConfigType).uuidType) {
        case UUIDTypeEnum.DeviceMemSync:
          openDeviceModal(true, { ...(val as uuidModalConfigType) });
          break;
        case UUIDTypeEnum.DataDefMemSync:
          openDataDefineModal(true, { ...(val as uuidModalConfigType) });
          break;
        case UUIDTypeEnum.DataSourceMemSync:
          openDataSourceModal(true, { ...(val as uuidModalConfigType) });
          break;
        case UUIDTypeEnum.InnerSourceMemSync:
          openInternalDataSourceModal(true, { ...(val as uuidModalConfigType) });
          break;
        case UUIDTypeEnum.DataChannelMemSync:
          openDataChannelModal(true, { ...(val as uuidModalConfigType) });
          break;
        case UUIDTypeEnum.InnerDataDefMemSync:
          openInnerDataDefineModal(true, { ...(val as uuidModalConfigType) });
          break;
        default:
          break;
      }
    }
  });
</script>
<style lang="less">
  .UUIDDom-uuid-modal {
    // 固定样式
    &.ant-modal {
      @uuid_bg: './images/DeviceBg.png';

      .ant-modal-content {
        // height: 64vh;
        // overflow: auto;
        background: url('@{uuid_bg}') no-repeat;
        background-size: 100% 100%;

        button {
          .ant-modal-close-x {
            height: 40px;
          }
        }

        .ant-modal-header {
          display: flex;
          align-items: center;
          height: 40px;
          margin: 0;
          padding: 0;
          padding-left: 5px;
          border-bottom: 0;
          background-color: rgb(255 255 255 / 0%);
          cursor: move;

          .ant-modal-title {
            cursor: move;

            span {
              cursor: move;
            }
          }
        }

        .ant-modal-footer {
          display: none;
        }
      }
    }
  }
</style>
