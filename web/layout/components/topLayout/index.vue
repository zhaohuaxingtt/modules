<!--
 * @Author: yuszhou
 * @Date: 2021-02-22 16:46:47
 * @LastEditTime: 2021-04-01 22:17:38
 * @LastEditors: Please set LastEditors
 * @Description: 存在于界面上方的组件。
 * @FilePath: \rise\src\layout\components\topLayout.vue
-->
<template>
  <div class="topLayout">
    <div class="left">
      <pInput v-model="search" :placeholder="$t('search') | capitalizeFilter" />
    </div>
    <div class="right">
      <div class="user">
        <el-avatar
          class="icon"
          src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3729239676,1542549068&fm=26&gp=0.jpg"
        ></el-avatar>
        <div class="info">
          <p class="name">{{ userInfo.nameZh || 'admin' }}</p>
          <p class="dept">CSP</p>
        </div>
      </div>
      <div class="setting">
        <el-dropdown size="small" @command="loginOut">
          <span>
            <icon symbol class="icon" name="iconSetting" />
            <span>{{ $t('setting') | capitalizeFilter }}</span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-switch-button">{{ $t('LK_TUICHUDENGLU') }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="language" @click="handleChangeLang">
        <icon symbol v-if="lang === 'zh'" class="icon" name="iconzhongyingwenzhuanhuanzhong" />
        <icon symbol v-else class="icon" name="iconzhongyingwenzhuanhuanying" />
      </div>
      <iMailTrigger />
      <!-- <div class="message" @click="showMessage">
        <el-badge :value="messageCount" :hidden="!messageCount">
          <icon symbol class="icon" name="iconxiaoxi" />
        </el-badge>
      </div> -->
    </div>
    <!-- 消息列表 -->
    <!-- <drawer
      ref="drawer"
      :visible="drawerVisible"
      @afterClear="afterClear"
      @updateMessageCount="getCountInMail"
    /> -->
    <notify ref="notify" v-if="!drawerVisible" />
  </div>
</template>
<script>
import pInput from './input.vue'
import { icon } from 'rise'
import drawer from '../message/drawer'
import notify from '../message/notify'
import filters from '@/utils/filters'
import { getCountInMail } from '@/api/layout/topLayout'
import { messageSocket } from '@/api/socket'
import { removeToken, updataComponents } from '@/utils/index.js'
import iMailTrigger from '../mail/trigger.vue'
import store from '@/store'
export default {
  mixins: [filters],
  components: {
    pInput,
    icon,
    drawer,
    notify,
    iMailTrigger
  },
  data() {
    return {
      socketVm: '',
      timer: 0,
      reconnectTimer: 0,
      lang: '',
      search: '',
      msgType: false,
      drawerVisible: false,
      messageCount: 0,
      messageLoading: false,
      messageData: {
        notice: [],
        message: []
      },
      isClose: true
    }
  },
  computed: {
    // eslint-disable-next-line no-undef
    ...Vuex.mapState({
      userInfo: state => state.permission.userInfo
    })
  },
  created() {
    this.lang = localStorage.getItem('lang')
    //this.getCountInMail();
    this.getMessageBySocket('1001')
  },
  beforeDestroy() {
    this.socketVm && this.socketVm.close()
  },
  methods: {
    //模拟退出登录方法
    loginOut() {
      removeToken()
      window.location.href = '/login'
      window.location.reload()
    },
    getMessageBySocket(userId) {
      messageSocket(userId)
        .then(({ res, vm }) => {
          this.socketVm = vm
          this.isClose = false

          window.addEventListener('beforeunload', () => {
            vm.close()
          })

          document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
              this.timer = setTimeout(() => {
                vm.close()
                this.isClose = true
              }, 180000)
            } else {
              clearTimeout(this.timer)
              if (this.isClose) {
                this.reconnectMessageSocket()
              }
            }
          })

          try {
            const data = JSON.parse(res.data)
            const msgTxt = data.msgTxt
            if (msgTxt) {
              if (msgTxt.type == '4' || msgTxt.type == '5') {
                if (this.drawerVisible) {
                  this.$refs.drawer.unshift(msgTxt)
                } else {
                  this.$refs.notify.unshift(msgTxt)
                }

                if (msgTxt.type == '5') this.messageCount += 1
              }
            }
          } catch (e) {
            console.log(e)
          }
        })
        .catch(e => {
          this.reconnectMessageSocket()
        })
    },
    reconnectMessageSocket() {
      if (!this.isClose) {
        return
      }

      clearTimeout(this.reconnectTimer)

      this.reconnectTimer = setTimeout(() => {
        this.getMessageBySocket('1001')
      }, 20000)
    },
    handleChangeLang() {
      this.lang = this.lang === 'zh' ? 'en' : 'zh'
      localStorage.setItem('lang', this.lang)
      this.$i18n.locale = this.lang
      if (this.lang == 'en') {
        // eslint-disable-next-line no-undef
        ELEMENT.locale(ELEMENT.lang.en)
      } else {
        // eslint-disable-next-line no-undef
        ELEMENT.locale(ELEMENT.lang.zhCN)
      }
    },
    // 显示消息列表
    showMessage() {
      this.drawerVisible = !this.drawerVisible
    },
    // 获取消息数目
    getCountInMail() {
      getCountInMail({ receiverId: this.userInfo.id, inMailType: 5 }).then(res => {
        this.messageCount = res.data
      })
    },
    afterClear() {
      this.getCountInMail()
    }
  }
}
</script>
<style lang="scss" scoped>
.topLayout {
  height: 60px;
  width: 100%;
  min-width: 1400px;
  background-color: $color-white;
  position: fixed;
  top: 0px;
  left: 0px;
  padding-left: 100px;
  box-shadow: 0px 1px 0px #dfe6f7;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 888;

  .left {
    height: 60px;
    line-height: 60px;
    padding-left: 60px;
    background-color: #ffffff;
  }

  .right {
    position: absolute;
    top: 0;
    right: 0;
    height: 60px;
    color: $color-header-black;
    padding-right: 33px;
    display: flex;
    align-items: center;

    .user {
      height: 60px;
      line-height: 60px;
      display: flex;
      align-items: center;

      .icon {
        width: 44px;
        height: 44px;

        ::v-deep img {
          position: relative;
          left: 50%;
          transform: translate(-50%, 0);
        }
      }

      .info {
        margin-left: 26px;

        .name {
          font-size: 16px;
          line-height: 20px;
        }

        .dept {
          margin-top: 4px;
          font-size: 16px;
          line-height: 16px;
          color: $color-header-gray;
        }
      }
    }

    .setting {
      font-size: 16px;
      margin-left: 30px;
      cursor: pointer;
      display: flex;
      align-items: center;

      .icon {
        font-size: 25px;
      }

      span {
        margin-left: 8px;
        line-height: 1em;
      }
    }

    .language,
    .message {
      margin-left: 30px;
      cursor: pointer;

      .icon {
        line-height: 97px;
        font-size: 25px;
      }
    }
  }

  .message {
    ::v-deep .el-badge {
      .el-badge__content {
        background: #e30d0d;
        top: auto;
        bottom: -3px;
        min-width: 25px;
        height: 25px;
        padding: 0;
        font-size: 14px;
        text-align: center;
      }
    }
  }
}
</style>
