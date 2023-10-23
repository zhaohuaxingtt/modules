<template>
  <div class="my-favorite-list-item">
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
      <a :href="item.url" :title="itemName">{{ itemName }}</a>
    </div>
  </div>
</template>

<script>
import { Icon } from 'rise'
export default {
  name: 'myFavoriteItem',
  components: { Icon },
  props: {
    item: {
      type: Object,
      default: function () {
        return {}
      }
    },
    flatFullMenus: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  computed: {
    itemName() {
      if (this.item.objType === 2) {
        return this.item.objName
      }
      if (this.flatFullMenus && this.flatFullMenus.length) {
        const findItem = this.flatFullMenus.find(
          (e) => e.id === this.item.objId
        )
        if (findItem) {
          return findItem.nameLinked
        }
      }
      return this.item.objName
    }
  }
}
</script>

<style lang="scss" scoped>
.my-favorite-list-item {
  font-size: 12px;
  line-height: 18px;
  padding: 6px 0px;
  overflow: hidden;
  display: flex;
  align-items: center;

  .icon-panel {
    width: 24px;
  }
  .icon-type {
    font-size: 18px;
    color: #67C23A;
    font-weight: bold;
  }
  .icon-type-c {
    font-size: 14px;
    transform: rotate(90deg);
  }
  .url {
    width: calc(100% - 24px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
