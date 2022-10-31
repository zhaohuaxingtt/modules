import iMessage from '../../iMessage'
import getResCode from '../../../resCode'
export default {
	computed: {
		unCols() {
			// 列权限控制，返回无权限的字段列表
			if (!this.permissionKey) {
				return []
			}
			const columnPermissions = sessionStorage.getItem('columnConfig')
			if (columnPermissions) {
				const currentColumnPermission = JSON.parse(columnPermissions)[
					this.permissionKey
				]
				if (currentColumnPermission) {
					return currentColumnPermission.unCols
				}
			}
			return []
		},
		tableVisibleColumns() {
			// 表格的列
			if (this.tableColumns.length) {
				const noSettingColumns = [
					'selection',
					'customSelection',
					'index',
					'fullIndex',
					'customIndex'
				]
				// filterColumns：记录过滤固定序号列后剩余表格项
				const filterColumns = []
				// const filterColumns = this.tableColumns.filter(
				//   (e) => !e.isHidden && !this.unCols.includes(e.prop)
				// )
				this.tableColumns.forEach((e) => {
					// 表格数项添加到filterColumns
					if (!e.isHidden && !noSettingColumns.includes(e.type) && !this.unCols.includes(e.prop)) {
						const column = this.columns.find((c) => c.prop === e.prop)
						if (
							column &&
							!filterColumns.some(
								(fc) => fc.type === column.type && column.type
							)
						) {
							filterColumns.push(column)
						}
					}
				})
				// columns: 表格中使用到的固定项，从noSettingColumns中标注的几种过滤
				const columns = []
				this.columns.forEach((e) => {
					if (
						noSettingColumns.includes(e.type) &&
						!filterColumns.find((fe) => fe.type === e.type)
					) {
						columns.push(e)
					}
				})
				return columns.concat(filterColumns)
			}
			return this.columns.filter((e) => !this.unCols.includes(e.prop))
		},
		tableSettingColumns() {
			// 表格自由列表设置列
			const noSettingColumns = [
				'selection',
				'customSelection',
				'index',
				'fullIndex',
				'customIndex',
			]
			if (this.tableColumns.length) {
				return this.tableColumns.filter(
					(e) =>
						!this.unCols.includes(e.prop) && !noSettingColumns.includes(e.type)
				)
			}
			return this.columns.filter(
				(e) =>
					!this.unCols.includes(e.prop) && !noSettingColumns.includes(e.type)
			)
		},
		usercenterApiPrefix() {
			let env = window.sessionStorage.getItem('env') || this.env
			const baseMap = {
				'': '/usercenterApi',
				dev: '/usercenterApi',
				sit: '/usercenterApi',
				vmsit: '/usercenterApi',
				uat: '/usercenterApi',
				production: '/usercenterApi',
			}
			return baseMap[env.toLowerCase()] || '/usercenterApi'
		},
	},
	created() {
		if (this.permissionKey) {
			this.querySetting()
		}
	},
	methods: {
		/******************* 记忆列表 ********************/
		getCookie(name) {
			const strCookie = document.cookie //获取cookie字符串
			const arrCookie = strCookie.split('; ') //分割
			//遍历匹配
			for (let i = 0; i < arrCookie.length; i++) {
				if (arrCookie[i].indexOf(`${name}=`) === 0) {
					return arrCookie[i].replace(`${name}=`, '')
				}
			}
			return ''
		},
		openSetting() {
			this.settingVisible = true
		},
		handleSaveSetting(val) {
			const userInfo = window.sessionStorage.getItem('userInfo') || ''
			if (userInfo) {
				const userData = JSON.parse(userInfo)
				const accountId = userData?.accountId
				const http = new XMLHttpRequest()
				const url = `${this.usercenterApiPrefix}/web/configUserListMemory`
				http.open('POST', url, true)
				http.setRequestHeader('content-type', 'application/json')
				http.setRequestHeader('token', this.getCookie('token'))
				http.setRequestHeader(
					'resCode',
					getResCode('/web/configUserListMemory')
				)
				http.onreadystatechange = (res) => {
					if (http.readyState === 4 && http.status == 200) {
						const response = JSON.parse(http.responseText)
						if (response.code === '200') {
							this.tableColumns = val.length ? val : this.columns
							iMessage.success('保存成功')
						} else {
							iMessage.error('保存失败')
						}
					}
				}
				const requestData = {
					accountId: accountId,
					listConfig: JSON.stringify(val),
					permissionKey: this.permissionKey,
				}
				if (this.settingId) {
					requestData.id = this.settingId
				}
				http.send(JSON.stringify(requestData))
			}
		},
		handleResetSetting() {
			this.handleSaveSetting([])
		},
		querySetting() {
			/*  const userInfo = window.sessionStorage.getItem('userInfo') || ''
		if (userInfo) {
			const userData = JSON.parse(userInfo)
			const accountId = userData?.accountId */
			const http = new XMLHttpRequest()
			const url = `${this.usercenterApiPrefix}/web/getUserListMemory`
			http.open('POST', url, true)
			http.setRequestHeader('content-type', 'application/json')
			http.setRequestHeader('token', this.getCookie('token'))
			http.setRequestHeader('resCode', getResCode('/web/getUserListMemory'))
			http.onreadystatechange = () => {
				if (http.readyState === 4 && http.status == 200) {
					const response = JSON.parse(http.responseText).data
					if (response && response.length > 0) {
						this.tableColumns = JSON.parse(response[0].listConfig)
						this.settingId = response[0].id
					} else {
						this.tableColumns = this.columns
					}
				} else {
					this.tableColumns = this.columns
				}
			}
			const requestData = {
				permissionKey: this.permissionKey,
			}
			http.send(JSON.stringify(requestData))
		},
	},
}
