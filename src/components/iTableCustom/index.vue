<template>
	<div
		class="i-table-custom"
		:class="{
			'single-choise': singleChoice,
			'disable-children-selection': disableChildrenSelection,
			'i-table-custom-expand': treeExpand,
		}"
		:style="{ minHeight: minHeight }"
	>
		<el-table
			tooltip-effect="light"
			:height="height"
			:max-height="maxHeight"
			:data="realTableData"
			v-loading="loading"
			:row-key="rowKey || 'uniqueId'"
			:highlight-current-row="highlightCurrentRow"
			:empty-text="$t('LK_ZANWUSHUJU')"
			ref="theCustomTable"
			:row-class-name="getRowClassNameDefault"
			:row-style="getRowStyle"
			:cell-class-name="getCellClassName"
			@selection-change="handleSelectionChange"
			@select="handleSelect"
			@select-all="handleAllSelect"
			@current-change="handleCurrentChange"
			@cell-click="handleCellClick"
			@sort-change="handleSortChange"
			fit
			:span-method="getSpanMethod"
			:stripe="stripe"
			:header-cell-class-name="handleHeaderCellClassName"
			@row-click="rowClick"
		>
			<template v-for="(item, index) in columns">
				<el-table-column
					:key="index"
					v-if="['selection', 'index'].includes(item.type)"
					:reserve-selection="item.reserveSelection || false"
					:type="item.type"
					:label="item.i18n ? $t(item.i18n) : item.label"
					:width="item.width || '50'"
					:min-width="item.minWidth"
					:align="item.align || 'center'"
					:selectable="handleSelectable"
					:fixed="item.fixed"
				/>
				<el-table-column
					:key="index"
					v-else-if="item.type === 'setting'"
					:width="item.width || '30'"
					:min-width="item.minWidth"
					:align="item.align || 'center'"
					:fixed="item.fixed"
				>
					<template slot="header">
						<div class="table-setting" @click="sortShow = true">
							<icon symbol name="iconzidingyi" />
						</div>
					</template>
				</el-table-column>
				<el-table-column
					:key="index"
					v-else-if="['customSelection'].includes(item.type)"
					reserve-selection
					:type="item.type"
					:label="item.i18n ? $t(item.i18n) : item.label"
					:width="item.width || '50'"
					:min-width="item.minWidth || '50'"
					:align="item.align || 'center'"
					:selectable="handleSelectable"
					:fixed="item.fixed"
				>
					<template slot="header" slot-scope="scope">
						<el-checkbox
							v-model="checkedAll"
							:indeterminate="indeterminateAll"
							@change="handleCheckedAll"
							:a="scope"
						/>
					</template>
					<template slot-scope="scope">
						<el-checkbox
							v-model="scope.row.checked"
							:indeterminate="scope.row.isIndeterminate"
							:disabled="scope.row.disabledChecked"
							@change="(val) => handleCheckedRow(val, scope.row)"
						>
						</el-checkbox>
					</template>
				</el-table-column>
				<el-table-column
					:key="index"
					v-else-if="['fullIndex'].includes(item.type)"
					:type="item.type"
					:label="item.i18n ? $t(item.i18n) : item.label"
					:width="item.width || '50'"
					:align="item.align || 'center'"
					:selectable="handleSelectable"
					:fixed="item.fixed"
				>
					<template slot-scope="scope">
						{{ getFullIndex(scope.row) }}
					</template>
				</el-table-column>
				<el-table-column
					v-else
					:render-header="item.headerRender"
					:key="index"
					:type="item.type"
					:align="item.align || 'center'"
					:header-align="item.headerAlign"
					:show-overflow-tooltip="false"
					:prop="item.prop"
					:label="item.i18n ? $t(item.i18n) : item.label"
					:sortable="item.sortable"
					:sort-method="item.sortMethod"
					:sort-by="item.sortBy"
					:sort-orders="item.sortOrders"
					:width="item.width ? item.width.toString() : ''"
					:min-width="item.minWidth ? item.minWidth.toString() : ''"
					:fixed="item.fixed"
				>
					<template slot-scope="scope">
						<template v-if="item.children">
							<el-table-column
								v-for="(subItem, subIndex) of item.children"
								:render-header="subItem.headerRender"
								:key="subIndex"
								:type="subItem.type"
								:align="subItem.align || 'center'"
								:header-align="subItem.headerAlign"
								:show-overflow-tooltip="subItem.tooltip"
								:prop="subItem.prop"
								:label="subItem.i18n ? $t(subItem.i18n) : subItem.label"
								:width="subItem.width ? subItem.width.toString() : ''"
								:min-width="subItem.minWidth ? subItem.minWidth.toString() : ''"
								:sortable="subItem.sortable"
								:sort-method="item.sortMethod"
								:sort-by="item.sortBy"
								:sort-orders="item.sortOrders"
							>
								<i-table-column
									v-if="subItem.customRender || subItem.type === 'expanded'"
									:scope="scope"
									:column="subItem"
									:custom-render="subItem.customRender"
									:extra-data="extraData"
									:prop="subItem.prop"
									:child-num-visible="childNumVisible"
								/>
								<span v-else>
									{{ scope.row[subItem.prop] }}
								</span>
							</el-table-column>
						</template>
						<div
							:class="{ 'custom-cell-tooltip': item.tooltip }"
							@mouseenter="customMouseenter"
							@mouseleave="customMouseleave"
							@click="handleEmit(item, scope.row)"
							v-else
						>
							<i-table-column
								v-if="item.customRender || item.type === 'expanded'"
								:scope="scope"
								:column="item"
								:custom-render="item.customRender"
								:extra-data="extraData"
								:prop="item.prop"
								:child-num-visible="childNumVisible"
							/>
							<span v-else>
								{{ scope.row[item.prop] }}
							</span>
						</div>
					</template>
				</el-table-column>
			</template>
		</el-table>
		<iTableHeaderSorter
			:data="columns"
			:show.sync="sortShow"
			:value="'value'"
			:label="'label'"
			:visiableKey="'hidden'"
			@callback="handleSaveSortCallback"
		/>
		<el-tooltip
			effect="light"
			placement="top"
			ref="customTableTooltip"
			popper-class="custom-table-popper"
		>
			<div
				slot="content"
				class="custom-table-popper-content"
				:style="{ width: tooltipWidth }"
			>
				{{ tooltipContent }}
			</div>
		</el-tooltip>
	</div>
