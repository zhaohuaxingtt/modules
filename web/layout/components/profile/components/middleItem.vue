<template>
	<div class="middle-item">
		<div class="label">
			{{ label }}
			<el-tooltip effect="light" :content="description">
				<icon
					v-if="description"
					name="iconzengjiacailiaochengben_lan"
					symbol
					style="font-size: 14px"
				/>
			</el-tooltip>
		</div>
		<div class="value">
			{{ value }}
			<slot></slot>
		</div>
	</div>
</template>

<script>
import { Icon } from 'rise'
export default {
	name: 'middleItem',
	components: { Icon },
	props: {
		label: {
			type: String,
			required: true,
		},
		value: {
			type: String,
		},
		description: {
			type: String,
		},
	},
}
</script>

<style lang="scss" scoped>
.middle-item {
	/* margin-right: 130px; */
	.label {
		color: #888888;
		font-size: 14px;
		margin-bottom: 10px;
	}
	.value {
		font-size: 14px;
		font-weight: 400;
		line-height: 0px;
		color: #000000;
		line-height: 20px;
	}
}
</style>
