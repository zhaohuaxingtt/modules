<template>
	<div class="avatar" title="点击上传头像">
		<ImgCutter
			:cutWidth="400"
			:cutHeight="400"
			rate="1:1"
			fileType="png"
			@cutDown="handleCutDown"
		>
			<icon
				v-if="!avatar"
				symbol
				name="iconmorentouxiang"
				class="default-avatar"
				slot="open"
			/>

			<img v-else :src="avatar" class="avatar-img" slot="open" />
		</ImgCutter>
	</div>
</template>

<script>
import { Icon } from 'rise'
import ImgCutter from '../../vueImgCutter'
export default {
	name: 'profileHeaderAvatar',
	components: { Icon, ImgCutter },
	props: {
		avatar: {
			type: String,
		},
	},
	inject: ['uploadAvatar'],
	methods: {
		handleCutDown(content) {
			this.uploadAvatar(content)
		},
	},
}
</script>

<style lang="scss" scoped>
.avatar {
	width: 84px;
	height: 84px;
	border-radius: 42px;
	margin-right: 40px;
	cursor: pointer;
}
.avatar-img {
	width: 84px;
	height: 84px;
	border-radius: 42px;
}

.default-avatar {
	font-size: 84px;
}
</style>
