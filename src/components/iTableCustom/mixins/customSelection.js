export default {
  methods: {
    /*-----------------------------------------------------------------------------------------
    ---------------------------------------下面是自定义级联复选框的------------------------------
    ------------------------------------------------------------------------------------------*/
    handleCheckedAll(val) {
      this.tableData.forEach((e) => {
        e.checked = val
        e.isIndeterminate = false
      })
      this.indeterminateAll = false

      const returnData = val ? this.tableData : []
      this.$emit('handle-selection-change', returnData, {
        checked: val,
        checkedAll: val,
        rows: this.tableData
      })
    },
    handleCheckedRow(val, row) {
      const { checkStrictly } = this.customSelectionOption
      if (!checkStrictly) {
        const childs = this.getChildRows(row)
        if (childs.length > 0) {
          childs.forEach((e) => {
            e.checked = val
            e.isIndeterminate = false
          })
        }
      }
      if (!val) {
        row.isIndeterminate = false
      }
      // 如果是取消选中
      if (!checkStrictly) {
        this.setParentChecked(row.parentUniqueId)
      }

      // 头部全选反选
      if (!checkStrictly) {
        const checkedData = this.tableData.filter((e) => e.checked)
        this.indeterminateAll =
          checkedData.length > 0 && checkedData.length !== this.tableData.length
        this.checkedAll = checkedData.length === this.tableData.length
      }

      const returnProptities = {
        checked: val,
        isCheckedAll: false,
        row
      }
      if (this.emitHalfSelection) {
        this.$emit(
          'handle-selection-change',
          this.tableData.filter((e) => e.checked),
          returnProptities
        )
      } else {
        this.$emit(
          'handle-selection-change',
          this.tableData.filter((e) => e.checked && !e.isIndeterminate),
          returnProptities
        )
      }
    },
    // 手动设置选中状态
    handleToggleSelectedRow(val, row) {
      const filterRow = this.tableData.filter(
        (e) => e[this.rowKey] === row[this.rowKey]
      )
      if (filterRow.length > 0) {
        filterRow[0].checked = val
        this.handleCheckedRow(val, row)
      }
    },
    handleToggleSelectedAll(val) {
      // this.handleCheckedAll(val)
      this.tableData.forEach((e) => {
        e.checked = val
        e.isIndeterminate = false
      })
      this.indeterminateAll = false
      this.checkedAll = val
    },
    // 设置父级反选
    setParentChecked(parentUniqueId) {
      if (parentUniqueId) {
        const parentFilters = this.tableData.filter(
          (e) => e.uniqueId === parentUniqueId
        )
        if (parentFilters.length > 0) {
          const parent = parentFilters[0]
          //  所有子集
          const parentAllChild = this.tableData.filter(
            (e) => e.parentUniqueId === parentUniqueId
          )
          // 包括半选和全选
          const parentAllChildChecked = this.tableData.filter(
            (e) => e.parentUniqueId === parentUniqueId && e.checked
          )
          // 只是半选
          const parentAllChildIndeterminate = parentAllChildChecked.filter(
            (e) => e.isIndeterminate
          )
          const childLength = parentAllChild.length
          const CheckedLength = parentAllChildChecked.length
          const IndeterminateLength = parentAllChildIndeterminate.length
          if (CheckedLength > 0) {
            if (CheckedLength === childLength) {
              parent.checked = true
              parent.isIndeterminate = false
            }
            if (CheckedLength < childLength) {
              parent.checked = true
              parent.isIndeterminate = true
            }
            if (
              IndeterminateLength > 0 &&
              IndeterminateLength < CheckedLength
            ) {
              parent.isIndeterminate = true
            }
          } else {
            parent.isIndeterminate = false
            parent.checked = false
          }
          this.setParentChecked(parent.parentUniqueId)
        }
      }
    }
  }
}
