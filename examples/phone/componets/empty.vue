<template>
	<view class="emptyContainer">
		<u-empty :text="text" :mode="mode" :show="show"></u-empty>
	</view>
</template>

<script setup lang="ts">
	interface Props {
		text ?: string
		mode ?: string
		show ?: boolean
	}
	const props = withDefaults(defineProps<Props>(), {
		text: '数据为空',
		mode: 'data',
		show: true
	})
</script>

<style lang="scss">
	.emptyContainer {
		margin-top: 30vh;
	}
</style>