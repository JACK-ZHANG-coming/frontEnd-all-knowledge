<template>
	<view class="container">
		<u-form :model="form" label-width="80px">
			<u-form-item label="原密码">
				<u-input placeholder="请输入原密码" type="password" v-model="form.oldPwd" />
			</u-form-item>
			<u-form-item label="新密码">
				<u-input placeholder="请输入新密码" type="password" v-model="form.newPwd" />
			</u-form-item>
			<u-form-item label="确认密码">
				<u-input placeholder="请输入确认密码" type="password" v-model="form.confirmPwd" />
			</u-form-item>
		</u-form>
		<u-button style="margin-top: 10px;" type="primary" @click="changePassword">确认修改</u-button>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import BaseTool from '../../common/baseTool.js';
	const baseTool = new BaseTool()
	const form = ref({
		oldPwd: '',
		newPwd: '',
		confirmPwd: ''
	})
	const changePassword = () => {
		if (form.value.newPwd != form.value.confirmPwd) {
			baseTool.msg('两次输入的新密码不一致，请重新输入')
			return
		}
		const url = '/WsSessionController/ModifyPassword'
		const param = {
			person: JSON.parse(uni.getStorageSync('USER_INFO') as string).userData,
			oldPassword: form.value.oldPwd,
			newPassword: form.value.newPwd
		}
		baseTool.postData(url, param).then((res) => {
			baseTool.msg('修改密码成功')
			uni.navigateBack()
		})
	}
</script>

<style scoped lang="scss">
	.container {
		background-color: white;
		padding: 0 10px;
	}
</style>