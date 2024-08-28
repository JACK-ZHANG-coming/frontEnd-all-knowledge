<template>
  <div class="w-100% h-30px pl-2 flex border-b-2px border-b-#E9E9E9 items-center">
    <div class="w-1 h-14px bg-blue rd-1px"></div>
    <div class="ml-1 font-600 text-15px">{{ title }}</div>
  </div>
</template>
<script lang="ts" setup>
  const props = defineProps({
    title: {
      type: String,
    },
  });
</script>
<style lang="less" scoped></style>
