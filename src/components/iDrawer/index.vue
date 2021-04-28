<!--
 * @Author: your name
 * @Date: 2021-04-08 14:44:44
 * @LastEditTime: 2021-04-21 21:40:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \front-modules\src\components\iDrawer\index.vue
-->
<template>
	<div class="drawer" :class="visible?'showMenuList':'hideMenuList'">
		<slot></slot>
	</div>
</template>

<script>
		/**
		 * @example ./README.me
		*/
	export default {
		name:'iDrawer',
		props: {
			visible: {
				type: Boolean,
				default: false
			}
		},
		mounted() {
			document.body.appendChild(this.$el)
		},
		methods:{
			// 显示任务菜单
			show() {
				this.$emit('visible:updated', true)
			},
			close() {
				this.$emit('visible:updated', false)
			}
		},
	}
</script>

<style lang="scss" scoped>
	.drawer {
		width: 400px;
		transition: right .3s ease-in-out;
		position: absolute;
		right: -400px;
		top: 0;
		min-height: 100vh;
		z-index: 99;
		background: #FFFFFF;
		box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.08);
	}

	.showMenuList {
		right: 0px;
	}

	.hideMenuList {
		right: -400px;
	}
</style>
