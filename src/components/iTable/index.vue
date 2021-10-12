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

  const selectionColumn = this.table.columns.find(column => column.type === 'selection')
  if (selectionColumn && selectionColumn.selectable(row, this.store.states.data.indexOf(row))) {
    this.table.toggleRowSelection(row)
    this.table.$emit("select", (this.store.states.selection || []).slice(), row)
  }

  this.store.commit("setCurrentRow", row)
  this.handleEvent(event, row, "click")
}

export default {
  extends: Table,
  name: 'ElTable',
  components: { TableBody }
}
</script>