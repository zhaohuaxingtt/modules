<!--
 * @Author: Luoshuang
 * @Date: 2021-06-29 11:09:14
 * @LastEditors: Luoshuang
 * @LastEditTime: 2021-07-01 19:22:32
 * @Description: DB零件-报价成本汇总-报价分析
 * @FilePath: \front-modules\web\quotationdetail\components\costsummary\components\quotationAnalysis.vue
-->

<template>
  <iCard :title="language('BAOJIAFENXI','报价分析')">
    <el-table ref="multipleTable" :span-method="arraySpanMethod" fit tooltip-effect='light' :height="height" :data='dbDetailList' v-loading='tableLoading' :empty-text="language('ZANWUSHUJU', '暂无数据')" >
      <el-table-column type='index' width='50' align='center' label='#'>
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column prop="name" align='center' :label="language('XIANGMULEIXING', '项目类型')"></el-table-column>
      <el-table-column prop="fee" align='center' :label="language('JINE', '金额')">
        <el-table-column prop="seaPrice" align='center' :label="language('HAIYUN', '海运')">
          <template slot-scope="scope">
            <span v-if="disabled">{{scope.row.seaPrice}}</span>
            <iSelect v-else-if="scope.row.type === 'select'" v-model="scope.row.seaPrice">
              <el-option :value="true" label="是"></el-option>
              <el-option :value="false" label="否"></el-option>
            </iSelect>
            <iDatePicker v-else-if="scope.row.type === 'date'" value-format="" v-model="scope.row.seaPrice"></iDatePicker>
            <iInput v-else v-model="scope.row.seaPrice" ></iInput>
          </template>
        </el-table-column>
        <el-table-column prop="airPrice" align='center' :label="language('KONGYUN', '空运')">
          <template slot-scope="scope">
            <span v-if="disabled || scope.row.noairPrice">{{scope.row.airPrice}}</span>
            <iInput v-else v-model="scope.row.airPrice" ></iInput>
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
import {tableTitleDB,tableDataDB, mockData} from './data'
export default {
  components: {iCard, iSelect, iDatePicker, iInput},
  props: {
    disabled: {type:Boolean, default:false},
    dbDetailList: {type:Array, default: []}
  },
  data() {
    return {
      tableTitle: tableTitleDB,
      tableData: tableDataDB
    }
  },
  methods: {
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

</style>