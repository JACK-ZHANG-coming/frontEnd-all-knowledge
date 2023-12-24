<script setup lang="ts" name="changePwd">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import SApi from '@/commonTools/baseApi/SApi'

const form = reactive({
  oldPwd: '',
  newPwd: '',
  confirmPwd: ''
})

const reSet = () => {
  form.oldPwd = ''
  form.newPwd = ''
  form.confirmPwd = ''
}

const onSubmit = () => {
  let oldPwd = form.oldPwd,
    newPwd = form.newPwd,
    confirmPwd = form.confirmPwd
  if (newPwd != confirmPwd) {
    ElMessage({
      message: '两次输入的新密码不一致，请重新输入',
      type: 'warning'
    })
    return
  }
  const url = '/WsSessionController/ModifyPassword'
  const param = {
    person: {
      type: 'sysperson',
      id: JSON.parse(sessionStorage.getItem('USER_INFO') as string).userId,
      properties: {}
    },
    oldPassword: oldPwd,
    newPassword: newPwd
  }
  new SApi().PostInfoData(url, param).then((res) => {
    ElMessage({
      message: '修改密码成功',
      type: 'success'
    })
    reSet()
  })
}
</script>
<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="旧密码">
      <el-input
        v-model="form.oldPwd"
        type="password"
        placeholder="请输入旧密码"
        clearable
        show-password
      />
    </el-form-item>
    <el-form-item label="新密码">
      <el-input
        v-model="form.newPwd"
        type="password"
        placeholder="请输入新密码"
        clearable
        show-password
      />
    </el-form-item>
    <el-form-item label="确认新密码">
      <el-input
        v-model="form.confirmPwd"
        type="password"
        placeholder="请输入新密码"
        clearable
        show-password
      />
    </el-form-item>
    <el-form-item>
      <el-button @click="reSet">重置</el-button>
      <el-button type="primary" @click="onSubmit">确认修改</el-button>
    </el-form-item>
  </el-form>
</template>
