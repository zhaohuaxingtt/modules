<!--
 * @Author: yuszhou
 * @Date: 2021-04-23 18:56:31
 * @LastEditTime: 2021-05-11 19:57:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\costsummary\components\tableTemlate.vue
-->

<template>
  <iCard :title='title'>
    <slot slot='header-control'></slot>
    <tableList 
      :tableIndexString='tableIndexString'
      :tableData='tableData'
      :tableTitle="tableTile" 
      :tableLoading="tableLoading"
      :indexKey='index'
      :selection='selection'
      :notEdit='notEdit'
      @handleSelectionChange='handleSelectionChange'
    ></tableList>
    <!------------------------------------------------------------------------>
    <!--                  表格分页                                          --->
    <!------------------------------------------------------------------------>
    <iPagination v-if='iPagination' v-update 
       @size-change="handleSizeChange($event, getTableList)" 
       @current-change="handleCurrentChange($event, getTableList)" 
       background 
       :page-sizes="page.pageSizes"
       :page-size="page.pageSize"
       :layout="page.layout"
       :current-page="page.currPage"
       :total="pageNationRes=='cbd'?vm.tableDataCbdModel.total:vm.allTableData[pageNationRes].total"
     />
  </iCard>
</template>
<script>
import {iCard,iPagination} from 'rise'
import tableList from '../../../../workingRfq/components/tableList'
import { pageMixins } from "@/utils/pageMixins";
export default{
  mixins:[pageMixins],
  components:{iCard,tableList,iPagination},
  inject:['vm'],
  props:{
    title:String,
    tableTile:{
      type:Array,
      default:()=>[]
    },
    tableData:{
      type:Array,
      default:()=>[]
    },
    tableIndexString:String,
    index:Boolean,
    iPagination:Boolean,
    selection:Boolean,
    notEdit:Boolean,
    getTableList:Function,
    pageNationReq:String,
    pageNationRes:String,
    cbdSelect:{
      type:Object,
      default:()=>{}
    }
  },
  methods:{
    handleSizeChange(e,){
      this.page.pageSize = e
      if(this.pageNationReq == 'cbd'){
        this.vm.findFiles(this.page.pageSize,this.page.currPage)
      }else{
        this.vm.getCostSummary(this.page.pageSize,this.page.currPage,this.pageNationReq)
      }
      
    },
    handleCurrentChange(e){
      this.page.currPage = e
      if(this.pageNationReq == 'cbd'){
        this.vm.findFiles(this.page.pageSize,this.page.currPage)
      }else{
        this.vm.getCostSummary(this.page.pageSize,this.page.currPage,this.pageNationReq)
      }
    },
    handleSelectionChange(row){
      this.cbdSelect.list = row
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
