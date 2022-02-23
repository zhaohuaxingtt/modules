<template>
	<div class="material-dialog2">
		<iDialog
			title="业务用户日志"
			:visible.sync="isShow"
			width="85%"
			@open="handleOpen"
			@close="handleClose"
		>
			<i-search @sure="sure" @reset="reset" class="margin-bottom20">
				<el-form :model="query" ref="queryForm">
					<el-form-item :label="'操作类型'">
						<iSelect
							v-model="query.type"
							filterable
							clearable
							placeholder="请选择（支持搜索）"
							@change="handleOperationTypes"
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
					<el-form-item :label="'业务编号'">
						<i-input
							:placeholder="'请输入'"
							:disabled="disabledBiz"
							v-model="query.bizId"
						/>
					</el-form-item>
					<el-form-item :label="'操作内容'">
						<i-input :placeholder="'请输入'" v-model="query.content_like" />
					</el-form-item>
					<el-form-item :label="'日志编号'">
						<i-input :placeholder="'请输入'" v-model="query.id" />
					</el-form-item>
					<el-form-item :label="'时间筛选'">
						<el-date-picker
							v-model="date"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							type="daterange"
							range-separator="至"
							value-format="yyyy-MM-dd"
							class="p-date"
							style="width:320px"
							@change="dateChange"
							clearable
						/>
					</el-form-item>
					<el-form-item :label="''" v-if="recordShow">
						<el-checkbox v-model="query.isSee" :disabled="recordFlag">{{
							language('显示关键查看记录')
						}}</el-checkbox>
					</el-form-item>
				</el-form>
			</i-search>
			<el-table
				:data="tableData"
				style="width: 100%"
				:class="{ 'log-table': !isPage }"
				default-expand-all
				v-loading="loading"
			>
				<!-- <el-table-column type="expand">
          <template slot-scope="props">
            {{ props.row.content }}
          </template>
        </el-table-column> -->
				<el-table-column
					label="日志编号"
					prop="id"
					width="150"
					align="center"
				/>
				<el-table-column label="操作类型" prop="typeName" align="center" />
				<el-table-column
					label="操作内容"
					prop="content"
					width="250"
					align="center"
				>
					<template slot-scope="{ row }">
						<el-popover
							title=""
							width="500"
							trigger="hover"
							:content="row.content"
						>
							<div
								slot="reference"
								style="width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
							>
								{{ row.content }}
							</div>
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column
					label="请求时间"
					prop="rqTime"
					width="150"
					align="center"
				/>
				<el-table-column
					label="响应时间"
					prop="respTime"
					width="150"
					align="center"
				/>
				<el-table-column
					label="异常信息"
					prop="exceptionMsg"
					width="200"
					show-overflow-tooltip
					align="center"
				/>
				<el-table-column label="用户" prop="creator" align="center" />
				<el-table-column label="岗位" prop="userPosition" align="center" />
				<el-table-column label="是否成功" prop="userPosition" align="center">
					<template slot-scope="{ row }">
						<span>{{ row.success ? '是' : '否' }}</span>
					</template>
				</el-table-column>
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
import iDialog from '../iDialog/index.vue'
import iSearch from '../iSearch/index.vue'
import iInput from '../iInput/index.vue'
import iSelect from '../iSelect/index.vue'
import iPagination from '../iPagination/index.vue'
// import moment from 'moment';

