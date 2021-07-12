<template>
  <div class="router-link">
    <router-link
      v-if="item.url.indexOf('http') === -1"
      class="side-menu-link"
      :class="{ active: isActive, disabled: !item.url }"
      :to="{ path: item.url }"
      :target="item.target"
      @click.native="handleRouterClick"
    >
      <icon
        symbol
        class="icon margin-right20 leftIconActive"
        :name="isActive ? 'iconxunyuandingdianxuanzhong' : 'iconxunyuandingdianweixuanzhong'"
      />
      <span>{{ item.title }}</span>
      <icon symbol class="icon floatright margin-top32" v-if="!isActive" name="iconmuluweixuanzhongshijiantou" />
    </router-link>
    <a v-else :href="item.url" :target="item.target" class="side-menu-link" @click.native="handleRouterClick">
      <icon
        symbol
        class="icon margin-right20 leftIconActive"
        :name="isActive ? 'iconxunyuandingdianxuanzhong' : 'iconxunyuandingdianweixuanzhong'"
      />
      <span>{{ item.title }}</span>
      <icon symbol class="icon floatright margin-top32" v-if="!isActive" name="iconmuluweixuanzhongshijiantou" />
    </a>
  </div>
</template>

<script>
import { Icon } from 'rise'
export default {
  name: 'ItemLink',
  components: { Icon },
  props: {
    item: {
      type: Object,
      default: function() {
        return {}
      }
    },
    menuMap: {
      type: Object,
      default: function() {
        return []
      }
    }
  },
  computed: {
    isActive() {
      const curRoutePath = this.$route.path
      if (curRoutePath === this.item.url) {
        return true
      }
      if (this.menuMap[curRoutePath]) {
        return this.menuMap[curRoutePath].includes(this.item.url)
      }
      return false
    }
  },
  methods: {
    handleRouterClick() {
      this.$emit('hide-side-menu')
    }
  }
}
</script>

<style lang="scss" scoped>
.side-menu-link {
  display: block;
  width: 100%;
  height: 84px;
  padding-left: 40px;
  line-height: 84px;
  padding-right: 30px;
  cursor: pointer;

  span {
    color: #5f6f8f;
    font-size: 20px;
  }
  .icon {
    font-size: 20px;
  }
  &:hover {
    span {
      color: #1660f1;
    }
  }
  &.active {
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
  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>
