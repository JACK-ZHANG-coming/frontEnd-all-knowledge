<!-- 设备总览 -->
<template>
  <div class="main-container">
    <div class="row0">
      <div class="box flex w-100%">
        <BasicForm ref="formElRef" @register="register" style="width: 100%" />
        <div class="button-group">
          <Space>
            <Button size="small" @click="areReset">
              <template #icon>
                <ReloadOutlined />
              </template>
              重置
            </Button>
            <Button :icon="h(SearchOutlined)" type="primary" size="small" @click="areQuery">
              查询
            </Button>
          </Space>
        </div>
      </div>
    </div>
    <div class="row1">
      <!-- 已接入设备总数 -->
      <div class="box w-24%"><Info :queryParams="queryParams" /></div>
      <!-- 运行情况 -->
      <div class="box w-35%"><Run :queryParams="queryParams" /></div>
      <!-- 设备健康 -->
      <div class="box w-39%"><Health :queryParams="queryParams" /></div>
    </div>
    <div class="row2">
      <div class="box w-24%">
        <!-- 平均稼动率统计 -->
        <OperationRateStatistics :queryParams="queryParams" />
      </div>
      <!-- 故障排名 -->
      <div class="box w-35%"><Fault :queryParams="queryParams" /></div>
      <!-- 停机排名 -->
      <div class="box w-39%"><Closed :queryParams="queryParams" /></div>
    </div>
    <div class="row3">
      <!-- 设备用途 -->
      <div class="box w-49.5%"><Use :queryParams="queryParams" /></div>
      <!-- 保修到期时间 -->
      <div class="box w-49.5%">
        <WarrantyExpirationTime :loading="loading" :queryParams="queryParams" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, h } from 'vue';
  import Health from './components/Health.vue';
  import Run from './components/Run.vue';
  import Info from './components/Info.vue';
  import Use from './components/Use.vue';
  import OperationRateStatistics from './components/OperationRateStatistics.vue';
  import Fault from './components/Fault.vue';
  import Closed from './components/Closed.vue';
  import WarrantyExpirationTime from './components/WarrantyExpirationTime.vue';
  import { BasicForm, useForm, FormSchema } from '@/components/Form';
  import { Button, Space } from 'ant-design-vue';
  import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue';

  const formSchema: FormSchema[] = [
    {
      field: 'DeviceForm',
      component: 'Select',
      label: '设备类型',
      colProps: {
        span: 6,
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
      field: 'DeviceAddress',
      component: 'Input',
      label: '安装位置',
      colProps: {
        span: 6,
      },
    },
    {
      field: 'Manufacturer',
      component: 'Input',
      label: '生产厂家',
      colProps: {
        span: 6,
      },
    },
  ];

  const formElRef = ref();
  const [register, { setFieldsValue }] = useForm({
    size: 'small',
    baseColProps: { span: 24 },
    baseRowStyle: { margin: '0.7% 0 0' },
    labelWidth: 100,
    showActionButtonGroup: false,
    schemas: formSchema,
  });

  const loading = ref(true);

  const queryParams = ref({
    isQuery: true,
    DeviceForm: '',
    DeviceAddress: '',
    Manufacturer: '',
  });

  const initQueryParams = (
    params = {
      DeviceForm: '',
      DeviceAddress: '',
      Manufacturer: '',
    },
  ) => {
    queryParams.value.isQuery = false;
    queryParams.value.DeviceForm = params.DeviceForm;
    queryParams.value.DeviceAddress = params.DeviceAddress;
    queryParams.value.Manufacturer = params.Manufacturer;
    queryParams.value.isQuery = true;
  };

  const areQuery = () => {
    // 查询
    let tempObj = formElRef.value.getFieldsValue();
    console.log(tempObj);
    initQueryParams({ ...tempObj });
  };

  const areReset = () => {
    // 重置
    setFieldsValue({
      DeviceForm: '',
      DeviceAddress: '',
      Manufacturer: '',
    }).then(() => {
      areQuery();
    });
  };

  setTimeout(() => {
    loading.value = false;
  }, 1500);
</script>
<style lang="less" scoped>
  .main-container {
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    width: 100%;
    height: 100%;
    padding: 1rem;

    .row0,
    .row1,
    .row2,
    .row3 {
      display: flex;
      justify-content: space-between;
      width: 100%;

      .box {
        height: 100%;
        border-radius: 8px;
        background-color: white;
      }

      .box-out {
        display: flex;
        flex-wrap: wrap;
        align-content: space-between;
      }
    }

    .row0 {
      width: 100%;
      height: 6%;

      .button-group {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 20px;
      }
    }

    .row1 {
      height: 27%;
    }

    .row2 {
      height: 27%;
    }

    .row3 {
      height: 37%;
    }
  }
</style>
