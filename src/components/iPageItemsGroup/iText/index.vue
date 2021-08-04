<!--
 * @Author: yuszhou
 * @Date: 2021-03-02 14:23:15
 * @LastEditTime: 2021-08-04 16:21:54
 * @LastEditors: Please set LastEditors
 * @Description: 作为当前组件的配套组合，适应不需要编辑的元素。
 * @FilePath: \rise\src\components\iPageItemsGroup\iText\index.vue
-->
<template>
  <div class="itext">
    <span class="child">
      <el-tooltip v-if='tooltip' effect='light' :content='$slots.default'><span><slot></slot></span></el-tooltip>
      <slot v-else></slot>
    </span>
  </div>
</template>
<script>
/**
 * @example ./README.me
*/
export default{
  name:'iText',
  data(){
    return {tooltip:false}
  },
  updated(){
      this.$nextTick(()=>{
      //保证获取到的值是已经填入后的元素宽度,鉴于数据的回填如果是异步错过el挂载，二次无法补救。使用当前组件updated做提示。
        let parentWidth =  this.$el.clientWidth -  20
        let childWidth =  this.$el.querySelector('.child').offsetWidth
        if(childWidth > parentWidth) {this.tooltip = true} else {this.tooltip = false} 
    }) 
  }
}
</script>
<style lang='scss' scoped>
  .itext{
    width: 100%;
    font-size: 16px;
    background-color: #F8F8FA;
    height: 35px;
    text-align: center;
    line-height: 35px;
    border-radius: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>