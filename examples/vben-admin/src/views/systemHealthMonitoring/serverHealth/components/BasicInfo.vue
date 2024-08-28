<template>
  <div class="w-100% h-100% serverHealth-ServeRate">
    <Card style="width: 100%; height: 100%">
      <template #title>
        <div class="w-100% h-100% flex justify-between">
          <div>服务器概览 </div>
          <div>
            <span class="text-14px">当前服务器：{{ currentIP }}</span>
            <Dropdown>
              <a-button type="link" :size="'small'">
                <Icon icon="ant-design:sync-outlined" :size="16"
              /></a-button>
              <template #overlay>
                <Menu>
                  <MenuItem v-for="item in IPList" :key="item">
                    <a-button type="link" :size="'small'" @click="changeIP(item)">{{
                      item
                    }}</a-button>
                  </MenuItem>
                </Menu>
              </template>
            </Dropdown>
            <!-- <a-button type="link" :size="'small'">更多</a-button> -->
          </div>
        </div>
      </template>
      <!-- 卡片具体内容 -->
      <div class="box-container">
        <div class="box">
          <img :src="basicImg1" style="width: 32px; height: 32px" />

          <div class="w-55% h-80% ml-3">
            <div class="text-12px color-#666666">日新增数据</div>
            <div class="mt-0">
              <span class="text-18px text-blue-500">{{ dailyAddData.addNum }} </span>
              <span class="text-12px color-#666666"> 条</span>
            </div>
          </div>
          <!-- <div class="divide"></div> -->
        </div>
        <div class="box">
          <img :src="basicImg2" style="width: 32px; height: 32px" />

          <div class="w-55% h-80% ml-3">
            <div class="text-12px color-#666666">
              <Tooltip placement="rightTop">
                <template #title>
                  <div>系统评分: {{ formateData(SystemHealthValue.allScore) }}</div>
                  <div>CPU评分: {{ formateData(SystemHealthValue.cpuScore) }}</div>
                  <div>内存评分 {{ formateData(SystemHealthValue.memScore) }}</div>
                  <div>磁盘评分: {{ formateData(SystemHealthValue.diskScore) }}</div>
                  <div>系统启动时间: {{ SystemHealthValue.systemStartTime }}</div>
                </template>
                集群健康得分 <ExclamationCircleOutlined />
              </Tooltip>
            </div>
            <div class="mt-0">
              <span class="text-18px text-blue-500">{{
                formateData(SystemHealthValue.allScore)
              }}</span>
              <Button type="link" @click="setHealth"
                ><template #icon> <EditTwoTone /> </template
              ></Button>
            </div>
          </div>
          <!-- <div class="divide"></div> -->
        </div>
        <div class="box">
          <img :src="basicImg3" style="width: 32px; height: 32px" />

          <div class="w-55% h-80% ml-3">
            <div class="text-12px color-#666666">
              <Tooltip placement="rightTop">
                <template #title>
                  <div>CPU使用率: {{ formateData(CpuInfo.cpuUseRateNum) }} %</div>
                  <div>逻辑CPU个数: {{ formateData(CpuInfo.cpuLogicNum) }}</div>
                  <div>物理CPU个数: {{ formateData(CpuInfo.cpuPhyNum) }}</div>
                  <div>用户态时间: {{ CpuInfo.userTime }}</div>
                  <div>系统态时间: {{ CpuInfo.systemTime }}</div>
                  <div>空闲时间: {{ CpuInfo.idleTime }}</div>
                </template>
                CPU使用率 <ExclamationCircleOutlined />
              </Tooltip>
            </div>
            <div class="mt-0">
              <span class="text-18px text-blue-500">{{ formateData(CpuInfo.cpuUseRateNum) }}</span>
              <span class="text-12px color-#666666"> %</span>
            </div>
          </div>
          <!-- <div class="divide"></div> -->
        </div>
        <div class="box">
          <img :src="basicImg4" style="width: 32px; height: 32px" />

          <div class="w-55% h-80% ml-3">
            <div class="text-12px color-#666666">
              <Tooltip placement="rightTop">
                <template #title>
                  <div>虚拟内存使用率: {{ formateData(VMemInfo.usedPercent) }} %</div>
                  <div>总虚拟内存: {{ formateData(VMemInfo.totalMem) }} MB</div>
                  <div>可用虚拟内存: {{ formateData(VMemInfo.freeMem) }} MB</div>
                  <div>已用虚拟内存: {{ formateData(VMemInfo.usedMem) }} MB</div>
                </template>
                虚拟内存使用率
                <ExclamationCircleOutlined /> </Tooltip
            ></div>
            <div class="mt-0">
              <span class="text-18px text-blue-500">{{ formateData(VMemInfo.usedPercent) }}</span>
              <span class="text-12px color-#666666"> %</span>
            </div>
          </div>
        </div>
      </div>

      <div class="box-container" style="margin-top: 0.5%">
        <div class="box">
          <img :src="basicImg5" style="width: 32px; height: 32px" />

          <div class="w-55% h-80% ml-3">
            <div class="text-12px color-#666666">日占用容量</div>
            <div class="mt-0">
              <span class="text-18px text-blue-500">{{ dailyAddData.addKb }} </span>
              <span class="text-12px color-#666666"> KB</span>
            </div>
          </div>
          <!-- <div class="divide"></div> -->
        </div>
        <div class="box">
          <img :src="basicImg6" style="width: 32px; height: 32px" />

          <div class="w-55% h-80% ml-3">
            <div class="text-12px color-#666666">
              <Tooltip placement="rightTop">
                <template #title>
                  <div>接收数据量: {{ formateData(NetInfo.netRecvByte) }} KB/s</div>
                  <div>发送数据量: {{ formateData(NetInfo.netSendByte) }} KB/s</div>
                </template>
                网络IO <ExclamationCircleOutlined /> </Tooltip
            ></div>
            <div class="mt-0">
              <span class="text-18px text-blue-500">{{ netIO }} </span>
              <span class="text-12px color-#666666"> KB/s</span>
            </div>
          </div>
        </div>
        <div class="box">
          <img :src="basicImg7" style="width: 32px; height: 32px" />

          <div class="w-55% h-80% ml-3">
            <div class="text-12px color-#666666">
              <Tooltip placement="rightTop">
                <template #title>
                  <div>写入次数: {{ formateData(DiskInfo.writeCount) }} 次/s </div>
                  <div>读取次数: {{ formateData(DiskInfo.readCount) }} 次/s </div>
                  <div>写入数据量: {{ formateData(DiskInfo.writeByte) }} KB/s</div>
                  <div>读取数据量: {{ formateData(DiskInfo.readByte) }} KB/s</div>
                </template>
                磁盘IO
                <ExclamationCircleOutlined /> </Tooltip
            ></div>
            <div class="mt-0">
              <span class="text-18px text-blue-500">{{ diskIO }}</span>
              <span class="text-12px color-#666666"> KB/s</span>
            </div>
          </div>
        </div>
        <div class="box">
          <img :src="basicImg8" style="width: 32px; height: 32px" />

          <div class="w-55% h-80% ml-3">
            <div class="text-12px color-#666666">
              <Tooltip placement="rightTop">
                <template #title>
                  <div>交互内存使用率: {{ formateData(SwapMemInfo.usedPercent) }} %</div>
                  <div>总交互内存: {{ formateData(SwapMemInfo.totalMem) }} MB</div>
                  <div>可用交互内存: {{ formateData(SwapMemInfo.freeMem) }} MB</div>
                  <div>已用交互内存: {{ formateData(SwapMemInfo.usedMem) }} MB</div>
                </template>
                交互内存使用率
                <ExclamationCircleOutlined /> </Tooltip
            ></div>
            <div class="mt-0">
              <span class="text-18px text-blue-500"
                >{{ formateData(SwapMemInfo.usedPercent) }}
              </span>
              <span class="text-12px color-#666666"> %</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
  <Modal @register="registerModal" />
