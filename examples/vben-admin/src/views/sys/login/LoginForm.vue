<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <FormItem name="Account" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.Account"
        :placeholder="t('sys.login.userName')"
        class="fix-auto-fill"
      />
    </FormItem>
    <FormItem name="Password" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.Password"
        :placeholder="t('sys.login.password')"
      />
    </FormItem>
    <ARow class="enter-x">
      <ACol :span="16">
        <FormItem>
          <!-- No logic, you need to deal with it yourself -->
          <Checkbox v-model:checked="isAgreed" size="small">
            {{ t('sys.login.statement_before')
            }}<span class="clickText" @click="openModal()">{{
              t('sys.login.statement_after')
            }}</span>
          </Checkbox>
        </FormItem>
      </ACol>
      <ACol :span="8">
        <FormItem :style="{ 'text-align': 'right' }">
          <!-- No logic, you need to deal with it yourself -->
          <Checkbox v-model:checked="isRememberPsd" size="small">
            {{ t('sys.login.password_remember') }}
          </Checkbox>
        </FormItem>
        <!-- <FormItem :style="{ 'text-align': 'right' }">
         
          <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
            {{ t('sys.login.forgetPassword') }}
          </Button>
        </FormItem> -->
      </ACol>
    </ARow>

    <FormItem class="enter-x">
      <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
        {{ t('sys.login.loginButton') }}
      </Button>
    </FormItem>
  </Form>
  <StatementModal @register="registerModal" />
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed } from 'vue';

  import { Checkbox, Form, Input, Row, Col, Button, Divider } from 'ant-design-vue';
  import LoginFormTitle from './LoginFormTitle.vue';

  import { useI18n } from '@/hooks/web/useI18n';
  import { useMessage } from '@/hooks/web/useMessage';

  import { useUserStore } from '@/store/modules/user';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';
  import { useDesign } from '@/hooks/web/useDesign';
  import StatementModal from './StatementModal.vue';
  import { useModal } from '@/components/Modal';

  import { Base64 } from 'js-base64'; //引入base64加密，用于记住密码

  const [registerModal, { openModal }] = useModal();
  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { notification, createErrorModal } = useMessage();
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();

  const { setLoginState, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);
  const isRememberPsd = ref(true);
  const isAgreed = ref(true);
  const formData = reactive<any>({
    Account: '',
    Password: '',
    // Account: 'admin',
    // Password: 'admin',
  });
  const hasUserCodeOrPassword = () => {
    if (localStorage.getItem('userAccount') && localStorage.getItem('userPassword')) {
      formData.Account = localStorage.getItem('userAccount');
      formData.Password = Base64.decode(localStorage.getItem('userPassword')); //解密
      // loginForm.checked.push(true)
    }
  };
  hasUserCodeOrPassword(); //调用函数

  const { validForm } = useFormValid(formRef);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  async function handleLogin() {
    const data = await validForm();
    console.log(data, 'Account');
    if (!data) return;
    if (!isAgreed.value) {
      notification.warning({
        message: t('sys.app.logoutTip'),
        description: t('sys.login.statement_tip'),
        duration: 3,
      });
      return;
    }
    try {
      loading.value = true;
      const userInfo = await userStore.login({
        Password: data.Password,
        Account: data.Account,
        mode: 'none', //不要默认的错误提示
      });
      if (userInfo) {
        if (isRememberPsd.value) {
          localStorage.setItem('userAccount', data.Account);
          localStorage.setItem(
            'userPassword',
            Base64.encode(data.Password), //base加密
          );
          // console.log(data.Password)
        }
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo?.account}`,
          duration: 3,
        });
      }
    } catch (error) {
      createErrorModal({
        title: t('sys.api.errorTip'),
        content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      });
    } finally {
      loading.value = false;
    }
  }
</script>
<style scoped lang="less">
  .clickText {
    color: #0960bd;
    cursor: pointer;
  }

  .clickText:hover {
    color: #69b1ff;
  }
</style>
