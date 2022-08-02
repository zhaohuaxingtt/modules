<!--
 * @Author: yuszhou
 * @Date: 2021-02-24 09:42:07
 * @LastEditTime: 2021-12-14 22:13:31
 * @LastEditors: Please set LastEditors
 * @Description: 零件签收-table组件。
 * @FilePath: \front-supplier\src\views\rfqManageMent\workingRfq\components\tableList\index.vue
-->
<template>
  <el-table class="table" fit tooltip-effect='light' :height="height" :data='tableData' v-loading='tableLoading' @selection-change="handleSelectionChange" :empty-text="language('ZANWUSHUJU', '暂无数据')" ref="moviesTable" :class="radio && 'radio'">
    <el-table-column v-if="selection && hasList(tableTitle)" type='selection' width="55" align='center'></el-table-column>
    <el-table-column v-if='indexKey && hasList(tableTitle)' type='index' width='50' align='center' label='#'>
      <template slot-scope="scope">
        {{tableIndexString+(scope.$index+1)}}
      </template>
    </el-table-column>
    <template v-for="items in tableTitle">
      <!----------------------A价------------------------>
      <el-table-column :key="items.key" align='center' :width="items.width" :show-overflow-tooltip='items.tooltip' v-if='items.props == "totalPrice"' :prop="items.props" :label="items.key ? (lang ? language(items.key, items.name) : $t(items.key)) : items.name">
        <template slot-scope="row">
          <!--钢材只显示A价--->
          <template v-if="isSteel">
            <span>{{row.row.totalPrice}}</span>
          </template>
          <!--在线竞价，显示一个定值，并且计算totalPrice--->
          <template v-else-if="roundIsOnlineBidding">
            <span>{{ row.row.biddingTotalPrice }}</span>
            <span v-show="false">{{getAallPrice(Aprice,row.row)}}</span>
          </template>
          <span v-else>{{ isEmptyPriceCompute(Aprice,row.row) ? row.row.totalPrice : getAallPrice(Aprice,row.row) }}</span>
        </template>
      </el-table-column>
      <!----------------------B价------------------------>
      <el-table-column :key="items.key" align='center' :width="items.width" :show-overflow-tooltip='items.tooltip' v-else-if='items.props == "totalPriceBprice"' :prop="items.props" :label="items.key ? (lang ? language(items.key, items.name) : $t(items.key)) : items.name">
        <template slot-scope="row">
          <span v-if="isSteel">{{ row.row.totalPrice }}</span>
          <!-- 如果onlinebidding 有回写B价，则显示B价--->
          <span v-else-if="row.row.biddingBPrice">{{row.row.biddingBPrice}}</span>
          <span v-else>{{ isEmptyPriceCompute(Aprice,row.row) && isEmptyPriceCompute(['packageCost','transportCost','operateCost'],row.row) ? row.row.totalPriceBprice : getBallPrice(Bprice,row.row) }}</span>
        </template>
      </el-table-column>
      <!----------------------需要高亮的列并且带有打开详情事件------------------------>
      <el-table-column :key="items.key" align='center' :width="items.width" :show-overflow-tooltip='items.tooltip' v-else-if='items.props == activeItems' :prop="items.props" :label="`${ items.seq ? items.seq + ' ' : '' }${ items.key ? (lang ? language(items.key, items.name) : $t(items.key)) : items.name }`">
        <template slot-scope="row"><span class="openLinkText cursor" @click="openPage(row.row)">{{row.row[activeItems]}}</span></template>
      </el-table-column>
      <!----------------------需要高亮的列并且带有打开详情事件------------------------>
      <el-table-column :key="items.key" align='center' :width="items.width" :show-overflow-tooltip='items.tooltip' v-else-if='items.props == "isSvwAssignPriceParts"' :prop="items.props" :label="`${ items.seq ? items.seq + ' ' : '' }${ items.key ? (lang ? language(items.key, items.name) : $t(items.key)) : items.name }`">
        <template slot-scope="row">
          <span v-if='notEdit'>{{row.row[items.props]?"是":"否"}}</span>
          <iSelect v-else v-model="row.row[items.props]" @change="$emit('handleChangeByIsSvwAssignPriceParts')">
            <el-option :value="options.value" v-for='(options,optionIndex) in items.options' :key='optionIndex' :label='options.label'></el-option>
          </iSelect>
        </template>
      </el-table-column>
      <el-table-column :key="items.key" align='center' :width="items.width" :show-overflow-tooltip='items.tooltip' v-else-if='items.props == "specialDeviceCost" && items.type === "select"' :prop="items.props" :label="`${ items.seq ? items.seq + ' ' : '' }${ items.key ? (lang ? language(items.key, items.name) : $t(items.key)) : items.name }`">
        <template slot-scope="row">
          <span v-if='notEdit'>{{row.row[items.props]?"是":"否"}}</span>
          <iSelect v-else v-model="row.row[items.props]">
            <el-option :value="options.value" v-for='(options,optionIndex) in items.options' :key='optionIndex' :label='options.label'></el-option>
          </iSelect>
        </template>
      </el-table-column>
      <!----------------------需要进行排序的列------------------------>
      <el-table-column :key="items.key" align='center' :width="items.width"  v-else-if='items.props == "paixu"'>
        <tempalte slot-scope="scope">
          <span @click="updateSlot(scope.row,0)" v-if='scope.row.recordId && parseInt(scope.row.recordId)'>
            <icon symbol class="cursor" name='iconliebiaoyizhiding' ></icon>
          </span>
          <span @click="updateSlot(scope.row,1)" v-else>
            <icon symbol class="cursor" name='iconliebiaoweizhiding'></icon>
          </span>
        </tempalte>
      </el-table-column>
      <el-table-column :key="items.key" align='center' :width="items.width" :show-overflow-tooltip='items.tooltip'  v-else :label="`${ items.seq ? items.seq + ' ' : '' }${ items.key ? groupTileTranslate(items) : items.name }`" :prop="items.props" :label-class-name="items.labelClassName">
        <template slot="header" >
          <el-tooltip effect="light"  :content="`${ items.seq ? items.seq + ' ' : '' }${ items.key ? groupTileTranslate(items) : items.name }`">
            <span>
              {{`${ items.seq ? items.seq + ' ' : '' }${ items.key ? groupTileTranslate(items) : items.name }`}}
            </span>
          </el-tooltip>
        </template>
        <!----------------------------存在二级表头的情况------------------------------->
        <template v-if='items.list && items.list.length > 0'>
           <template v-for="(itemss,indexs) in items.list">
              <el-table-column v-if="selection && itemss.props == 'selection'" :key="indexs" type='selection' width="55" align='center'></el-table-column>
              <el-table-column v-else-if='indexKey && itemss.props == "index"' :key="indexs" type='index' width='50' align='center' label='#'>
                <template slot-scope="scope">{{tableIndexString+(scope.$index+1)}}</template>
              </el-table-column>
              
              <!----------------------------物料费用展示------------------------>
              <el-table-column v-else-if="itemss.props == 'materialPersent'" :key="indexs" align='center' :width="itemss.width" :show-overflow-tooltip='itemss.tooltip'  :label="itemss.key ? (lang ? language(itemss.key, items.name) : $t(itemss.key)) : itemss.name" :prop="itemss.props">
                <template slot-scope="scope">
                  <span v-if='notEdit'>
                    {{getPersion(scope.row.indirectMaterialCost,scope.row.materialCost)}}
                  </span>
                  <iInput v-else :value="getPersion(scope.row.indirectMaterialCost,scope.row.materialCost)"></iInput>
                </template>
              </el-table-column>
              <el-table-column v-else :key="indexs" align='center' :width="itemss.width" :show-overflow-tooltip='itemss.tooltip'  :label="itemss.key ? (lang ? language(itemss.key, itemss.name) : $t(itemss.key)) : itemss.name" :prop="itemss.props">
                  <!----------------------------如果是展示select 或者input------------------------>
                  <template slot="header">
                    <el-tooltip :content="itemss.key ? (lang ? language(itemss.key, itemss.name) : $t(itemss.key)) : itemss.name" effect='light'>
                      <span class="labelHader">
                        {{itemss.key ? (lang ? language(itemss.key, itemss.name) : $t(itemss.key)) : itemss.name}}
                      </span>
                    </el-tooltip>
                  </template>
                  <tempalte slot-scope="scope">
                    <template v-if='itemss.type == "select"'>
                      <iSelect v-model="scope.row[itemss.props]" v-if='!notEdit'>
                          <el-option :value="options.code" v-for='(options,optionIndex) in items.options' :key='optionIndex' :label='options.name'></el-option>
                      </iSelect>
                      <span v-else>{{scope.row[itemss.props]}}</span>
                    </template>
                    <template v-else-if='itemss.type == "input"'>
                      <iInput v-model="scope.row[itemss.props]" v-if='!notEdit' @input="handleInput($event, scope.row, itemss.props, itemss)"></iInput>
                      <span v-else>{{scope.row[itemss.props]}}</span>
                    </template>
                    <template v-else>{{scope.row[itemss.props]}}</template>
                  </tempalte>
              </el-table-column>
           </template>
        </template>
        <!----------------------------如果是展示select 或者input------------------------>
        <template v-if='!items.list' slot-scope="scope">
          <template v-if='items.type == "select"'>
            <iSelect v-model="scope.row[items.props]" v-if='!notEdit' @change="$emit('handleSelectChange', $event, scope.row, items.props)">
              <el-option :value="options.value" v-for='(options,optionIndex) in items.options' :key='optionIndex' :label="options.name || options.label"></el-option>
            </iSelect>
            <span v-else>{{ items.showLabel ? showLabel(scope.row[items.props], items.options) : scope.row[items.props]}}</span>
          </template>
          <template v-else-if='items.type == "autocomplete"'>
            <el-autocomplete
              v-if="!notEdit"
              v-model="scope.row[items.props]"
              :fetch-suggestions="scope.row.autocompleteFn || items.autocompleteFn"
              @select="$emit('handleAutocompleteSelect', $event, scope.row, items.props)"
            >
              <template v-slot="scope">
                <el-tooltip class="item" effect="light" placement="right" :content="scope.item.value">
                  <span>{{ scope.item.value }}</span>
                </el-tooltip>
              </template>
            </el-autocomplete>
            <span v-else>{{ scope.row[items.props] }}</span>
          </template>
          <template v-else-if='items.type == "input"'>
            <iInput v-model="scope.row[items.props]" v-if='!notEdit || items.edit' @input="handleInput($event, scope.row, items.props, items)"></iInput>
            <span v-else>{{scope.row[items.props]}}</span>
          </template>
          <template v-else-if='items.type == "inputRate"'>
            <div class="flexVerticalCenter" v-if='!notEdit'>
              <iInput v-model="scope.row[items.props]" @input="handleInputByRate($event, scope.row, items.props)"></iInput><span class="margin-left5">%</span>
            </div>
            <span v-else>{{scope.row[items.props]}}</span>
          </template>
          <!---------------------------bidding---------------------------->
          <template v-else-if='items.props.indexOf("items") > -1'>
              <span v-if='scope.$index == 0'>{{(scope.row[items.props]).quotation}}</span>
              <span v-if='scope.$index == 1'>{{fixTo2((scope.row[items.props]).bidding)}}</span>
              <span v-if='scope.$index == 2' :class="{redClass:(scope.row[items.props]).isColor}">{{(scope.row[items.props]).result}}</span>
          </template>
          <template v-else>
            <span v-if="items.type === 'inputRate' && !notEdit">{{scope.row[items.props]}}{{ (scope.row[items.props] == null || scope.row[items.props] == "") && scope.row[items.props] !== 0  ? '' : '%' }}</span>
            <span v-else>{{ typeof filterProps[items.props] === "function" ? filterProps[items.props](scope.row[items.props]) : scope.row[items.props] }}</span>
          </template>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>
