<!--
* @author:shujie
* @Date: 2021-2-26 13:31:16
 * @LastEditors: Please set LastEditors
* @Description: iTabs多列表时
 -->
<script>
	import {
		Tabs
	} from "element-ui";
	/**
 * @example ./README.me
*/
	export default {
		name:'iTabsList',
		extends: Tabs,
	};
</script>

<style lang="scss" scoped>
	.el-tabs--border-card {
		border-radius: none;
		border: none;
		box-shadow: none;
		overflow: visible;
		background-color: $color-background;
		.el-tabs__header {
			border: none;
		}

		::v-deep .el-tabs__nav {
			display: flex;
			align-items: center;
			background-color: $color-background;

			.el-tabs__item {
				height: 30px;
				line-height: 30px;
				color: #727272;
				border: none;
				padding: 0px 10px;
				font-size: 16px;
				margin-right: 10px;
			}

			.is-active {
				color: $color-blue;
				background: #FFFFFF;
				box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08);
				border-radius: 5px;
			}

			.el-tabs__item:nth-child(2) {
				padding: 0px 10px;
			}
		}

		.el-tabs--border-card>.el-tabs__header {
			border: none;
		}

		.el-tabs__content {
			box-shadow: none;
			border-radius: 0;
			padding: 0;
			margin-top: 15px;
			background-color: transparent;
			overflow: visible;
			// box-shadow: $btn-box-shadow;
			// border-radius: 10px;
			// padding: 32px 60px;
			// margin-top: 15px;
			// background-color: #FFFFFF;
		}
	}
</style>
