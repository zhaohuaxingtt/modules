<template>
	<el-popover
		placement="bottom"
		trigger="click"
		:popper-class="'setting-popover'"
		v-model="visible"
		@show="handleShow"
		@hide="handleHide"
	>
		<div class="admin-menus">
			<div class="title flex-align-center">
				<icon symbol class="icon" name="iconSetting" />
				<!-- <span class="margin-left10">{{ $t('topLayout.setting.personal') | capitalizeFilter }}</span> -->
				<span class="margin-left10">{{
					language('个人设置', '个人设置')
				}}</span>
			</div>
			<div>
				<div
					v-for="(menu, index) in menus_genaral"
					:key="index"
					@click="handleProfileClick(menu)"
					:class="{
						'flex-between-center-center': true,
						menu: true,
						active: $route.path === menu.path,
					}"
				>
					<span>{{ language(menu.title, menu.title) }}</span>
				</div>
			</div>
			<div v-if="menus_admin.length">
				<div class="title flex-align-center">
					<icon symbol class="icon" name="iconguanliyuanshezhi" />
					<!-- <span class="margin-left10">{{ $t('topLayout.setting.admin') | capitalizeFilter }}</span> -->
					<span class="margin-left10">{{ language('管理端', '管理端') }}</span>
				</div>
				<div>
					<div
						v-for="(menu, index) in menus_admin"
						:key="index"
						@click="handleRedirect(menu)"
						:class="{
							'flex-between-center-center': true,
							menu: true,
							active:
								activeMenu &&
								activeMenu.length > 1 &&
								activeMenu[1] === menu.permissionKey,
							disabled: !menu.url,
						}"
						:url="menu.url"
					>
						<span>{{ language(menu.title, menu.title) }}</span>
					</div>
				</div>
			</div>
		</div>
		<div
			:class="['user', { active: active || usernameActive }]"
			slot="reference"
		>
			<el-avatar class="icon" :src="avatar"></el-avatar>
			<div class="info">
				<p class="name">{{ userInfo.nameZh || 'admin' }}</p>
				<p class="dept">{{ deptName }}</p>
			</div>
		</div>
	</el-popover>
</template>

<script>
import { icon, iMessage } from 'rise'
import filters from '@/utils/filters'

export default {
	mixins: [filters],
	props: {
		userInfo: {
			type: Object,
			default: function() {
				return {}
			},
		},
		menus: {
			type: Array,
			default: function() {
				return []
			},
		},
		activeMenu: {
			type: Array,
			default: function() {
				return []
			},
		},
	},
	components: {
		icon,
	},
	computed: {
		deptName() {
			if (!this.userInfo) {
				return ''
			}
			return this.userInfo?.deptDTO?.nameZh || ''
		},
		usernameActive() {
			return (
				this.activeMenu &&
				this.activeMenu.length &&
				this.activeMenu[0] === 'RISE_ADMIN'
			)
		},
		avatar() {
			return this.userInfo?.profile?.path || ''
		},
	},
	data() {
		const _self = this
		return {
			active: false,
			menus_genaral: [
				{
					title: '个人信息',
					name: 'profile',
				},
				{
					title: '设置',
					name: 'setting',
					url: '/portal/#/setting',
					path: '/setting',
				},
				{
					title: '退出登录',
					name: 'logout',
				},
			],
			menus_admin: [],
			visible: false,
		}
	},
	methods: {
		handleShow() {
			this.active = true
			this.menus_admin = this.menus
		},
		handleHide() {
			this.active = false
		},
		//模拟退出登录方法
		logout() {
			this.$emit('click-menu', 'logout')
		},
		handleProfileClick(menu) {
			if (menu.name === 'logout') {
				this.logout()
			} else if (menu.name === 'setting') {
				window.location.href = '/portal/#/setting'
			} else {
				// iMessage.success('coming soon')
				this.$emit('click-menu', menu.name)
			}
			this.visible = false
		},
		handleRedirect(menu) {
			window.sessionStorage.setItem('seconedPerminssionKey', menu.permissionKey)
			if (!menu.url) {
				iMessage.success('coming soon')
			} else if (menu?.url.indexOf('http') !== -1) {
				this.$emit('click-menu')
				location.href = menu.url
				/* if (menu.target !== '_blank') {
          this.$emit('click-menu')
          location.href = menu.url
        } else {
          window.open(menu.url)
        } */
			} else {
				if (this.$route.path !== menu.url) {
					this.$emit('click-menu')
					this.$router.push(menu.url)
				}
			}
			this.visible = false
		},
		removeToken() {
			const keys = document.cookie.match(/[^ =;]+(?==)/g)
			if (keys) {
				for (let i = keys.length; i--; ) {
					// 清除当前域名下的,例如：m.csvw.com
					const outDate = new Date(0).toUTCString()
					document.cookie = `${keys[i]}=0;path=/;expires=${outDate}`
					document.cookie = `${keys[i]}=0;path=/;domain=${document.domain};expires=${outDate}` // 清除当前域名下的，例如 .m.csvw.com
					document.cookie = `${keys[i]}=0;path=/;domain=csvw.com;expires=${outDate}` // 清除一级域名下的或指定的，例如 .csvw.com
				}
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.user {
	height: 60px;
	line-height: 60px;
	display: flex;
	align-items: center;
	cursor: pointer;

	&.active {
		border-bottom: 3px solid #67C23A;
	}

	.icon {
		width: 44px;
		height: 44px;

		::v-deep img {
			position: relative;
			left: 50%;
			transform: translate(-50%, 0);
		}
	}

	.info {
		margin-left: 26px;

		.name {
			font-size: 16px;
			line-height: 20px;
		}

		.dept {
			margin-top: 4px;
			font-size: 16px;
			line-height: 16px;
			color: $color-header-gray;
		}
	}
}
</style>
<style lang="scss">
.el-popover {
	&.setting-popover {
		width: 330px;
		padding: 0px;

		.admin-menus {
			max-height: calc(100vh - 80px);
			overflow-y: auto;

			> div {
				&:last-child {
					> .menu {
						&:last-child {
							margin-bottom: 15px;
						}
					}
				}
			}

			.title {
				font-weight: bold;
				color: #5f6f8f;
				font-size: 16px;
				padding: 15px 0 15px 20px;
			}

			> .title:first-child {
				padding-top: 30px;
			}

			.menu {
				cursor: pointer;
				color: #707070;
				padding: 15px 0 15px 50px;
				font-size: 14px;

				&:hover,
				&.active {
					border-left: 3px solid #67C23A;
					font-weight: bold;
					background: rgba(22, 96, 241, 0.08);
				}

				&.disabled {
					pointer-events: none;
					cursor: not-allowed;
					color: rgba(0, 0, 0, 0.4);
				}
			}
		}
	}
}
</style>
