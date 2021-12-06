<template>
	<el-popover
		placement="bottom"
		trigger="click"
		:popper-class="'setting-popover'"
		@show="handleShow"
		@hide="handleHide"
	>
		<div class="admin-menus">
			<div class="title flex-align-center">
				<icon symbol class="icon" name="iconSetting" />
				<!-- <span class="margin-left10">{{ $t('topLayout.setting.personal') | capitalizeFilter }}</span> -->
				<span class="margin-left10">个人设置</span>
			</div>
			<div>
				<div
					v-for="(menu, index) in menus_genaral"
					:key="index"
					@click="handleProfileClick(menu)"
					:class="{
						'flex-between-center-center': true,
						menu: true,
						active: $route.path === menu.url,
						disabled: menu.name !== 'logout',
					}"
				>
					<span>{{ menu.title }}</span>
				</div>
			</div>
			<div v-if="menus_admin.length">
				<div class="title flex-align-center">
					<icon symbol class="icon" name="iconguanliyuanshezhi" />
					<!-- <span class="margin-left10">{{ $t('topLayout.setting.admin') | capitalizeFilter }}</span> -->
					<span class="margin-left10">管理端</span>
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
						<span>{{ menu.title }}</span>
					</div>
				</div>
			</div>
		</div>
		<div
			:class="['user', { active: active || usernameActive }]"
			slot="reference"
		>
			<el-avatar
				class="icon"
				src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3729239676,1542549068&fm=26&gp=0.jpg"
			></el-avatar>
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
import { removeToken } from '@/utils/index.js'
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
					title: _self.$t('setting'),
					name: 'setting',
				},
				{
					title: _self.$t('LK_TUICHUDENGLU'),
					name: 'logout',
				},
			],
			menus_admin: [],
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
			removeToken()
			window.sessionStorage.clear()
			window.localStorage.clear()
			this.$store.commit('SET_USER_INFO', {})
			removeToken()
			window.location.href = process.env.VUE_APP_LOGOUT_URL
		},
		handleProfileClick(menu) {
			if (menu.name === 'logout') {
				this.logout()
			} else {
				iMessage.success('coming soon')
			}
		},
		handleRedirect(menu) {
			if (!menu.url) {
				iMessage.success('coming soon')
			} else if (menu?.url.indexOf('http') !== -1) {
				if (menu.target !== '_blank') {
					this.$emit('click-menu')
					location.href = menu.url
				} else {
					window.open(menu.url)
				}
			} else {
				if (this.$route.path !== menu.url) {
					this.$emit('click-menu')
					this.$router.push(menu.url)
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
		border-bottom: 3px solid #1763f7;
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
					border-left: 3px solid #1660f1;
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
