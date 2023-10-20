<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SApi from '@/commonTools/baseApi/SApi'
import { useSystemPersonList } from '@/stores/modules/systemPersonList'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()

const userName = ref<string | undefined>()
const { systemPersonList } = storeToRefs(useSystemPersonList())
const url = '/WsObjLevelController/QueryObjects'
new SApi().PostInfoData(url, { type: 'sysperson' }).then((res: any) => {
  for (let i = 0; i < res.length; i++) {
    if (JSON.parse(sessionStorage.getItem('USER_INFO') as string).userId == res[i].id) {
      userName.value = res[i].properties.NAME
      const userData = JSON.parse(sessionStorage.getItem('USER_INFO') as string)
      userData.wcId = userData.workCenterData.id.toString()
      userData.userData = res[i]
      sessionStorage.setItem('USER_INFO', JSON.stringify(userData))
    }
    systemPersonList.value[i] = res[i].properties
    systemPersonList.value[i].id = res[i].id
    systemPersonList.value[i].type = res[i].type
  }
})

const switchUserCenter = () => {
  router.push('/userCenter')
}

const logout = () => {
  router.push('/login')
}

const backIndex = () => {
  router.push('/index')
}
</script>

<template>
  <div class="header_bar space_between">
    <!-- 公司logo -->
    <div>
      <img src="../assets/picture/common/logoImg.png" class="page_logo" @click="backIndex" />
      <span class="page-title">
        {{ route.meta.title }}
      </span>
    </div>
    <div>
      <el-dropdown>
        <el-button type="" text bg icon="UserFilled">
          {{ userName || '未登录' }}
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="switchUserCenter">
              <el-icon><User /></el-icon>个人中心
            </el-dropdown-item>
            <el-dropdown-item @click="logout">
              <el-icon><SwitchButton /></el-icon>退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button style="margin-left: 15px" type="" text bg icon="HomeFilled" @click="backIndex"
        >首页</el-button
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
.header_bar {
  width: 100%;
  height: $header-bar-height;
  padding-left: 23px;
  padding-right: 40px;
  box-sizing: border-box;
  background-color: $color-box-background;
  align-items: center;
  .page_logo {
    height: 56px;
    margin-top: 2px;
    float: left;
  }

  .page-title {
    font-size: 20px;
    line-height: 60px;
    margin-left: 10px;
    font-weight: bold;
    float: left;
  }
  .el-button {
    padding: 8px !important;
    font-size: 20px;
    font-weight: 700;
  }
}
</style>
