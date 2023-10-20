<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps(['topHeader', 'header'])

const scrollbarAside = ref()
const scrollbarMain = ref()
defineExpose({ scrollbarAside, scrollbarMain })
</script>
<template>
  <el-container v-if="props.topHeader" class="el_container components_container">
    <el-header v-if="props.header" class="el_header">
      <slot name="Header"></slot>
    </el-header>
    <el-container>
      <slot name="Top"></slot>
      <el-aside class="el_aside" style="margin-left: 12px">
        <el-scrollbar height="100%" ref="scrollbarAside">
          <slot name="Aside"></slot>
        </el-scrollbar>
      </el-aside>
      <el-main class="el_main">
        <el-scrollbar height="100%" ref="scrollbarMain">
          <div class="box_padding">
            <slot name="Main"></slot>
          </div>
        </el-scrollbar>
      </el-main>
      <slot name="Bottom"></slot>
    </el-container>
  </el-container>
  <el-container v-else class="el_container components_container">
    <el-aside class="el_aside">
      <el-scrollbar height="100%" ref="scrollbarAside">
        <slot name="Aside"></slot>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <slot name="Top"></slot>
      <el-header v-if="props.header" class="el_header">
        <slot name="Header"></slot>
      </el-header>
      <el-main class="el_main">
        <el-scrollbar height="100%" ref="scrollbarMain">
          <div class="box_padding">
            <slot name="Main"> </slot>
          </div>
        </el-scrollbar>
      </el-main>
      <slot name="Bottom"></slot>
    </el-container>
  </el-container>
</template>
<style scoped lang="scss">
.el_container {
  height: 100%;
  .el_aside {
    width: auto;
    margin-top: 12px;
    box-shadow: 0px 5px 8px 5px rgba(#000000, 0.05);
    background-color: $color-box-background;
  }
  .el_header {
    margin: 12px;
    margin-bottom: 0;
    height: auto;
    box-shadow: 0px 5px 8px 5px rgba(#000000, 0.05);
    background-color: $color-box-background;
  }
  .el_main {
    padding: 0;
    margin: 12px;
    margin-bottom: 0;
    box-shadow: 0px 5px 8px 5px rgba(#000000, 0.05);
    background-color: $color-box-background;
  }
}
</style>
