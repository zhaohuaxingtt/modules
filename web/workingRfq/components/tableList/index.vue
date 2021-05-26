<!--
 * @Author: yuszhou
 * @Date: 2021-02-24 09:42:07
 * @LastEditTime: 2021-05-25 17:29:56
 * @LastEditors: Please set LastEditors
 * @Description: 零件签收-table组件。
 * @FilePath: \rise\src\views\partsign\components\tableList.vue
-->
<template>
  <el-table fit tooltip-effect='light' :height="height" :data='tableData' v-loading='tableLoading' @selection-change="handleSelectionChange" :empty-text="$t('LK_ZANWUSHUJU')" ref="moviesTable" :class="radio && 'radio'">
    <el-table-column v-if="selection && hasList(tableTitle)" type='selection' width="50" align='center'></el-table-column>
    <el-table-column v-if='indexKey && hasList(tableTitle)' type='index' width='50' align='center' label='#'>
      <template slot-scope="scope">
        {{tableIndexString+(scope.$index+1)}}
      </template>
    </el-table-column>
    <template v-for="(items,index) in tableTitle">
      <!----------------------A价------------------------>
      <el-table-column :key="index" align='center' :width="items.width" :show-overflow-tooltip='items.tooltip' v-if='items.props == "totalPrice"' :prop="items.props" :label="items.key ? $t(items.key) : items.name">
        <template slot-scope="row">{{getAallPrice(Aprice,row.row)}}</template>
      </el-table-column>
      <!----------------------B价------------------------>
      <el-table-column :key="index" align='center' :width="items.width" :show-overflow-tooltip='items.tooltip' v-else-if='items.props == "totalPriceBprice"' :prop="items.props" :label="items.key ? $t(items.key) : items.name">
       <template slot-scope="row">{{getAallPrice(Bprice,row.row)}}</template>
      </el-table-column>
      <!----------------------需要高亮的列并且带有打开详情事件------------------------>
      <el-table-column :key="index" align='center' :width="items.width" :show-overflow-tooltip='items.tooltip' v-else-if='items.props == activeItems' :prop="items.props" :label="items.key ? $t(items.key) : items.name">
        <template slot-scope="row"><span class="openLinkText cursor" @click="openPage(row.row)">{{row.row[activeItems]}}</span></template>
      </el-table-column>
      <!----------------------需要高亮的列并且带有打开详情事件------------------------>
      <el-table-column :key="index" align='center' :width="items.width" :show-overflow-tooltip='items.tooltip' v-else-if='items.props == "isSvwAssignPriceParts"' :prop="items.props" :label="items.key ? $t(items.key) : items.name">
        <template slot-scope="row">
          <span v-if='notEdit'>{{row.row[items.props]?"是":"否"}}</span>
          <iSelect v-else v-model="row.row[items.props]">
            <el-option :value="options.value" v-for='(options,optionIndex) in items.options' :key='optionIndex' :label='options.label'></el-option>
          </iSelect>
        </template>
      </el-table-column>
      <!----------------------需要进行排序的列------------------------>
      <el-table-column :key="index" align='center' :width="items.width"  v-else-if='items.props == "paixu"'>
        <tempalte slot-scope="scope">
          <span @click="updateSlot(scope.row,0)" v-if='scope.row.recordId && parseInt(scope.row.recordId)'>
            <icon symbol class="cursor" name='iconliebiaoyizhiding' ></icon>
          </span>
          <span @click="updateSlot(scope.row,1)" v-else>
            <icon symbol class="cursor" name='iconliebiaoweizhiding'></icon>
          </span>
        </tempalte>
      </el-table-column>
      <el-table-column :key="index" align='center' :width="items.width" :show-overflow-tooltip='items.tooltip'  v-else :label="items.key ? $t(items.key) : items.name" :prop="items.props">
        <!----------------------------存在二级表头的情况------------------------------->
        <template v-if='items.list && items.list.length > 0'>
           <template v-for="(itemss,indexs) in items.list">
              <el-table-column v-if="selection && itemss.props == 'selection'" :key="indexs" type='selection' width="50" align='center'></el-table-column>
              <el-table-column v-else-if='indexKey && itemss.props == "index"' :key="indexs" type='index' width='50' align='center' label='#'>
                <template slot-scope="scope">{{tableIndexString+(scope.$index+1)}}</template>
              </el-table-column>
              <!----------------------------物料费用展示------------------------>
              <el-table-column v-else-if="itemss.props == 'materialPersent'" :key="indexs" align='center' :width="itemss.width" :show-overflow-tooltip='itemss.tooltip'  :label="itemss.key ? $t(itemss.key) : itemss.name" :prop="itemss.props">
                <template slot-scope="scope">
                  <span v-if='notEdit'>
                    {{getPersion(scope.row.indirectMaterialCost,scope.row.materialCost)}}
                  </span>
                  <iInput v-else :value="getPersion(scope.row.indirectMaterialCost,scope.row.materialCost)"></iInput>
                </template>
              </el-table-column>
              <el-table-column v-else :key="indexs" align='center' :width="itemss.width" :show-overflow-tooltip='itemss.tooltip'  :label="itemss.key ? $t(itemss.key) : itemss.name" :prop="itemss.props">
                  <!----------------------------如果是展示select 或者input------------------------>
                  <tempalte slot-scope="scope">
                    <template v-if='itemss.type == "select" && !notEdit'>
                      <iSelect v-model="scope.row[itemss.props]">
                          <el-option :value="options.code" v-for='(options,optionIndex) in items.options' :key='optionIndex' :label='options.name'></el-option>
                      </iSelect>
                    </template>
                    <template v-else-if='itemss.type == "input" && !notEdit'>
                      <iInput v-model="scope.row[itemss.props]"></iInput>
                    </template>
                    <template v-else>{{scope.row[itemss.props]}}</template>
                  </tempalte>
              </el-table-column>
           </template>
        </template>
        <!----------------------------如果是展示select 或者input------------------------>
        <template v-if='!items.list' slot-scope="scope">
          <template v-if='items.type == "select" && !notEdit'>
            <iSelect v-model="scope.row[items.props]">
                <el-option :value="options.value" v-for='(options,optionIndex) in items.options' :key='optionIndex'>{{options.label}}</el-option>
            </iSelect>
          </template>
          <template v-else-if='items.type == "input" && !notEdit'>
            <iInput v-model="scope.row[items.props]"></iInput>
          </template>
          <template v-else>{{scope.row[items.props]}}</template>
          </template>
      </el-table-column>
    </template>
  </el-table>