</template>

<script>
import Icon from '../icon/index.vue'
import iTableColumn from './iTableColumn'
import iTableHeaderSorter from '../iTableHeaderSorter'
export default {
	// eslint-disable-next-line vue/no-unused-components
	components: {
		iTableColumn,
		Icon,
		iTableHeaderSorter,
	},
	props: {
		permissionKey: {
			type: String,
		},
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
		maxHeight: { type: Number || String },
		minHeight: { type: Number || String },
		extraData: {
			type: Object,
			default: function() {
				return {}
			},
		},
		// 多层级展开选项
		treeExpand: {
			type: Object,
		},
		rowKey: {
			type: String,
		},
		// 是否默认展开
		defaultExpand: {
			type: Boolean,
			default: false,
		},
		// 是否禁用子集选择
		disableChildrenSelection: {
			type: Boolean,
			default: false,
		},
		// 是否单选
		singleChoice: {
			type: Boolean,
			default: false,
		},
		// 是不是级联选择
		cascade: {
			type: Boolean,
			default: false,
		},
		// 使用自定义选择框
		customSelection: {
			type: Boolean,
			default: false,
		},
		// 使用自定义选择框, 是否要回传半选状态记录
		emitHalfSelection: {
			type: Boolean,
			default: true,
		},
		// 子元素数量是否显示
		childNumVisible: {
			type: Boolean,
			default: false,
		},
		// 行的class名
		rowClassName: {
			type: Function,
		},
		// 高亮当前行
		highlightCurrentRow: {
			type: Boolean,
			defalut: false,
		},
		defaultSelectedRows: {
			type: Array,
		},
		//合并列
		isColSpan: {
			type: Boolean,
			defalut: false,
		},
		spanMethod: {
			type: Function,
		},
		stripe: {
			type: Boolean,
			default: false,
		},
		isNavMenu: {
			type: Boolean,
			default: false,
		},
		tooltipWidth: {
			type: String,
			default: '100%',
		},
	},
	computed: {
		realTableData() {
			if (this.tableData) {
				return this.tableData.filter((e) => e.visible)
			}
			return []
		},
		isDefaultCheckedAll() {
			if (!this.customSelection) {
				return false
			}
			if (!this.defaultSelectedRows) {
				return false
			}
			if (this.data.length <= 0) {
				return false
			}
			if (!this.rowKey) {
				return false
			}
			if (this.defaultSelectedRows.length === 0) {
				return false
			}
			if (this.defaultSelectedRows.length < this.data.length) {
				return false
			}
			const dataKeys = this.data.map((e) => e[this.rowKey])
			const defaultCheckedKeys = this.defaultSelectedRows.map(
				(e) => e[this.rowKey]
			)

			const mergeKeys = [...new Set([...dataKeys, ...defaultCheckedKeys])]
			return mergeKeys.length === defaultCheckedKeys.length
		},
		theSetColumns() {
			return this.columns.filter((e) => !e.type)
		},
	},
	data() {
		return {
			tableData: [],
			selectedRows: [],
			checkedAll: false,
			indeterminateAll: false,
			defaultCheckedKeys: [],
			columnsSetVisible: false,
			columnViews: [],
			tableColumns: [],
			sortShow: false,
			tooltipContent: '',
		}
	},
	watch: {
		data() {
			this.getTableData()
		},
		defaultSelectedRows() {
			this.setDefaultDefaultCheckedKeys()
			this.getTableData()
		},
	},
	created() {
		this.setDefaultDefaultCheckedKeys()
		this.getTableData()
	},
	methods: {
		handleHeaderCellClassName({ columnIndex }) {
			if (this.columns && this.columns.length > columnIndex) {
				const column = this.columns[columnIndex]
				if (column.required) {
					return 'is-required'
				}
			}
		},
		setDefaultDefaultCheckedKeys() {
			if (this.defaultSelectedRows) {
				this.defaultCheckedKeys = this.getDefaultSelectedKeys(
					this.defaultSelectedRows || []
				)
			}
		},
		rowClick(row, column, event) {
			this.$emit('row-click', row, column, event)
		},
		handleSortChange(val) {
			this.$emit('handle-sort-change', val)
		},
		handleCurrentChange(val) {
			this.$emit('handle-current-change', val)
		},
		handleSelectionChange(val) {
			this.selectedRows = val
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
				this.tableData.forEach((e, index) => {
					e.uniqueId = index + ''
					e.visible = true
					e.parentUniqueId = null
					if (this.customSelection) {
						e.checked = false
						e.isIndeterminate = false
					}
					// 设置已选中值
					if (
						this.customSelection &&
						this.defaultCheckedKeys.includes(e[this.rowKey])
					) {
						e.checked = true
						this.selectedRows.push(e)
					}
				})
			}

			if (this.customSelection) {
				this.checkedAll = this.isDefaultCheckedAll
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
					childNum: (hasChild && row[childrenKey].length) || 0,
				}

				for (const k in row) {
					if (Object.hasOwnProperty.call(row, k)) {
						const item = row[k]
						if (k !== childrenKey) {
							resItem[k] = item
						}
					}
				}

				if (this.customSelection) {
					if (!Object.prototype.hasOwnProperty.call(row, 'checked')) {
						resItem.checked = false
					}
					resItem.isIndeterminate = false
					// 设置已选中值
					if (this.defaultSelectedRows) {
						if (this.defaultCheckedKeys.includes(row[this.rowKey])) {
							resItem.checked = true
							this.selectedRows.push(resItem)
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
					element.expanded = false
					if (element.uniqueId.indexOf('-') > -1) {
						element.visible = false
					}
				})
			}
		},
		toggleRowSelection(row, selected) {
			let toggleRow = row
			if (this.rowKey) {
				const filterRow = this.realTableData.filter(
					(e) => e[this.rowKey] === row[this.rowKey]
				)
				if (filterRow.length > 0) {
					toggleRow = filterRow[0]
				}
				if (selected) {
					if (
						this.selectedRows.filter(
							(e) => e[this.rowKey] === toggleRow[this.rowKey]
						).length === 0
					) {
						this.$refs.theCustomTable.toggleRowSelection(toggleRow, selected)
					}
				} else {
					this.$refs.theCustomTable.toggleRowSelection(toggleRow, selected)
				}
			} else {
				this.$refs.theCustomTable.toggleRowSelection(toggleRow, selected)
			}
		},
		toggleRowAndChildrenSelection(row, selected) {
			let toggleRow = row
			if (this.rowKey) {
				const filterRow = this.realTableData.filter(
					(e) => e[this.rowKey] === row[this.rowKey]
				)
				if (filterRow.length > 0) {
					toggleRow = filterRow[0]
				}
			}
			this.$refs.theCustomTable.toggleRowSelection(toggleRow, selected)
			const rowUniqueId = toggleRow.uniqueId
			const rowChildren = this.tableData.filter(
				(e) => e.uniqueId.indexOf(rowUniqueId + '-') === 0
			)
			if (rowChildren.length > 0) {
				rowChildren.forEach((e) => {
					this.$refs.theCustomTable.toggleRowSelection(e, selected)
				})
			}
		},
		toggleAllSelection() {
			this.$refs.theCustomTable.toggleAllSelection()
		},
		clearSelection() {
			this.$refs.theCustomTable.clearSelection()
		},
		handleSelectable(row) {
			if (
				this.disableChildrenSelection &&
				row.uniqueId &&
				row.uniqueId.indexOf('-') > 0
			) {
				return false
			}

			if (this.singleChoice && this.selectedRows.length === 0) {
				return true
			}
			if (this.singleChoice && this.selectedRows.length > 0) {
				if (this.selectedRows.indexOf(row) > -1) {
					return true
				} else {
					return false
				}
			}

			return true
		},
		handleSelect(selection, row) {
			this.$emit('select', selection, row)
		},
		handleAllSelect(selection) {
			this.$emit('select-all', selection)
		},
		getRowClassNameDefault({ row, rowIndex }) {
			let rowClass = ''
			if (this.rowClassName) {
				rowClass = this.rowClassName({ row, rowIndex })
			}
			if (row.visible) {
				rowClass += ' visible'
			} else {
				rowClass += ' hidden'
			}

			if (this.treeExpand && row.visible) {
				const index = this.tableData.filter((e) => e.visible).indexOf(row)
				rowClass += index % 2 === 0 ? ' odd' : ' even'
			}

			if (this.isNavMenu) {
				if (this.$route.fullPath === row.url) {
					rowClass += ' nav-active-menu'
				}
			}

			if (
				row.uniqueId === null ||
				row.uniqueId === undefined ||
				row.uniqueId.indexOf('-') === -1
			) {
				return `${rowClass} root-row`
			}

			return `${rowClass} row-child`
		},
		getRowStyle({ row }) {
			if (!row.visible) {
				return { display: 'none' }
			}
			return ''
		},
		getCellClassName({ column, columnIndex }) {
			if (column.showOverflowTooltip) {
				if (this.isColSpan && columnIndex === 0) {
					return 'bgColor cell-ellipsis'
				} else {
					return 'cell-ellipsis'
				}
			} else {
				if (this.isColSpan && columnIndex === 0) {
					return 'bgColor'
				}
				return 'cell-ellipsis'
			}
		},
		getFullIndex(row) {
			const uniqueIdArr = row.uniqueId.split('-')
			const newIndex = uniqueIdArr.map((e) => parseInt(e) + 1)
			return newIndex.join('.')
		},
		getChildRows(row) {
			return this.tableData.filter(
				(e) => e.uniqueId.indexOf(row.uniqueId + '-') === 0
			)
		},
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
				rows: this.tableData,
			})
		},
		handleCheckedRow(val, row) {
			const childs = this.getChildRows(row)
			if (childs.length > 0) {
				childs.forEach((e) => {
					e.checked = val
					e.isIndeterminate = false
				})
			}
			if (!val) {
				row.isIndeterminate = false
			}
			// 如果是取消选中
			this.setParentChecked(row.parentUniqueId)

			// 头部全选反选
			const checkedData = this.tableData.filter((e) => e.checked)
			this.indeterminateAll =
				checkedData.length > 0 && checkedData.length !== this.tableData.length
			this.checkedAll = checkedData.length === this.tableData.length
			const returnProptities = {
				checked: val,
				isCheckedAll: false,
				row,
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
		},
		getSpanMethod(val) {
			if (this.spanMethod) {
				return this.spanMethod(val)
			}
		},
		getDefaultSelectedKeys(data, res) {
			const { childrenKey } = this.treeExpand
			res = res || []
			for (let i = 0; i < data.length; i++) {
				const element = data[i]
				res.push(element[this.rowKey])
				if (element[childrenKey]) {
					this.getDefaultSelectedKeys(element[childrenKey], res)
				}
			}
			return res
		},
		/******************* 记忆列表 ********************/
		handleSaveSortCallback(val) {
			console.log('此处做table刷新', val)
		},
		queryTableColumns() {
			const userInfo = window.sessionStorage.getItem('userInfo') || ''
			if (userInfo) {
				const userData = JSON.parse(userInfo)
				const accountId = userData?.accountId
				const http = new XMLHttpRequest()
				const url = `/usercenterApi/web/selectDictByKeys`
				http.open('GET', url, true)
				http.setRequestHeader('content-type', 'application/json')
				http.onreadystatechange = () => {
					if (http.readyState === 4 && http.status == 200) {
						const response = JSON.parse(http.responseText).data
						if (response) {
							this.tableColumns = response
						} else {
							this.tableColumns = this.columns
						}
					} else {
						this.tableColumns = this.columns
					}
				}
				const requestData = {
					accountId,
					key: this.permissionKey,
				}
				http.send(JSON.stringify(requestData))
			}
		},
		/******************气泡框 Start****************** */

		customMouseenter($event) {
			const ele = $event.toElement

			const clientWidth = ele.clientWidth
			const scrollWidth = ele.scrollWidth
			if (clientWidth < scrollWidth) {
				this.tooltipContent = ele.innerText || ele.textContent
				const tooltip = this.$refs.customTableTooltip
				tooltip.referenceElm = ele
				tooltip.show()
			}
		},
		customMouseleave() {
			const tooltip = this.$refs.customTableTooltip
			if (tooltip) {
				tooltip.hide()
			}
		},
		/******************气泡框 end****************** */
	},
}
</script>

