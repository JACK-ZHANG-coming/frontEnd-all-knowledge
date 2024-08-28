<template>
  <div class="w-100% h-100%">
    <div class="title">
      <div class="blue-dot"></div>
      <span class="title-text">主轴实时数据</span>
    </div>
    <div class="divider"></div>
    <div class="box-row h-135px">
      <div
        class="little-box w-100%"
        @click="open('主轴实时数据-转速')"
        :title="realTimeData?.r1c1 + realTimeData?.r1c1_unit"
      >
        <img
          class="little-box-img"
          src="@/assets/images/equipmentManagement/deviceTemplateDetail/speed_full.png"
        />
        <div class="little-box-text">
          <div class="little-box-title">转速</div>
          <div class="little-box-number">
            <div class="w-55% ellipsis-box"> {{ realTimeData?.r1c1 }}</div>
            <div class="w-45%">{{ realTimeData?.r1c1_unit }}</div>
          </div>
        </div>
      </div>
      <div class="little-box w-100%" @click="open('主轴实时数据-倍率')" :title="realTimeData?.r1c2">
        <img
          class="little-box-img"
          src="@/assets/images/equipmentManagement/deviceTemplateDetail/beilv_full.png"
        />
        <div class="little-box-text">
          <div class="little-box-title">倍率</div>
          <div class="little-box-number">
            <span v-if="realTimeData?.r1c2 !== ''"> ×{{ realTimeData?.r1c2 }} </span>
          </div>
        </div>
      </div>
      <div
        class="little-box w-100%"
        @click="open('主轴实时数据-负载')"
        :title="realTimeData?.r1c3 + realTimeData?.r1c3_unit"
      >
        <img
          class="little-box-img"
          src="@/assets/images/equipmentManagement/deviceTemplateDetail/fuzai_full.png"
        />
        <div class="little-box-text">
          <div class="little-box-title">负载</div>
          <div class="little-box-number">
            <div class="w-55% ellipsis-box"> {{ realTimeData?.r1c3 }}</div>
            <div class="w-45%">{{ realTimeData?.r1c3_unit }}</div>
          </div>
        </div>
      </div>
      <div
        class="little-box w-100%"
        @click="open('主轴实时数据-负载百分比')"
        :title="realTimeData?.r1c4 + realTimeData?.r1c4_unit"
      >
        <img
          class="little-box-img"
          src="@/assets/images/equipmentManagement/deviceTemplateDetail/percent_full.png"
        />
        <div class="little-box-text">
          <div class="little-box-title">负载百分比</div>
          <div class="little-box-number">
            <div class="w-55% ellipsis-box"> {{ realTimeData?.r1c4 }}</div>
            <div class="w-45%">{{ realTimeData?.r1c4_unit }}</div>
          </div>
        </div>
      </div>
      <div
        class="little-box w-100%"
        @click="open('主轴实时数据-电机温度')"
        :title="realTimeData?.r1c5 + realTimeData?.r1c5_unit"
      >
        <img
          class="little-box-img"
          src="@/assets/images/equipmentManagement/deviceTemplateDetail/wendu_full.png"
        />
        <div class="little-box-text">
          <div class="little-box-title">电机温度</div>
          <div class="little-box-number">
            <div class="w-55% ellipsis-box"> {{ realTimeData?.r1c5 }}</div>
            <div class="w-45%">{{ realTimeData?.r1c5_unit }}</div>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
    <div class="title mt-2">
      <div class="blue-dot"></div>
      <span class="title-text">工作台实时数据</span>
    </div>
    <div class="divider"></div>
    <div class="box-row h-80px">
      <div
        class="little-box w-100%"
        @click="open('工作台实时数据-负载')"
        :title="realTimeData?.r2c1 + realTimeData?.r2c1_unit"
      >
        <img
          class="little-box-img"
          src="@/assets/images/equipmentManagement/deviceTemplateDetail/fuzai_full.png"
        />
        <div class="little-box-text">
          <div class="little-box-title">负载</div>
          <div class="little-box-number">
            <div class="w-55% ellipsis-box"> {{ realTimeData?.r2c1 }}</div>
            <div class="w-45%">{{ realTimeData?.r2c1_unit }}</div>
          </div>
        </div>
      </div>
      <div
        class="little-box w-100%"
        @click="open('工作台实时数据-负载百分比')"
        :title="realTimeData?.r2c2 + realTimeData?.r2c2_unit"
      >
        <img
          class="little-box-img"
          src="@/assets/images/equipmentManagement/deviceTemplateDetail/percent_full.png"
        />
        <div class="little-box-text">
          <div class="little-box-title">负载百分比</div>
          <div class="little-box-number">
            <div class="w-55% ellipsis-box"> {{ realTimeData?.r2c2 }}</div>
            <div class="w-45%">{{ realTimeData?.r2c2_unit }}</div>
          </div>
        </div>
      </div>
      <div
        class="little-box w-100%"
        @click="open('工作台实时数据-电机温度')"
        :title="realTimeData?.r2c3 + realTimeData?.r2c3_unit"
      >
        <img
          class="little-box-img"
          src="@/assets/images/equipmentManagement/deviceTemplateDetail/wendu_full.png"
        />
        <div class="little-box-text">
          <div class="little-box-title">电机温度</div>
          <div class="little-box-number">
            <div class="w-55% ellipsis-box"> {{ realTimeData?.r2c3 }}</div>
            <div class="w-45%">{{ realTimeData?.r2c3_unit }}</div>
          </div>
        </div>
      </div>
    </div>

    <!--  -->
    <div class="title">
      <div class="blue-dot"></div>
      <span class="title-text">竖直轴实时数据</span>
    </div>
    <div class="divider"></div>
    <div class="box-row h-80px">
      <div
        class="little-box w-100%"
        @click="open('竖直轴实时数据-负载')"
        :title="realTimeData?.r3c1 + realTimeData?.r3c1_unit"
      >
        <img
          class="little-box-img"
          src="@/assets/images/equipmentManagement/deviceTemplateDetail/fuzai_full.png"
        />
        <div class="little-box-text">
          <div class="little-box-title">负载</div>
          <div class="little-box-number">
            <div class="w-55% ellipsis-box"> {{ realTimeData?.r3c1 }}</div>
            <div class="w-45%">{{ realTimeData?.r3c1_unit }}</div>
          </div>
        </div>
      </div>
      <div
        class="little-box w-100%"
        @click="open('竖直轴实时数据-负载百分比')"
        :title="realTimeData?.r3c2 + realTimeData?.r3c2_unit"
      >
        <img
          class="little-box-img"
          src="@/assets/images/equipmentManagement/deviceTemplateDetail/percent_full.png"
        />
        <div class="little-box-text">
          <div class="little-box-title">负载百分比</div>
          <div class="little-box-number">
            <div class="w-55% ellipsis-box"> {{ realTimeData?.r3c2 }}</div>
            <div class="w-45%">{{ realTimeData?.r3c2_unit }}</div>
          </div>
        </div>
      </div>
    </div>

    <!--  -->
    <div class="title">
      <div class="blue-dot"></div>
      <span class="title-text">进给轴实时数据</span>
    </div>
    <div class="divider"></div>
    <div class="box-row h-80px">
      <div
        class="little-box w-100%"
        @click="open('进给轴实时数据-速度')"
        :title="realTimeData?.r4c1 + realTimeData?.r4c1_unit"
      >
        <img
          class="little-box-img"
          src="@/assets/images/equipmentManagement/deviceTemplateDetail/speed_full.png"
        />
        <div class="little-box-text">
          <div class="little-box-title">速度</div>
          <div class="little-box-number">
            <div class="w-55% ellipsis-box"> {{ realTimeData?.r4c1 }}</div>
            <div class="w-45%">{{ realTimeData?.r4c1_unit }}</div>
          </div>
        </div>
      </div>
      <div
        class="little-box w-100%"
        @click="open('进给轴实时数据-倍率')"
        :title="realTimeData?.r4c2"
      >
        <img
          class="little-box-img"
          src="@/assets/images/equipmentManagement/deviceTemplateDetail/beilv_full.png"
        />
        <div class="little-box-text">
          <div class="little-box-title">倍率</div>
          <div class="little-box-number">
            <span v-if="realTimeData?.r4c2 !== ''"> ×{{ realTimeData?.r4c2 }} </span>
          </div>
        </div>
      </div>
      <div
        class="little-box w-100%"
        @click="open('进给轴实时数据-负载')"
        :title="realTimeData?.r4c3 + realTimeData?.r4c3_unit"
      >
        <img
          class="little-box-img"
          src="@/assets/images/equipmentManagement/deviceTemplateDetail/fuzai_full.png"
        />
        <div class="little-box-text">
          <div class="little-box-title">负载</div>
          <div class="little-box-number">
            <div class="w-55% ellipsis-box"> {{ realTimeData?.r4c3 }}</div>
            <div class="w-45%">{{ realTimeData?.r4c3_unit }}</div>
          </div>
        </div>
      </div>
      <div
        class="little-box w-100%"
        @click="open('进给轴实时数据-负载百分比')"
        :title="realTimeData?.r4c4 + realTimeData?.r4c4_unit"
      >
        <img
          class="little-box-img"
          src="@/assets/images/equipmentManagement/deviceTemplateDetail/percent_full.png"
        />
        <div class="little-box-text">
          <div class="little-box-title">负载百分比</div>
          <div class="little-box-number">
            <div class="w-55% ellipsis-box"> {{ realTimeData?.r4c4 }}</div>
            <div class="w-45%">{{ realTimeData?.r4c4_unit }}</div>
          </div>
        </div>
      </div>
    </div>

    <!--  -->
    <div class="title">
      <div class="blue-dot"></div>
      <div class="title-text">
        告警信息
        <Tooltip placement="right">
          <template #title>查看历史告警信息</template>
          <div class="search" @click="openList">
            <SearchOutlined />
          </div>
          <!-- <Button type="link" :size="'large'"><template #icon> <SearchOutlined /> </template></Button> -->
        </Tooltip>
      </div>
    </div>
    <div class="divider"></div>
    <div class="box-row h-178px">
      <div class="little-box w-100%" @click="open('告警信息-编号')" :title="realTimeData?.r5c1">
        <img
          class="little-box-img"
          src="@/assets/images/equipmentManagement/deviceTemplateDetail/code_full.png"
        />
        <div class="little-box-text">
          <div class="little-box-title">编号</div>
          <div class="little-box-number"> {{ realTimeData?.r5c1 }}</div>
        </div>
      </div>
      <div class="time-box w-100%" :title="realTimeData?.r5c2 + 's'">
        <img
          class="little-box-img"
          src="@/assets/images/equipmentManagement/deviceTemplateDetail/lastTime_full.png"
        />
        <div class="little-box-text">
          <div class="little-box-title">持续时间</div>
          <div class="little-box-number">
            <span v-if="realTimeData?.r5c2 !== ''"> {{ realTimeData?.r5c2 }}s </span>
          </div>
        </div>
      </div>
      <div class="little-box w-100%" @click="open('告警信息-等级')" :title="realTimeData?.r5c3">
        <img
          class="little-box-img"
          src="@/assets/images/equipmentManagement/deviceTemplateDetail/level_full.png"
        />
        <div class="little-box-text">
          <div class="little-box-title">等级</div>
          <div class="little-box-number">{{ realTimeData?.r5c3 }}</div>
        </div>
      </div>
      <div></div>
      <div class="detail-box w-100%" @click="open('告警信息-详情')" :title="realTimeData?.r5c4">
        <img
          class="detail-box-img"
          src="@/assets/images/equipmentManagement/deviceTemplateDetail/detail_full.png"
        />
        <div class="detail-box-text">
          <div class="detail-box-title">详情</div>
          <div class="detail-box-number">{{ realTimeData?.r5c4 }}</div>
        </div>
      </div>
    </div>

    <BindModal @register="registerBindModal" />
    <WarningDrawer @register="registerWarningDrawer" />
  </div>
