<!-- 修改密码弹框 -->

<template>
  <BasicModal
    width="600px"
    v-bind="$attrs"
    title="修改密码"
    @ok="handleSubmit"
    @cancel="resetFields"
    :maskClosable="false"
  >
    <div class="py-8 bg-white flex flex-col justify-center items-center">
      <BasicForm @register="register" />
      <!-- <div class="flex justify-center">
        <a-button @click="resetFields"> 重置 </a-button>
        <a-button class="!ml-4" type="primary" @click="handleSubmit"> 确认 </a-button>
      </div> -->
    </div>
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import { UpdatePersonNow } from '@/api/personnelAuthority/myInformation';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useUserStore } from '@/store/modules/user';
  import { router } from '@/router';
  import { PageEnum } from '@/enums/pageEnum';

  import { formSchema } from './ChangePasswordModal.data';

  const userStore = useUserStore();
  const [register, { validate, resetFields }] = useForm({
    size: 'large',
    baseColProps: { span: 24 },
    labelWidth: 100,
    showActionButtonGroup: false,
    schemas: formSchema,
  });
  const { createMessage } = useMessage();

  const handleSubmit = async () => {
    try {
      const values = await validate();
      const { passwordOld, passwordNew } = values;

      // TODO custom api
      console.log(passwordOld, passwordNew);
      // const { router } = useRouter();
      // router.push(pageEnum.BASE_LOGIN);
      const tempObj = {};
      await UpdatePersonNow({
        options: ['Password'],
        UserName: tempObj['userName'] || '',
        IsMale: tempObj['isMale'] || '',
        Password: passwordNew,
        RoleId: tempObj['roleId'] || '',
        RoleName: tempObj['roleName'] || '',
        JobNumber: tempObj['jobNumber'] || '',
        Phone: tempObj['phone'] || '',
        Email: tempObj['email'] || '',
        Introduction: tempObj['introduction'] || '',
        Company: tempObj['company'] || '',
        Department: tempObj['department'] || '',
      });
      userStore.setToken(undefined);
      userStore.setSessionTimeout(false);
      userStore.setUserInfo(null);
      userStore.setUserAvatar('');
      // 直接回登陆页
      router.replace(PageEnum.BASE_LOGIN);

      createMessage.success('密码修改成功！请重新登录');
    } catch (error) {
      console.error(error);
    }
  };

  // export default defineComponent({
  //   components: { BasicModal },
  //   setup() {
  //     return {};
  //   },
  // });
</script>
./ChangePasswordModal.data
