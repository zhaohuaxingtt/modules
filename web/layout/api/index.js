import axios from '@/utils/axios'

const requestPopup = axios(process.env.VUE_APP_MAIL)
const requestUSER = axios(process.env.VUE_APP_USER_CENTER)
const requestFile = axios(process.env.VUE_APP_FILEAPI + '/fileud')

export function updateModules(params) {
	return requestUSER({
		url: '/home/module/update',
		method: 'POST',
		data: params,
	})
}

export function updateBatchModules(data) {
	return requestUSER({
		url: '/home/module/updateBatch',
		method: 'POST',
		data,
	})
}

//获取最新的popup
export function getPopupList(data) {
	return requestPopup({
		url: `/popup/lastest5/${data}`,
		method: 'GET',
		data,
	})
}

//改成这条消息已读
export function changeCheckedSta(data) {
	const userId = data.userId
	const popupId = data.popupId
	return requestPopup({
		url: `/popup/detail/${userId}/${popupId}`,
		method: 'GET',
		// params:data
	})
}
//  个人信息/更新局部字段
export function updateUserInfo(data) {
	return requestUSER({
		url: '/web/sapUser/updateUserInfo',
		method: 'POST',
		data,
	})
}

export function uploadAvatar(data) {
	return requestFile({
		url: `/udSingleFile`,
		method: 'post',
		data,
	})
}

/**
 *
 * @param {*} data
 * @returns 查询已收藏
 */
export function queryFavorites(data) {
	return requestUSER({
		url: '/web/sapUser/getFavoriteList',
		method: 'post',
		data,
	})
}

// 切换岗位
export function switchPosition(params) {
	return requestUSER({
		url: `/web/switchPosition`,
		params,
	})
}
