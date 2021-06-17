<!--
 * @Author: Luoshuang
 * @Date: 2021-05-27 16:26:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-17 11:14:35
 * @Description: 
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\sampleDeliveryProgress\tableList.vue
-->

<template>
  <div class="ptof-table">
    <el-table fit tooltip-effect='light' :height="height" :data='tableData' v-loading='tableLoading' @selection-change="handleSelectionChange" :empty-text="$t('LK_ZANWUSHUJU')" ref="moviesTable" >
      <el-table-column v-if="selection" type='selection' width="50" align='center'></el-table-column>
      <el-table-column v-if='index' type='index' width='50' align='center' :label='indexLabel'></el-table-column>
      <template v-for="(items,index) in tableTitle">
        <!----------------------可以进行编辑的列，若不编辑则正常展示------------------------>
        <el-table-column :key="index" align='center' :width="items.width" :show-overflow-tooltip='items.tooltip' v-if='editableItems.includes(items.props)' :prop="items.props" :label="items.key ? $t(items.key) : items.name" >
          <template slot-scope="scope">
            <template v-if="isEdit">
              <iInput v-if="selectedItems.includes(scope.row.partNum) && items.type == 'input'" v-model="scope.row[items.props]" />
              <iSelect v-else-if="selectedItems.includes(scope.row.partNum) && items.type == 'select'" v-model="scope.row[items.props]" >
                <el-option
                  v-for="item in items.selectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </iSelect>
              <span v-else>{{ scope.row[items.props] }}</span>
            </template>
            <template slot-scope="scope" v-else>
              <span>{{ scope.row[items.props] }}</span>
            </template>
          </template>
        </el-table-column>
        <!----------------------需要高亮的列并且带有打开详情事件------------------------>
        <el-table-column :key="index" align='center' :width="items.width" :show-overflow-tooltip='items.tooltip' v-else-if='items.props == activeItems' :prop="items.props" :label="items.key ? $t(items.key) : items.name">
          <template slot-scope="row"><span class="openLinkText cursor" @click="openPage(row.row)">{{activeItems == 'priceList' ? (currentStatus == '09' || currentStatus == '10') ? '查看报价' :`${$t('LK_JINGRUBJ')}` : row.row[activeItems]}}</span></template>
        </el-table-column>
        <!-------------------------正常列--------------------------->
        <el-table-column :key="index" align='center' :width="items.width" :show-overflow-tooltip='items.tooltip'  v-else :label="items.key ? $t(items.key) : items.name" :prop="items.props"></el-table-column>
        
      </template>
    </el-table>
  </div>
</template>
<script>
import {iInput, iSelect} from 'rise';
export default{
  components:{iInput, iSelect},
  props:{
    tableData:{type:Array},
    tableTitle:{type:Array},
    tableLoading:{type:Boolean,default:false},
    selection:{type:Boolean,default:false},
    height:{type:Number||String},
    activeItems:{type:String,default:''},
    isEdit:{type:Boolean,default:false},
    editableItems:{type:Array,default:() => []},
    selectedItems:{type:Array,default:() => []},
    showSummary:{type:Boolean,default:false},
    currentStatus:{type:String},
    index:{type:Boolean,default:true},
    indexLabel: {
      type: String,
      default: '#'
    },
  },
  inject:['vm'],
  methods:{
    handleSelectionChange(val){
      this.$emit('handleSelectionChange',val)
    },
    openPage(e, round){
      this.$emit('openPage', e, round)
    },
    // 获取零件的报价状态
    getQuotationStatus(row, props) {
      return (row.roundQuotationInfoList?.find(item => item.round === props) || {}).quotationStatus || ''
    },
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
  .ptof-table {
    ::v-deep .openLinkText {
      text-decoration: underline;
    }
  }
  .weibaojia-wrapper {
    width: 17px;
    padding: 5px 0;
    margin: 0 auto;
  }
  .weibaojia {
    background: rgba(23, 99, 247,1);
    width: 17px;
    height: 1px;
  }
</style>

<style lang="scss">
.tooltip {
  border:none !important;
  box-shadow: 0px 3px 10px rgba(27, 29, 33, 0.16);
}
</style>