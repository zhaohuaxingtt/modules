<!--
 * @Author: yuszhou
 * @Date: 2021-02-25 16:34:49
 * @LastEditTime: 2021-05-24 15:45:01
 * @LastEditors: Please set LastEditors
 * @Description: 界面中存在的搜索区域，公共组件。
 * @FilePath: \rise\src\components\iSearch\index.vue
-->
<template>
  <iCard  :title="title" :tabCard="tabCard" >
    <div class="iSearch-content" :class="{hiden:hidens}" >
      <div class="operation" v-if='!hiddenRight'>
        <slot name='button'>
          <iButton @click="$emit('sure')" >{{ $t('rfq.RFQINQUIRE') }}</iButton>
          <iButton @click="$emit('reset')" >{{ $t('rfq.RFQRESET') }}</iButton>
        </slot>
        <i @click="toggle" v-if='!icon' class="el-icon-arrow-up icon margin-left20 cursor"
           :class="{rotate:hidens}"></i>
      </div>
      <div class="serch" :style="`margin-right:${stypeWidth}px;`" v-on:keyup.13.stop="$emit('click')">
        <slot>
        </slot>
      </div> 
    </div>
  </iCard>
</template>
<script>
import iCard from '../iCard'
import iButton from '../iButton'
/**
 * @example ./README.me
*/
export default {
  name:'iSearch',
  components: {iCard, iButton},
  props: {
    //是否显示图标
    icon: Boolean,
    //标题名字
    title: {
      type: String
    },

    tabCard: {
      type: Boolean,
      default: false
    },
    //是否显示右边站位模块
    hiddenRight:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      hidens: false,
      stypeWidth:0
    }
  },
  mounted(){
    this.getWidth()
  },
  methods:{
    /**
     * @description: 获取宽度设置
     * @param {*}
     * @return {*}
     */
    getWidth(){
        let rightWidth = this.hiddenRight?0:this.$el.getElementsByClassName('operation')[0]
        this.stypeWidth = rightWidth.clientWidth
    },
    toggle(){
      this.hidens = !this.hidens
      this.$emit('toggle', this.hidens)
    }
  }
}
</script>
<style lang='scss' scoped>
.iSearch-content {
  transition: max-height .5s;
  max-height: 500px;
  overflow: hidden;

  .serch {
    margin-right: 250px;
    height: auto;
    overflow: hidden;

    ::v-deep .el-form-item {
      margin-bottom: 2px;
      width: 220px;
      float: left;
      margin-right: 50px;
      padding-left: 2px;
      padding-top: 5px;
      padding-bottom: 5px;

      .el-form-item__label {
        font-size: 14px;
        color: $color-black;
        font-weight: 400;
        line-height: 14px;
        margin-bottom: 8px;
      }

      .el-form-item__content {
        line-height: inherit;
      }
    }
  }

  ::v-deep .operation {
    float: right;
    margin-top: 22px;
    position: relative;
    text-align: right;
    .rotate {
      transform: rotate(180deg);
      color: $color-blue;
      position: absolute !important;
      top: -16px !important;
    }
    .icon{
      position: absolute;
      top: -26px;
      right: 0px;
      }
      button{
        margin-top: 5px;
      }
  }
}

.el-icon-arrow-up {
  transition: all 0.5s;
  height: 15px;
  position: relative;
  top: 8px;
}

// .rotate {
//   transform: rotate(180deg);
//   color: $color-blue;
// }

.icon {
  font-size: 20px;
  color: #D3D3DB;

  &:hover {
    color: $color-blue;
  }
}

.hiden {
  max-height: 65px;
}
</style>