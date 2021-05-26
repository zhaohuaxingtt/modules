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
		extends: Tabs,
	};
</script>

<style lang="scss" scoped>
	::v-deep.rsg--preview-37{
		background-color: #F8F9FA;
	}
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
		}
	}
	.el-tabs--card{
			border-radius: none;
			border: none;
			box-shadow: none;
			overflow: visible;
			background-color: $color-background;
			.el-tabs__header{
				border-bottom: none;
				margin-bottom: 15px;
				::v-deep.el-tabs__nav {
					border:none;
				}
			}
			::v-deep.el-tabs__item{
				min-width: 150px;
				text-align: center;
				border: none;
				background-color: #F5F6F7;
				color:rgba(114, 114, 114, 1);
				box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.08);
				font-size: 16px;
				&:nth-child(1){
					border-top-left-radius: 10px;	
					border-bottom-left-radius: 10px;
				}
				&:last-child{
					border-top-right-radius: 10px;	
					border-bottom-right-radius: 10px;
				}
			}
			::v-deep.is-active {
					background: #FFFFFF;
					box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.08);
					z-index: 1;
					color: rgba(22, 96, 241, 1);
			}
			.el-tabs__nav-wrap{
				height: 35px;	
				overflow: visible;
			}
			::v-deep.el-tabs__nav-scroll{
				overflow: visible;
			}
			.el-tabs__nav-scroll{
				overflow: visible;
			}
			.el-tabs__content{
				overflow: visible;
			}
	}
</style>
