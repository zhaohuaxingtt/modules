<!--
 * @Author: yuszhou
 * @Date: 2021-04-23 17:41:42
 * @LastEditTime: 2021-05-26 13:43:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\costsummary\components\persent.vue
-->
<template>
<ul class="urlli">
  <template v-for='(items,index) in persentTitel(persentList,realDataList)'>
      <li :key='index' :style='{width:items.width}' v-if='items.width != 0'>
        <p class="a" :style="{backgroundColor:items.color}"></p>
        <p class="b" :title='items.name'>{{$t(items.key)}}</p>
        <p class="c" :title='items.persent'>{{items.persent}}</p>
      </li>
  </template>

</ul>
</template>
<script>
import {persentDatalist,persentTitel} from './data'
export default{
  props:{
    persentList:{
      type:Array,
      default:()=>['0','0','0','0','0','0']
    },
    realDataList:{
      type:Array,
      default:()=>[]
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
    max-height: 68px;
    li{
      float: left;
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
</style>
