<template>
  <div class="uuid-div">
    <!-- <div
      class="uuid-content"
      :style="{
        border: '1px solid ' + getBgColor(getColor(props.uuidType), 1.2),
        backgroundColor: getBgColor(getColor(props.uuidType), 0.4),
      }"
      @click="onClickHandle"
    >
      {{ uuidShowText }}
    </div> -->
    <div class="uuid-content">
      <Tag
        v-if="flitterUUID(props.uuid)"
        :color="getColor(props.uuidType)"
        :style="{
          backgroundColor: getBgColor(getColor(props.uuidType), 0.2),
          border: '1px solid ' + getBgColor(getColor(props.uuidType), 1),
          color: getBgColor(getColor(props.uuidType), 1),
        }"
        @click="onClickHandle"
      >
        {{ uuidShowText }}
      </Tag>
      <span v-else></span>
    </div>
    <div class="uuid-modal">
      <UUIDModal v-model="uuidModalConfig" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, nextTick, onMounted, ref, watch } from 'vue';
  import { Tag, Alert } from 'ant-design-vue';
  import { UUIDModal, uuidModalConfigType } from '@/components/UUIDDom';
  import { UUIDTypeEnum } from './types/UUID.data';
  import {
    GetOneDevice,
    GetOneDataSource,
    GetOneInnerSource,
    GetOneDataChannel,
    GetOneDataDefine,
    GetOneInnerDefine,
  } from '@/api/sys/search';
  import { flitterUUID } from '@/utils/simpleTools';

  interface Props {
    uuid: string;
    uuidType: UUIDTypeEnum;
    title?: string;
    record?: any;
    noClick?: boolean;
  }

  defineOptions({ name: 'UUIDDiv' });

  const showUUIDTypeDic = {
    [UUIDTypeEnum.Person_UUID]: '人员',
    [UUIDTypeEnum.DeviceMemSync]: '设备',
    [UUIDTypeEnum.DataDefMemSync]: '外义',
    [UUIDTypeEnum.DataSourceMemSync]: '外源',
    [UUIDTypeEnum.DataChannelMemSync]: '通道',
    [UUIDTypeEnum.InnerSourceMemSync]: '内源',
    [UUIDTypeEnum.InnerDataDefMemSync]: '内义',
    [UUIDTypeEnum.CustomLargeScreen_UUID]: '大屏',
    [UUIDTypeEnum.CustomReportForm_UUID]: '报表',
  };

  const props = withDefaults(defineProps<Props>(), {
    uuid: '',
    uuidType: 'Default_UUID' as UUIDTypeEnum,
    title: '',
    record: {},
    noClick: false,
  });

  const uuidModalConfig = ref<uuidModalConfigType>({
    visible: false,
    uuid: '',
    uuidType: '',
    title: '',
    record: {},
  });

  const uuidShowText = ref('');

  const getColor = (type: UUIDTypeEnum) => {
    let color = '';
    switch (type) {
      // case UUIDTypeEnum.Person_UUID:
      //   color = '#f50';
      //   break;
      case UUIDTypeEnum.DeviceMemSync:
        color = '#4876FF';
        break;
      case UUIDTypeEnum.DataDefMemSync:
        color = '#EEB422';
        break;
      case UUIDTypeEnum.DataSourceMemSync:
        color = '#CD8C95';
        break;
      case UUIDTypeEnum.DataChannelMemSync:
        color = '#009ACD';
        break;
      case UUIDTypeEnum.InnerSourceMemSync:
        color = 'pink';
        break;
      case UUIDTypeEnum.InnerDataDefMemSync:
        color = '	#8B008B';
        break;
      // case UUIDTypeEnum.CustomLargeScreen_UUID:
      //   color = '#f50';
      //   break;
      // case UUIDTypeEnum.CustomReportForm_UUID:
      //   color = '#f50';
      //   break;
      default:
        color = '#ccc';
        break;
    }
    return color;
  };

  const getBgColor = (color, opacity = 0.5) => {
    // Helper functions to parse different color formats
    const hexToRgb = (hex) => {
      // Remove the leading # if it exists
      hex = hex.replace('#', '');

      // Handle short hex notation (e.g., #f50 -> #ff5500)
      if (hex.length === 3) {
        hex = hex
          .split('')
          .map((char) => char + char)
          .join('');
      }

      // Convert to RGB values
      const bigint = parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;

      return [r, g, b];
    };

    const colorNameToRgb = (colorName) => {
      // Create a dummy element to compute the rgb value from the color name
      const element = document.createElement('div');
      element.style.color = colorName;
      document.body.appendChild(element);

      // Get the computed color value
      const rgb = window.getComputedStyle(element).color;
      document.body.removeChild(element);

      return rgb;
    };

    const parseRgb = (rgb) => {
      const match = rgb.match(/\d+/g);
      return match ? match.map(Number) : [0, 0, 0];
    };

    let rgbArray;

    if (color.startsWith('#')) {
      // Hexadecimal format
      rgbArray = hexToRgb(color);
    } else if (color.startsWith('rgb')) {
      // RGB format
      rgbArray = parseRgb(color);
    } else {
      // Color name
      const rgbString = colorNameToRgb(color);
      rgbArray = parseRgb(rgbString);
    }

    // Return rgba format with the specified opacity
    return `rgba(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]}, ${opacity})`;
  };

  const clickTagHandle = (event: MouseEvent) => {
    console.log('1', 1);
  };

  const init = () => {
    uuidShowText.value = showUUIDTypeDic[props.uuidType] + '-' + props.uuid.slice(0, 4);
  };

  const onClickHandle = (event: MouseEvent) => {
    if (props.noClick) {
      return;
    }
    let result = {
      title: props?.title || uuidShowText.value,
      uuid: props.uuid,
      uuidType: props.uuidType,
      record: props?.record || {},
    };
    openDetailModal(result);
  };

  const openDetailModal = async (result) => {
    // console.log('result--->', result);
    uuidModalConfig.value.visible = false;
    uuidModalConfig.value.title = result?.title;
    const uuidResult = {
      uuid: result.uuid,
      uuidType: result.uuidType,
      record: props?.record || {},
    };
    switch (uuidResult.uuidType) {
      case UUIDTypeEnum.DeviceMemSync:
        {
          uuidModalConfig.value.title = '设备类型uuid详情';
          uuidResult.record = await GetOneDevice({}, { uuid: result.uuid });
        }
        break;
      case UUIDTypeEnum.DataSourceMemSync:
        {
          uuidModalConfig.value.title = '外部数据源类型uuid详情';
          uuidResult.record = await GetOneDataSource({}, { uuid: result.uuid });
        }
        break;
      case UUIDTypeEnum.InnerSourceMemSync:
        {
          uuidModalConfig.value.title = '内部数据源类型uuid详情';
          uuidResult.record = await GetOneInnerSource({}, { uuid: result.uuid });
        }
        break;
      case UUIDTypeEnum.DataChannelMemSync:
        {
          uuidModalConfig.value.title = '数据通道类型uuid详情';
          uuidResult.record = await GetOneDataChannel({}, { uuid: result.uuid });
        }
        break;
      case UUIDTypeEnum.DataDefMemSync:
        {
          uuidModalConfig.value.title = '外部数据定义类型uuid详情';
          uuidResult.record = await GetOneDataDefine({}, { uuid: result.uuid });
        }
        break;
      case UUIDTypeEnum.InnerDataDefMemSync:
        {
          uuidModalConfig.value.title = '内部数据定义类型uuid详情';
          uuidResult.record = await GetOneInnerDefine({}, { uuid: result.uuid });
        }
        break;
      default:
        break;
    }
    uuidModalConfig.value.uuid = uuidResult.uuid;
    uuidModalConfig.value.uuidType = uuidResult.uuidType;
    uuidModalConfig.value.record = uuidResult.record;
    uuidModalConfig.value.visible = true;
  };

  onMounted(() => {
    init();
  });
  watch(props, (val) => {
    init();
  });
</script>
<style scoped lang="less">
  .uuid-div {
    display: inline-block;

    .uuid-content {
      display: inline-block;
      // padding: 4px 8px;
      // border-radius: 5px;
      // border: 1px solid #ccc;
      font-size: 14px;
      cursor: pointer;
    }
  }
</style>
