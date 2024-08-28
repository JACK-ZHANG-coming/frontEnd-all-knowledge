<template>
  <div class="w-100% h-100% flex">
    <div class="imgBox">
      <div class="h-167px flex flex-wrap justify-center">
        <Spin :spinning="uploading" :delay="1000">
          <Image :width="290" :height="160" class="mt-1" :src="deviceUrl" :fallback="EmptyImg" />
        </Spin>
      </div>
      <div class="h-73px relative">
        <div class="pt-20px text-center"> <span class="text-name">设备名称</span></div>
        <div class="mt-10px text-center text-value">{{ props.devideInfo?.name }}</div>

        <div class="upload">
          <Upload
            :file-list="fileList"
            :before-upload="beforeUpload"
            :showUploadList="false"
            :max-count="1"
          >
            <a-button type="link"><CloudUploadOutlined /></a-button>
          </Upload>
        </div>
      </div>
    </div>
    <div class="textBox">
      <div class="flex justify-end">
        <a-button type="link" :size="'large'" @click="openMore">更多</a-button>
      </div>
      <div class="flex mt-20px">
        <div class="w-49% flex items-end">
          <span class="text-name">运行状态：</span>
          <img v-if="run !== ''" :src="run" class="mr-2" />
          <span class="text-value">{{ realTimeData?.runState }} </span>

          <Icon
            class="bind-icon"
            icon="ant-design:link-outlined"
            :size="17"
            @click="open('运行状态')"
          />
        </div>
        <div class="w-49% ml-2% flex items-end">
          <span class="text-name">健康状况：</span>
          <img v-if="health !== ''" :src="health" class="mr-2 w-20px" />
          <span class="text-value">{{ realTimeData?.healthState }}</span>
          <Icon
            class="bind-icon"
            icon="ant-design:link-outlined"
            :size="17"
            @click="open('健康状况')"
          />
        </div>
      </div>
      <div class="mt-20px">
        <span class="text-name">当前运行程序名称：</span>
        <span class="text-value">{{ realTimeData?.programName }} </span>
        <Icon
          class="bind-icon"
          icon="ant-design:link-outlined"
          :size="17"
          @click="open('当前运行的程序名称')"
        />
      </div>
      <div class="mt-20px">
        <span class="text-name">当前刀具编号：</span>
        <span class="text-value">{{ realTimeData?.toolCode }} </span>
        <Icon
          class="bind-icon"
          icon="ant-design:link-outlined"
          :size="17"
          @click="open('当前刀具编号')"
        />
      </div>
      <div class="mt-20px">
        <span class="text-name">设备编号：</span>
        <span class="text-value">{{ props.devideInfo?.deviceCode }}</span>
      </div>
      <div class="mt-20px">
        <span class="text-name">设备描述：</span>
        <span class="text-value">{{ props.devideInfo?.description }} </span>
      </div>
    </div>
    <BindModal @register="registerBindModal" />

    <MoreDrawer @register="registerMoreDrawer" />
  </div>
