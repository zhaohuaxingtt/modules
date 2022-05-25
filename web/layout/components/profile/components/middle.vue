<template>
	<div class="middle">
		<middleItem label="Department:" :value="deptName" />
		<middleItem
			label="Position:"
			:description="positionList.length > 1 ? langSwitchPositionTips : ''"
		>
			<div class="position-panel">
				<div
					class="position-label"
					v-for="item in positionList"
					:key="item.id"
					:class="{ active: positionDtoId === item.id }"
					:title="positionDtoId !== item.id ? langSwitchPosition : ''"
					@click="handleSwitchPosition(item)"
				>
					<icon
						v-if="positionDtoId === item.id"
						symbol
						name="iconshenpiliu-yishenpi"
						style="font-size: 14px"
					/>
					<span class="name">{{ item.fullNameZh }}</span>
				</div>
			</div>
		</middleItem>
		<middleItem label="Employee Number:" :value="userInfo.userNum" />
	</div>
</template>

<script>
import middleItem from './middleItem'
import { switchPosition } from '../../../api'
import { Icon, iMessage } from 'rise'
export default {
	name: 'profileMiddle',
	components: { middleItem, Icon },
	computed: {
		userInfo() {
			return this.$store.state.permission.userInfo || {}
		},
		positionList() {
			return this.userInfo.positionList || []
		},
		positionDtoId() {
			return this.userInfo?.positionDTO?.id
		},
		deptName() {
			return this.userInfo?.deptDTO?.nameZh
		},
		locale() {
			return this.$i18n.locale || 'zh'
		},
		langSwitchPosition() {
			return this.locale === 'zh' ? '点击切换岗位' : 'Click to switch posts'
		},
		langSwitchPositionTips() {
			return this.locale === 'zh'
				? '多岗位时，单击非当前岗位名称可切换岗位'
				: 'If there are multiple positions, you can click a non-current position name to switch positions'
		},
		langConfirmTitle() {
			return this.locale === 'zh' ? '确定信息' : 'Confirm'
		},
		langConfirmText() {
			return this.locale === 'zh'
				? '确定要切换岗位吗，切换岗位请关闭与系统相关的其他浏览器标签。'
				: 'Are you sure you want to switch positions? To switch positions, please close other browser tabs related to the system.'
		},
	},
	methods: {
		handleSwitchPosition(position) {
			if (this.positionDtoId === position.id) {
				return
			}

			this.$confirm(this.langConfirmText, this.langConfirmTitle, {
				confirmButtonText: this.$t('确认'),
				cancelButtonText: this.$t('取消'),
				type: 'warning',
			})
				.then(() => {
					const req = {
						positionId: position.id,
					}
					switchPosition(req)
						.then((res) => {
							if (res.code == 200) {
								this.$emit('close')
								window.sessionStorage.removeItem('userInfo')
								window.sessionStorage.removeItem('cardList')
								window.sessionStorage.removeItem('columnConfig')
								this.$store.commit('SET_USER_INFO', {})
								this.$store.commit('SET_CARD_LIST', {})
								const currentPath = window.location.href.replace(
									window.location.origin,
									''
								)
								if (currentPath === '/portal/#/index') {
									window.location.reload()
								} else {
									window.location.href = '/portal/#/index'
								}
							} else {
								iMessage.error(res.desZh || '岗位切换失败！')
							}
						})
						.catch((err) => {
							iMessage.error(err.desZh || '岗位切换失败！')
						})
				})
				.catch((err) => {
					console.log(err)
				})
		},
	},
}
</script>

<style lang="scss" scoped>
.middle {
	margin: 30px 0px 30px 0px;
	display: flex;
	justify-content: space-between;
}
.position-panel {
	display: flex;
	align-items: center;
}
.position-label {
	margin-right: 10px;
	cursor: pointer;
	display: flex;
	align-items: center;
	&.active {
		color: $color-blue;
		cursor: default;
	}
	&:hover {
		color: $color-blue;
	}
	.name {
		margin-left: 5px;
	}
}
</style>
