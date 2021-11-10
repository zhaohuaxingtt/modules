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
						<el-select
							v-model="query.type"
							filterable
							placeholder="请选择（支持搜索）"
						>
							<el-option
								v-for="item in options"
								:key="item.code"
								:label="item.value"
								:value="item.code"
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="'操作人'">
						<i-input :placeholder="'请输入'" v-model="query.creator" />
					</el-form-item>
				</el-form>
			</i-search>
			<el-table :data="tableData" style="width: 100%" class="log-table">
				<el-table-column type="expand">
					<template slot-scope="props">
						{{ props.row.content }}
					</template>
				</el-table-column>
				<el-table-column
					label="模块"
					prop="module"
					align="center"
				></el-table-column>
				<el-table-column
					label="操作类型"
					prop="typeName"
					align="center"
				></el-table-column>
				<el-table-column
					label="操作人"
					prop="creator"
					align="center"
				></el-table-column>
				<el-table-column
					label="请求时间"
					prop="rqTime"
					align="center"
				></el-table-column>
				<el-table-column
					label="响应时间"
					prop="respTime"
					align="center"
				></el-table-column>
				<el-table-column
					label="结果"
					prop="result"
					align="center"
				></el-table-column>
			</el-table>
		</iDialog>
	</div>
</template>

<script>
import iDialog from '../iDialog'
import iSearch from '../iSearch'
import iInput from '../iInput'

export default {
	components: { iDialog, iSearch, iInput },
	props: {
		bizId: {
			type: Number,
			Default: function() {
				return 0
			},
		},
		show: [Boolean],
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
	},
	data() {
		return {
			tableData: [],
			query: {
				type: '',
				creator: '',
			},
			options: [],
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
		bizLogApiPrefix() {
			const baseMap = {
				'': '/api',
				dev: '/bizlogApi',
				sit: '/bizlogApi',
				vmsit: '/bizlogApi',
				uat: '/bizlogApi',
				production: '/api',
			}
			return baseMap[this.appEnv.toLowerCase()] || '/api'
		},
	},
	methods: {
		sure() {
			if (this.query.type || this.query.creator) {
				this.getList()
			}
		},
		reset() {
			if (this.query.type || this.query.creator) {
				this.query = {
					type: '',
					creator: '',
				}
				this.getList()
			}
		},
		handleClose() {
			this.query = {
				type: '',
				creator: '',
			}
		},
		handleOpen() {
			this.getOptions()
			this.getList()
		},
		getOptions() {
			const http = new XMLHttpRequest()
			const url = `${this.bizLogApiPrefix}/operationLog/listOperationType`
			http.open('POST', url, true)
			http.setRequestHeader('content-type', 'application/json')
			http.onreadystatechange = () => {
				if (http.readyState === 4) {
					this.options = JSON.parse(http.responseText)?.data || []
				}
			}
			http.send()
		},
		getList() {
			console.log('bizId', this.bizId)
			const http = new XMLHttpRequest()
			const url = `${this.bizLogApiPrefix}/operationLog/listOperationLogs`
			http.open('POST', url, true)
			http.setRequestHeader('content-type', 'application/json')
			http.onreadystatechange = () => {
				if (http.readyState === 4) {
					this.tableData = JSON.parse(http.responseText)
				}
			}
			this.query.bizId = this.bizId
			const extendParams = this.extendParams || {}
			const sendData = {
				extendFields: { ...this.query, ...extendParams },
			}
			http.send(JSON.stringify(sendData))
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