<script>
import {icon,iSelect,iInput} from 'rise'
import {_getMathNumber, numberProcessor} from '@/utils'
import {getAallPrice,Aprice,Bprice} from '../../../quotationdetail/components/costsummary/components/data'
import { uuidv4 } from "rise/web/aeko/quotationdetail/components/aPriceChange/components/data"
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
    notEdit:Boolean,
    filterProps: {
      type: Object,
      default: () => ({})
    },
    isSteel: {
      type: Boolean,
      default: false
    },
    roundIsOnlineBidding:{
      type:Boolean,
      default:false
    },
    lang: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    tableTitle() {
      this.$refs.moviesTable.$vnode.key = uuidv4()
      this.$forceUpdate()
    }
  },
  inject:['vm'],
  data(){
    return {
      Aprice,
      Bprice
    }
  },
  methods:{
    fixTo2(val){
      if(parseFloat(val)){
        return parseFloat(val).toFixed(2)
      }else{
        return val
      }
    },
    isEmptyPriceCompute(keys, row) {
      return keys.every(key => !row[key] || row[key] == 0)
    },
    /**
     * @description:组合表头翻译 
     * @param {*}
     * @return {*}
     */
    groupTileTranslate(items){
      return this.language(items.key, items.name)

      // if(items.props == 'materialSummary' || items.props == 'productionSummary' ||items.props == 'scrapSummary' ||items.props == 'manageSummary' || items.props == 'otherSummary' || items.props == 'profitSummary'){
      //   return this.language(items.key, items.name)
      // }else{
      //   return this.language(items.key, items.name)
      // }
    },
    getBallPrice(a,b){
      console.log("(Aprice.every(key => b[key] === null || b[key] === undefined))", (Aprice.every(key => b[key] === null || b[key] === undefined)))

      const result = (Aprice.every(key => !b[key] || b[key] == 0)) ? getAallPrice(a,b, "B", b.totalPrice) : getAallPrice(a,b)
      
      this.$set(b, "totalPriceBprice", result)
      return result
    },
    getAallPrice(a, b) {
      if (this.vm.initData) return b.totalPrice
      const result = getAallPrice(a,b)
      this.$set(b, "totalPrice", result)
      return result
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
    },
    handleInputByRate(value, row, key) {
      this.$set(row, key, numberProcessor(value, 2))
      this.$emit("handleInputByRate", value, row, key)
    },
    handleInput(value, row, key, column) {
      if (column.type === "input" && column.inputType === "decimal") {
        this.$set(row, key, numberProcessor(value, 2))
      }
      this.$emit("handleInput", value, row, key)
    },
    showLabel(value, options = []) {
      const current = options.find(item => item.value === value)
      if (current) {
        return current.name || current.label
      } else {
        return value
      }
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

.flexVerticalCenter {
  display: flex;
  align-items: center;
}
.redClass{
  color:red;
}

.table {
  ::v-deep td .cell {
    width: 100%!important;
  }
   .labelHader{
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
  ::v-deep .el-input,
  .el-select,
  .el-autocomplete  {
    width: 97% !important;
  }
}
</style>