<!--
 * @Author: yuszhou
 * @Date: 2021-02-22 16:47:54
 * @LastEditTime: 2021-04-19 17:09:46
 * @LastEditors: Please set LastEditors
 * @Description: 界面左边的按钮切换菜单栏。
 * @FilePath: \rise\src\layout\components\leftLayout.vue
-->
<template>
  <div class="left-layout">
    <div class="leftLayout">
      <div class="content">
        <img class="logo" src="~@/assets/images/rise.png" alt="" />
        <div :class="iconChangeClass" class="centerBtn">
          <span
            v-for="(item, index) in menus"
            :key="index"
            :class="{ transparent: activeIndex === index }"
            @click="toggleActive(index)"
          >
            <icon symbol :name="activeIndex === index ? item.activeIcon : item.icon" />
          </span>
        </div>
        <div class="btn-button">
          <img src="~@/assets/images/leftContent.png" alt="" />
        </div>
      </div>
    </div>
    <div class="leftLayout menuLayout">
      <icon
        symbol
        name="iconcaidanzhankai"
        :class="{ menu: true, hiddenMenu: menuVisible, delay: !menuVisible }"
        @click.native="menuVisible = !menuVisible"
      />
      <div
        :class="{
          meunContent: true,
          showMenuContent: menuVisible,
          delay: menuVisible
        }"
      >
        <div class="meunTopContent">
          <span>
            {{ activeIndex == '0' ? 'Personalized Modules' : activeIndex == '1' ? 'Workbench' : 'Common Function' }}
          </span>
          <icon
            symbol
            name="iconcaidanshouqi"
            :class="{ menu: true, hiddenMenu: menuVisible }"
            @click.native="menuVisible = !menuVisible"
          />
        </div>
        <slot name="menu"></slot>
        <slot name="dashboard"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import { icon } from 'rise'
