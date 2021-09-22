<!--
 * @Author: ldh
 * @Date: 2021-05-28 22:43:53
 * @LastEditTime: 2021-09-08 14:39:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \front-modules\src\components\iEditor\index.vue
-->
<template>
	<div>
		<div class="editor" id="editor"></div>
	</div>
</template>

<script>
import Editor from 'wangeditor'

// 校验valueType
const validateValueType = function (valueType) {
	if (typeof valueType === 'string') valueType = valueType.toLowerCase()
	return ['html', 'text', 'json'].indexOf(valueType) > -1
}

// menu
const menus = [
	'head',
	'bold',
	'fontSize',
	'fontName',
	'italic',
	'underline',
	'strikeThrough',
	'indent',
	'lineHeight',
	'foreColor',
	'backColor',
	'link',
	'list',
	'todo',
	'justify',
	'quote',
	'emoticon',
	'image',
	'video',
	'table',
	'code',
	'splitLine',
	'undo',
	'redo',
]
/**
 * @example ./README.me
 */
export default {
	name: 'iEditor',
	props: {
		config: {
			type: Object,
			default: () => ({}),
		},
		delay: {
			type: Number,
			default: 0,
		},
		valueType: {
			type: String,
			default: 'html',
		},
		height: {
			type: Number,
			default: 300,
		},
		autoHeight: {
			type: Boolean,
			default: false,
		},
		zIndex: {
			type: Number,
			default: 0,
		},
		placeholder: {
			type: String,
			default: '',
		},
		value: {
			type: String,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		menus: {
			type: Array,
			default: () => menus,
		},
		showMenus: {
			type: Boolean,
			default: () => true,
		},
		excludeMenus: {
			type: Array,
			default: () => [],
		},
		showFullScreen: {
			type: Boolean,
			default: false,
		},
		uploadImgShowBase64: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			editor: null,
			editorDom: null,
		}
	},
	mounted() {
		this.editorDom = document.querySelector('#editor')
		this.editor = new Editor(this.editorDom)

		// 初始化配置
		const config = {
			menus: this.menus,
			zIndex: this.zIndex,
			placeholder: this.placeholder,
			showFullScreen: this.showFullScreen,
			uploadImgShowBase64: this.config.uploadImgServer
				? false
				: this.uploadImgShowBase64,
			onchangeTimeout: this.delay,
			onchange: () =>
				this.editor.txt &&
				validateValueType(this.valueType) &&
				this.$emit('input', this[`${this.valueType.toLowerCase()}`]()),
			onblur: () =>
				this.editor.txt &&
				validateValueType(this.valueType) &&
				this.$emit('blur', this[`${this.valueType.toLowerCase()}`]()),
			onfocus: () =>
				this.editor.txt &&
				validateValueType(this.valueType) &&
				this.$emit('focus', this[`${this.valueType.toLowerCase()}`]()),
		}

		// eslint-disable-next-line
		this.editor.config = _.cloneDeep({
			...this.editor.config,
			...this.config,
			...config,
		})

		this.editor.create()

		// 初始化高度
		this.setHeight(this.height)

		// 初始化内容
		if (validateValueType(this.valueType)) {
			this.editor.txt[this.valueType.toLowerCase()](this.value)
		}

		// 初始化禁用
		this.disabled && this.disable()

		// 初始化显示menu
		this.showMenu(this.showMenus)
	},
	watch: {
		value() {
			if (validateValueType(this.valueType)) {
				this.editor.txt[this.valueType.toLowerCase()](this.value)
			}
		},
		disabled(status) {
			status ? this.disable() : this.enable()
		},
		showMenus(status) {
			this.showMenu(status)
		},
		height(value) {
			this.setHeight(value)
		},
		autoHeight() {
			this.setHeight(this.height)
		},
	},
	beforeDestroy() {
		this.destroy()
	},
	methods: {
		// 获取/设置 html
		html(value) {
			const result = this.editor.txt.html(value)
			if (value) this.$emit('change', this.html())
			return result
		},
		// 获取/设置 text
		text(value) {
			const result = this.editor.txt.text(value)
			if (value) this.$emit('change', this.text())
			return result
		},
		// 获取/设置 json
		json(value) {
			const result = value
				? this.editor.txt.setJSON(value)
				: this.editor.txt.getJSON()
			if (value) this.$emit('change', this.json())
			return result
		},
		// 清理内容
		clear() {
			const result = this.editor.txt.clear()
			this.$emit('change', '')
			return result
		},
		// 设置高度
		setHeight(height) {
			if (this.editor) {
				this.editorDom.querySelector('.w-e-text-container').style.height = this
					.autoHeight
					? 'auto'
					: `${height / 16}rem`
				this.editor.$textElem.elems[0].style.minHeight = `${height / 16}rem`
			}
		},
		// 展开/取消 全屏
		fullScreen(status = true) {
			if (this.editor) {
				status ? this.editor.fullScreen() : this.editor.unFullScreen()
			}
		},
		// 隐藏/显示 menu
		showMenu(status = true) {
			if (this.editor) {
				const menuDom = this.editor.$toolbarElem.elems[0]

				if (menuDom) {
					if (status) {
						menuDom.style.display = 'flex'
					} else {
						menuDom.style.display = 'none'
					}
				}
			}
		},
		// 禁用
		disable() {
			this.editor && this.editor.disable()
		},
		// 解除禁用
		enable() {
			this.editor && this.editor.enable()
		},
		// 销毁
		destroy() {
			this.editor && this.editor.destroy()
			this.editor = null
		},
		//光标处插入字符
		insertHTML(value) {
			this.editor.cmd.do('insertHTML', value)
		},
	},
}
</script>

<style lang="scss" scoped>
::v-deep .editor {
	box-shadow: 0 0 0.1875rem rgb(0 38 98 / 15%);
	border-radius: 4px;

	.w-e-toolbar,
	.w-e-text-container {
		border-radius: 4px;
	}

	.w-e-toolbar {
		border-top: 1px solid transparent !important;
		border-left: 1px solid transparent !important;
		border-right: 1px solid transparent !important;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	.w-e-text-container {
		border: 1px solid transparent !important;

		.placeholder {
			z-index: 0;
		}
	}

	.w-e-content-preview {
		p {
			word-break: break-all;
		}
	}
}
</style>
