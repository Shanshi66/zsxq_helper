<template>
  <el-card class="account-setting" shadow="never">
    <div class="content-part">
      <div v-if="isLogin === null"></div>
      <div v-else-if="isLogin" class="user-info">
        <el-descriptions :column="2">
          <el-descriptions-item label="手机号">{{ userInfo.phone }}</el-descriptions-item>
          <el-descriptions-item label="Token剩余">{{ token_left }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div v-else class="auth-btn">
        <el-form label-position="left" :inline="true">
          <el-form-item label="手机">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="验证码">
            <el-input v-model="form.passcode"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="operation-part">
      <div v-if="isLogin == true">
        <el-button type="danger" plain @click="logout">注销账号</el-button>
        <el-button type="success" plain @click="refreshTokenLeft">刷新余额</el-button>
      </div>
      <div v-else>
        <el-button type="success" @click="sendCode" plain>发送验证码</el-button>
        <el-button type="success" @click="login" plain>登录</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { getUser, logout } from '../../common/auth'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import { sendSmsCode, loginByPhoneCode } from '../../common/auth'
import { getTokenLeft } from '../../common/auth'

export default {
  data() {
    return {
      isLogin: null,
      userInfo: {},
      token_left: 0,
      form: {
        phone: '',
        passcode: '',
      },
    }
  },

  async beforeMount() {
    const user = await getUser();
    if (user != null) {
      this.userInfo = user
      this.isLogin = true
    }
    else {
      this.isLogin = false
    }
    if (this.isLogin) {
      const resp = await getTokenLeft();
      if (resp.statu) {
        this.token_left = resp.token_left
      }
    }
  },

  methods: {
    changeLoginStatu(isLogin) {
      this.isLogin = isLogin
    },

    changeUserInfo(userInfo) {
      this.userInfo = userInfo
    },

    logout() {
      logout().then(() => {
        this.isLogin = false
      })
    },

    async refreshTokenLeft() {
      const resp = await getTokenLeft();
      if (resp.statu) {
        this.token_left = resp.token_left
        ElMessage.success({
          message: '刷新成功'
        })
      }
      else {
        ElMessage.error({
          message: resp.message
        })
      }
    },

    async sendCode() {
      if (!this.checkPhone()) {
        return
      }
      // not response message
      var resp = await sendSmsCode(this.form.phone)
      if (resp.statu == true) {
        ElMessage.success({
          message: '发送成功'
        })
      }
      else {
        ElMessage.error({
          message: resp.message
        })
      }
    },
    async login() {
      if (this.checkPhone() && this.checkPasscode()) {
        const result = await loginByPhoneCode(this.form.phone, this.form.passcode);
        if (result.statu) {
          this.isLogin = true;
          this.userInfo = result.user
        } else {
          ElMessage.error(result.message)
        }
      }
    },
    checkPhone() {
      if (!this.form.phone) {
        ElMessage.error({
          message: '请输入手机号'
        })
        return false
      }
      return true
    },

    checkPasscode() {
      if (!this.form.passcode) {
        ElMessage.error({
          message: '请输入验证码'
        })
        return false
      }
      return true
    },

    checkUsername() {
      if (!this.form.username) {
        ElMessage.error({
          message: '请输入用户名'
        })
        return false
      }
      return true
    }
  }
}
</script>


<style lang="less" scoped>
.auth-btn {
  padding: 20px 0;
}

.user-info {
  margin: 20px 0;
}
</style>