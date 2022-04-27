<template>
	<div class="layout-notify">
		<notifyDialog
			v-if="dialogVisible"
			:dialogVisible.sync="dialogVisible"
			:detail="detail"
			@is-sure="handleDialogSure"
		/>
	</div>
</template>

<script>
import notifyDialog from './notifyDialog.vue'
import { getPopupList } from '../../api'
import { getgetPopupSocketMessage } from '@/api/mail'
import { Notification } from 'element-ui'
export default {
	name: 'layoutNotify',
	components: {
		notifyDialog,
	},
	data() {
		return {
			dialogVisible: false,
			detail: {
				title: '',
				content: '',
				picUrl: '',
				linkUrl: '',
				publishTime: '',
				popupStyle: '',
				wordAlign: '0',
				popupId: '',
			},
			popupDataList: [],
			closePopupSocket: null,
		}
	},
	mounted() {
		this.closePopupSocket = getgetPopupSocketMessage((res) => {
			this.getLatest()
		})
	},
	beforeDestroy() {
		if (this.closePopupSocket) {
			this.closePopupSocket()
		}
		this.clearNotify()
	},
	created() {
		this.getLatest()
	},
	methods: {
		getLatest() {
			console.log('window.requestNotifiy', window.requestNotifiy)
			if (!window.requestNotifiy) {
				window.requestNotifiy = true
				const accountId = JSON.parse(
					sessionStorage.getItem('userInfo')
				)?.accountId
				if(accountId)
				getPopupList(accountId)
					.then((res) => {
						if (res?.code == 200) {
							let popupDataList = res.data
							this.popupDataList = popupDataList.reverse()
							this.showNotify()
						} else {
							this.$message.error(res.desZh)
						}
					})
					.finally(() => {
						window.requestNotifiy = false
					})
			}
		},
		clearNotify() {
			Notification.closeAll()
			const elements = document.querySelectorAll('.notifyHandel')
			if (elements) {
				elements.forEach((e) => {
					e.remove()
				})
			}
		},
		showNotify() {
			this.clearNotify()
			this.popupDataList.forEach((e) => {
				setTimeout(()=>Notification(this.getNotifyOption(e)),100)
			})
		},
		getNotifyOption(ele) {
			const _this = this
			return {
				duration: 0,
				dangerouslyUseHTMLString: true,
				customClass: 'notifyHandel notifyHandel_' + ele.id,
				message: `<div style='display: flex;justify-content: space-between;cursor:pointer'>
                          <div class="popupLeft" style='width:50px;height:50px; '>
                              <img src="${
																ele.picUrl ||
																'/portal/static/img/popupPic.f3ff87ac.png'
															}" style='width:100%;height:100%; border-radius: 50%;'>
                          </div>
                          <div class="popupRight" style='position:relative;margin-left:20px'>
                              <p class='${ele.linkUrl && 'linkTitle'}'
                              style='overflow:hidden;white-space:nowrap;text-overflow:ellipsis;height:100%;
                              width:100px;font-weight:bolder;font-size:16px;position:absolute;color: #0D2451;'
                              >
                              ${ele.popupName}
                              </p>
                              <p style='overflow: hidden;white-space:nowrap;text-overflow:ellipsis;width:150px;position:absolute;top:30px;color: #4B5C7D;'
                              >${ele.content}</p>
                          </div>
                      </div>`,
				position: 'bottom-right',
				onClick() {
					_this.openDialog(ele)
				},
				onClose() {},
			}
		},
		openDialog(ele) {
			console.log('open dialog', ele)
			this.dialogVisible = false
			const {
				publishTime,
				popupName,
				content,
				picUrl,
				linkUrl,
				popupStyle,
				wordAlign,
				id,
			} = ele
			const y = publishTime.slice(0, 4)
			const M = publishTime.slice(5, 7)
			const d = publishTime.slice(8, 10)
			const h = publishTime.slice(11, 13)
			const m = publishTime.slice(14, 16)
			const time = `${y}年${M}月${d}日 ${h}时${m}分`
			this.detail = {
				title: popupName,
				content,
				picUrl,
				linkUrl,
				publishTime: time,
				popupStyle: popupStyle,
				wordAlign: wordAlign,
				popupId: id,
			}
			this.dialogVisible = true
		},
		handleDialogSure() {
			this.clearNotify()
			this.$nextTick(()=>{
				this.getLatest()
			})
		},
	},
}
</script>

<style lang="scss">
.popupContent {
	width: 600px;
	height: 100%;
}
.notifyHandel {
	margin: 0px;
}
</style>
