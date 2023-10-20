<script setup lang="ts" name="index">
import { ref, computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import _ from 'lodash'

const router = useRouter()
</script>

<template>
  <div class="background_color" id="page_index">
    首页11
  </div>
</template>
<style scoped lang="scss">
$top-tabs-height: 130px;
.background_color {
  width: 100%;
  height: calc(100% - $footer-bar-height);
  position: relative;
  background-color: $color-box-background;
}
</style>