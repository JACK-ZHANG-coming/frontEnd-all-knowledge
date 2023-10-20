<script setup lang="ts" name="userCenter">
import { ref } from 'vue'
import changePwd from './components/changePwd.vue'

const menuIndex = ref<number>(1)
</script>
<template>
  <Container>
    <template #Aside>
      <el-menu default-active="1" class="el-menu-vertical-demo">
        <el-menu-item index="1">
          <el-icon><setting /></el-icon>
          <span>修改密码</span>
        </el-menu-item>
      </el-menu>
    </template>
    <template #Main>
      <changePwd v-if="menuIndex === 1"></changePwd>
    </template>
  </Container>
</template>