export default {
	name: 'iUserLog',
	components: { iDialog, iSearch, iInput, iSelect, iPagination },
	props: {
		bizId: {
			type: Number,
			Default: function() {
				return 0
			},
		},
		menuId: {
			type: [Number, String],
			default: '',
		},
		show: [Boolean],
		isPage: {
			type: Boolean, // 是否分页
			default: false,
		},
		isDate: {
			type: Boolean, // 是否默认时间查询
			default: true,
		},
		days: {
			//默认时间天数
			type: Number,
			default: 90,
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
		recordShow: {
			type: Boolean, // 是否默认显示关键查看记录
			default: true,
		},
	},
	data() {
		return {
			tableData: [],
			query: {
				type: '',
				creator: '',
				bizId: '',
				content_like: '',
				createDate_gt: '',
				createDate_le: '',
				id: '',
				isSee: '',
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
			date: null,
			disabledBiz: false,
			recordFlag: false,
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
	created() {
		this.restForm()
	},
	methods: {
		restForm() {
			return new Promise((resolve) => {
				let end = moment().format('YYYY-MM-DD')
				let start = moment(
					new Date(end).getTime() - 30 * 24 * 3600 * 1000
				).format('YYYY-MM-DD') //30天
				this.date = [start, end]
				this.query.createDate_gt = start
				this.query.createDate_le = end
				resolve()
			})
		},
		dateChange(date) {
			this.query.createDate_gt = date ? date[0] : ''
			this.query.createDate_le = date ? date[1] : ''
		},
		sure() {
			if (this.isPage) {
				this.page.currPage = 1
			}
			this.getList()
		},
		async reset() {
			await this.restForm()
			this.query = {
				type: '',
				creator: '',
				bizId: '',
				content_like: '',
				createDate_gt: '',
				createDate_le: '',
				id: '',
				isSee: '',
			}
			// this.date = ""
			if (this.disabledBiz) {
				this.query.bizId = this.bizId
				this.query.menuId = this.menuId
			}
			if (this.isPage) {
				this.page.currPage = 1
			}
			this.getList()
		},
		async handleClose() {
			await this.restForm()
			this.query = {
				type: '',
				creator: '',
				bizId: '',
				content_like: '',
				createDate_gt: '',
				createDate_le: '',
				id: '',
			}
			// this.date = ""
			this.$emit('close')
		},
		handleOpen() {
			if (this.bizId) {
				this.disabledBiz = true
			} else {
				this.disabledBiz = false
			}
			this.query.bizId = this.bizId
			this.query.menuId = this.menuId
			if (this.isDate) {
				let end = moment().format('YYYY-MM-DD')
				let start = moment(
					new Date(end).getTime() - this.days * 24 * 3600 * 1000
				).format('YYYY-MM-DD')
				this.date = [start, end]
				this.query.createDate_gt = start
				this.query.createDate_le = end
			}
			this.getOptions()
			this.getList()
		},
		getOptions() {
			// 操作类型
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
			const url = `${this.bizLogApiPrefix}/operationLog/findRecordLogs`

			http.open('POST', url, true)
			http.setRequestHeader('content-type', 'application/json')
			http.onreadystatechange = () => {
				if (http.readyState === 4) {
					if (this.isPage) {
						const { data } = JSON.parse(http.responseText)
						this.tableData = data.content || []
						this.page.totalCount = data.total
					} else {
						this.tableData = JSON.parse(http.responseText)?.data || []
					}
				}
				this.loading = false
			}
			const extendParams = this.extendParams || {}
			this.query.isSee = this.query.isSee ? 1 : 0
			let data = JSON.parse(JSON.stringify(this.query))
			data.createDate_gt = this.query.createDate_gt
				? `${this.query.createDate_gt.split(' ')[0]} 00:00:00`
				: ''
			data.createDate_le = this.query.createDate_le
				? `${this.query.createDate_le.split(' ')[0]} 23:59:59`
				: ''

			const sendData = {
				extendFields: { ...data, ...extendParams },
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
		handleOperationTypes(v) {
			if (v === '170') {
				this.query.isSee = false
				this.recordFlag = true
			} else {
				this.recordFlag = false
			}
		},
	},
}
</script>
<style lang="scss">
.pagination-box {
	padding-bottom: 30px;
}
.el-tooltip__popper.is-dark {
	z-index: 9999 !important;
}

.material-dialog2 {
	// .card {
	//   box-shadow: none;

	//   .cardBody {
	//     padding: 0;
	//   }
	// }

	.log-table {
		padding-bottom: 35px;
	}

	.el-table__body-wrapper {
		height: 350px;
		overflow-y: auto;
		border-bottom: 1px solid #eee;
	}
}
.p-date {
	height: 35px;
	border-color: transparent;
	box-shadow: 0 0 0.1875rem rgb(0 38 98 / 15%);
}
</style>
