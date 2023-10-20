<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import SApi from '@/commonTools/baseApi/SApi'
import type Jrjobject from '@/commonTools/baseDataType/Jrjobject'

const username = ref<string>('')
const password = ref<string>('')
const router = useRouter()
// //自适应
// const bodyScale = () => {
//   const deviceWidth = document.documentElement.clientWidth
//   const scale = deviceWidth / 1920
//   ;(document as any).body.style.zoom = scale
// }
// bodyScale()
// window.addEventListener('resize', bodyScale)
// onBeforeUnmount(() => {
//   window.removeEventListener('resize', bodyScale)
// })
//根据登录状态判断显示
const currentUser = ref('南京简睿捷软件开发有限公司')
const tableData = [
  { companyName: '南京简睿捷软件开发有限公司' },
  { companyName: '南京巴拉巴拉股份有限公司' },
  { companyName: '南京巴拉巴拉股份有限公司' },
  { companyName: '南京巴拉巴拉股份有限公司' }
]

function onSubmit() {
  let baseUrl = new SApi().baseUrl
  console.log('【baseUrl】', baseUrl)
  let url = 'http://192.168.1.12:5189/WsSessionController/Login'
  let param = {
    userName: 'admin',
    property: 'name',
    password: '',
    factory: '标准工厂',
    appName: 'MES',
    host: '',
    licenseCode: ''
  }
  new SApi().PostData(url, param).then((res) => {
    console.log('【res】', res)
  })
  // router.push('/index')
}
</script>

<template>
  <!-- <img src="../assets/picture/common/stdloginbackground.jpg" alt="888" width="200" height="200" /> -->
  <div class="background_img" id="page_login">
    <div class="form">
      <div class="title_name">
        <el-dropdown trigger="click" style="white-space: nowrap">
          <span class="el-dropdown-link">
            {{ currentUser }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, index) in tableData"
                :key="item.companyName"
                @click="currentUser = item.companyName"
                style="font-size: 25px; letter-spacing: 2px; padding: 15px 30px"
                :divided="index !== 0"
              >
                {{ item.companyName }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <form>
        <el-input v-model="username" placeholder="请输入用户名" prefix-icon="User" />
        <el-input
          v-model="password"
          type="password"
          placeholder="请输入密码"
          show-password
          prefix-icon="Lock"
          id="el_input__password"
        />
        <div class="link_button">
          <el-link type="info">访问官网</el-link><el-link type="info">忘记密码?</el-link>
        </div>
        <el-button type="primary" @click="onSubmit">登 录</el-button>
        <div class="link_button_toRegister">
          <el-link type="primary">没有账号，去注册</el-link>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.background_img {
  width: 100%;
  height: 100%;
  font-size: $font-size-big;
  background: url('../assets/picture/common/loginBackgroundImg.jpg') 0 0 / 100% 100% no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .form {
    position: absolute;
    top: 37%;
    left: 54%;
    width: 27%;
    .title_name {
      width: 90%;
      height: 7%;
      margin-bottom: 2%;
      letter-spacing: 2px;
      color: $color-info;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .el-dropdown-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        font-size: $font-size-big;
      }
    }

    .el-input {
      width: 100%;
      margin-top: 5%;
      font-size: $font-size-big;
    }

    .link_button {
      margin-top: 47px;
      display: flex;
      justify-content: space-between;

      .el-link {
        font-size: $font-size-big;
      }
    }

    .el-button {
      width: 100%;
      height: 64px;
      margin-top: 20px;
      font-size: $font-size-big;
      letter-spacing: 19px;
    }

    .link_button_toRegister {
      width: 100%;
      margin-top: 20px;
      display: flex;
      justify-content: end;

      .el-link {
        font-size: $font-size-big;
      }
    }
  }
}
</style>
<style lang="scss">
#page_login {
  /* 登录页面密码输入样式 */
  .el-input__password {
    font-size: $font-size-big !important;
  }
  .el-input__inner {
    padding: 6.5%;
    padding-left: 0;
  }
  /* 登录页面列表样式 */
  #el_table_large .cell {
    padding: 7px 16px !important;
    padding-left: 72px !important;
    font-size: $font-size-big;
    color: $color-info;
  }
}
.el-dropdown-menu__item--divided {
  padding: 0 !important;
}
</style>
