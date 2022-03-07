<!--
 * @Author: your name
 * @Date: 2021-04-08 14:44:44
 * @LastEditTime: 2021-04-21 21:40:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \front-modules\src\components\iDrawer\index.vue
-->
<template>
  <div class="drawer" :class="{ closed: !visible }">
    <div class="drawer-bg" @click="close"></div>
    <div
      class="drawer-container"
      :class="visible ? 'showMenuList' : 'hideMenuList'"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
/**
 * @example ./README.me
 */
export default {
  name: 'iDrawer',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    document.body.appendChild(this.$el)
  },
  methods: {
    // 显示任务菜单
    show() {
      this.$emit('update:visible', true)
    },
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer {
  width: 100%;
  position: absolute;
  z-index: 98;
  top: 0;
  transition: all 0.3s ease-in-out;
  &.closed {
    transform: translateX(100%);
    .drawer-bg {
      width: 0px;
    }
  }
}
.drawer-bg {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  min-height: 100vh;
}
.drawer-container {
  width: 400px;
  transition: all 0.3s ease-in-out;
  position: absolute;
  right: 0;
  top: 0;
  min-height: 100vh;
  z-index: 99;
  background: #ffffff;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.08);
  transform: translateX(0px);
}

.showMenuList {
  /* width: 400px; */
  transform: translateX(0px);
}

.hideMenuList {
  /* width: 0px; */
  transform: translateX(400px);
}
</style>