</template>
<script lang="ts" setup>
  import { h, ref, computed, watch, onMounted, onActivated, onUnmounted } from 'vue';
  import { Image, Upload, Empty, Spin, UploadProps, message } from 'ant-design-vue';
  import { CloudUploadOutlined } from '@ant-design/icons-vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import Icon from '@/components/Icon/Icon.vue';
  import { useModal } from '@/components/Modal';
  import { ImportImage } from '@/api/equipmentManagement/deviceTemplateDetail';
  import { getIp } from '@/utils/simpleTools';
  import state_run from '@/assets/images/equipmentManagement/deviceTemplateDetail/state_run.png';
  import state_stop from '@/assets/images/equipmentManagement/deviceTemplateDetail/state_stop.png';
  import state_empty_run from '@/assets/images/equipmentManagement/deviceTemplateDetail/state_empty_run.png';
  import state_empty from '@/assets/images/equipmentManagement/deviceTemplateDetail/state_empty.png';

  import state_health from '@/assets/images/equipmentManagement/deviceTemplateDetail/state_health.png';
  import state_no_health from '@/assets/images/equipmentManagement/deviceTemplateDetail/state_no_health.png';

  import state_fail from '@/assets/images/equipmentManagement/deviceTemplateDetail/state_fail.png';
  import BindModal from './BindModal.vue';

  import MoreDrawer from './MoreDrawer.vue';

  import { useDrawer } from '@/components/Drawer';

  const [registerBindModal, { openModal: bindModal }] = useModal();

  const [registerMoreDrawer, { openDrawer: moreDrawer }] = useDrawer();
  const run = ref<any>('');
  const health = ref<any>('');
  const runStateList = ref([
    { name: '运行', url: state_run },
    {
      name: '停机',
      url: state_stop,
    },

    {
      name: '空运行',
      url: state_empty_run,
    },
    {
      name: '空闲',
      url: state_empty,
    },
  ]);
  const healthStateList = ref([
    {
      name: '健康',
      url: state_health,
    },
    {
      name: '亚健康',
      url: state_no_health,
    },

    {
      name: '故障',
      url: state_fail,
    },
  ]);
  const { createMessage } = useMessage();
  const EmptyImg = ref(
    'data:image/png;base64,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',
  );

  const props = defineProps({
    deviceUUId: String,
    staticDataDefineLinkInfo: Object,
    devideInfo: Object,
    realTimeList: Array,
  });
  const realTimeData = ref<any>({});
  const deviceUrl = ref<any>('');
  deviceUrl.value = getIp(0) + '/api/Device/GetImage?uuid=' + props.deviceUUId;

  const fileList = ref<UploadProps['fileList']>([]);
  const uploading = ref<boolean>(false);
  const openMore = () => {
    moreDrawer(true, { deviceUUId: props.deviceUUId });
    let element: any = document.querySelector('.vben-layout-content');
    element.style.overflow = 'hidden';
  };
  const open = (val: any) => {
    let name = '',
      item1 = '',
      item2 = '';
    for (let key in props.staticDataDefineLinkInfo) {
      if (key === val) {
        name = key;
        item1 = props.staticDataDefineLinkInfo[key].item1;
        item2 = props.staticDataDefineLinkInfo[key].item2;
      }
    }
    if (name !== '') {
      bindModal(true, { uuid: props.deviceUUId, name, item1, item2 });
    } else {
      message.warning('未找到该绑定信息！');
    }
  };
  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    fileList.value = [...(fileList.value || []), file];
    uploading.value = true;
    handleUpload();

    return false;
  };
  const getDeviceUrl = () => {
    return getIp(0) + '/api/Device/GetImage?uuid=' + props.deviceUUId + '&t=' + new Date();
  };
  const handleUpload = () => {
    let params: any = {
      file: fileList.value && fileList.value[0],
    };
    // uploading.value = true;
    ImportImage('?uuid=' + props.deviceUUId, params)
      .then(() => {
        fileList.value = [];

        createMessage.success('上传成功！');
        uploading.value = false;
        deviceUrl.value = getDeviceUrl();
      })
      .catch(() => {
        uploading.value = false;
        createMessage.error('上传失败！');
      });
  };
  watch(
    () => props.realTimeList,
    () => {
      if (props.realTimeList?.length && props.realTimeList?.length > 0) {
        props.realTimeList?.forEach((item: any) => {
          if (item[0] == '当前运行的程序名称') {
            realTimeData.value.programName = item[1];
          } else if (item[0] == '运行状态') {
            // realTimeData.value.runState = '运行';

            realTimeData.value.runState = item[1];
            let temp = '';
            runStateList.value.forEach((item) => {
              // console.log(item.name, realTimeData.value.runState, 'run.value ');
              if (item.name == realTimeData.value.runState) {
                temp = item.url;
              }
            });
            run.value = temp;
            // console.log(run.value, 'run.value');
          } else if (item[0] == '当前刀具编号') {
            realTimeData.value.toolCode = item[1];
          } else if (item[0] == '健康状况') {
            // realTimeData.value.healthState = '健康';
            let temp = '';
            realTimeData.value.healthState = item[1];
            healthStateList.value.forEach((item) => {
              if (item.name == realTimeData.value.healthState) {
                temp = item.url;
              }
            });
            health.value = temp;
          }
        });
      } else {
        realTimeData.value = {};
      }
      // if (newVal !== oldVal) openRef.value = newVal;
    },
    { deep: true },
  );
  onMounted(() => {
    console.log(deviceUrl.value, 'deviceUrl.value');
  });
  // onActivated(() => {
  //   let element: any = document.querySelector('.vben-layout-content');
  //   element.style.overflow = 'auto';
  // });

  onUnmounted(() => {
    // console.log(deviceUUId.value, 'onUnmounted');
  });
</script>
<style scoped lang="less">
  .imgBox {
    width: 300px;
    min-width: 300px;
    height: 240px;
    margin: 12px;
    background: url('@/assets/images/equipmentManagement/deviceTemplateDetail/imageBox.png')
      no-repeat;
    background-size: 100% 100%;

    .upload {
      position: absolute;
      top: 0;
      right: 0;
    }
  }

  .textBox {
    width: calc(100% - 68px);
    height: calc(100% - 32px);
    margin: 10px 10px 0 22px;

    // border: 1px solid red;
  }

  .text-name {
    color: #808080;
    font-size: 14px;
    font-weight: 500;
  }

  .text-value {
    color: #4d4d4d;
    font-size: 16px;
    font-weight: 500;
  }

  .bind-icon {
    margin-left: 0.5rem;
    color: #0960bd;
    cursor: pointer;
  }

  .bind-icon:hover {
    color: #69b1ff;
  }
</style>
