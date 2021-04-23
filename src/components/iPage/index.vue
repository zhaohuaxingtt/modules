<!--
 * @Author: yuszhou
 * @Date: 2021-02-24 09:30:41
 * @LastEditTime: 2021-04-21 21:40:44
 * @LastEditors: Please set LastEditors
 * @Description: 界面根组件
 * @FilePath: \rise\src\components\iPage\index.vue
-->
<template>
<div class="routerpage">
  <slot></slot>  
</div>
</template>
<script>
/**
 * @example ./README.me
*/
export default{
  name:'iPage',
}
</script>
<style lang='scss' scoped>
  .routerpage{
    height: 100%;
    width: 100%;
    padding: 30px 40px 30px 40px;
    overflow-y: scroll;
  }
</style>
