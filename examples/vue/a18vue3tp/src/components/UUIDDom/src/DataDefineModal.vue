<!-- 外部数据定义 类型弹框 -->
<template>
  <BasicModal
    v-bind="$attrs"
    class="UUIDDom-uuid-modal UUIDDom-uuid-DataDefineModal"
    @register="register"
    :title="titleValue"
    @ok="validateForm"
    @cancel="reset"
    width="750px"
    :showCancelBtn="false"
    :showOkBtn="false"
    :canFullscreen="false"
  >
    <div class="uuid-modal-content">
      <!-- <div class="header">
        <div class="img-box">
          <Image
            :width="80"
            :src="`${getIp(0)}/api/Device/GetImage?uuid=${recordValue.uuid}`"
            fallback="data:image/png;base64,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"
          />
        </div>
        <div class="title-box">
          <div class="first-title">{{ recordValue.name }}</div>
        </div>
      </div> -->
      <div class="content">
        <div class="item w-100%!">
          <div class="item-title">UUID：</div>
          <div class="item-value">
            {{ recordValue.uuid }}
            <Button
              style="margin-top: -5px; margin-left: -5px"
              title="一键复制"
              size="small"
              type="text"
              @click="oneCopyText(recordValue.uuid)"
            >
              <template #icon><CopyOutlined style="font-size: 12px" /> </template>
            </Button>
          </div>
        </div>
        <div class="item w-100%!">
          <div class="item-title">名称：</div>
          <div class="item-value">{{ recordValue.dataName }}</div>
        </div>
        <div class="item w-100%!">
          <div class="item-title">数据类型：</div>
          <div class="item-value">{{ recordValue.dataTypeBase }}</div>
        </div>
        <div class="item w-100%!">
          <div class="item-title">单位：</div>
          <div class="item-value">{{ recordValue.unitName }}</div>
        </div>
        <div class="item w-100%!">
          <div class="item-title">次级类型：</div>
          <div class="item-value">{{ recordValue.typeSub }}</div>
        </div>
        <div class="item w-100%!">
          <div class="item-title">父级定义UUID：</div>
          <div class="item-value">
            <!-- {{ recordValue.fatherUUID }} -->
            <UUIDDiv
              v-if="recordValue.fatherUUID"
              :uuid="recordValue.fatherUUID"
              :uuidType="UUIDTypeEnum.DataDefMemSync"
            />
            <Button
              v-if="recordValue.fatherUUID"
              style="margin-top: -5px; margin-left: -5px"
              title="一键复制"
              size="small"
              type="text"
              @click="oneCopyText(recordValue.fatherUUID)"
            >
              <template #icon> <CopyOutlined style="font-size: 12px" /></template>
            </Button>
          </div>
        </div>
        <div class="item w-100%!">
          <div class="item-title">子级定义UUID列表：</div>
          <div class="item-value">
            <div v-for="(item, index) in recordValue.childUUID" :key="index">
              <!-- <span>{{ item }}</span> -->
              <UUIDDiv v-if="item" :uuid="item" :uuidType="UUIDTypeEnum.DataDefMemSync" />
              <Button
                v-if="item"
                style="margin-top: -5px; margin-left: -5px"
                title="一键复制"
                size="small"
                type="text"
                @click="oneCopyText(item)"
              >
                <template #icon> <CopyOutlined style="font-size: 12px" /></template>
              </Button>
            </div>
          </div>
        </div>
        <div class="item w-100%!">
          <div class="item-title">被引用次数：</div>
          <div class="item-value">{{ recordValue.bindCounter }}</div>
        </div>
        <div class="item w-100%!">
          <div class="item-title">唯一标识字段：</div>
          <div class="item-value">{{ recordValue.isIdField }}</div>
        </div>
        <div class="item w-100%!">
          <div class="item-title">描述：</div>
          <div class="item-value">{{ recordValue.description }}</div>
        </div>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="tsx" setup>
  import { computed, nextTick, ref, watch } from 'vue';
  import { BasicModal, useModal, useModalInner } from '@/components/Modal';
  import { useMessage } from '@/hooks/web/useMessage';
  import { oneCopyText } from '@/utils/simpleTools';
  import { Button } from 'ant-design-vue';
  import { CopyOutlined } from '@ant-design/icons-vue';
  import { UUIDDiv, uuidModalConfigType, UUIDTypeEnum } from '@/components/UUIDDom';

  defineOptions({ name: 'DataDefineModal' });

  const $emit = defineEmits(['register']);
  const { createMessage } = useMessage();

  const uuidValue = ref('');
  const uuidTypeValue = ref('');
  const titleValue = ref('');
  const recordValue = ref<any>({});

  const onDataReceive = (data: uuidModalConfigType) => {
    console.log('接收到的data:', data);
    uuidValue.value = data.uuid;
    uuidTypeValue.value = data.uuidType;
    titleValue.value = data.title;
    recordValue.value = data.record;
  };

  const modelRef = ref({});

  const [register, { closeModal }] = useModalInner((data) => {
    data && onDataReceive(data);
  });

  //保存校验
  const validateForm = async () => {
    // console.log('保存');
  };
  //取消重置
  const reset = async () => {
    // console.log('取消');
  };
</script>
<style lang="less">
  .UUIDDom-uuid-DataDefineModal {
    // 样式背景覆盖
    &.ant-modal {
      @uuid_bg: './images/DataDefineBg.png';

      .ant-modal-content {
        // height: 457px !important;
        background: url('@{uuid_bg}') no-repeat !important;
        background-size: 100% 100% !important;
      }
    }

    .uuid-modal-content {
      .header {
        display: grid;
        grid-template-columns: 80px auto;
        width: 100%;
        height: 80px;
        padding: 0 0 0 10px;

        .img-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          // background-color: yellowgreen;
        }

        .title-box {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          height: 100%;
          padding: 15px;
          padding-left: 20px;

          .first-title {
            width: 100%;
            color: #010101;
            font-family: 'Microsoft YaHei';
            font-size: 18px;
            font-weight: bold;
          }

          .second-title {
            width: 100%;
            color: rgb(77 77 77 / 100%);
          }
        }
      }

      .content {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        padding: 20px 10px 0;

        .item {
          display: flex;
          align-items: center;
          width: 50%;
          padding: 0 10px 15px;
          font-family: 'Microsoft YaHei';
          font-size: 16px;

          .item-title {
            width: 220px;
            font-weight: bold;
            text-align: left;
          }

          .item-value {
            flex: 1;
            overflow: hidden;
            color: rgb(77 77 77 / 100%);
            text-align: left;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
</style>
