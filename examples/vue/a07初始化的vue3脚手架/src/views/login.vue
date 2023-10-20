<script setup lang="ts" name="login">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import SApi from '@/commonTools/baseApi/SApi'

const loading = ref<boolean>(false)
const router = useRouter()
const loginInfo = ref<any>({
  userName: 'admin',
  password: '',
  factoryValue: undefined,
  workCenterValue: undefined
})

const loginButtonText = ref('登\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0录')

const onSubmit = () => {
  if (loginInfo.value.factoryValue === undefined) {
    ElMessage({
      message: '请选择工厂',
      type: 'warning'
    })
    return
  } else if (loginInfo.value.workCenterValue === undefined) {
    ElMessage({
      message: '请选择工作中心',
      type: 'warning'
    })
    return
  }
  loading.value = true
  const url = '/WsSessionController/Login'
  const param = {
    userName: loginInfo.value.userName,
    property: 'name',
    password: loginInfo.value.password,
    factory: loginInfo.value.factoryValue,
    appName: 'MES',
    host: '',
    licenseCode: ''
  }
  new SApi()
    .PostData(url, param)
    .then((res: any) => {
      if (res) {
        res.factoryData = factoryList.value.filter(
          (item: any) => item.id === loginInfo.value.factoryValue
        )[0]
        res.workCenterData = workCenterList.value.filter(
          (item: any) => item.id === loginInfo.value.workCenterValue
        )[0]
        sessionStorage.setItem('USER_INFO', JSON.stringify(res))
        router.push({ name: 'index' })
        ElMessage({
          message: '登录成功',
          type: 'success'
        })
        loginButtonText.value = '正在跳转 . . .'
      } else {
        loading.value = false
      }
    })
    .catch(() => {
      loading.value = false
    })
}

//获取工厂与工作中心列表
const factoryList = ref<any>([])
new SApi().PostData('/WsSessionController/GetFactoryWithoutToken', {}).then((res) => {
  factoryList.value = res
})
const workCenterList = ref<any>([])
new SApi().PostData('/WsSessionController/GetWorkCenterWithoutToken', {}).then((res) => {
  workCenterList.value = res
})
</script>
<template>
  <div class="background_img login_page">
    <div class="login_box">
      <div class="img_box">
        <img src="@/assets/picture/common/loginImg.png" />
      </div>
      <div class="login_input_box">
        <img src="@/assets/picture/common/logo2.png" />
        <el-form>
          <div class="el_form_item">
            <el-input
              v-model="loginInfo.userName"
              placeholder="请输入用户名"
              prefix-icon="User"
              clearable
            />
          </div>
          <div class="el_form_item">
            <el-input
              v-model="loginInfo.password"
              placeholder="请输入密码"
              prefix-icon="Lock"
              type="password"
              clearable
              show-password
            />
          </div>
          <div class="el_form_item">
            <p class="el_form_item_title"><span>工</span><span>厂</span></p>
            <el-select v-model="loginInfo.factoryValue" placeholder="请选择">
              <template #prefix>
                <el-icon><OfficeBuilding /></el-icon>
              </template>
              <el-option
                v-for="item in factoryList"
                :key="item.id"
                :label="item.properties.NAME"
                :value="item.properties.NAME"
              />
            </el-select>
          </div>
          <div class="el_form_item">
            <p class="el_form_item_title">
              <span>工</span><span>作</span><span>中</span><span>心</span>
            </p>
            <el-select v-model="loginInfo.workCenterValue" filterable placeholder="请选择">
              <template #prefix>
                <el-icon><Printer /></el-icon>
              </template>
              <el-option
                v-for="item in workCenterList"
                :key="item.id"
                :label="item.properties.WCNo"
                :value="item.id"
              />
            </el-select>
          </div>
          <div class="el_form_item">
            <el-button ref="loginButton" type="primary" @click="onSubmit" :loading="loading">
              {{ loginButtonText }}
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.background_img {
  height: calc(100% + $header-bar-height);
  background: #e2f5ff url('@/assets/picture/common/loginBackgroundPic.png') 0 0 /68.5% auto no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_box {
    width: 60%;
    height: 69%;
    background: url('@/assets/picture/common/loginBox.png') 50% 50% /100% 100% no-repeat;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .img_box {
      width: 40%;
      img {
        width: 100%;
      }
    }
    .login_input_box {
      width: 40%;
      height: 85%;
      padding-top: 3%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      img {
        width: 40%;
      }
      form {
        width: 90%;
        height: 75%;
        display: flex;
        flex-direction: column;
        align-items: center;
        > div {
          margin-bottom: 7%;
          > span {
            margin-bottom: 5%;
          }
        }
      }
      .el_form_item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 12%;
        .el-input {
          height: 100%;
        }
        .el-button {
          width: 100%;
          height: 100%;
          margin-top: 2%;
          font-size: 19px;
        }
        .el_form_item_title {
          margin-right: 4%;
          flex: 1;
          display: flex;
          justify-content: space-between;
          font-size: 19px;
          color: $color-info;
        }
        .el-select {
          width: 75%;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.login_page {
  span,
  input {
    font-size: 19px;
  }
  .el-select {
    height: 100%;
    .select-trigger {
      height: 100%;
      .el-input {
        height: 100%;
      }
    }
  }
}
</style>
