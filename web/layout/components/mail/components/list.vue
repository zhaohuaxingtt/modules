<template>
  <div class="imail-list">
    <div class="operation-wrapper">
      <mailFilter :typeOptions="typeOptions" @filterCallback="handleFilterCallback" />
      <div class="btn-wrapper">
        <el-button type="text" @click="handleReadAll" :disabled="!list.length">
          <span v-if="!query.status">全部已读</span>
        </el-button>
        <el-button type="text" @click="handleDelAll" :disabled="!list.length">清除全部</el-button>
      </div>
    </div>
    <div class="card-wrapper" v-infinite-scroll="load" infinite-scroll-disabled="disabled">
      <mail-card
        :tab="tab"
        v-for="(item, index) in list"
        :key="index"
        :item="item"
        @readCallback="handleReadCallback"
        @delCallback="handleDelCallback"
      ></mail-card>
      <p v-if="loading">加载中...</p>
      <p v-if="noMore">{{this.total ? '没有更多了' : `${this.tab ? '暂无未读消息' : '暂无未读通知'}`}}</p>
    </div>
  </div>
</template>

<script>
import mailFilter from './filter.vue'
import mailCard from './card.vue'
import { getMailList, getUnreadCount, getTypeOptionsByTab, readMailBatch, removeMailBatch } from '@/api/mail'
export default {
  props: {
    tab: {
      type: String,
      default: function() {
        return '0'
      }
    }
  },
  components: {
    mailFilter,
    mailCard
  },
  computed: {
    noMore() {
      return !this.loading && (this.list.length === this.total || this.list > this.total)
    },
    disabled() {
      return this.loading || this.noMore
    }
  },
  data() {
    return {
      current: 1,
      loading: false,
      total: 0,
      list: [],
      query: { type: '', status: 0 },
      typeOptions: []
    }
  },
  methods: {
    handleReadCallback(val) {
      const { tab } = val
      if (tab === this.tab) {
        this.current = 1
        this.loading = true
        this.getList()
        this.getUnreadCount()
        this.$emit('triggerCallback')
      }
    },
    handleDelCallback(val) {
      const { tab } = val
      if (tab === this.tab) {
        this.current = 1
        this.loading = true
        this.getList()
        this.getUnreadCount()
        this.$emit('triggerCallback')
      }
    },
    async handleReadAll() {
      const result = await readMailBatch({ tab: this.tab })
      if (result?.code === '200') {
        this.current = 1
        this.loading = true
        this.getList()
        this.getUnreadCount()
        this.$emit('triggerCallback')
      }
    },
    handleDelAll() {
      this.$alert('全部清除会将未读已读所有消息全部清除', {
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            const result = await removeMailBatch({ tab: this.tab })
            if (result?.code === '200') {
              this.current = 1
              this.loading = true
              this.getList()
              this.getUnreadCount()
              this.$emit('triggerCallback')
            }
            done()
          } else {
            done()
          }
        }
      }).then(action => {})
    },
    load() {
      this.loading = true
      this.current++
      this.getList()
    },
    async getTypeOptions() {
      const result = await getTypeOptionsByTab({ tab: this.tab })
      if (result?.code === '200' && result?.data) {
        result.data.unshift({ name: '全部', code: '' })
        this.typeOptions = result.data
      }
    },
    async getList() {
      const data = {
        current: this.current,
        size: 10,
        isRead: !!this.query.status,
        subType: this.query.type,
        tab: this.tab
      }
      const result = await getMailList(data)
      if (result?.data) {
        this.loading = false
        this.list = this.current === 1 ? result.data : this.list.concat(result.data)
        this.total = result.total
      }
    },
    async getUnreadCount() {
      const result = await getUnreadCount({ tab: this.tab })
      if (result?.code === '200' && result?.data) {
        this.$emit('unReadCallback', {
          unread: result?.data?.notReadNum,
          name: this.tab
        })
      }
    },
    handleFilterCallback(val) {
      this.query = val
      this.current = 1
      this.loading = true
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.imail-list {
  .operation-wrapper,
  .card-wrapper {
    padding: 0 30px;
  }
  .operation-wrapper {
    // box-shadow: 0px 4px 10px rgba(27, 29, 33, 0.12);
  }
  .card-wrapper {
    height: 720px;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 10px 30px 0 30px;
  }
  .btn-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  p {
    text-align: center;
    padding: 20px 0;
  }
}
</style>