</template>
<script lang="ts" setup>
  import { Tooltip, Card, Dropdown, Menu, MenuItem, Button, message } from 'ant-design-vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import { h, ref, computed, unref, toRaw, watch, onMounted, onUnmounted } from 'vue';
  import { useModal } from '@/components/Modal';
  import BindModal from './BindModal.vue';
  import WarningDrawer from './WarningDrawer.vue';
  import { useDrawer } from '@/components/Drawer';

  // import { mitt } from '@/utils/mitt';
  // const subMenuEmitter = mitt();

  const [registerBindModal, { openModal: bindModal }] = useModal();
  const [registerWarningDrawer, { openDrawer: warningDrawer }] = useDrawer();

  // const deviceUUId = ref(route.params?.uuid);
  // console.log(deviceUUId.value, 'route');
  const realTimeData = ref<any>({});
  const props = defineProps({
    deviceUUId: String,
    staticDataDefineLinkInfo: Object,
    realTimeList: Array,
  });
  const openList = () => {
    let obj: any =
      props.staticDataDefineLinkInfo && props.staticDataDefineLinkInfo['告警信息-编号'];
    if (obj.item1 !== '' && obj.item2 !== '') {
      warningDrawer(true, { obj, deviceUUId: props.deviceUUId });
    } else {
      message.warning('请先绑定告警信息-编号！');
    }
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
  const isNumericString = (num) => {
    if (num === '') {
      return 0;
    } else {
      let handleNum = parseFloat(num);
      let isToFixed =
        handleNum.toString().includes('.') && handleNum.toString().split('.')[1].length > 2;
      if (isToFixed) {
        if (handleNum.toFixed(2).toString().split('.')[1] == '00') {
          return handleNum.toFixed(0);
        } else {
          return handleNum.toFixed(2);
        }
      } else {
        return handleNum;
      }
    }
  };
  watch(
    () => props.realTimeList,
    () => {
      if (props.realTimeList?.length && props.realTimeList?.length > 0) {
        props.realTimeList?.forEach((item: any) => {
          if (item[0] == '主轴实时数据-转速') {
            realTimeData.value.r1c1 =
              !isNaN(parseFloat(item[1])) && isFinite(item[1]) ? isNumericString(item[1]) : item[1];
            realTimeData.value.r1c1_unit = item[2];
            // realTimeData.value.r1c1 = isNumericString(item[1]);
          } else if (item[0] == '主轴实时数据-倍率') {
            realTimeData.value.r1c2 =
              !isNaN(parseFloat(item[1])) && isFinite(item[1]) ? isNumericString(item[1]) : item[1];
          } else if (item[0] == '主轴实时数据-负载') {
            realTimeData.value.r1c3 =
              !isNaN(parseFloat(item[1])) && isFinite(item[1]) ? isNumericString(item[1]) : item[1];
            realTimeData.value.r1c3_unit = item[2];
          } else if (item[0] == '主轴实时数据-负载百分比') {
            realTimeData.value.r1c4 =
              !isNaN(parseFloat(item[1])) && isFinite(item[1]) ? isNumericString(item[1]) : item[1];
            realTimeData.value.r1c4_unit = item[2];
          } else if (item[0] == '主轴实时数据-电机温度') {
            realTimeData.value.r1c5 =
              !isNaN(parseFloat(item[1])) && isFinite(item[1]) ? isNumericString(item[1]) : item[1];
            realTimeData.value.r1c5_unit = item[2];
          } else if (item[0] == '工作台实时数据-负载') {
            realTimeData.value.r2c1 =
              !isNaN(parseFloat(item[1])) && isFinite(item[1]) ? isNumericString(item[1]) : item[1];
            realTimeData.value.r2c1_unit = item[2];
          } else if (item[0] == '工作台实时数据-负载百分比') {
            realTimeData.value.r2c2 =
              !isNaN(parseFloat(item[1])) && isFinite(item[1]) ? isNumericString(item[1]) : item[1];
            realTimeData.value.r2c2_unit = item[2];
          } else if (item[0] == '工作台实时数据-电机温度') {
            realTimeData.value.r2c3 =
              !isNaN(parseFloat(item[1])) && isFinite(item[1]) ? isNumericString(item[1]) : item[1];
            realTimeData.value.r2c3_unit = item[2];
          } else if (item[0] == '竖直轴实时数据-负载') {
            realTimeData.value.r3c1 =
              !isNaN(parseFloat(item[1])) && isFinite(item[1]) ? isNumericString(item[1]) : item[1];
            realTimeData.value.r3c1_unit = item[2];
          } else if (item[0] == '竖直轴实时数据-负载百分比') {
            realTimeData.value.r3c2 =
              !isNaN(parseFloat(item[1])) && isFinite(item[1]) ? isNumericString(item[1]) : item[1];
            realTimeData.value.r3c2_unit = item[2];
          } else if (item[0] == '进给轴实时数据-速度') {
            realTimeData.value.r4c1 =
              !isNaN(parseFloat(item[1])) && isFinite(item[1]) ? isNumericString(item[1]) : item[1];
            realTimeData.value.r4c1_unit = item[2];
          } else if (item[0] == '进给轴实时数据-倍率') {
            realTimeData.value.r4c2 =
              !isNaN(parseFloat(item[1])) && isFinite(item[1]) ? isNumericString(item[1]) : item[1];
          } else if (item[0] == '进给轴实时数据-负载') {
            realTimeData.value.r4c3 =
              !isNaN(parseFloat(item[1])) && isFinite(item[1]) ? isNumericString(item[1]) : item[1];
            realTimeData.value.r4c3_unit = item[2];
          } else if (item[0] == '进给轴实时数据-负载百分比') {
            realTimeData.value.r4c4 =
              !isNaN(parseFloat(item[1])) && isFinite(item[1]) ? isNumericString(item[1]) : item[1];
            realTimeData.value.r4c4_unit = item[2];
          } else if (item[0] == '告警信息-编号') {
            realTimeData.value.r5c1 =
              !isNaN(parseFloat(item[1])) && isFinite(item[1]) ? isNumericString(item[1]) : item[1];
            realTimeData.value.r5c2 = item[3];
          } else if (item[0] == '告警信息-等级') {
            realTimeData.value.r5c3 =
              !isNaN(parseFloat(item[1])) && isFinite(item[1]) ? isNumericString(item[1]) : item[1];
          } else if (item[0] == '告警信息-详情') {
            realTimeData.value.r5c4 =
              !isNaN(parseFloat(item[1])) && isFinite(item[1]) ? isNumericString(item[1]) : item[1];
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
    // console.log(deviceUUId.value, 'onMountedroute');
  });

  onUnmounted(() => {
    // console.log(deviceUUId.value, 'onUnmounted');
  });
</script>
<style scoped lang="less">
  .title {
    display: flex;
    align-items: center;
    margin-left: 17px;

    .blue-dot {
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: #0960bd;
    }

    .title-text {
      margin-left: 9px;
      color: #333;
      font-size: 18px;
      font-weight: 600;
    }
  }

  .divider {
    height: 1px;
    margin: 10px 8px;
    background: #e8e8e8;
  }

  .box-row {
    // background-color: red;background-color
    display: grid;
    grid-gap: 0 15px;
    // grid-column-gap: 2px;
    grid-template-columns: repeat(4, 1fr);
    margin: 0 20px;

    .little-box,
    .time-box {
      display: flex;
      align-items: center;
      height: 56px;
      border: 1px solid #d9d9d9;
      border-radius: 5px;
      background: #f5f5f5;
      box-shadow: 0 2px 0 rgb(0 0 0 / 2%);
      cursor: pointer;

      .little-box-img {
        width: 40px;
        height: 40px;
        margin: 0 5px 0 10px;
        opacity: 0.8;
      }

      .little-box-text {
        width: calc(100% - 65px);

        .little-box-title {
          height: 16px;
          color: #808080;
          font-size: 14px;
          font-weight: 500;
        }

        .little-box-number {
          display: flex;
          width: 100%;
          height: 16px;
          margin-top: 4px;
          overflow: hidden; /* 隐藏超出的内容 */
          // background-color: red;
          // padding-right:4px;
          color: #4d4d4d;
          font-size: 16px;
          font-weight: 500;
          text-overflow: ellipsis; /* 用省略号表示被隐藏的部分 */
          white-space: nowrap; /* 不换行 */
        }
      }
    }

    .little-box:hover {
      border: 1px solid #1677ff;
      background: rgb(22 119 255 / 10%);

      .little-box-title {
        color: #0960bd;
      }

      .little-box-number {
        color: #0960bd;
      }

      .little-box-img {
        opacity: 1;
      }
    }

    .ellipsis-box {
      overflow: hidden; /* 隐藏超出的内容 */
      text-overflow: ellipsis; /* 用省略号表示被隐藏的部分 */
      white-space: nowrap; /* 不换行 */
    }

    .detail-box {
      display: flex;
      grid-column: 1 / 5;
      // align-items: center;
      height: 100px;
      border: 1px solid #d9d9d9;
      border-radius: 5px;
      background: #f5f5f5;
      box-shadow: 0 2px 0 rgb(0 0 0 / 2%);
      cursor: pointer;

      .detail-box-img {
        width: 40px;
        height: 40px;
        margin: 10px 5px 0 10px;
        opacity: 0.8;
      }

      .detail-box-text {
        width: calc(100% - 65px);
        margin-top: 10px;

        .detail-box-title {
          height: 16px;
          color: #808080;
          font-size: 14px;
          font-weight: 500;
        }

        .detail-box-number {
          display: -webkit-box;
          width: 100%;
          height: 55px;
          margin-top: 4px;
          overflow: hidden;
          color: #4d4d4d;
          font-size: 16px;
          font-weight: 500;
          word-break: break-all;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
      }
      // grid-row: 2 / 4;
    }
  }

  .search {
    display: inline-block;
    color: #0960bd;
    cursor: pointer;
  }

  .search:hover {
    color: #69b1ff;
  }
</style>
