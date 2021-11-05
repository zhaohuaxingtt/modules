<!--
 * @Author: ldh
 * @Date: 2021-04-22 12:34:50
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-07 15:58:35
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\tableList.vue
-->
<template>
  <el-table ref="table"   :class="singleSelect ? 'singleSelectTable' : ''"  tooltip-effect="light" :height="height" :data="tableData" :cell-class-name="cellClassName" v-loading="tableLoading" @selection-change="handleSelectionChange" :empty-text="$t('LK_ZANWUSHUJU')">
    <el-table-column v-if="selection" type="selection" width="30" align="center"  :fixed="fixed"></el-table-column>
    <el-table-column v-if="index" type="index" align="center" :label="indexLabel"  :fixed="fixed"></el-table-column>
    <template v-for="item in tableTitle">
      <el-table-column :key="item.updateKey || item.props" align="center" :label="`${ item.seq ? item.seq + ' ' : '' }${ item.key ? (lang ? language(item.key, item.name) : $t(item.key)) : item.name }`" :prop="item.props" :show-overflow-tooltip="item.tooltip" :width="item.width" :min-width="item.minWidth" :render-header="item.renderHeader" :fixed="item.fixed">
        <template v-if="$scopedSlots[item.props] || $slots[item.props]" v-slot="scope">
          <slot :name="item.props" v-bind="scope" ></slot>
          <!-- :\$index="scope.$index" :row="scope.row" -->
        </template>
        <template #header="scope">
          <el-popover
            placement="top"
            trigger="hover"
            popper-class="tableTitleTip"
            :visible-arrow="false"
            :disabled="!item.tipsKey">
            <p v-html="item.tipsLang ? language(item.tipsKey, item.tips) : $t(item.tipsKey)"></p>
            <p slot="reference">
              <span>{{ scope.column.label }}</span>
              <icon v-if="item.tipsKey" class="require margin-left4" symbol name="iconxinxitishi" />
              <i v-if="item.require" class="require margin-left3">*</i>
            </p>
          </el-popover>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script>
import { icon } from "rise"

export default {
  components: { icon },
  props:{
    tableData: {
      type: Array,
      default: () => ([])
    },
    tableTitle: {
      type: Array,
      default: () => ([])
    },
    tableLoading: {
      type: Boolean,
      default: false
    },
    selection: {
      type: Boolean,
      default: true
    },
    index: {
      type: Boolean,
      default: false
    },
    indexLabel: {
      type: String,
      default: '#'
    },
    height: {
      type: String
    },
    cellClassName: {
      type: Function
    },
    lang: {
      type: Boolean,
      default: false
    },
    fixed: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    handleSelectionChange(list){
      this.$emit('handleSelectionChange', list)
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  ::v-deep .el-input {
    width: 97%; // 解决tooltip异常弹出
  }
}
.require {
  color: red;
}

.singleSelectTable {
  ::v-deep .el-table__header-wrapper .el-checkbox {
    display: none;
  }
}
</style>