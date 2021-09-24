<script>
import { Table } from 'element-ui'
import TableBody from 'element-ui/packages/table/src/table-body'
// import { getCell, getColumnByCell } from 'element-ui/packages/table/src/util'

TableBody.methods.handleClick = function(event, row) {
  // const cell = getCell(event)
  // let column = undefined
  // if (cell) {
  //   column = getColumnByCell(this.table, cell)
  // }

  // if (!this.table.columns.some(column => column.type === 'selection')) return
  // if (typeof this.table.selectRowDisabeld === "function" && this.table.selectRowDisabeld(row, column)) return
  this.table.toggleRowSelection(row)
  this.table.$emit("select", (this.store.states.selection || []).slice(), row)
  this.store.commit("setCurrentRow", row)
  this.handleEvent(event, row, "click")
}

export default {
  extends: Table,
  name: 'ElTable',
  components: { TableBody },
  // props: {
  //   selectRowDisabeld: Function
  // }
}
</script>