</template>
<script lang="ts" setup>
  import basicImg1 from '@/assets/images/systemHealthMonitoring/basic_icon1.png';
  import basicImg2 from '@/assets/images/systemHealthMonitoring/basic_icon2.png';
  import basicImg3 from '@/assets/images/systemHealthMonitoring/basic_icon3.png';
  import basicImg4 from '@/assets/images/systemHealthMonitoring/basic_icon4.png';
  import basicImg5 from '@/assets/images/systemHealthMonitoring/basic_icon5.png';
  import basicImg6 from '@/assets/images/systemHealthMonitoring/basic_icon6.png';
  import basicImg7 from '@/assets/images/systemHealthMonitoring/basic_icon7.png';
  import basicImg8 from '@/assets/images/systemHealthMonitoring/basic_icon8.png';
  import Icon from '@/components/Icon/Icon.vue';

  import Modal from './Modal.vue';
  import { Ref, ref, watch, computed, onMounted, onUnmounted } from 'vue';
  import { Tooltip, Card, Dropdown, Menu, MenuItem, Button } from 'ant-design-vue';
  import { ExclamationCircleOutlined, EditTwoTone } from '@ant-design/icons-vue';
  import { useModal } from '@/components/Modal';
  import { GetSystemHealth } from '@/api/systemHealthMonitoring/serverHealth';
  import { useGlobSetting } from '@/hooks/setting';

  const { ipList, virtualIp } = useGlobSetting();
  const server = ipList?.split(';');
  const IPList = ref(server);
  const currentIP = ref(server?.[0]);
  const props = defineProps({
    info: Array,
    dailyAddInfo: Object,
  });
  const [registerModal, { openModal: openHealthModal }] = useModal();
  const setHealth = () => {
    GetSystemHealth()
      .then((res) => {
        // console.log(res, 'res');
        openHealthModal(true, {
          CpuThreshold: res?.cpuThreshold ?? null,
          MemThreshold: res?.memThreshold ?? null,
          DiskThreshold: res?.diskThreshold ?? null,
          // info: 'Info',
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const changeIP = (item: string) => {
    currentIP.value = item;
    getInfo(currentIP.value);
  };

  const dailyAddData = ref<any>({});
  const NetInfo = ref<any>({});
  const CpuInfo = ref<any>({});
  const VMemInfo = ref<any>({});
  const SwapMemInfo = ref<any>({});
  const DiskInfo = ref<any>({});
  const SystemHealthValue = ref<any>({});
  const getInfo = (current: any) => {
    // console.log(config.slice(1), 'config2=========');

    // console.log(JSON.parse(config.slice(1)), '-=================');
    // JSON.parse()
    props.info?.forEach((item: any) => {
      if (item.nodeUrl == current) {
        NetInfo.value = item.netInfo;
        CpuInfo.value = item.cpuInfo;
        VMemInfo.value = item.vMemInfo;
        SwapMemInfo.value = item.swapMemInfo;
        DiskInfo.value = item.diskInfo;
        SystemHealthValue.value = item.systemHealthValue;
      }
    });
  };
  //保留两位小数
  const formateData = (val: any) => {
    // console.log()
    if (val === undefined) {
      return '--';
    } else if (val !== '') {
      return Number(val).toFixed(2);
    } else {
      return val;
    }
  };
  const netIO = computed(() => {
    let temp = 0;
    if (formateData(NetInfo.value.netRecvByte) > 0) {
      temp = temp + Number(formateData(NetInfo.value.netRecvByte));
    }
    if (formateData(NetInfo.value.netSendByte) > 0) {
      temp = temp + Number(formateData(NetInfo.value.netSendByte));
    }
    return temp > 0 ? formateData(temp) : '--';
  });
  const diskIO = computed(() => {
    let temp = 0;
    if (formateData(DiskInfo.value.readByte) > 0) {
      temp = temp + Number(formateData(DiskInfo.value.readByte));
    }
    if (formateData(DiskInfo.value.writeByte) > 0) {
      temp = temp + Number(formateData(DiskInfo.value.writeByte));
    }
    return temp > 0 ? formateData(temp) : '--';
  });
  watch(
    () => props.info,
    () => {
      if (!props.info) {
        return;
      }
      if (props.info.length > 0) {
        getInfo(currentIP.value);
      }
    },
    { immediate: true },
  );
  watch(
    () => props.dailyAddInfo,
    () => {
      if (!props.dailyAddInfo) {
        return;
      }
      dailyAddData.value = props.dailyAddInfo;
    },
    { immediate: true },
  );
</script>
<style lang="less" scoped>
  .serverHealth-ServeRate {
    :deep(.ant-card) {
      .ant-card-head {
        height: 56px;
        padding: 0 10px;
      }

      .ant-card-body {
        height: calc(100% - 56px);
        padding: 0;
      }
    }
  }

  .box-container {
    display: flex;
    justify-content: space-between;
    height: 48%;
    padding: 0 2rem;

    .box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 25%;
    }
  }
</style>
