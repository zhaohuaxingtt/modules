<template>
	<div class="material-dialog">
		<iDialog
			title="业务日志"
			:visible.sync="isShow"
			width="85%"
			@open="handleOpen"
			@close="handleClose"
		>
			<i-search
				@sure="sure"
				@reset="reset"
				class="margin-bottom20"
				:icon="true"
			>
				<el-form row="1" :model="query" ref="queryForm">
					<el-form-item :label="'操作类型'">
						<iSelect
							v-model="query.type"
							@change="onTypeChange"
							filterable
							placeholder="请选择（支持搜索）"
						>
							<el-option
								v-for="item in options"
								:key="item.code"
								:label="item.value"
								:value="item.code"
							></el-option>
						</iSelect>
					</el-form-item>
					<el-form-item :label="'操作人'">
						<i-input :placeholder="'请输入'" v-model="query.creator" />
					</el-form-item>
				</el-form>
			</i-search>
			<el-table
				:data="tableData"
				style="width: 100%"
				:class="{'log-table':!isPage}"
				v-loading="loading"
				default-expand-all
			>
				<el-table-column type="expand">
					<template slot-scope="props">
						{{ props.row.content }}
					</template>
				</el-table-column>
				<el-table-column label="模块" prop="module" align="center" />
				<el-table-column label="操作类型" prop="typeName" align="center" />
				<el-table-column label="操作人" prop="creator" align="center" />
				<el-table-column label="请求时间" prop="rqTime" align="center" />
				<el-table-column label="响应时间" prop="respTime" align="center" />
				<el-table-column label="结果" prop="result" align="center" />
			</el-table>
			<div v-if="isPage" slot="footer">
				<iPagination
					v-update
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					background
					:current-page="page.currPage"
					:page-sizes="page.pageSizes"
					:page-size="page.pageSize"
					:layout="page.layout"
					:total="page.totalCount"
				/>
			</div>
		</iDialog>
	</div>
</template>

