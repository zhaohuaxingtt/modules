<template>
  <div class="middle">
    <middleItem label="Department:" :value="userInfo.deptDTO.nameZh" />
    <middleItem label="Position:" :value="userInfo.positionDTO.fullNameZh" />
    <middleItem label="Employee Number:" :value="userInfo.userNum" />
  </div>
</template>

<script>
import middleItem from './middleItem'
export default {
  name: 'profileMiddle',
  components: { middleItem },
  computed: {
    userInfo() {
      return this.$store.state.permission.userInfo || {}
    }
  }
}
</script>

<style lang="scss" scoped>
.middle {
  margin: 30px 0px 30px 0px;
  display: flex;
  justify-content: space-between;
}
</style>
