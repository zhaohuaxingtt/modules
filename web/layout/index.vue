<!--
 * @Author: yuszhou
 * @Date: 2020-07-22 14:56:34
 * @LastEditTime: 2021-03-25 23:15:21
 * @LastEditors: Please set LastEditors
 * @Description: 项目默认layout
 * @FilePath: \test\src\layout\default.vue
-->
<template>
	<div class="content">
		<topLayout
			:menus="menus_admin"
			:active-menu="activeMenu"
			@click-menu="handleClickAdminMenu"
		></topLayout>
		<leftLayout
			ref="leftLayout"
			:menus="menus"
			:active-menu="activeMenu"
			@toggle-active="toggleActive"
			@set-menu-modal-visible="setMenuModalVisible"
		>
			<template slot="menu" v-if="activeIndex != 'RISE_HOME'">
				<sideMenu
					:side-menus="sideMenus"
					:menu-map="menuMap"
					:active-menu="activeMenu"
					@hide-side-menu="hideSideMenu"
				/>
			</template>
			<template slot="dashboard" v-else>
				<myModules :index="activeIndex" />
			</template>
		</leftLayout>
		<div class="app-content" :class="{ keepAlive: $route.meta.keepAlive }">
			<keep-alive>
				<router-view v-if="$route.meta.keepAlive" :key="$route.fullPath">
				</router-view>
			</keep-alive>
			<router-view v-if="!$route.meta.keepAlive" :key="$route.fullPath" />
			<div
				v-if="menuModelVisible"
				class="app-menu-model"
				@click="hideSideMenu"
			></div>
		</div>
		<div class="btn-button" @click="handleShow">
			<!-- <img src="~@/assets/images/leftContent.png" alt="" /> -->
			<img :src="!contentShowFlag ? popurIcon : activePopurIcon" alt="" />
		</div>
		<div class="povper-content" v-show="contentShowFlag">
			<div v-for="(list, index) in popoverList" :key="index">
				<div class="item-content" @click="handleClick(list)">
					<div><img src="../images/partLifyCycle.svg" class="img" /></div>
					<div class="text">{{ list.name }}</div>
				</div>
			</div>
			<!-- <div class="item-content">零件寿命周期</div>
      <div class="item-content">外部数据查询</div>
      <div class="item-content" >用户助手</div> -->
		</div>
	</div>
</template>
<script>
import topLayout from './components/topLayout/'
import LeftLayout from './components/leftLayout'
import sideMenu from './components/sideMenu'
import myModules from './components/myModules'
import { arrayToTree, treeToArray } from '@/utils'
import { popoverList } from './components/data.js'

import popurIcon from './assets/images/leftContent.png'
import activePopurIcon from './assets/images/active-popur.svg'

