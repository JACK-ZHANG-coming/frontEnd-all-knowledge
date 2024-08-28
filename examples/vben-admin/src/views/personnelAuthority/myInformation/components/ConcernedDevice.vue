<template>
  <Card :title="'已关注设备'">
    <div class="ConcernedDevice">
      <div v-if="userInfo && userInfo.deviceList && userInfo.deviceList.length > 0">
        <div class="item" v-for="(item, index) in userInfo.deviceList" :key="index">
          <div class="left">
            <Image
              :width="60"
              :src="`${getIp(0)}/api/Device/GetImage?uuid=${item.uuid}`"
              :fallback="imgFallback"
            />
          </div>
          <div class="right">
            <div class="content">
              <div class="title">
                {{ item.name }}
                <span style="margin-left: 10px"></span>
                <UUIDDiv :uuidType="UUIDTypeEnum.DeviceMemSync" :uuid="item.uuid" :record="item" />
              </div>
              <!-- <div class="title">
              {{ item.name }}
              <div class="uuid-icon" :class="'uuid-bg-type' + item.deviceUuid.slice(0, 1)"></div>
            </div> -->
              <div class="desc">
                {{ item.description }}
              </div>
            </div>
            <div class="icon">
              <Popconfirm
                placement="top"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleNoStarClick(item)"
              >
                <template #title>
                  <p>确定取消关注吗</p>
                </template>
                <img style="cursor: pointer" :src="star" width="25" height="25" />
              </Popconfirm>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty">
        <Empty style="margin-top: 40px" :image="simpleImage" />
      </div>
    </div>
  </Card>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store/modules/user';
  import { computed, onMounted } from 'vue';
  import { DelSubDevice } from '@/api/personnelAuthority/myInformation';
  import { Space, Card, Empty, Image, Popconfirm } from 'ant-design-vue';
  import star from '@/assets/images/personnelAuthority/star.png';
  import { useMessage } from '@/hooks/web/useMessage';
  import { getIp } from '@/utils/simpleTools';
  import { getUserInfo } from '@/api/sys/user';
  import { UUIDDiv, UUIDTypeEnum } from '@/components/UUIDDom';
  import { imgFallback } from '@/utils/domUtils';

  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
  const userStore = useUserStore();
  const userInfo: any = computed(() => {
    return userStore.getUserInfo || {};
  });
  const userAvatar = computed(() => {
    return userStore.getUserAvatar || '';
  });
  const { createMessage } = useMessage();

  const handleNoStarClick = async (item: any) => {
    // 取消关注接口
    // 下面重新请求接口，更新用户关注设备列表
    await DelSubDevice({ PerUUID: userInfo.value.uuid, DevUUID: item.uuid });
    createMessage.success('取消订阅成功');
    const data = await getUserInfo({ account: userInfo.value.account as string });
    userStore.setUserInfo(data);
  };

  onMounted(() => {
    getUserInfo({ account: userInfo.value.account as string }).then((res) => {
      userStore.setUserInfo(res);
    });
  });
</script>

<style scoped lang="less">
  .ConcernedDevice {
    min-height: 160px;

    .item {
      display: flex;
      height: 80px;

      .left {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
      }

      .right {
        display: flex;
        flex: auto;
        justify-content: space-between;
        height: 80px;
        padding: 10px;
        border-bottom: 1px solid #808080c7;

        .content {
          display: flex;
          flex-direction: column;
          height: 100%;

          .title {
            display: flex;
            align-items: center;
            font-size: 16px;
            font-weight: bold;
          }

          .desc {
            display: flex;
            flex: 1;
            flex-direction: row;
            align-items: center;
            color: gray;
          }
        }

        .icon {
          display: flex;
          align-items: center;
          width: 100px;
          height: 100%;
        }
      }
    }

    .empty {
      overflow: hidden;
    }

    .uuid-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 15px;
      margin-left: 5px;
      border-radius: 5px;
    }

    .uuid-bg-type1 {
      background-color: rgb(245 154 35);
    }

    .uuid-bg-type2 {
      background-color: rgb(129 211 248);
    }

    .uuid-bg-type3 {
      background-color: rgb(194 128 255);
    }
  }
</style>
