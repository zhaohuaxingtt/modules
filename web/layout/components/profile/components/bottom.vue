<template>
  <div>
    <bottomItem label="Phone:" :text="userInfo.phone" />
    <bottomItem label="Email:" :text="userInfo.email" />
    <bottomItem label="Role:" :text="role" />
    <bottomItem
      ref="office"
      label="Office:"
      text-key="officeLocal"
      :text="userInfo.officeLocal"
      placeholder="请输入办公室地址"
      editable
      @update="handleUpdate"
    />
    <bottomItem
      ref="mobile"
      label="Mobile Phone:"
      text-key="mobile"
      :text="userInfo.mobile"
      placeholder="请输入手机号码"
      editable
    />
    <bottomItem
      ref="wechat"
      text-key="wechat"
      label="Wechat:"
      :text="userInfo.wechat"
      placeholder="请输入微信号"
      editable
    />
  </div>
</template>

<script>
import bottomItem from './bottomItem'
export default {
  name: 'bottom',
  components: { bottomItem },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    userInfo() {
      return this.$store.state?.permission?.userInfo || {}
    },
    role() {
      if (this.userInfo && this.userInfo.roleList) {
        return this.userInfo.roleList.map((e) => e.fullNameZh).join(',')
      }
      return ''
    }
  },
  methods: {
    setReadonly() {
      this.$refs.office.handleSetEdit(false)
      this.$refs.mobile.handleSetEdit(false)
      this.$refs.wechat.handleSetEdit(false)
    }
  }
}
</script>

<style lang="scss" scoped></style>
