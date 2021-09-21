import { Table } from 'element-ui'
import TableBody from 'element-ui/packages/table/src/table-body'

TableBody.methods.handleClick = function (event, row) {
  const targetEl = event.srcElement || event.target
  const preventTagNames = ["INPUT", "SVG"]
  const preventClassNames = ["link", "cursor"]
  if (preventTagNames.some(tagName => targetEl.tagName === tagName)) return
  if (preventClassNames.some(className => (targetEl.className || "").toLowerCase().includes(className))) return

  this.table.toggleRowSelection(row)
  this.table.$emit("select", (this.store.states.selection || []).slice(), row)
  this.store.commit("setCurrentRow", row)
  this.handleEvent(event, row, "click")
}

Table.components.TableBody = TableBody

export default Table