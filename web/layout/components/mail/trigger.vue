<template>
  <div class="message" @click="showMessage">
    <el-badge :value="messageCount" :hidden="!messageCount" :max="99">
      <icon symbol class="icon" name="iconxiaoxi" />
    </el-badge>
    <iMail :visible="drawerVisible" @triggerCallback="handleTriggerCallback" />
  </div>
</template>

<script>
import iMail from './index.vue'
import { icon } from 'rise'
import { getUnreadTotal } from '@/api/mail'
export default {
  components: {
    iMail,
    icon
  },
  data() {
    return {
      drawerVisible: false,
      messageCount: 0
    }
  },
  mounted() {
    this.getUnreadTotal()
  },
  methods: {
    handleTriggerCallback() {
      this.getUnreadTotal()
    },
    async getUnreadTotal() {
      const result = await getUnreadTotal()
      if (result?.code === '200' && result?.data) {
        this.messageCount = result.data
      }
    },
    // 显示消息列表
    showMessage() {
      this.drawerVisible = !this.drawerVisible
    }
  }
}
</script>

<style lang="scss" scoped>
.message {
  margin-left: 30px;
  cursor: pointer;
  .icon {
    line-height: 97px;
    font-size: 25px;
  }
}
.message {
  ::v-deep .el-badge {
    .el-badge__content {
      background: #e30d0d;
      top: auto;
      bottom: -3px;
      min-width: 25px;
      height: 25px;
      padding: 0;
      font-size: 14px;
      text-align: center;
    }
  }
}
</style>
