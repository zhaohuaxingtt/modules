export default function getResCode(requestUrl) {
	const url = getUrl(requestUrl)
	let userName = ''
	if (!userName) {
		const useInfo = window.sessionStorage.getItem('userInfo') || ''
		if (useInfo) {
			try {
				const userInfo = JSON.parse(useInfo) || {}
				userName = userInfo?.userName || ''
			} catch (err) {
				console.log(err)
			}
		}
	}
	if (userName && url) {
		return toBase64([userName, url, ''].join('@@@'))
	}
	return ''
}

function getUrl(requestUrl) {
	const urlArr = requestUrl.split('?')
	return urlArr.length ? urlArr[0] : ''
}

function toBase64(str) {
	// 对字符串进行编码
	var encode = encodeURI(str)
	// 对编码的字符串转化base64
	var base64 = btoa(encode)
	return base64
}
