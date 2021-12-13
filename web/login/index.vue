<!--
 * @Author: your name
 * @Date: 2021-03-10 15:22:16
 * @LastEditTime: 2021-03-29 18:23:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \rise\src\views\login\index.vue
-->
<template>
  <div v-if="ssoLogin" class="eidp-login">
    <div>Loading...to redirect...</div>
  </div>
  <div v-else class="login">
    <div class="title">RISE</div>
    <div class="content">
      <el-form :rules="rules">
        <el-form-item :label="$t('LK_YONGHUMING')">
          <el-input
            v-model="userName"
            autocomplete="off"
            :readonly="readonly"
            @focus="stopAutoComplate"
            @keyup.enter.native="login"
          />
        </el-form-item>
        <el-form-item :label="$t('LK_MIMA')">
          <el-input
            v-model="passWord"
            autocomplete="off"
            type="password"
            :readonly="readonly"
            @focus="stopAutoComplate"
            @keyup.enter.native="login"
          />
        </el-form-item>
      </el-form>

      <el-button :loading="loading" class="button" @click="login">
        {{ language('登录') }}
      </el-button>
    </div>
  </div>
</template>
<script>
import { iMessage } from 'rise'
import { login } from './api'
import { encryptPwd, setToken } from './utils'
export default {
  data() {
    return {
      userName: '',
      passWord: '',
      readonly: true,
      loading: false,
      ssoLogin: false
    }
  },
  watch: {
    passWord: function (val) {
      if (val === '') this.stopAutoComplate()
    },
    userName: function (val) {
      if (val === '') this.stopAutoComplate()
    }
  },
  methods: {
    login() {
      if (this.passWord === '' || this.userName === '') {
        return iMessage.error(this.language('抱歉，用户名或密码不能为空！'))
      }
      this.loading = true

      login({
        userName: this.userName,
        passWord: encryptPwd(this.passWord)
      })
        .then(async (res) => {
          if (res && res.result) {
            this.loading = false
            await setToken(res.data.token)
            this.$router
              .replace({
                path: '/index'
              })
              .catch((err) => console.log(err))
          }
        })
        .catch((err) => {
          console.log('login error', err)
          iMessage.error(err.desEn || this.language('登录失败'))
        })
        .finally(() => {
          this.loading = false
        })
    },
    stopAutoComplate() {
      this.readonly = true
      setTimeout(() => (this.readonly = false), 10)
    }
  },
  created() {
    if (this.$route.path.indexOf('superLogin') > -1) {
      //nothing to do
    } else {
      if (process.env.VUE_APP_LOGIN_URL) {
        this.ssoLogin = true
        location.href = process.env.VUE_APP_LOGIN_URL
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.eidp-login {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
}
$colorpage: rgb(67, 152, 217);
.login {
  background-color: rgb(1, 5, 32);
  height: 100%;
  width: 100%;
  border-top: 4px solid $color-blue;
  position: relative;

  .title {
    padding: 40px;
    font-size: 40px;
    font-weight: bold;
    color: white;
  }

  .content {
    @include centerAbsolute;
    //background-color: white;
    width: 500px;
    height: 500px;
  }
}

.el-form {
  ::v-deep .el-form-item__label {
    font-size: 14px;
    color: #e4e7ed;
  }

  ::v-deep .el-input__inner {
    border: none;
    border-bottom: 3px solid #e4e7ed;
    background-color: transparent;
    border-radius: 0px;
    padding-left: 0px;
    font-size: 30px;
    padding-bottom: 20px;
    height: 50px;
    transition: all 0.3s;
    color: #e4e7ed !important;

    &:-internal-autofill-selected {
      box-shadow: 0 0 0px 1000px #010520 inset !important;
      background-color: transparent !important;
      color: $colorpage !important;
    }

    &:-internal-autofill {
      box-shadow: 0 0 0px 1000px #010520 inset !important;
      background-color: transparent !important;
      color: $colorpage !important;
    }

    &:focus {
      border-bottom: 4px solid $colorpage;
      color: $colorpage;
      padding-bottom: 30px;
      height: 60px;
      padding-top: 10px;

      .el-form-item__label {
        color: $colorpage;
      }
    }
  }
}

.button {
  width: 100%;
  margin-top: 100px;
  background-color: $colorpage;
  font-size: #e4e7ed;
  border-radius: 20px;
  border: none;

  ::v-deep span {
    color: white;
  }

  &:hover {
    opacity: 0.7;
  }
}
</style>
