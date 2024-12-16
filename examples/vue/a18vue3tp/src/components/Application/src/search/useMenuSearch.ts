import { useI18n } from '@/hooks/web/useI18n';
import { useGo } from '@/hooks/web/usePage';
import { getMenus } from '@/router/menus';
import { type Menu } from '@/router/types';
import { filter, forEach } from '@/utils/helper/treeHelper';
import { useScrollTo } from '@vben/hooks';
import { type AnyFunction } from '@vben/types';
import { onKeyStroke, useDebounceFn } from '@vueuse/core';
import { cloneDeep, result } from 'lodash-es';
import { Ref, nextTick, onBeforeMount, ref, unref } from 'vue';
import {
  getSearchData,
  GetOneDevice,
  GetOneDataSource,
  GetOneInnerSource,
  GetOneDataChannel,
  GetOneDataDefine,
  GetOneInnerDefine,
} from '@/api/sys/search';
import { UUIDTypeEnum, uuidModalConfigType } from '@/components/UUIDDom/index';

export interface SearchResult {
  uuid: string;
  type: string;
  info: string;
  // 搜索结果包含的字符着色
  chars: { char: string; highlight: boolean }[];
}

// Translate special characters
function transform(c: string) {
  const code: string[] = ['$', '(', ')', '*', '+', '.', '[', ']', '?', '\\', '^', '{', '}', '|'];
  return code.includes(c) ? `\\${c}` : c;
}

function createSearchReg(key: string) {
  const keys = [...key].map((item) => transform(item));
  const str = ['', ...keys, ''].join('.*');
  return new RegExp(str);
}

// const searchTypeOfUUIDTypeDic = {
//   DataDefMemSync: UUIDTypeEnum.DataDefine_UUID, // 外部数据定义
//   DataSourceMemSync: UUIDTypeEnum.DataSource_UUID, // 外部数据源
//   DeviceMemSync: UUIDTypeEnum.Device_UUID, // 设备
//   DataChannelMemSync: UUIDTypeEnum.DataChannel_UUID, // 数据通道
//   InnerSourceMemSync: UUIDTypeEnum.InternalDataSource_UUID, // 内部数据源
//   InnerDataDefMemSync: UUIDTypeEnum.InnerDataDef_UUID, // 内部数据定义
// };

