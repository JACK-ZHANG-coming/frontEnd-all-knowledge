<template>
	<u-subsection :list="list" :current="current" activeColor='#3c9cff' inactiveColor="#303133"
		@change="sectionChange"></u-subsection>
	<start-task v-if="current===0"></start-task>
	<commit-task v-else></commit-task>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import startTask from './startTask.vue'
	import commitTask from './commitTask.vue'
	const list = ref<string[]>(['开工工单', '报工工单'])
	const current = ref<number>(0)
	const sectionChange = (key : number) => {
		current.value = key
	}
</script>

<style scoped lang="scss">

</style>