<script>
import iDialog from '../iDialog'
import iSearch from '../iSearch'
import iInput from '../iInput'
import iSelect from '../iSelect'
import iPagination from '../iPagination'
export default {
	components: { iDialog, iSearch, iInput, iSelect, iPagination },
	props: {
		bizId: {
			type: Number,
			Default: function() {
				return 0
			},
		},
		show: [Boolean],
		isPage: {
			type: Boolean, // 是否分页
			default: false,
		},
		extendParams: {
			type: Object,
			default: function() {
				return {}
			},
		},
		env: {
			// 运行环境，如dev,sit,vmsit,uat等，一般传process.env.NODE_ENV
			type: String,
			default: '',
		},
		// 根据字典查询下拉key
		optionDicKey: {
			type: String,
			default: '',
		},
		// 字典查询筛选参数，通常用于三级字典查询，根据已有的列表查询
		optionDicKey2: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			tableData: [],
			query: {
				type: '',
				creator: '',
			},
			options: [],
			page: {
				totalCount: 0, //总条数
				pageSize: 10, //每页多少条
				pageSizes: [10, 20, 50, 100], //每页条数切换
				currPage: 1, //当前页
				layout: 'sizes, prev, pager, next, jumper',
			},
			loading: false,
		}
	},
	computed: {
		isShow: {
			get() {
				return this.show
			},
			set(val) {
				this.$emit('update:show', val)
			},
		},
		appEnv() {
			return window.sessionStorage.getItem('env') || this.env
		},
		dicApiPrefix() {
			const baseMap = {
				'': '/baseApi/web',
				dev: '/baseApi/web',
				sit: '/baseApi/web',
				vmsit: '/baseApi/web',
				uat: '/baseApi/web',
				production: '/baseApi/web',
			}
			return baseMap[this.appEnv.toLowerCase()] || '/baseinfo/web'
		},
		bizLogApiPrefix() {
			const baseMap = {
				'': '/bizlogApi',
				dev: '/bizlogApi',
				sit: '/bizlogApi',
				vmsit: '/bizlogApi',
				uat: '/bizlogApi',
				production: '/bizlogApi',
			}
			return baseMap[this.appEnv.toLowerCase()] || '/api'
		},
	},
	methods: {
		sure() {
			if (this.isPage) {
				this.page.currPage = 1
			}
			this.getList()
		},
		reset() {
			this.query = {
				type: '',
				creator: '',
			}
			if (this.isPage) {
				this.page.currPage = 1
			}
			this.getList()
		},
		handleClose() {
			this.query = {
				type: '',
				creator: '',
			}
		},
		handleOpen() {
			// 传了字典key的，默认通过字典接口查询下拉
			if (this.optionDicKey) {
				this.getDicOptions()
			} else {
				this.getOptions()
			}
			this.getList()
		},
		// 根据key查字典
		getDicOptions() {
			const key = this.optionDicKey || ''
			const http = new XMLHttpRequest()
			const url = `${this.dicApiPrefix}/selectDictByKeys?keys=${key}`
			http.open('GET', url, true)
			http.setRequestHeader('content-type', 'application/json')
			http.onreadystatechange = () => {
				if (http.readyState === 4) {
					let data = JSON.parse(http.responseText)?.data || []
					data = (data && data[key]) || []
					const options = data.map((o) => {
						o.value = o.name
						return o
					})
					// 需要查询三级
					if (this.optionDicKey2) {
						let selectOptions = options.find(
							(o) => o.code === this.optionDicKey2
						)
						selectOptions =
							selectOptions &&
							selectOptions.subSelectVos &&
							selectOptions.subSelectVos.length
								? selectOptions.subSelectVos
								: []
						this.options = selectOptions.map((o) => {
							o.value = o.name
							return o
						})
					} else {
						// 直接取字典回来的数组
						this.options = options
					}
				}
			}
			http.send()
		},
		getOptions() {
			const http = new XMLHttpRequest()
			const url = `${this.bizLogApiPrefix}/operationLog/listOperation`
			http.open('POST', url, true)
			http.setRequestHeader('content-type', 'application/json')
			http.onreadystatechange = () => {
				if (http.readyState === 4) {
					this.options = JSON.parse(http.responseText)?.data || []
				}
			}
			http.send(JSON.stringify({ isAdmin: false }))
		},
		getList() {
			this.loading = true
			const http = new XMLHttpRequest()
			const url = `${this.bizLogApiPrefix}/operationLog/findRecordLogs`	// 接口调整，统一使用分页
			// const url = `${this.bizLogApiPrefix}/operationLog/${
			// 	this.isPage ? 'findOperaLogs' : 'listOperaLogs'
			// }`

			http.open('POST', url, true)
			http.setRequestHeader('content-type', 'application/json')
			http.onreadystatechange = () => {
				if (http.readyState === 4) {
					this.loading = false
					if (this.isPage) {
						const { data } = JSON.parse(http.responseText)
						this.tableData = data.content || []
						this.page.totalCount = data.total
					} else {
						this.tableData = JSON.parse(http.responseText)?.data || []
					}
				}
			}
			this.query.bizId = this.bizId
			const extendParams = this.extendParams || {}
			const sendData = {
				extendFields: { ...extendParams, ...this.query },
			}
			if (this.isPage) {
				sendData.current = this.page.currPage - 1
				sendData.size = this.page.pageSize
			}
			http.send(JSON.stringify(sendData))
		},
		handleSizeChange(val) {
			this.page.pageSize = val
			this.getList()
		},
		handleCurrentChange(val) {
			this.page.currPage = val
			this.getList()
		},
		onTypeChange(type) {
			this.$emit('onTypeChange', type)
		},
	},
}
</script>
<style lang="scss">
.pagination-box {
	padding-bottom: 30px;
}

.material-dialog {
	.card {
		box-shadow: none;

		.cardBody {
			padding: 0;
		}
	}

	.log-table {
		padding-bottom: 35px;
	}

	.el-table__body-wrapper {
		height: 400px;
		overflow-y: auto;
		border-bottom: 1px solid #eee;
	}
}
</style>
