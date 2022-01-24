<template>
  <div class="header">
    <div class="profile">
      <headerAvatar :avatar="avatar" />
      <headerUsername
        :nameZh="userInfo.nameZh"
        :nameEn="userInfo.nameEn"
        :gender="userInfo.gender"
      />
    </div>
    <div class="logo">
      <img src="../../../assets/images/rise.png" alt="RiSE" />
    </div>
  </div>
</template>

<script>
import headerAvatar from './headerAvatar'
import headerUsername from './headerUsername'
export default {
  name: 'profileHeader',
  components: { headerAvatar, headerUsername },
  computed: {
    userInfo() {
      return this.$store.state.permission.userInfo || {}
    },
    avatar() {
      return this.userInfo?.profile?.path || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 44px;
  border-bottom: solid 1px rgba(112, 112, 112, 0.15);
}
.profile {
  display: flex;
  color: #000000;
}
.logo {
  width: 68px;
  height: 35px;
  img {
    max-width: 100%;
  }
}
</style>
