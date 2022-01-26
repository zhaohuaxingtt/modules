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
						<iDatePicker
							v-model="date"
							:start-placeholder="language('开始日期')"
							:end-placeholder="language('结束日期')"
							type="daterange"
							format="yyyy-MM-dd"
							range-separator="至"
							value-format="yyyy-MM-dd"
							style="width:320px"
							clearable
							@change="dateChange"
						/>
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
					show-overflow-tooltip
					align="center"
				/>
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
import iDatePicker from '../iDatePicker/index.vue'

export default {
	name: 'iUserLog',
	components: { iDialog, iSearch, iInput, iSelect, iPagination, iDatePicker },
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
		reset() {
			this.query = {
				type: '',
				creator: '',
				bizId: '',
				content_like: '',
				createDate_gt: '',
				createDate_le: '',
				id: '',
			}
			if (this.disabledBiz) {
				this.query.bizId = this.bizId
				this.query.menuId = this.menuId
			}
			this.date = null
			if (this.isPage) {
				this.page.currPage = 1
			}
			this.getList()
		},
		handleClose() {
			this.query = {
				type: '',
				creator: '',
				bizId: '',
				content_like: '',
				createDate_gt: '',
				createDate_le: '',
				id: '',
			}
			this.date = null
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
			const sendData = {
				extendFields: { ...this.query, ...extendParams },
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
	},
}
</script>
<style lang="scss">
.pagination-box {
	padding-bottom: 30px;
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
</style>