import _ from 'lodash'
export default {
  components: { icon },
  props: {
    menus: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      iconChangeClass: '',
      menuVisible: false,
      activeIndex: 1
    }
  },
  provide() {
    return this
  },
  created() {
    const rootIndex =
      process.env.NODE_ENV === 'sit' || process.env.NODE_ENV === 'production'
        ? this.getActiveIndexInSVW(this.menus)
        : this.getActiveIndex(this.menus)
    console.log('rootIndex', rootIndex)
    this.activeIndex = rootIndex
    this.$emit('toggle-active', rootIndex)
  },
  methods: {
    toggleActive(index) {
      const activeMenu = this.menus[index]
      if (this.menus.length > 0) {
        if (activeMenu.subMenus) {
          if (this.activeIndex === index) {
            if (this.menuVisible) {
              this.hideSideMenu()
            } else {
              this.showSideMenu()
            }
          } else {
            this.showSideMenu()
          }
        } else if (activeMenu.url) {
          if (activeMenu.url.indexOf('http') !== -1 || activeMenu.url.indexOf('https') !== -1) {
            activeMenu.target ? window.open(activeMenu.url) : (location.href = activeMenu.url)
          }
          // if (this.$route.path !== activeMenu.url) {
          //   this.$router.push({ path: activeMenu.url })
          // }
          this.hideSideMenu()
        }
        this.activeIndex = index
        this.$emit('toggle-active', index)
      }
    },
    showSideMenu() {
      this.menuVisible = true
    },
    hideSideMenu() {
      this.menuVisible = false
    },
    getActiveIndex(menus) {
      let index = -1
      index = _.findIndex(menus, item => {
        const url =
          item.url?.match(/((?<=#).*(?=\?))|((?<=#).*)/g) && item.url?.match(/((?<=#).*(?=\?))|((?<=#).*)/g)[0]
        if (url === this.$route.path) {
          return item
        }
      })

      if (
        process.env.VUE_APP_PUBLICPATH === '/portal' &&
        this.$route.path !== '/index' &&
        this.$route.meta.perm !== 'admin'
      ) {
        index = _.findIndex(menus, item => {
          return item.permissionKey === 'RISE_COMMON_FUNCTION'
        })
      }

      if (
        process.env.VUE_APP_PUBLICPATH !== '/portal' &&
        process.env.VUE_APP_PUBLICPATH !== '/portal/contract' &&
        process.env.VUE_APP_PUBLICPATH !== '/portal/meeting'
      ) {
        index = _.findIndex(menus, item => {
          return item.permissionKey === 'RISE_WORKBENCH'
        })
      }
      return index
    },
    getActiveIndexInSVW(menus) {
      let index = -1
      const host = window.location.host
      const isHome = this.$route.path === '/index'
      const isAdmin = this.$route.meta.perm === 'admin'
      const isPortal = host.indexOf('portal') !== -1
      const isMeetingHall = this.$route.path === '/meeting/hall'
      const isMeetingType = this.$route.path === '/meeting/type'
      const isMeetingHome = this.$route.path === '/meeting/home'
      const isContract = this.$route.path === '/contract/contractTemplate'
      const isCF = (isPortal && !isHome && !isAdmin) || isMeetingHall
      const isAdminMenus = isAdmin || isMeetingHome || isMeetingType || isContract
      if (isHome) {
        index = _.findIndex(menus, item => {
          return item.permissionKey === 'RISE_HOME'
        })
      } else if (isCF) {
        index = _.findIndex(menus, item => {
          return item.permissionKey === 'RISE_COMMON_FUNCTION'
        })
      } else if (isAdminMenus) {
        index = -1
      } else {
        index = _.findIndex(menus, item => {
          return item.permissionKey === 'RISE_WORKBENCH'
        })
      }
      return index
    }
  }
}
</script>
<style lang="scss" scoped>
.left-layout {
}
.delay {
  transition-delay: 0.4s !important;
}

.content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.leftLayout {
  width: 100px;
  background-color: $color-white;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  padding-top: 11px;
  padding-bottom: 30px;

  .menu {
    position: absolute;
    top: 10px;
    font-size: 38px;
    left: 91px;
    cursor: pointer;
    transition: all 0.3s;
    opacity: 1;
    transform: translateX(0px);
    border-radius: 0px;
  }

  .hiddenMenu {
    opacity: 0;
    transform: translateX(-30px);
  }

  .type-first {
    span {
      &:nth-child(2) {
        border-top-right-radius: 15px;
      }
    }
  }

  .type-tow {
    span {
      &:nth-child(1) {
        border-bottom-right-radius: 15px;
      }

      &:nth-child(3) {
        border-top-right-radius: 15px;
      }
    }
  }

  .type-last {
    span {
      &:nth-child(2) {
        border-bottom-right-radius: 15px;
      }
    }
  }

  .centerBtn {
    background-color: #f1f5ff;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    span {
      height: 90px;
      width: 100%;
      display: inline-block;
      text-align: center;
      line-height: 90px;
      background-color: $color-white;
      font-size: 32px;
      cursor: pointer;
      transition: all 0.2s;
      color: #001847;
    }

    .icon {
      font-size: 32px;
    }

    .transparent {
      background-color: transparent;
      height: 90px;
      line-height: 90px;

      svg {
        color: $color-blue;
      }
    }
  }

  .logo {
    width: 63px;
    height: 32px;
    display: block;
    margin: 0 auto;
    cursor: pointer;
  }

  .btn-button {
    width: 70px;
    height: 70px;
    background: #f1f5ff;
    margin: 0 auto;
    padding: 13px;
    border-radius: 15px;
    cursor: pointer;

    img {
      display: inline-block;
      height: 100%;
      width: 100%;
    }
  }
}

.menuLayout {
  z-index: 998 !important;

  .meunContent {
    position: absolute;
    left: 0px;
    top: 0px;
    height: 100%;
    width: 386px;
    background: #eef2fb;
    box-shadow: 0px 0px 20px rgba(95, 98, 111, 0.16);
    transform: translateX(-368px);
    transition: all 0.4s;
    opacity: 0.5;

    .meunTopContent {
      height: 60px;
      padding-left: 40px;
      line-height: 60px;
      position: relative;
      overflow: hidden;

      span {
        font-size: 24px;
        font-weight: bold;
        color: #001847;
      }

      .menu {
        position: absolute;
        top: 10px;
        right: -10px;
        left: inherit;
        font-size: 38px;
        cursor: pointer;
        transition: all 0.3s;
        transform: translateX(30px);
        opacity: 0;
      }

      .hiddenMenu {
        transform: translateX(0px);
        opacity: 1;
      }
    }
  }

  .showMenuContent {
    transform: translateX(101px);
    opacity: 1;
  }
}
</style>
