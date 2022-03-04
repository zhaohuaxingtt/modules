<template>
	<div class="file-downloader">
		<el-button @click="handleDownloadBatch" type="primary" v-if="type"
			>批量下载</el-button
		>
		<div v-if="type === 2 || !type">
			<el-row
				v-for="(item, index) in fileList"
				:key="index"
				type="flex"
				class="row-bg"
				justify="space-between"
			>
				<el-col :span="8">
					<div @click="handlePreview(item)" class="name">{{ item.name }}</div>
				</el-col>
				<el-col :span="3"
					><i
						class="el-icon-download download"
						@click="handleDownload(item)"
					></i
				></el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
import getResCode from '../../resCode'
export default {
	props: {
		fileIds: {
			type: Array,
			default: function() {
				return []
			},
		},
		type: {
			type: Number,
			default: function() {
				return 0
			},
		},
	},
	data() {
		return {
			fileList: [],
		}
	},
	async mounted() {
		const http = new XMLHttpRequest()
		const url = `/fileud/batchSelectByIds`
		http.open('POST', url, true)
		http.setRequestHeader('content-type', 'application/json')
		http.setRequestHeader('resCode', getResCode('/fileud/batchSelectByIds'))
		http.onreadystatechange = () => {
			if (http.readyState === 4) {
				console.log('http', JSON.parse(http.responseText))
				const result = JSON.parse(http.responseText)
				this.fileList = result
			}
		}
		const sendData = this.fileIds
		http.send(JSON.stringify(sendData))
	},
	methods: {
		handlePreview(item) {
			window.open(item.path, '_blank')
		},
		handleDownload(item) {
			this.download(item.id)
		},
		download(id) {
			const xhr = new XMLHttpRequest()
			xhr.open('POST', `/fileud/udDown?fileIds=${id}`, true)
			xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
			xhr.setRequestHeader('resCode', getResCode('/fileud/udDown'))
			xhr.responseType = 'blob'
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					const response = xhr.response
					const contentDisposition = xhr.getResponseHeader(
						'content-disposition'
					)
					const filename = contentDisposition.split('=')[1]
					const elink = document.createElement('a')
					const blob = response
					const url = window.URL.createObjectURL(blob)
					elink.download = filename
					elink.style.display = 'none'
					elink.href = url
					elink.click()
					document.body.removeChild(elink)
					window.URL.revokeObjectURL(url)
				}
			}
			xhr.send()
		},
		handleDownloadBatch() {
			const ids = this.fileList
				.map((file) => {
					return file.id
				})
				.join(',')
			this.download(ids)
		},
	},
}
</script>
<style lang="scss">
.file-downloader {
	.name {
		cursor: pointer;
	}
	.download {
		cursor: pointer;
	}
}
.file-downloader .name:hover {
	color: $color-blue;
}
</style>
