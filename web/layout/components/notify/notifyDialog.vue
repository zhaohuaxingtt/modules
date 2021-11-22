<template>
	<iDialog
		:visible.sync="show"
		:title="papgeTitle"
		@close="closeDialog"
		:loading="loading"
		:show-close="false"
		min-width="600px"
		min-height="440px"
		:class="{ 'black-style': detail.popupStyle == '2' }"
	>
		<div
			class=""
			:class="{
				'center-style': detail.popupStyle == '1',
				main: detail.popupStyle == '0',
				'right-style': detail.popupStyle == '2',
			}"
		>
			<div class="left">
				<img
					v-show="detail.picUrl"
					:src="detail.picUrl"
					alt=""
					class="left-image"
				/>
				<img
					v-show="!detail.picUrl"
					src="../../assets/images/popupPic.png"
					alt=""
					class="left-image"
				/>
			</div>
			<div class="right">
				<h2 :class="{ 'link-text': detail.linkUrl }" @click="toNewPage">
					{{ detail.title }}
				</h2>
				<div class="content">
					{{ detail.content }}
				</div>
				<div class="publishTime">
					<i class="el-icon-time"
						><span class="publishTime-content">{{
							detail.publishTime
						}}</span></i
					>
				</div>
				<iButton @click="closeDialog" class="btn">{{
					language('确认')
				}}</iButton>
			</div>
		</div>
	</iDialog>
</template>

<script>
import { iDialog, iButton } from 'rise'
export default {
	name: 'detailDialog',
	components: { iDialog, iButton },
	props: {
		detail: {
			type: Object,
			default: function() {
				return {
					title: '',
					content: '',
					picUrl: '',
					linkUrl: '',
					publishTime: '',
					popupStyle: '',
				}
			},
		},
		show: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			loading: false,
		}
	},
	created() {
		this.loading = true
		window.setTimeout(() => {
			this.loading = false
		}, 1000)
	},
	methods: {
		toNewPage() {
			if (this.detail.linkUrl) {
				window.open(this.detail.linkUrl)
			}
		},
		closeDialog() {
			this.$emit('update:show', false)
		},
	},
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
	position: relative;
}
.black-style {
	::v-deep .el-dialog__header {
		background-color: #151316;
		border-radius: 10px 0 0 0;
	}
	::v-deep .el-dialog__body {
		background-color: #151316;
		border-radius: 0 0 0 10px;
	}
}
.main {
	display: flex;
	height: 440px;
	width: 100%;
	justify-content: space-between;
	.left {
		width: 400px;
		height: 100%;
		position: absolute;
		top: 0px;
		left: 0px;
		.left-image {
			width: 100%;
			height: 100%;
			border-radius: 10px;
		}
	}
	.right {
		position: relative;
		// display: flex;
		// flex-direction: column;
		width: 100%;
		height: 100%;
		margin-left: 430px;
		.content,
		.btn {
			position: absolute;
			bottom: 60px;
		}
		.publishTime {
			position: absolute;
			display: inline-block;
			bottom: 120px;
			color: #1660f1;
			.publishTime-content {
				color: #666666;
				margin-left: 20px;
				font-size: 16px;
			}
		}
		.content {
			position: absolute;
			top: 70px;
			line-height: 24px;
			max-height: 200px;
			overflow: auto;
		}
	}
}
.center-style {
	display: flex;
	flex-direction: column;
	align-items: center;
	.left {
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		.left-image {
			width: 100%;
			height: 200px;
			border-radius: 10px 10px 0 0;
		}
	}
	.right {
		margin-top: 160px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		> h2,
		.content,
		.publishTime,
		.btn {
			margin-bottom: 20px;
		}
		.content {
			line-height: 24px;
		}
		.publishTime {
			width: 250px;
			padding: 5px;
			color: #1660f1;
			border: solid rgb(229, 229, 229) 1px;
			.publishTime-content {
				margin-left: 20px;
				color: #1b1d21;
			}
		}
	}
}
.right-style {
	display: flex;
	height: 440px;
	width: 100%;
	background: #151316;
	justify-content: space-between;
	.left {
		width: 400px;
		height: 100%;
		position: absolute;
		top: 0px;
		left: 0px;
		.left-image {
			width: 100%;
			height: 100%;
			border-radius: 10px;
		}
	}
	.right {
		position: relative;
		// display: flex;
		// flex-direction: column;
		width: 100%;
		height: 100%;
		margin-left: 430px;
		> h2 {
			color: #ffffff;
		}
		.content,
		.btn {
			position: absolute;
			bottom: 60px;
		}
		.publishTime {
			position: absolute;
			display: inline-block;
			bottom: 120px;
			color: #1660f1;
			.publishTime-content {
				color: #ffffff;
				margin-left: 20px;
				font-size: 16px;
			}
		}
		.content {
			position: absolute;
			top: 70px;
			color: #888888;
			line-height: 24px;
			max-height: 200px;
			overflow: auto;
		}
	}
}

.link-text {
	text-decoration: underline;
	cursor: pointer;
}
</style>
