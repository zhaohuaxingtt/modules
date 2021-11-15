<template>
	<i-dialog
		title="表头设置"
		:visible.sync="isShow"
		width="30%"
		class="table-header-modal"
		:before-close="handleBeforeClose"
	>
		<div class="header-wrapper" ref="header-wrapper">
			<div
				class="flex-align-center header-col drop-item"
				v-for="(item, index) in dataSource"
				:key="index"
				:id="item.prop"
				:data-id="item.i18n ? language(item.i18n) : item.label"
				:class="{ draggable: !item.type }"
			>
				<div><icon symbol class="icon" name="iconshunxubiaoqian" /></div>
				<el-switch
					v-model="item.isHidden"
					active-color="#CDD4E2"
					inactive-color="#1660F1"
				/>
				<div>{{ item.i18n ? language(item.i18n) : item.label }}</div>
			</div>
		</div>
		<span slot="footer" class="dialog-footer">
			<i-button @click="handleSave">保存</i-button>
			<i-button @click="handleReset">重置</i-button>
			<i-button @click="handleCancel">退出</i-button>
		</span>
	</i-dialog>
</template>

<script>
import Sortable from 'sortablejs'
import iButton from '../iButton/index.vue'
import iDialog from '../iDialog/index.vue'
import icon from '../icon/index.vue'
import _ from 'lodash'
export default {
	components: {
		iButton,
		iDialog,
		icon,
	},
	props: {
		data: {
			type: Array,
			default: function() {
				return []
			},
		},
		show: [Boolean],
	},
	data() {
		return {
			dataSource: [],
			originalData: [],
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
	},
	created() {
		this.handleOpened()
	},
	methods: {
		handleBeforeClose(done) {
			this.handleReset()
			done()
		},
		handleSave() {
			const elements = document.querySelectorAll('.drop-item')
			const newData = []
			for (let i = 0; i < elements.length; i++) {
				const element = elements[i]
				console.log(element.getAttribute('data-id'))
				const item = this.dataSource.find((e) => {
					const itemName = e.i18n ? this.language(e.i18n) : e.label
					return itemName === element.getAttribute('data-id')
				})
				newData.push(item)
			}
			this.isShow = false
			this.$emit('callback', newData)
		},
		handleCancel() {
			this.handleReset()
			this.isShow = false
		},
		handleReset() {
			this.dataSource = this.deepClone(this.originalData)
			// this.$emit('reset')
		},
		handleOpened() {
			const dataSource = this.deepClone(this.data)
			dataSource.forEach((e) => {
				if (!e.hasOwnProperty('isHidden')) {
					e.isHidden = false
				}
			})
			this.dataSource = this.deepClone(dataSource)
			this.originalData = this.deepClone(dataSource)
			this.newData = this.deepClone(dataSource)
			this.$nextTick(() => {
				const el = document.getElementsByClassName('header-wrapper')[0]
				new Sortable(el, {
					animation: 250,
					draggable: '.draggable',
				})
			})
		},
		deepClone(data) {
			var t = this.getType(data),
				o,
				i,
				ni

			if (t === 'array') {
				o = []
			} else if (t === 'object') {
				o = {}
			} else {
				return data
			}

			if (t === 'array') {
				for (i = 0, ni = data.length; i < ni; i++) {
					o.push(this.deepClone(data[i]))
				}
				return o
			} else if (t === 'object') {
				for (i in data) {
					o[i] = this.deepClone(data[i])
				}
				return o
			}
		},
		getType(obj) {
			var toString = Object.prototype.toString
			var map = {
				'[object Boolean]': 'boolean',
				'[object Number]': 'number',
				'[object String]': 'string',
				'[object Function]': 'function',
				'[object Array]': 'array',
				'[object Date]': 'date',
				'[object RegExp]': 'regExp',
				'[object Undefined]': 'undefined',
				'[object Null]': 'null',
				'[object Object]': 'object',
			}
			return map[toString.call(obj)]
		},
	},
}
</script>

<style lang="scss" scoped>
.table-header-modal {
	.header-wrapper {
		.header-col {
			background: #f9fafe;
			padding: 10px 10px;
			margin-bottom: 20px;

			> div {
				&:first-child {
					margin-right: 20px;
				}
				&:last-child {
					margin-left: 20px;
				}
			}
		}
		.drop-item.draggable {
			cursor: move;
		}
	}
}
</style>
<style lang="scss">
.table-header-modal {
	.el-dialog__body {
		max-height: 465px;
		overflow-y: scroll;
		overflow-x: auto;
	}
}
</style>
