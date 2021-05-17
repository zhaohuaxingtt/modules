<!--
 * @Author: your name
 * @Date: 2021-04-21 13:51:54
 * @LastEditTime: 2021-04-21 21:41:09
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \front-modules\src\components\iPageItemsGroup\iLabel\index.vue
-->
<template>
	<div class="flex-align-center">
		<span v-if="label">{{label}}</span>
		<span v-if="required" class="start">*</span>
		<el-tooltip :disabled="!icons" effect="light" placement="top-start">
			<icon symbol :name="icons"></icon>
			<template #content>
				<div v-html="tip"></div>
			</template>
		</el-tooltip>
	</div>
</template>

<script>
	import icon from "../../icon"
	/**
 * @example ./README.me
*/
	export default {
		name:"iLabel",
		components: {
			icon
		},
		props: {
			label: {
				type: String,
				default: ""
			},
			icons: {
				type: String,
				default: ""
			},
			required: {
				type: Boolean,
				default: false
			},
			tip: {
				type: String,
				default: ""
			}
		}
	}
</script>

<style lang="scss" scoped>
	.start {
		color: #FF0000;
		margin-left: 4px;
	}

	// .tips {
	// 	position: relative;
	// 	cursor: pointer;
	// 	margin-left: 4px;
	// }

	// .tips:hover .text {
	// 	display: inline-block;
	// }
	
	// .text{
	// 	display: inline-block;
	// 	z-index: 100;
	// 	position: absolute;
	// 	bottom: 100%;
	// 	left: 102px;
	// 	padding: 5px 10px;
	// 	background: #FFFFFF;
	// 	box-shadow: 0px 3px 10px rgba(27, 29, 33, 0.16);
	// 	border-radius: 5px;
	// 	font-size: 14px;
	// 	line-height: 1.2;
	// 	color: $color-black;
	// }
</style>
