<template>
  <div class="mail">
    <i-drawer class="messageDrawer1" :visible.sync="visible" v-loading="loading">
      <el-tabs :stretch="true" v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane v-for="item in tabs" :key="item.name" :name="item.name">
          <span slot="label">
            <i :class="item.icon"></i>
            {{ item.title }}
            <el-badge is-dot class="item" v-if="item.unread"></el-badge>
            <span v-if="item.unread">(未读{{ item.unread }}条)</span>
          </span>
          <component
            ref="list"
            :is="item.content"
            :tab="item.nameInt"
            @listCallback="handleListCallback"
            @unReadCallback="handleUnreadCallback"
            @triggerCallback="handleTriggerCallback"
          ></component>
        </el-tab-pane>
      </el-tabs>
    </i-drawer>
  </div>
</template>

<script>
import { iDrawer } from 'rise'
import { list } from './components'
export default {
  components: { iDrawer },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    visible(val) {
      if (val) {
        for (let li in this.$refs.list) {
          this.$refs.list[li].getTypeOptions()
          this.$refs.list[li].getList()
          this.$refs.list[li].getUnreadCount()
        }
      }
    }
  },
  data() {
    const _self = this
    return {
      activeTab: '0',
      tabs: [
        {
          title: '通知',
          content: list,
          unread: 0,
          name: '0',
          nameInt: 0,
          icon: 'el-icon-bell'
        },
        {
          title: '消息',
          content: list,
          unread: 0,
          name: '1',
          nameInt: 1,
          icon: 'el-icon-copy-document'
        }
      ]
    }
  },
  methods: {
    handleTriggerCallback() {
      this.$emit('triggerCallback')
    },
    handleClick(tab) {
      const li = parseInt(tab.name)
      this.$refs.list[li].getTypeOptions()
      this.$refs.list[li].getList()
      this.$refs.list[li].getUnreadCount()
    },
    handleUnreadCallback(val) {
      const { unread, name } = val
      const item = this.tabs.find(t => {
        return parseInt(t.name) === parseInt(name)
      })
      item.unread = unread
      const index = _.findIndex(this.tabs, t => {
        return parseInt(t.name) === parseInt(name)
      })
      this.$set(this.tabs, index, item)
    },
    handleListCallback() {}
  }
}
</script>

<style lang="scss">
.messageDrawer1 {
  margin-top: 60px;
  .el-tabs__item {
    height: 50px;
    line-height: 50px;
  }
}
</style>
