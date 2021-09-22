import { Table } from 'element-ui'
import TableBody from 'element-ui/packages/table/src/table-body'

TableBody.methods.handleClick = function (event, row) {
  this.table.toggleRowSelection(row)
  this.table.$emit("select", (this.store.states.selection || []).slice(), row)
  this.store.commit("setCurrentRow", row)
  this.handleEvent(event, row, "click")
}

Table.components.TableBody = TableBody

export default Table