<template>
	<div class="file-downloader">
		<el-row v-for="(item, index) in fileList" :key="index" type="flex" class="row-bg" justify="space-between">
			<el-col :span="8">
				<div @click="handlePreview(item)" class="name">{{ item.name }}</div>
			</el-col>
			<el-col :span="3"><i class="el-icon-download download" @click="handleDownload(item)"></i></el-col>
		</el-row>
	</div>
</template>

<script>
export default {
	props: {
		fileIds: {
			type: Array,
			default: function() {
				return []
			}
		}
	},
	data() {
		return {
			fileList: []
		}
	},
	mounted() {
		const http = new XMLHttpRequest()
		const url = `/fileud/batchSelectByIds`
		http.open('POST', url, true)
		http.setRequestHeader('content-type', 'application/json')
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
			window.open('/fileud/udDown?files=' + item.id, '_blank')
		}
	}
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
