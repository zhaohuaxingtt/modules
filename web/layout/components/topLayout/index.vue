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
      <i-user-setting
        :userInfo="userInfo"
        :menus="menus"
        :activeMenu="activeMenu"
        @click-menu="clickMenu"
      />
      <div class="language" @click="handleChangeLang">
        <img  v-if="lang === 'zh'" src="../../assets/images/Group 1.svg" alt="SVG Icon">
        <!-- <icon
          symbol
          v-if="lang === 'zh'"
          class="icon"
          name="iconzhongyingwenzhuanhuanzhong"
        /> -->
        <img  v-else src="../../assets/images/Group 4.svg" alt="SVG Icon">
        <!-- <icon symbol v-else class="icon" name="iconzhongyingwenzhuanhuanying" /> -->
      </div>
      <iMailTrigger ref="iMail"/>
    </div>
    <notify ref="notify" v-if="!drawerVisible" />
    <profile :visible.sync="profileVisible" />
  </div>
</template>
<script>
import pInput from './input.vue'
import { icon } from 'rise'
import notify from '../message/notify'
import filters from '@/utils/filters'
import { getCountInMail } from '@/api/layout/topLayout'
import { removeToken } from '@/utils/index.js'
import iMailTrigger from '../mail/trigger.vue'
import iUserSetting from './userSetting.vue'
import profile from '../profile'
export default {
  mixins: [filters],
  components: {
    pInput,
    icon,
    notify,
    iMailTrigger,
    iUserSetting,
    profile
  },
  props: {
    menus: {
      type: Array,
      default: function () {
        return []
      }
    },
    activeMenu: {
      type: Array,
      default: function () {
        return []
      }
    }
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
      isClose: true,
      profileVisible: false
    }
  },
  computed: {
    // eslint-disable-next-line no-undef
    ...Vuex.mapState({
      userInfo: (state) => state.permission.userInfo
    })
  },
  created() {
    this.lang = localStorage.getItem('lang')
  },

  beforeDestroy() {
    this.socketVm && this.socketVm.close()
  },
  methods: {
    clickMenu(val) {
      if (val == 'logout') {
        this.$refs.iMail.handleHideDrawer()
        this.$emit('click-menu', val)
        this.$nextTick(()=>{
          removeToken()
          window.sessionStorage.clear()
          window.localStorage.clear()
          this.$store.commit('SET_USER_INFO', {})
          window.location.href = process.env.VUE_APP_LOGOUT_URL
        })
      } else {
        this.$emit('click-menu')
      }
      if (val === 'profile') {
        this.showProfile()
      }
    },
    //模拟退出登录方法
    loginOut() {
      removeToken()
      window.location.href = '/login'
      window.location.reload()
    },
    handleChangeLang() {
      this.lang = this.lang === 'zh' ? 'en' : 'zh'
      this.$store.commit('SET_LANGUAGE', this.lang)
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
      getCountInMail({ receiverId: this.userInfo.id, inMailType: 5 }).then(
        (res) => {
          this.messageCount = res.data
        }
      )
    },
    afterClear() {
      this.getCountInMail()
    },
    showProfile() {
      this.profileVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.topLayout {
  height: 60px;
  width: 100%;
  min-width: 1400px;
  background-color: $color-black;
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
    background-color: #000;
  }

  .right {
    position: absolute;
    top: 0;
    right: 0;
    height: 60px;
    color: #fff;
    padding-right: 33px;
    display: flex;
    align-items: center;

    .user {
      height: 60px;
      line-height: 60px;
      display: flex;
      align-items: center;
      cursor: pointer;
      .icon {
        width: 44px;
        height: 44px;
        use{
          fill:#000
        }
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
