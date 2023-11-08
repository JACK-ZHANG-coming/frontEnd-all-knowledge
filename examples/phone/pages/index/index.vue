<template>
	<view class="moduleContainer">
		<view class="option" v-for="(item, index) in lstModule" :key="index" @click="goPage(item)">
			<view class="icon">
				<image class="image" :src="`../../static/${item.innerName}.png`" :alt="item.displayName" />
			</view>
			<view class="text">{{item.displayName}}</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	interface moduleType {
		displayName : string,
		innerName : string,
		pageUrl : string
	}
	const lstModule = ref<moduleType[]>([
		{
			displayName: '工人操作台',
			innerName: 'factoryStation',
			pageUrl: 'factoryStation/factoryStation'
		},
		{
			displayName: '开工',
			innerName: 'startTask',
			pageUrl: 'factoryStation/startTask'
		},
		{
			displayName: '报工',
			innerName: 'commitTask',
			pageUrl: 'factoryStation/commitTask'
		},
		{
			displayName: '个人中心',
			innerName: 'usercenter',
			pageUrl: 'usercenter/usercenter'
		}
	])
	const goPage = (item : moduleType) => {
		const pageUrl = item.pageUrl
		uni.navigateTo({
			url: `/pages/${pageUrl}`
		})
	}
</script>

<style lang="scss">
	.moduleContainer {
		// height: 100vh;
		// background-color: white;

		.option {
			// border: 1px solid red;
			width: 33.33%;
			height: 75px;
			display: inline-block;
			margin-top: 15px;
			text-decoration: none;

			.icon {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 2.5rem;
				margin-top: 5px;

				.image {
					width: 50px;
					height: 50px;
				}
			}

			.text {
				font-size: 13px;
				text-align: center;
				margin-top: 10px;
				color: #666;
			}
		}
	}
</style>