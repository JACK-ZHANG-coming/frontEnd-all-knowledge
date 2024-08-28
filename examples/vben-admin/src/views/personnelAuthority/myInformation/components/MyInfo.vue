<template>
  <Card :title="'我的信息'">
    <div class="MyInfo">
      <Row :gutter="24">
        <Col :span="6" :style="{ textAlign: 'center', padding: '10px 0' }">
          <CropperAvatar
            :uploadApi="uploadAvatar as any"
            :value="userAvatar"
            btnText="更换头像"
            :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
            @change="updateAvatar"
            width="150"
            :size="1"
          />
        </Col>
        <Col :span="18">
          <BasicForm ref="formElRef" @register="register" />
          <Row>
            <Col :span="12" style="text-align: left">
              <a-button type="primary" @click="openEditPasswordModal"> 修改密码 </a-button>
            </Col>
            <Col :span="6" />
            <Col :span="6" style="text-align: right">
              <a-button v-if="!isEdit" type="primary" @click="convertEditStatus">
                编辑基本信息
              </a-button>
              <Space v-else>
                <a-button type="primary" @click="resetForm"> 取消 </a-button>
                <a-button type="primary" @click="handleSubmit"> 保存 </a-button>
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  </Card>
  <ChangePasswordModal @register="registerModal" />
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store/modules/user';
  import { computed, h, onMounted, ref } from 'vue';
  import { Card, Row, Col, Space, Input, Select, Textarea, Avatar } from 'ant-design-vue';
  import { useModal } from '@/components/Modal';
  import ChangePasswordModal from './ChangePasswordModal.vue';
  import { BasicForm, useForm, FormSchema } from '@/components/Form';
  import { getUserInfo, uploadAvatar, getUserAvatar } from '@/api/sys/user';
  import { UpdatePersonNow } from '@/api/personnelAuthority/myInformation';
  import { useMessage } from '@/hooks/web/useMessage';
  import { CropperAvatar } from '@/components/Cropper';
  import { compareObjects } from '@/utils/simpleTools';

  const { createMessage } = useMessage();
  const userStore = useUserStore();
  const isEdit = ref(false);
  const userInfo = computed(() => {
    return userStore.getUserInfo || {};
  });
  const userAvatar = computed(() => {
    return userStore.getUserAvatar || '';
  });

  const baseSetschemas: FormSchema[] | any = ref([
    {
      field: 'account',
      component: 'Input',
      label: '账号',
      colProps: { span: 12 },
      dynamicDisabled: true,
      render: ({ model, field }) => {
        if (isEdit.value) {
          return h(Input, {
            placeholder: '请输入',
            allowClear: true,
            disabled: true,
            value: model[field],
            onChange: (e: any) => {
              model[field] = e.target.value;
            },
          });
        } else {
          return h('span', { style: { color: 'gray' } }, model[field]);
        }
      },
    },
    {
      field: 'userName',
      component: 'Input',
      label: '用户名',
      colProps: { span: 12 },
      rules: [{ required: true }],
      dynamicDisabled: computed(() => !isEdit.value),
      render: ({ model, field }) => {
        if (isEdit.value) {
          return h(Input, {
            placeholder: '请输入',
            allowClear: true,
            value: model[field],
            onChange: (e: any) => {
              model[field] = e.target.value;
            },
          });
        } else {
          return h('span', { style: { color: 'gray' } }, model[field]);
        }
      },
    },
    {
      field: 'uuid',
      component: 'Input',
      label: '账号ID',
      colProps: { span: 12 },
      dynamicDisabled: true,
      render: ({ model, field }) => {
        if (isEdit.value) {
          return h(Input, {
            placeholder: '请输入',
            allowClear: true,
            disabled: true,
            value: model[field],
            onChange: (e: any) => {
              model[field] = e.target.value;
            },
          });
        } else {
          return h('span', { style: { color: 'gray' } }, model[field]);
        }
      },
    },
    {
      field: 'phone',
      component: 'Input',
      label: '手机号',
      colProps: { span: 12 },
      dynamicDisabled: computed(() => !isEdit.value),
      render: ({ model, field }) => {
        if (isEdit.value) {
          return h(Input, {
            placeholder: '请输入',
            allowClear: true,
            value: model[field],
            onChange: (e: any) => {
              model[field] = e.target.value;
            },
          });
        } else {
          return h('span', { style: { color: 'gray' } }, model[field]);
        }
      },
    },
    {
      field: 'createTime',
      component: 'Input',
      label: '注册时间',
      colProps: { span: 12 },
      dynamicDisabled: true,
      render: ({ model, field }) => {
        if (isEdit.value) {
          return h(Input, {
            placeholder: '请输入',
            allowClear: true,
            disabled: true,
            value: model[field],
            onChange: (e: any) => {
              model[field] = e.target.value;
            },
          });
        } else {
          return h('span', { style: { color: 'gray' } }, model[field]);
        }
      },
    },
    {
      field: 'email',
      component: 'Input',
      label: '邮箱',
      colProps: { span: 12 },
      dynamicDisabled: computed(() => !isEdit.value),
      render: ({ model, field }) => {
        if (isEdit.value) {
          return h(Input, {
            placeholder: '请输入',
            allowClear: true,
            value: model[field],
            onChange: (e: any) => {
              model[field] = e.target.value;
            },
          });
        } else {
          return h('span', { style: { color: 'gray' } }, model[field]);
        }
      },
    },
    {
      field: 'company',
      component: 'Input',
      label: '所属公司',
      colProps: { span: 12 },
      dynamicDisabled: true,
      render: ({ model, field }) => {
        if (isEdit.value) {
          return h(Input, {
            placeholder: '请输入',
            allowClear: true,
            disabled: true,
            value: model[field],
            onChange: (e: any) => {
              model[field] = e.target.value;
            },
          });
        } else {
          return h('span', { style: { color: 'gray' } }, model[field]);
        }
      },
    },
    {
      field: 'department',
      component: 'Input',
      label: '所属部门',
      colProps: { span: 12 },
      dynamicDisabled: true,
      render: ({ model, field }) => {
        if (isEdit.value) {
          return h(Input, {
            placeholder: '请输入',
            allowClear: true,
            disabled: true,
            value: model[field],
            onChange: (e: any) => {
              model[field] = e.target.value;
            },
          });
        } else {
          return h('span', { style: { color: 'gray' } }, model[field]);
        }
      },
    },
    {
      field: 'roleName',
      component: 'Input',
      label: '角色',
      colProps: { span: 12 },
      dynamicDisabled: true,
      render: ({ model, field }) => {
        if (isEdit.value) {
          return h(Input, {
            placeholder: '请输入',
            allowClear: true,
            disabled: true,
            value: model[field],
            onChange: (e: any) => {
              model[field] = e.target.value;
            },
          });
        } else {
          return h('span', { style: { color: 'gray' } }, model[field]);
        }
      },
    },
    {
      field: 'isMale',
      component: 'Select', // 这里需要写条件
      label: '性别',
      colProps: { span: 12 },
      dynamicDisabled: computed(() => !isEdit.value),
      componentProps: {
        options: [
          {
            label: '男',
            value: true,
            key: true,
          },
          {
            label: '女',
            value: false,
            key: false,
          },
        ],
      },
      render: ({ model, field }) => {
        if (isEdit.value) {
          return h(Select, {
            options: [
              {
                label: '男',
                value: true as any,
                key: true,
              },
              {
                label: '女',
                value: false as any,
                key: false,
              },
            ],
            value: model[field],
            onChange: (e: any) => {
              console.log('e', e);
              model[field] = e;
            },
          });
        } else {
          return h('span', { style: { color: 'gray' } }, model[field] === true ? '男' : '女');
        }
      },
    },
    {
      field: 'introduction',
      component: 'InputTextArea',
      label: '个人简介',
      colProps: { span: 24 },
      dynamicDisabled: computed(() => !isEdit.value),
      render: ({ model, field }) => {
        if (isEdit.value) {
          return h(Textarea, {
            placeholder: '请输入',
            allowClear: true,
            value: model[field],
            onChange: (e: any) => {
              model[field] = e.target.value;
            },
          });
        } else {
          return h('span', { style: { color: 'gray' } }, model[field]);
        }
      },
    },
  ]);
  const [registerModal, { openModal: openPasswordModal }] = useModal();
  const formElRef = ref();
  const [register, { setFieldsValue }] = useForm({
    labelAlign: 'left',
    labelWidth: 80,
    schemas: computed(() => baseSetschemas.value),
    showActionButtonGroup: false,
    rowProps: { gutter: [40, 5] },
  });
  const handleSubmit = async () => {
    let tempObj = formElRef.value.getFieldsValue();
    await UpdatePersonNow({
      options: compareObjects(tempObj, userInfo.value),
      UserName: tempObj['userName'] || '',
      IsMale: tempObj['isMale'] || '',
      Password: tempObj['password'] || '',
      RoleId: tempObj['roleId'] || '',
      RoleName: tempObj['roleName'] || '',
      JobNumber: tempObj['jobNumber'] || '',
      Phone: tempObj['phone'] || '',
      Email: tempObj['email'] || '',
      Introduction: tempObj['introduction'] || '',
      Company: tempObj['company'] || '',
      Department: tempObj['department'] || '',
    });
    createMessage.success('更新成功！');
    const data = await getUserInfo({ account: userInfo.value.account as string });
    setFieldsValue(data);
    userStore.setUserInfo(data);
    convertEditStatus();
  };

  const resetForm = async () => {
    setFieldsValue(userInfo.value);
    convertEditStatus();
  };

  const convertEditStatus = () => {
    isEdit.value = !isEdit.value;
  };

  const openEditPasswordModal = () => {
    // console.log('openEditPasswordModal');
    openPasswordModal();
  };

  const updateAvatar = async () => {
    const userAvatar = await getUserAvatar();
    const base64 = btoa(
      new Uint8Array(userAvatar.data).reduce((data, byte) => data + String.fromCharCode(byte), ''),
    );
    const imageSrc = `data:${userAvatar.headers['content-type'].toLowerCase()};base64,${base64}`;
    userStore.setUserAvatar(imageSrc);
  };

  onMounted(async () => {
    const data = await getUserInfo({ account: userInfo.value.account as string });
    setFieldsValue(data);
  });
</script>

<style scoped lang="less">
  .MyInfo {
    height: 420px;
  }

  .form-span-item {
    display: inline-block;
    color: rgb(148 233 248);
  }
</style>
