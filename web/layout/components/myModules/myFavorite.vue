<template>
  <div class="my-favorites">
    <div class="my-favorites-name">
      <span class="name">My Favourites</span>
      <span class="icon-setting">
        <a href="/portal/#/setting?module=favourites">
          <icon name="iconSetting" symbol />
        </a>
      </span>
    </div>
    <div
      class="my-favorite-list"
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0)"
    >
      <myFavoriteItem
        v-for="item in favorites"
        :key="item.name"
        :item="item"
        :flatFullMenus="flatFullMenus"
      />
      <!-- <div
        class="my-favorite-list-item"
        v-for="item in favorites"
        :key="item.name"
      >
        <div class="icon-panel">
          <span v-if="item.objType === 1" class="icon-type el-icon-link"></span>
          <icon
            v-if="item.objType === 2"
            name="iconshangchuanwenjian"
            class="icon-type-c"
            symbol
          />
        </div>
        <div class="url">
          <a :href="item.url" :title="item.objName">{{ item.objName }}</a>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { queryFavorites } from './../../api'
import myFavoriteItem from './myFavoriteItem'
import { Icon } from 'rise'

export default {
  name: 'myFavorite',
  components: { myFavoriteItem, Icon },
  computed: {
    fullMenus() {
      return this.$store.state.permission.menuList
    }
  },
  data() {
    return {
      favorites: [],
      loading: false,
      flatFullMenus: []
    }
  },
  created() {
    this.queryFavourites()
    this.flatFullMenus = this.getFlatFullMenu(this.fullMenus)
  },
  methods: {
    async queryFavourites() {
      const requestData = {
        userId: this.$store.state.permission.userInfo.id
      }
      this.loading = true
      const { data = [] } = await queryFavorites(requestData).finally(() => {
        this.loading = false
      })
      this.favorites = data
    },
    // 扁平化菜单数据
    getFlatFullMenu(menuList, res) {
      res = res || []
      for (let i = 0; i < menuList.length; i++) {
        const menu = menuList[i]

        const parentItem = res.find((e) => e.id === menu.parentId)
        const nameLinked = parentItem
          ? `${parentItem.nameLinked} - ${menu.name}`
          : menu.name
        const item = {
          name: menu.name,
          nameLinked: nameLinked,
          id: menu.id,
          parentId: menu.parentId,
          permissionKey: menu.permissionKey,
          level: menu.level
        }
        res.push(item)
        if (menu.menuList && menu.menuList.length) {
          this.getFlatFullMenu(menu.menuList, res)
        }
      }
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
.my-favorites {
  flex: 1;
  overflow: hidden;
  margin-top: 20px;
}
.my-favorites-name {
  display: flex;
  position: relative;
  padding-left: 10px;
  border-left: solid 3px #67C23A;
  color: #001847;
  font-size: 18px;
  justify-content: space-between;
  .name {
    font-weight: bold;
  }
  .icon-setting {
    cursor: pointer;
  }
}
.my-favorite-list {
  overflow-y: auto;
  margin: 10px 0px;
  height: 150px;
}
</style>
