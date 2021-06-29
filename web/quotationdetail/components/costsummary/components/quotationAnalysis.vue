<!--
 * @Author: Luoshuang
 * @Date: 2021-06-29 11:09:14
 * @LastEditors: Luoshuang
 * @LastEditTime: 2021-06-29 15:28:31
 * @Description: DB零件-报价成本汇总-报价分析
 * @FilePath: \front-modules\web\quotationdetail\components\costsummary\components\quotationAnalysis.vue
-->

<template>
  <iCard :title="language('BAOJIAFENXI','报价分析')">
    <el-table ref="multipleTable" :span-method="arraySpanMethod" fit tooltip-effect='light' :height="height" :data='tableData' v-loading='tableLoading' :empty-text="language('ZANWUSHUJU', '暂无数据')" >
      <el-table-column type='index' width='50' align='center' label='#'>
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column prop="projectType" align='center' :label="language('XIANGMULEIXING', '项目类型')"></el-table-column>
      <el-table-column prop="fee" align='center' :label="language('JINE', '金额')">
        <el-table-column prop="sea" align='center' :label="language('HAIYUN', '海运')">
          <template slot-scope="scope">
            <span v-if="disabled">{{scope.row.sea}}</span>
            <iSelect v-else-if="scope.row.type === 'select'" v-model="scope.row.sea"></iSelect>
            <iDatePicker v-else-if="scope.row.type === 'date'" v-model="scope.row.sea"></iDatePicker>
            <iInput v-else v-model="scope.row.sea" ></iInput>
          </template>
        </el-table-column>
        <el-table-column prop="sky" align='center' :label="language('KONGYUN', '空运')">
          <template slot-scope="scope">
            <span v-if="disabled || scope.row.noSky">{{scope.row.sky}}</span>
            <iInput v-else v-model="scope.row.sky" ></iInput>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="memo" align='center' :label="language('BEIZHU', '备注')">
        <template slot-scope="scope">
          <span v-if="disabled || scope.row.memoDisabled">{{scope.row.memo}}</span>
          <iInput v-else v-model="scope.row.memo" :default-value="scope.row.memoDefault"></iInput>
        </template>
      </el-table-column>
    </el-table>
  </iCard>
</template>

<script>
import { iCard, iSelect, iDatePicker, iInput } from 'rise'
import {tableTitleDB,tableDataDB} from './data'
export default {
  components: {iCard, iSelect, iDatePicker, iInput},
  props: {
    disabled: {type:Boolean, default:false}
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