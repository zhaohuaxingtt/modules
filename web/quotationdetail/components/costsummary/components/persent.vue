<!--
 * @Author: yuszhou
 * @Date: 2021-04-23 17:41:42
 * @LastEditTime: 2021-06-19 14:05:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\costsummary\components\persent.vue
-->
<template>
  <ul class="urlli">
    <template v-for='(items,index) in persentTitel(persentList,realDataList)'>
      <li :key='index' :style='{width:parseInt(items.width)<5?"100px":items.width}' v-if="items.width">
        <p class="a" :style="{backgroundColor:items.color}"></p>
        <p class="b" :title='items.name'>{{ lang ? language(items.key, items.name) : $t(items.key)}}</p>
        <p class="c" :title='items.persent'>{{items.persent}}</p>
      </li>
    </template>
  </ul>
</template>
<script>
import {persentTitel} from './data'
export default{
  props:{
    persentList:{
      type:Array,
      default:()=>[0,0,0,0,0,0]
    },
    realDataList:{
      type:Array,
      default:()=>[]
    },
    lang: {
      type: Boolean,
      default: false
    }
  },
  methods:{
    persentTitel(persentList,dataList){
      return persentTitel(persentList,dataList)
    }
  }
}
</script>
<style lang='scss' scoped>
  .urlli{
    width: 100%;
    overflow: hidden;
    margin-top: 20px;
    // max-height: 70px;
    display: flex;
    li{
      padding-right: 5px;
      transition: all 1s;
      p{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .a{
        height: 16px;
        width: 100%;
        margin-bottom: 8px;
      }
      .b{
        font-size: 16px;
        margin-bottom: 6px;
      }
      .c{
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
.hide {
  display: none;
}
</style>