<style lang="scss" scoped>
::v-deep.i-table-custom {
	.el-table__column-resize-proxy,
	.el-loading-mask {
		z-index: 9;
	}
	max-width: 100%;
	&.disable-children-selection {
		.row-child {
			.el-table-column--selection {
				.el-checkbox__input.is-disabled {
					display: none;
				}
			}
		}
	}
	.cell-ellipsis {
		.cell.el-tooltip {
			overflow: hidden;
			text-overflow: ellipsis;
			> div {
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}
	&.single-choise {
		thead .el-table-column--selection .cell {
			display: none;
		}
	}
	.el-table .el-table__row .el-input {
		width: 100% !important;
	}
	.el-table .el-table__row.disabled {
		background-color: #eee;
		.el-checkbox {
			display: none;
		}
	}
	.el-table__fixed-body-wrapper,
	.el-table__fixed-header-wrapper {
		background: #fff;
	}
	.el-table__header-wrapper th.is-required > div.cell::after {
		content: '*';
		color: #d00;
	}
}
::v-deep.i-table-custom {
	.bgColor {
		background: #d8e5fd !important;
		border-top: 2px solid #fff;
		height: calc(100% - 2px);
	}
}
::v-deep.i-table-custom-expand {
	.el-table .tbody tr {
		background-color: none;
	}
	.el-table tr:nth-child(even) {
		background-color: #fff !important;
	}
	.el-table tr.even {
		background-color: rgba(22, 99, 246, 0.07) !important;
		&.nav-active-menu {
			background-color: $color-blue !important;
			td {
				color: #fff;
			}
			&:hover {
				td {
					background-color: $color-blue !important;
				}
			}
		}
	}
	.el-table tr.odd {
		&.nav-active-menu {
			background-color: $color-blue !important;
			td {
				color: #fff;
			}
			&:hover {
				td {
					background-color: $color-blue !important;
				}
			}
		}
	}
}
.columns-set {
	position: absolute;
	top: 0;
	right: 20px;
	line-height: 40px;
	cursor: pointer;
	&:hover {
		color: #1763f7;
	}
}
.checkbox-panel {
	margin: 10px 0px;
}
.table-setting {
	color: $color-blue;
	cursor: pointer;

	span {
		transform: scale(1);
		transition: all 0.3s ease-in;
	}
}
.table-setting span:hover {
	transform: scale(1.5);
}

/*************** 浮动框 *******************/
.custom-cell-tooltip {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	width: 100%;
}
.custom-table-popper-content {
	max-width: 1200px;
}
</style>
