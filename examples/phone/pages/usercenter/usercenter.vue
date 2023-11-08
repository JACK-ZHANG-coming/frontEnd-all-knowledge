<template>
	<view class="avatarContainer">
		<view class="avatar">
			<u-avatar size="large" src="../../static/usercenter.png"></u-avatar>
		</view>
		<view class="username">{{userName}}</view>
	</view>
	<u-cell-group>
		<u-cell-item icon="info-circle" title="关于我们" @click="goPage('aboutUs')"></u-cell-item>
		<u-cell-item icon="lock" title="修改密码" @click="goPage('changePwd')"></u-cell-item>
		<u-cell-item icon="list-dot" title="退出登录" @click="logOut"></u-cell-item>
	</u-cell-group>
	<u-modal v-model="show" content="确认退出登录？" :showCancelButton="true" @cancel="cancleLogOut"
		@confirm="confirmLogOut"></u-modal>
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue'
	import Jrjobject from '../../common/Jrjobject';
	const show = ref(false)
	const userName = ref('')
	onMounted(() => {
		uni.getStorage({
			key: 'USER_INFO',
			success: (res) => {
				userName.value = new Jrjobject(JSON.parse(res.data).userData).GetPropVal('name')
			}
		})
	})
	const goPage = (innerName : string) => {
		uni.navigateTo({
			url: `/pages/usercenter/${innerName}`
		})
	}
	const logOut = () => {
		show.value = true
	}
	const cancleLogOut = () => {
		show.value = false
	}
	const confirmLogOut = () => {
		show.value = false
		uni.removeStorageSync('USER_INFO')
		uni.reLaunch({
			url: '/pages/login/login'
		})
	}
</script>

<style lang="scss">
	.avatarContainer {
		text-align: center;
		padding: 30px 0;

		.username {
			font-size: 16px;
		}
	}
</style>