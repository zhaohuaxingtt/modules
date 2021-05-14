<!--
 * @Author: yuszhou
 * @Date: 2021-02-25 16:34:49
 * @LastEditTime: 2021-05-14 21:27:27
 * @LastEditors: Please set LastEditors
 * @Description: 界面中存在的搜索区域，公共组件。
 * @FilePath: \rise\src\components\iSearch\index.vue
-->
<template>
  <iCard :title="title" :tabCard="tabCard">
    <div class="iSearch-content" :class="{hiden:hidens}">
      <div class="operation" v-if='!hiddenRight'>
        <slot name='button'>
          <iButton @click="$emit('sure')" :v-permission="searchKey">{{ $t('rfq.RFQINQUIRE') }}</iButton>
          <iButton @click="$emit('reset')" :v-permission="resetKey">{{ $t('rfq.RFQRESET') }}</iButton>
        </slot>
        <i @click="hidens=!hidens" v-if='!icon' class="el-icon-arrow-up icon margin-left20 cursor"
           :class="{rotate:hidens}"></i>
      </div>
      <div class="serch" :style="`margin-right:${stypeWidth}px;`">
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
    searchKey: String,
    resetKey: String,
    icon: Boolean,
    title: {
      type: String
    },
    tabCard: {
      type: Boolean,
      default: false
    },
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

  .operation {
    float: right;
    width: auto;
    display: flex;
    margin-top: 22px;
    text-align: right;
  }
}

.el-icon-arrow-up {
  transition: all 0.5s;
  height: 15px;
  position: relative;
  top: 8px;
}

.rotate {
  transform: rotate(180deg);
  color: $color-blue;
}

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