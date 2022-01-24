<template>
  <div class="router-link">
    <router-link
      v-if="item.url.indexOf('http') === -1"
      class="side-menu-link 1"
      :class="{ active: isActive, disabled: !item.url }"
      :to="{ path: item.url }"
      @click.native="handleRouterClick"
    >
      <icon
        symbol
        class="icon margin-right20 leftIconActive"
        :name="
          isActive
            ? 'iconxunyuandingdianxuanzhong'
            : 'iconxunyuandingdianweixuanzhong'
        "
      />
      <span>{{ item.title }}</span>
      <icon
        symbol
        class="icon floatright margin-top32"
        v-if="!isActive"
        name="iconmuluweixuanzhongshijiantou"
      />
    </router-link>
    <a
      v-else
      :href="itemUrl"
      :class="{ active: isActive, disabled: !item.url }"
      class="side-menu-link 2"
      @click.stop="handleRouterClick"
    >
      <icon
        symbol
        class="icon margin-right20 leftIconActive"
        :name="
          isActive
            ? 'iconxunyuandingdianxuanzhong'
            : 'iconxunyuandingdianweixuanzhong'
        "
      />
      <span>{{ item.title }}</span>
      <icon
        symbol
        class="icon floatright margin-top32"
        v-if="!isActive"
        name="iconmuluweixuanzhongshijiantou"
      />
    </a>
  </div>
</template>

<script>
import { Icon } from 'rise'
import { getToken } from '@/utils'
export default {
  name: 'ItemLink',
  components: { Icon },
  props: {
    item: {
      type: Object,
      default: function () {
        return {}
      }
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    itemUrl() {
      if (this.item.url) {
        if (
          ['/bkm/login.do', '/bkmApi/login.do'].includes(
            this.item.url.replace(process.env.VUE_APP_HOST, '')
          )
        ) {
          return this.item.url + '?userno=' + getToken()
        }
        return this.item.url
      }
      return (
        this.item.menuList &&
        this.item.menuList.length &&
        this.item.menuList[0].url
      )
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