</template>
<script>
import {icon,iSelect,iInput} from 'rise'
import {_getMathNumber} from '@/utils'
import {getAallPrice,Aprice,Bprice} from 'rise/supplier/quotationdetail/components/costsummary/components/data'
export default{
  components:{icon,iSelect,iInput},
  props:{
    tableData:{type:Array},
    tableTitle:{type:Array},
    tableLoading:{type:Boolean,default:false},
    selection:{type:Boolean,default:true},
    height:{type:Number||String},
    activeItems:{type:String,default:'b'},
    radio:{type:Boolean,default:false},// 是否单选
    tableIndexString:{
      type:String,
      default:''
    },
    indexKey:Boolean,
    notEdit:Boolean
  },
  inject:['vm'],
  data(){
    return {
      Aprice,
      Bprice
    }
  },
  methods:{
    getAallPrice(a,b){
      return getAallPrice(a,b)
    },
    hasList(list){
      if(list && list.length>0 && list[0].list){
        return false
      }else {
        return true
      }
    },
    handleSelectionChange(val){
      if (this.radio) {
        if (val.length > 1) {
        var duoxuans=val.pop();
        this.handleSelectArr=val.pop();
        this.$refs.moviesTable.clearSelection()
        this.$refs.moviesTable.toggleRowSelection(duoxuans)
        } else {
        this.$emit('handleSelectionChange',val)
        }
      }else{
        this.$emit('handleSelectionChange',val)
      }
    },
    openPage(e){
      this.$emit('openPage',e)
    },	
    activeTop(e){
      this.$emit('activeTop',e)
    },
    updateSlot(e,a){
      this.$emit('updateSlot',[e,a])
    },
    /**
     * @description: 获取成本展示 
     * @param {*}
     * @return {*}
     */    
    getPersion(a=0,b=0){
      return _getMathNumber(`${b}/${a}`)
    }	
  }
}
</script>
<style lang='scss' scoped>
  .openLinkText{
    color:$color-blue;
    text-decoration: underline;
  }
  .radio{
    ::v-deep thead .el-table-column--selection .cell {
    display: none;
	}
  }
</style>