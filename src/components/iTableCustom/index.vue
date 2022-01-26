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
			v-loading="loading"
			ref="theCustomTable"
			tooltip-effect="light"
			fit
			:height="height"
			:max-height="maxHeight"
			:data="virtualList ? virtualTableData : realTableData"
			:row-key="rowKey || 'uniqueId'"
			:highlight-current-row="highlightCurrentRow"
			:empty-text="language('ZANWUSHUJU', '暂无数据')"
			:row-class-name="getRowClassNameDefault"
			:row-style="getRowStyle"
			:cell-class-name="getCellClassName"
			:span-method="getSpanMethod"
			:stripe="stripe"
			:header-cell-class-name="handleHeaderCellClassName"
			:border="border"
			@selection-change="handleSelectionChange"
			@select="handleSelect"
			@select-all="handleAllSelect"
			@current-change="handleCurrentChange"
			@cell-click="handleCellClick"
			@sort-change="handleSortChange"
			@row-click="rowClick"
		>
			<template v-for="(item, index) in tableVisibleColumns">
				<el-table-column
					:key="index"
					v-if="['selection', 'index'].includes(item.type)"
					:reserve-selection="item.reserveSelection || false"
					:type="item.type"
					:label="
						item.i18n ? language(item.i18n, item.label) : language(item.label)
					"
					:width="item.width || '50'"
					:min-width="item.minWidth"
					:align="item.align || 'center'"
					:selectable="handleSelectable"
					:fixed="item.fixed"
				/>
				<el-table-column
					:key="index"
					v-else-if="['customSelection'].includes(item.type)"
					reserve-selection
					:type="item.type"
					:label="item.i18n ? language(item.i18n, item.label) : item.label"
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
							class="custom-checkbox"
						>
						</el-checkbox>
					</template>
				</el-table-column>
				<el-table-column
					:key="index"
					v-else-if="['fullIndex'].includes(item.type)"
					:type="item.type"
					:label="item.i18n ? language(item.i18n, item.label) : item.label"
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
					:show-overflow-tooltip="item.tooltip"
					:prop="item.prop"
					:label="item.i18n ? language(item.i18n, item.label) : item.label"
					:width="item.width ? item.width.toString() : ''"
					:min-width="item.minWidth ? item.minWidth.toString() : ''"
					:fixed="item.fixed"
					:sortable="item.sortable || false"
					:sort-method="item.sortMethod"
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
								:label="
									subItem.i18n
										? language(subItem.i18n, subItem.label)
										: subItem.label
								"
								:width="subItem.width ? subItem.width.toString() : ''"
								:min-width="subItem.minWidth ? subItem.minWidth.toString() : ''"
								:sortable="subItem.sortable || false"
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
							v-else
							:class="{ 'custom-cell-tooltip': item.tooltip }"
							@mouseenter="customMouseenter"
							@mouseleave="customMouseleave"
							@click="handleEmit(item, scope.row)"
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
			v-if="settingVisible"
			:data="tableSettingColumns"
			:show.sync="settingVisible"
			:value="'value'"
			:label="'label'"
			:visiableKey="'hidden'"
			@callback="handleSaveSetting"
			@reset="handleResetSetting"
		/>
		<el-tooltip
			open-delay="3000"
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
import iTableColumn from './iTableColumn'
import Icon from '../icon/index.vue'
import iButton from '../iButton/index.vue'
import iSelect from '../iSelect/index.vue'
import iInput from '../iInput/index.vue'
import iRadio from '../iRadio/index.vue'
import iMessage from '../iMessage'
import iTableHeaderSorter from '../iTableHeaderSorter/index.vue'
import {
	virtualListMixin,
	settingMixin,
	tooltipMixin,
	customSelectionMixin,
} from './mixins'
export default {
	name: 'iTableCustom',
	components: {
		iTableColumn,
		iButton,
		iSelect,
		iInput,
		iRadio,
		Icon,
		iTableHeaderSorter,
	},
	mixins: [virtualListMixin, settingMixin, tooltipMixin, customSelectionMixin],
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
			default: true,
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
		// 使用自定义选择框选项
		customSelectionOption: {
			type: Object,
			default: function() {
				return {
					checkStrictly: false, // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false, false: 关联，true: 不关联
				}
			},
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
		env: {
			// 运行环境，如dev,sit,vmsit,uat等，一般传process.env.NODE_ENV
			type: String,
			default: '',
		},
		virtualList: {
			type: Boolean,
			default: false,
		},
		border: {
			type: Boolean,
			default: true,
		},
		// 默认展开的级别
		defaultExpandLevel: {
			type: Number,
		},
	},
	computed: {
		// 根据visible筛选是否要显示的数据
		realTableData() {
			if (this.tableData) {
				return this.tableData.filter((e) => e.visible)
			}
			return []
		},
		// 是否默认全选
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
	},
	data() {
		return {
			tableData: [],
			selectedRows: [],
			checkedAll: false,
			indeterminateAll: false,
			defaultCheckedKeys: [],
			tableColumns: [],
			settingVisible: false,
			tooltipContent: '',
			settingId: '',
			emitLabel: [],
			isCustomSelection: false,
		}
	},
	watch: {
		data() {
			this.getTableData()
		},
		defaultSelectedRows() {
			this.setDefaultCheckedKeys()
			this.getTableData()
		},
	},
	created() {
		this.setDefaultCheckedKeys()
		this.getTableData()
	},
	mounted() {
		if (
			this.tableVisibleColumns &&
			this.tableVisibleColumns.length &&
			this.tableVisibleColumns[0].type == 'customSelection'
		) {
			this.isCustomSelection = true
			const customSelectionLabel = this.tableVisibleColumns.map((item) => {
				return item.label
			})
			this.emitLabel = [...customSelectionLabel, ...this.emitLabel]
		} else {
			this.emitLabel = this.tableVisibleColumns.map((ele) => {
				if (ele.emit) {
					return ele.label
				}
			})
		}
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
		// 设置默认选择项
		setDefaultCheckedKeys() {
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
			// 20211130 原生的selection
			if (!this.customSelection) {
				this.selectedRows = val
				this.$emit('handle-selection-change', val)
			}
		},
		handleEmit(item, row) {
			if (item.emit) {
				this.$emit(item.emit, row)
			}
		},
		getTableData() {
			this.virtualListConfig.total = this.data.length
			this.virtualListConfig.pages = Math.ceil(this.data.length / 20)
			if (this.treeExpand) {
				this.tableData = this.getTreeTableData(this.data)
				/****************** 20211130 如果有默认的，先emit */
				/* if (this.defaultSelectedRows) {
          this.selectedRows = this.tableData.filter((e) =>
            this.defaultCheckedKeys.includes(e[this.rowKey])
          )
        } */
				/******************* end *********************/
			} else {
				this.tableData = this.data ? this.data : []
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
				/********** 211130 判断是不是要半选顶部复选框 start ***************/
				if (this.defaultCheckedKeys && !this.checkedAll) {
					const checkedRootNums = this.data.filter((e) =>
						this.defaultCheckedKeys.includes(e[this.rowKey])
					)
					if (checkedRootNums.length) {
						this.indeterminateAll = true
					}
				}
				/***************** end ****************************************/
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
				const level = uniqueId.split('-').length
				// 展开
				let expanded = this.defaultExpand
				if (expanded && this.defaultExpandLevel) {
					expanded = level < this.defaultExpandLevel
				}

				// 显示隐藏
				let visible = uniqueId.includes('-') ? this.defaultExpand : true
				if (visible && this.defaultExpandLevel) {
					visible = level <= this.defaultExpandLevel
				}

				const resItem = {
					uniqueId,
					isLeaf: !hasChild,
					expanded,
					visible,
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
					/********** 211130 判断是不是要半选复选框 start ***************/
					if (hasChild && resItem.childNum) {
						const notCheckedNums = row[childrenKey].filter(
							(e) => !this.defaultCheckedKeys.includes(e[this.rowKey])
						).length
						if (notCheckedNums !== resItem.childNum) {
							resItem.isIndeterminate = true
						}
					}
					/***************** end ********************************/
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
			// console.log(row,column,'=====');
			if (!this.emitLabel.includes(column.label)) {
				if (this.isCustomSelection) {
					console.log('QWQ')
					// this.handleToggleSelectedRow(true,row)
				} else {
					console.log('T-T')
					this.$refs.theCustomTable.toggleRowSelection(row)
				}
			}
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
			// row.flag = selected
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
			let rowClass = `row-${row.uniqueId}`
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
	.el-table__row {
		.el-table_1_column_1 {
			.cell {
				padding-right: 10px;
				//  background: chartreuse;
			}
		}
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

.i-table-custom {
	::v-deep .el-table--border th {
		border-right: 1px solid #ffffff !important;
	}

	::v-deep .el-table--border td {
		border-right: 0 !important;
	}
}
</style>

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
			<template v-for="(item, index) in tableVisibleColumns">
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
						<div class="table-setting" @click="openSetting">
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
			v-if="settingVisible"
			:data="tableSettingColumns"
			:show.sync="settingVisible"
			:value="'value'"
			:label="'label'"
			:visiableKey="'hidden'"
			@callback="handleSaveSetting"
			@reset="handleResetSetting"
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
