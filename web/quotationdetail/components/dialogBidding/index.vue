<!--
 * @Author: your name
 * @Date: 2021-10-28 13:25:35
 * @LastEditTime: 2021-10-28 15:42:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \front-modules\web\quotationdetail\components\dialogBidding\index.vue
-->
<template>
  <iDialog :visible.sync='show.show' :title="'竞价结果对比'">
    <tabelList class="padding-bottom20" :selection='false'  :tableData='tabelData.tabelData' :tableTitle='tabelData.tableTitle'></tabelList>
  </iDialog>
</template>
<script>
import {iDialog} from 'rise'
import tabelList from 'rise/web/workingRfq/components/tableList'
export default{
  components:{iDialog,tabelList},
  props:{
    tabelData:{
      type:Object,
      default:()=>{}
    },
    show:{
      type:Object,
      default:()=>{}
    }
  }
}
</script>
<style lang='scss' scoped>
</style>