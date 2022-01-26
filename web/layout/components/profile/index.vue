<template>
  <iDialog
    :visible.sync="isShow"
    @close="onClose"
    width="800px"
    min-height="400px"
    append-to-body
  >
    <div v-loading="loading">
      <profileHeader :loading.sync="loading" />
      <middle />
      <bottom ref="bottom" :loading.sync="loading" />
    </div>
    <div slot="footer">
      <iButton @click="isShow = false">确定</iButton>
    </div>
  </iDialog>
</template>

<script>
import { iDialog, iButton, iMessage } from 'rise'
import { profileHeader, middle, bottom } from './components'
import { updateUserInfo, uploadAvatar } from '../../api'
export default {
  name: 'UserProfile',
  components: { iDialog, profileHeader, middle, bottom, iButton },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  provide() {
    return {
      updateUser: this.handleUpdate,
      uploadAvatar: this.handleUploadAvatar
    }
  },
  data() {
    return {
      isShow: false,
      loading: false
    }
  },
  computed: {
    userInfo() {
      return this.$store.state?.permission?.userInfo || {}
    }
  },
  watch: {
    visible(val) {
      this.isShow = val
    }
  },
  created() {
    this.isShow = this.visible
  },
  methods: {
    onClose() {
      this.$refs.bottom.setReadonly()
      this.$emit('update:visible', false)
    },
    handleUpdate(data) {
      if (data) {
        this.loading = true
        updateUserInfo(data)
          .then((res) => {
            if (res.result) {
              const keys = Object.keys(data)
              keys.forEach((key) => {
                this.userInfo[key] = data[key]
              })

              window.sessionStorage.setItem(
                'userInfo',
                JSON.stringify(this.userInfo)
              )
              this.$store.commit('SET_USER_INFO', this.userInfo)
              this.$refs.bottom.setReadonly()
              iMessage.success(res.desZh || '更新成功')
            } else {
              iMessage.error(res.desZh || '更新失败')
            }
          })
          .catch((err) => {
            console.log('err', err)
            iMessage.error(err.desZh || '更新失败')
          })
          .finally(() => (this.loading = false))
      }
    },
    handleUploadAvatar(content) {
      const formData = new FormData()
      formData.append('file', content.file)
      formData.append('applicationName', 'rise-usercenter')
      formData.append('businessId', 1)
      formData.append('isTemp', 0)
      formData.append('type ', 1)
      formData.append(
        'currentUser',
        this.$store.state.permission.userInfo.userName
      )
      this.loading = true
      uploadAvatar(formData)
        .then((res) => {
          if (res && res.result) {
            this.handleUpdate({ profile: res.data, profileId: res.data.id })
          } else {
            this.loading = false
            iMessage.error(res.desZh || this.language('上传失败'))
          }
        })
        .catch((err) => {
          this.loading = false
          iMessage.error(err.desZh || this.language('上传失败'))
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
