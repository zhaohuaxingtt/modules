<template>
	<div class="flex-align-center">
		<span v-if="label">{{label}}</span>
		<span v-if="required" class="start">*</span>
		<div v-if="icon" class="tips">
			<icon symbol :name="icon"></icon>
			<span class="text" v-if="tip">{{tip}}</span>
		</div>
	</div>
</template>

<script>
	import {
		icon
	} from "../../icon"
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
			icon: {
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

	.tips {
		position: relative;
		cursor: pointer;
		margin-left: 4px;
	}

	.tips:hover .text {
		display: inline-block;
	}
	
	.text{
		display: none;
		z-index: 100;
		position: absolute;
		bottom: 100%;
		right: -270px;
		padding: 5px 10px;
		width: 280px;
		background: #FFFFFF;
		box-shadow: 0px 3px 10px rgba(27, 29, 33, 0.16);
		border-radius: 5px;
		font-size: 14px;
		line-height: 16px;
		color: $color-black;
	}
</style>
