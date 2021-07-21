<!--
 * @Author: Luoshuang
 * @Date: 2021-06-29 11:09:14
 * @LastEditors: Luoshuang
 * @LastEditTime: 2021-07-15 16:33:53
 * @Description: DB零件-报价成本汇总-报价分析
 * @FilePath: \front-modules\web\quotationdetail\components\costsummary\components\quotationAnalysis.vue
-->

<template>
  <iCard :title="language('BAOJIAFENXI','报价分析')">
    <el-table class="baojiaTable" ref="multipleTable" :span-method="arraySpanMethod" fit tooltip-effect='light' :height="height" :data='dbDetailList' v-loading='tableLoading' :empty-text="language('ZANWUSHUJU', '暂无数据')" >
      <el-table-column type='index' width='50' align='center' label='#'>
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column prop="name" align='center' :label="language('XIANGMULEIXING', '项目类型')"></el-table-column>
      <el-table-column prop="fee" align='center' :label="language('JINE', '金额')">
        <el-table-column prop="seaPrice" align='center' :label="language('HAIYUN', '海运')">
          <template slot-scope="scope">
            <span v-if="disabled">{{scope.row.type === 'select' ? scope.row.seaPrice ?language('SHI', '是'): language('FOU', '否') : scope.row.type === 'date' ? moment(scope.row.seaPrice).format('YYYY-MM-DD') : scope.row.seaPrice}}</span>
            <iSelect v-else-if="scope.row.type === 'select'" v-model="scope.row.seaPrice">
              <el-option :value="true" :label="language('SHI', '是')"></el-option>
              <el-option :value="false" :label="language('FOU', '否')"></el-option>
            </iSelect>
            <iDatePicker v-else-if="scope.row.type === 'date'" value-format="" v-model="scope.row.seaPrice" :class="scope.row.sortOrder === 13 && 'withRequire'"></iDatePicker>
            <iInput v-else :value="scope.row.seaPrice" :class="scope.row.isRequire && 'withRequire'" @input="val => onChangeInput(val, scope.row, 'seaPrice')" ></iInput>
            <!-- <span v-if="scope.row.isRequire" style="color:red;">*</span> -->
          </template>
        </el-table-column>
        <el-table-column prop="airPrice" align='center' :label="language('KONGYUN', '空运')">
          <template slot-scope="scope">
            <span v-if="disabled || scope.row.noairPrice">{{scope.row.airPrice}}</span>
            <iInput v-else :value="scope.row.airPrice" @input="val => onChangeInput(val, scope.row, 'airPrice')" ></iInput>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="remark" align='center' :label="language('BEIZHU', '备注')">
        <template slot-scope="scope">
          <span v-if="disabled || scope.row.remarkDisabled">{{scope.row.remark}}</span>
          <iInput v-else v-model="scope.row.remark" :default-value="scope.row.remarkDefault"></iInput>
        </template>
      </el-table-column>
    </el-table>
  </iCard>
</template>

<script>
import { iCard, iSelect, iDatePicker, iInput } from 'rise'
import {tableTitleDB,tableDataDB} from './data'
import moment from 'moment'
export default {
  components: {iCard, iSelect, iDatePicker, iInput},
  props: {
    disabled: {type:Boolean, default:false},
    dbDetailList: {type:Array, default: []}
  },
  data() {
    return {
      tableTitle: tableTitleDB,
      tableData: tableDataDB,
      moment
    }
  },
  methods: {
    onChangeInput(val, params, type){
      if (params.sortOrder === 14) {
        this.$set(params, type, val)
      }else if(/^\d*\.?\d*$/.test(val)) {
        this.$set(params, type, val.indexOf('.')>0 ? val.slice(0,val.indexOf('.')+3) : val)
      }
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 13) {
        if (columnIndex === 2) {
          return [1, 3];
        } 
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.baojiaTable {
  ::v-deep .el-table__row .el-input {
    width: 80%;
    margin: 0 auto;
  }
  ::v-deep .el-table__row:last-child .el-input {
    width: 94%;
  }
}
.withRequire::after {
  content: '*';
  position: absolute;
  color: red;
  margin-left: 5px;
}
</style>