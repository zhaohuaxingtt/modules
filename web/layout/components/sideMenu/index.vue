<template>
  <ul class="side-menus">
    <li
      class="item"
      v-for="(item, index) in menus"
      :key="index"
      :class="{ item: true, active: item.active }"
    >
      <item-link
        :item="item"
        :menu-map="menuMap"
        @hide-side-menu="$emit('hide-side-menu')"
      />
    </li>
  </ul>
</template>

<script>
import ItemLink from './ItemLink'
export default {
  name: 'SideMenu',
  components: { ItemLink },
  props: {
    sideMenus: {
      type: Array,
      default: () => [],
    },
    menuMap: {
      type: Object,
      default: function() {
        return []
      },
    },
  },
  computed: {
    menus() {
      return this.sideMenus.filter((e) => !e.hidden)
    },
  },
}
</script>

<style lang="scss" scoped>
.side-menus {
  height: calc(100% - 60px);
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  margin: 0px;
  padding: 0px;

  .active {
    background: #1660f1;
    span {
      color: white;
    }
    &:hover {
      span {
        color: white;
      }
    }
  }
}
</style>
