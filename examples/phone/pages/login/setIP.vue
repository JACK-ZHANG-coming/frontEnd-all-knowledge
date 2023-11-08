<template>
	<view class="container">
		<u-form :model="formData">
			<u-form-item label="IP">
				<u-input placeholder="请输入IP" type="text" v-model="formData.IP" />
			</u-form-item>
		</u-form>
		<u-button style="margin-top: 10px;" type="primary" @click="setIPWithPort">确定</u-button>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue'
	const formData = ref({
		IP: ''
	})
	const setIPWithPort = () => {
		uni.setStorage({
			key: 'MES_IP',
			data: formData.value.IP
		})
		uni.redirectTo({
			url: '/pages/login/login'
		})
	}

	onMounted(() => {
		uni.getStorage({
			key: 'MES_IP',
			success: (res) => {
				formData.value.IP = res.data
			}
		})
	})
</script>

<style scoped lang="scss">
	.container {
		background-color: white;
		padding: 0 10px;
	}
</style>