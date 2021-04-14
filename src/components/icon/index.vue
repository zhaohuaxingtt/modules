<!--
 * @Author: your name
 * @Date: 2021-04-08 14:44:44
 * @LastEditTime: 2021-04-11 16:14:52
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \front-modules\src\components\icon\index.vue
-->
<template>
  <svg v-if="symbol" class="icon" :color='color' aria-hidden="true">
    <use :xlink:href="`#${ name }`"></use>
  </svg>
  <i v-else class="iconfont" :class="name"></i>
</template>

<script>
export default {
  name:'icon',
  props: {
    symbol: {
      type: Boolean,
      default: false
    },
    name: {
      type: String
    },
    color:{
      type:String
    }
  }
}
</script>

<style lang="scss" scoped>
.icon {
  width: 1em; height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>