export function useMenuSearch(
  refs: Ref<HTMLElement[]>,
  scrollWrap: Ref,
  emit: AnyFunction,
  uuidModalConfig: uuidModalConfigType,
) {
  const searchResult = ref<SearchResult[]>([]);
  const keyword = ref('');
  const activeIndex = ref(-1);

  let menuList: Menu[] = [];

  const { t } = useI18n();
  const handleSearch = useDebounceFn(search, 500);

  onBeforeMount(async () => {
    const list = await getMenus();
    menuList = cloneDeep(list);
    forEach(menuList, (item) => {
      item.name = t(item.meta?.title || item.name);
    });
  });

  async function search(e: ChangeEvent) {
    e?.stopPropagation();
    const key = e.target.value;
    // keyword.value = key.trim().toLowerCase();
    keyword.value = key.toLowerCase();
    if (!key) {
      searchResult.value = [];
      return;
    }
    const getSearchResult = await getSearchData({}, { infos: unref(keyword.value) });
    searchResult.value = handlerSearchResult(getSearchResult, keyword.value);
    activeIndex.value = 0;
  }

  function handlerSearchResult(originalSearchResult, keyword) {
    // console.log('originalSearchResult, reg-->', originalSearchResult, keyword);
    const ret: SearchResult[] = [];
    for (let i = 0; i < originalSearchResult.queryList.length; i++) {
      const obj: SearchResult = {
        uuid: originalSearchResult.queryList[i]._uuid,
        type: originalSearchResult.queryList[i]._Task,
        info: originalSearchResult.queryList[i]._info,
        chars: [],
      };
      obj.chars = segments(originalSearchResult.queryList[i]._info, keyword);
      // originalSearchResult.queryList[i]._info.split('').forEach((char: string, index: number) => {
      //   keyword.split('').includes(char)
      //     ? obj.chars.push({ char, highlight: true })
      //     : obj.chars.push({ char, highlight: false });
      // });
      ret.push(obj);
    }
    // console.log('ret', ret);
    return ret;
  }

  // 定义段落对象数组
  const segments = (string1 = '', string2 = '') => {
    const words = string2.split(' ').filter((word) => word.length > 0);
    const regex = new RegExp(words.join('|'), 'g'); // 创建一个匹配关键词的正则表达式

    // 使用正则表达式将字符串1拆分为匹配和非匹配段落
    const parts = string1.split(regex);

    // 找出所有匹配的词组
    const matches = string1.match(regex) || [];

    // 合并匹配和非匹配部分
    const result: any = [];
    parts.forEach((part, index) => {
      result.push({ char: part, highlight: false });
      if (index < matches.length) {
        result.push({ char: matches[index], highlight: true });
      }
    });

    return result;
  };

  // Activate when the mouse moves to a certain line
  function handleMouseenter(e: any) {
    const index = e.target.dataset.index;
    activeIndex.value = Number(index);
  }

  // Arrow key up
  function handleUp() {
    if (!searchResult.value.length) return;
    activeIndex.value--;
    if (activeIndex.value < 0) {
      activeIndex.value = searchResult.value.length - 1;
    }
    handleScroll();
  }

  // Arrow key down
  function handleDown() {
    if (!searchResult.value.length) return;
    activeIndex.value++;
    if (activeIndex.value > searchResult.value.length - 1) {
      activeIndex.value = 0;
    }
    handleScroll();
  }

  // When the keyboard up and down keys move to an invisible place
  // the scroll bar needs to scroll automatically
  function handleScroll() {
    const refList = unref(refs);
    if (!refList || !Array.isArray(refList) || refList.length === 0 || !unref(scrollWrap)) {
      return;
    }

    const index = unref(activeIndex);
    const currentRef = refList[index];
    if (!currentRef) {
      return;
    }
    const wrapEl = unref(scrollWrap);
    if (!wrapEl) {
      return;
    }
    const scrollHeight = currentRef.offsetTop + currentRef.offsetHeight;
    const wrapHeight = wrapEl.offsetHeight;
    const { start } = useScrollTo({
      el: wrapEl,
      duration: 100,
      to: scrollHeight - wrapHeight,
    });
    start();
  }

  // enter keyboard event
  async function handleEnter(e) {
    if (!searchResult.value.length) {
      return;
    }
    const result = unref(searchResult);
    const index = unref(activeIndex);
    if (result.length === 0 || index < 0) {
      return;
    }
    // console.log('result[index]===>', result[index]);
    // const to = result[index];
    openDetailModal(result[index]);
    // handleClose();
    // await nextTick();
    // go(to.path);
  }

  const openDetailModal = async (result: SearchResult) => {
    // console.log('result--->', result);
    uuidModalConfig.visible = false;
    uuidModalConfig.title = '详情';
    // console.log('result', result);
    const uuidResult = {
      uuid: result.uuid,
      uuidType: result.type as UUIDTypeEnum,
      record: {},
    };
    switch (result.type) {
      case 'DeviceMemSync':
        {
          uuidModalConfig.title = '设备类型uuid详情';
          uuidResult.record = await GetOneDevice({}, { uuid: result.uuid });
        }
        break;
      case 'DataSourceMemSync':
        {
          uuidModalConfig.title = '外部数据源类型uuid详情';
          uuidResult.record = await GetOneDataSource({}, { uuid: result.uuid });
        }
        break;
      case 'InnerSourceMemSync':
        {
          uuidModalConfig.title = '内部数据源类型uuid详情';
          uuidResult.record = await GetOneInnerSource({}, { uuid: result.uuid });
        }
        break;
      case 'DataChannelMemSync':
        {
          uuidModalConfig.title = '数据通道类型uuid详情';
          uuidResult.record = await GetOneDataChannel({}, { uuid: result.uuid });
        }
        break;
      case 'DataDefMemSync':
        {
          uuidModalConfig.title = '外部数据定义类型uuid详情';
          uuidResult.record = await GetOneDataDefine({}, { uuid: result.uuid });
        }
        break;
      case 'InnerDataDefMemSync':
        {
          uuidModalConfig.title = '内部数据定义类型uuid详情';
          uuidResult.record = await GetOneInnerDefine({}, { uuid: result.uuid });
        }
        break;
      default:
        break;
    }
    handleClose();
    uuidModalConfig.uuid = uuidResult.uuid;
    uuidModalConfig.uuidType = uuidResult.uuidType;
    uuidModalConfig.record = uuidResult.record;
    uuidModalConfig.visible = true;
    // console.log('uuidModalConfig:', uuidModalConfig);
  };

  // close search modal
  function handleClose() {
    searchResult.value = [];
    emit('close');
  }

  // enter search
  onKeyStroke('Enter', handleEnter);
  // Monitor keyboard arrow keys
  onKeyStroke('ArrowUp', handleUp);
  onKeyStroke('ArrowDown', handleDown);
  // esc close
  onKeyStroke('Escape', handleClose);

  return { handleSearch, searchResult, keyword, activeIndex, handleMouseenter, handleEnter };
}