export default {
	components: { topLayout, LeftLayout, sideMenu, myModules },
	props: {
		menus: {
			type: Array,
			default: function() {
				return []
			},
		},
	},
	data() {
		return {
			activeIndex: '',
			menuMap: {},
			menus_admin: [],
			menu2IconMap: {
				RISE_HOME: ['iconhomeweixuanzhong', 'iconhomexuanzhong'],
				RISE_WORKBENCH: ['iconworkbenchweixuanzhong', 'iconworkbenchxuanzhong'],
				RISE_GP: ['icona-GPtubiaohei', 'icona-GPtubiaolan'],
				RISE_COMMON_FUNCTION: [
					'iconcommonfunctionweixuanzhong',
					'iconcommonfunctionxuanzhong',
				],
				RISE_ADMIN: ['', ''],
			},
			menuModelVisible: false,
			popoverList,
			contentShowFlag: false,
			activeMenu: [],
			popurIcon,
			activePopurIcon,
		}
	},
	watch: {
		'$route.path'() {
			this.setActiveMenu()
		},
	},
	computed: {
		// eslint-disable-next-line no-undef
		...Vuex.mapState({
			menuList: (state) => state.permission.menuList,
		}),
		sideMenus() {
			if (this.menus.length > 0) {
				// const activeMenu = this.menus[this.activeIndex]
				const activeMenu = this.menus.find((item) => {
					return item.permissionKey === this.activeIndex
				})
				if (activeMenu && activeMenu.subMenus) {
					return activeMenu.subMenus
				}
			}
			return []
		},
	},
	created() {
		/* this.$nextTick(()=>{
      this.$refs.popupNotify.getPopupItemList()
    }) */

		this.menus && this.menus.length ? this.getMenus() : this.getMenuList()
		this.setActiveMenu()
	},
	methods: {
		setActiveMenu() {
			const meta = this.$route.meta
			if (meta) {
				this.activeMenu = meta.activeMenu || []
			}
		},
		handleShow() {
			this.contentShowFlag = !this.contentShowFlag
		},
		getMenus() {
			const menuMap = this.getMenusMap(this.menuList)
			this.menuMap = menuMap
		},
		getMenuList() {
			const menuList = _.cloneDeep(this.menuList)
			const list = treeToArray(menuList, 'menuList')
			list.forEach((item) => {
				item.title = item.name
				item.key = item.id
				item.permissionKey === 'RISE_HOME'
					? // item.url.slice(9)//
					  (item.url = process.env.VUE_APP_HOST + item.url)
					: ''
				if (
					item.parentId &&
					item.url &&
					item.url.indexOf('http') === -1 &&
					item.url.indexOf('https') === -1
				) {
					item.url = process.env.VUE_APP_HOST + item.url
				} else {
					item.url = item.url || ''
				}

				if (!item.parentId) {
					item.icon =
						(this.menu2IconMap[item.permissionKey] &&
							this.menu2IconMap[item.permissionKey][0]) ||
						''
					item.activeIcon =
						(this.menu2IconMap[item.permissionKey] &&
							this.menu2IconMap[item.permissionKey][1]) ||
						''
				}
			})
			const menus_tree_all = arrayToTree(list, 'id', 'parentId', 'subMenus')
			const menus_tree_normal = menus_tree_all.filter((item) => {
				return item.name !== 'ADMIN'
			})
			const menus_tree_admin = menus_tree_all.find((item) => {
				return item.name === 'ADMIN'
			})
			this.menus = menus_tree_normal
			const menuMap = this.getMenusMap(menus_tree_normal)
			this.menuMap = menuMap
			this.menus_admin = menus_tree_admin?.subMenus
		},
		toggleActive(index) {
			this.activeIndex = index
		},
		hideSideMenu() {
			this.$refs.leftLayout.hideSideMenu()
		},
		// 获取每个链接的父级
		getMenusMap(menus, parent, res) {
			res = res || {}
			for (let i = 0; i < menus.length; i++) {
				const menu = menus[i]
				if (!res[menu.url]) {
					res[menu.url] = []
				}
				parent = parent || []
				// console.log('parent', parent)
				res[menu.url].push(...[...new Set(parent)])
				res[menu.url].push(menu.url)

				if (menu.subMenus) {
					this.getMenusMap(menu.subMenus, res[menu.url], res)
				}
			}
			return res
		},
		setMenuModalVisible(val) {
			this.menuModelVisible = val
		},
		handleClick(list) {
			this.$router.push(list.path)
		},
		handleClickAdminMenu() {
			console.log('点击了admin 菜单')
			this.$refs.leftLayout.activeIndex = ''
		},
	},
}
</script>
<style lang="scss" scoped>
.content {
	height: 100%;
	width: 100%;
	.app-content {
		padding-left: 100px;
		padding-top: 60px;
		height: 100%;
		width: 100%;
		position: relative;
	}
	.povper-content {
		position: fixed;
		bottom: 40px;
		right: 120px;
		background-color: #fff;
		border-radius: 10%;
		box-shadow: 10px 10px 5px #e0e4ec;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.item-content {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			padding: 20px;
			cursor: pointer;
			.img {
				width: 40px;
				height: 40px;
			}
			.text {
				font-size: 16px;
				color: #5f6f8f;
				margin-left: 20px;
			}
		}
	}
	.btn-button {
		position: fixed;
		bottom: 40px;
		right: 50px;

		img {
			height: 50px;
			width: 50px;
		}
	}
	.app-menu-model {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 2;
	}
}
</style>
