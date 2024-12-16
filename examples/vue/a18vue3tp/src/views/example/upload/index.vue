<!-- 工作台 -->
<template>
  <BaseContainer class="p-4">
    <PageWrapper title="上传组件示例">
      <Alert message="基础示例" />
      <BasicUpload
        :maxSize="20"
        :maxNumber="10"
        @change="handleChange"
        :api="uploadApi"
        class="my-5"
      />
    </PageWrapper>
  </BaseContainer>
</template>
<script lang="ts" setup>
  import BaseContainer from '@/components/BaseContainer.vue';

  import { BasicUpload } from '@/components/Upload';
  import { useMessage } from '@/hooks/web/useMessage';
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import { PageWrapper } from '@/components/Page';
  import { Alert } from 'ant-design-vue';
  import { uploadApi } from '@/api/sys/upload';

  const { createMessage } = useMessage();

  const handleChange = (list: string[]) => {
    if (list.length <= 0) {
      return;
    }
    createMessage.info(`已上传文件${JSON.stringify(list)}`);
  };
</script>
<style lang="less" scoped>
  .content {
    display: flex;
    margin-top: 12px;

    &-left {
      flex: 1;
      margin-right: 16px;
      overflow: hidden;
    }

    &-right {
      width: 332px;
    }
  }
</style>
