<!--
 * 页面layout布局
 * 使用方法
 * import iLayout from 'rise/web/layout/index.vue'
 * <iLayout :menus="menus" />
 * menus 参考 menus.js, 不同工程需要自定义menus.js文件 front-modules中的menus.js仅供参考
 * 后期menus可能会集成进来
-->
<template>
  <div class="content">
    <topLayout></topLayout>
    <leftLayout ref="leftLayout" :menus="menus" @toggle-active="toggleActive">
      <template slot="menu">
        <sideMenu :side-menus="sideMenus" :menu-map="menuMap" @hide-side-menu="hideSideMenu" />
      </template>
    </leftLayout>
    <div class="app-content" :class="{ keepAlive: $route.meta.keepAlive }">
      <div class="clickhiddenMenu"  @click='clickhiddenMenu'>
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" :key="$route.fullPath" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" :key="$route.fullPath" />
      </div>
    </div>
  </div>
</template>
<script>
import topLayout from './components/topLayout/'
import LeftLayout from './components/leftLayout'
import sideMenu from './components/sideMenu'
export default {
  components: { topLayout, LeftLayout, sideMenu },
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
      activeIndex: 1,
      menuMap: {}
    }
  },
  computed: {
    sideMenus() {
      if (this.menus.length > 0) {
        const activeMenu = this.menus[this.activeIndex]
        if (activeMenu && activeMenu.subMenus) {
          return activeMenu.subMenus
        }
      }
      return []
    }
  },
  created() {
    const menuMap = this.getMenusMap(this.menus)
    console.log('menuMap', menuMap)
    this.menuMap = menuMap
  },
  methods: {
    toggleActive(index) {
      this.activeIndex = index
    },
    hideSideMenu() {
      this.$refs.leftLayout.hideSideMenu()
    },
    clickhiddenMenu() {
      this.$refs.leftLayout.hideSideMenu()
    },
    getMenusMap(menus, parent, res) {
      res = res || {}
      for (let i = 0; i < menus.length; i++) {
        const menu = menus[i]
        if (!res[menu.url]) {
          res[menu.url] = []
        }
        parent = parent || []
        res[menu.url].push(...parent)
        res[menu.url].push(menu.url)

        if (menu.subMenus) {
          this.getMenusMap(menu.subMenus, res[menu.url], res)
        }
      }
      return res
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  height: 100%;
  width: 100%;
  .app-content {
    padding-left: 100px;
    padding-top: 60px;
    height: 100%;
    width: 100%;
    position: absolute;
    .clickhiddenMenu{
      height: 100%;
      width: 100%;
      position: relative;
    }
  }
}
</style>
