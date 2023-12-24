<template>
	<div class="custom-select">
		<input v-model="searchTerm" @input="filterOptions" placeholder="搜索选项" />
		<ul v-show="isDropdownVisible">
			<li v-for="(option, index) in filteredOptions" :key="index" @click="selectOption(option)">
				{{ option }}
			</li>
		</ul>
	</div>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted
	} from 'vue';

	const options = ref(['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5']);
	const searchTerm = ref('');
	const isDropdownVisible = ref(false);

	const filteredOptions = computed(() => {
		return options.value.filter(option =>
			option.toLowerCase().includes(searchTerm.value.toLowerCase())
		);
	});

	function filterOptions() {
		isDropdownVisible.value = true;
	}

	function selectOption(option) {
		searchTerm.value = option;
		isDropdownVisible.value = false;
		// 处理选中逻辑，例如将选中的值传递给父组件
		// emit('option-selected', option);
	}

	onMounted(() => {
		// 初始化操作，如果需要的话
	});
</script>

<style scoped lang="scss">
	.custom-select {
		position: relative;
		width: 98%;

		input {
			width: 100%;
			padding: 10px;
			border: 1px solid #ccc;
			border-radius: 5px;
		}

		ul {
			list-style: none;
			padding: 0;
			margin: 0;
			position: absolute;
			width: 100%;
			background-color: white;
			border: 1px solid #ccc;
			border-radius: 5px;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
			z-index: 1;
		}

		li {
			padding: 10px;
			cursor: pointer;
		}

		li:hover {
			background-color: #f5f5f5;
		}
	}
</style>