<template>
  <el-table
    tooltip-effect="light"
    :height="height"
    :data="realTableData"
    v-loading="loading"
    :row-key="rowKey || 'uniqueId'"
    @selection-change="handleSelectionChange"
    @cell-click="handleCellClick"
    :empty-text="$t('LK_ZANWUSHUJU')"
    ref="customTable"
  >
    <template v-for="(item, index) in columns">
      <el-table-column
        :key="index"
        v-if="['selection', 'index'].includes(item.type)"
        :type="item.type"
        :label="item.i18n ? $t(item.i18n) : item.label"
        :width="item.width || 50"
        align="center"
      />
      <el-table-column
        v-else
        :key="index"
        :type="item.type"
        :align="item.align || 'center'"
        :header-align="item.headerAlign"
        :show-overflow-tooltip="item.tooltip"
        :prop="item.prop"
        :label="item.i18n ? $t(item.i18n) : item.label"
        :width="item.width || 'auto'"
      >
        <template slot-scope="scope">
          <div @click="handleEmit(item, scope.row)">
            <i-table-column
              v-if="item.customRender || item.type === 'expanded'"
              :scope="scope"
              :column="item"
              :custom-render="item.customRender"
              :extra-data="extraData"
              :prop="item.prop"
            />
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </div>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script>
import iButton from '../iButton/index.vue'
import iSelect from '../iSelect/index.vue'
import iInput from '../iInput/index.vue'
import iRadio from '../iRadio/index.vue'
import Icon from '../icon/index.vue'
import iTableColumn from './iTableColumn'

export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { iTableColumn, iButton, iSelect, iInput, iRadio, Icon },

  props: {
    data: {
      type: Array,
      default: function() {
        return []
      },
    },
    columns: {
      type: Array,
      default: function() {
        return []
      },
    },
    loading: { type: Boolean, default: false },
    height: { type: Number || String },
    extraData: {
      type: Object,
      default: function() {
        return {}
      },
    },
    treeExpand: {
      type: Object,
    },
    rowKey: {
      type: String,
    },
    defaultExpand: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    realTableData() {
      if (this.treeExpand) {
        return this.tableData.filter((e) => e.visible)
      }
      return this.tableData.map((e, index) => {
        return { ...e, uniqueId: index + '' }
      })
    },
  },
  data() {
    return {
      tableData: [],
      selectedRow: [],
    }
  },
  watch: {
    data() {
      this.getTableData()
    },
  },
  created() {
    this.getTableData()
  },

  methods: {
    handleSelectionChange(val) {
      this.selectedRow = val
      this.$emit('handle-selection-change', val)
    },
    handleEmit(item, row) {
      if (item.emit) {
        this.$emit(item.emit, row)
      }
    },
    getTableData() {
      if (this.treeExpand) {
        this.tableData = this.getTreeTableData(this.data)
      } else {
        this.tableData = this.data
      }
    },
    getTreeTableData(data, parentKey, res) {
      parentKey = parentKey || ''
      res = res || []
      const { childrenKey } = this.treeExpand
      for (let i = 0; i < data.length; i++) {
        const row = data[i]
        const uniqueId = parentKey ? `${parentKey}-${i}` : `${i}`
        let hasChild = Object.hasOwnProperty.call(row, childrenKey)
        if (hasChild && (!row[childrenKey] || row[childrenKey].length === 0)) {
          hasChild = false
        }
        const visible = uniqueId.includes('-') ? this.defaultExpand : true
        const resItem = {
          uniqueId,
          isLeaf: !hasChild,
          expanded: this.defaultExpand,
          visible: visible,
          parentUniqueId: parentKey,
        }

        for (const k in row) {
          if (Object.hasOwnProperty.call(row, k)) {
            const item = row[k]
            if (k !== childrenKey) {
              resItem[k] = item
            }
          }
        }
        res.push(resItem)
        if (
          Object.hasOwnProperty.call(row, childrenKey) &&
          row[childrenKey] &&
          row[childrenKey].length > 0
        ) {
          this.getTreeTableData(row[childrenKey], uniqueId, res)
        }
      }
      return res
    },
    handleCellClick(row, column) {
      if (this.treeExpand) {
        if (this.treeExpand.expandKey === column.property) {
          row.expanded = !row.expanded
          this.tableData.forEach((element) => {
            const isChildren =
              element.uniqueId.indexOf(row.uniqueId + '-') === 0
            if (row.expanded) {
              if (isChildren && element.parentUniqueId === row.uniqueId) {
                element.visible = row.expanded
                // element.expanded = row.expanded
              }
            } else {
              if (isChildren) {
                element.visible = row.expanded
                element.expanded = row.expanded
              }
            }
          })
        }
      }
    },
    expandAll() {
      // 全部展开
      if (this.treeExpand) {
        this.tableData.forEach((element) => {
          element.expanded = true
          element.visible = true
        })
      }
    },
    collapseAll() {
      // 全部收起
      if (this.treeExpand) {
        this.tableData.forEach((element) => {
          if (element.uniqueId.indexOf('-') > -1) {
            element.expanded = false
            element.visible = false
          } else {
            element.expanded = false
          }
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
