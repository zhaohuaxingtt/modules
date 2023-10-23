<template>
  <iDrawer class="messageDrawer" :visible="visible" v-loading="loading">
    <transition-group name="items" tag="div">
      <template v-for="(items, key) of messageData">
        <div class="chunk" :key="key" v-if="items.length">
          <div class="header">
            <p class="title font-weight">
              {{ $t(`topLayout.message.${key}`) }}
            </p>
            <span class="clear font-size14" @click="handleClearByChunk(key)">{{
              $t('LK_QINGCHU')
            }}</span>
          </div>
          <transition-group name="item" tag="card">
            <card
              class="card"
              v-for="item in items"
              :key="item.remark"
              :data="item"
              @handleClear="handleClear(item, items)"
            />
          </transition-group>
        </div>
      </template>
    </transition-group>
  </iDrawer>
</template>

<script>
import { iDrawer } from 'rise'
import card from './card'
import { queryByPage, readById, batchReadById } from '@/api/layout/topLayout'
import { messageTypeMap } from '../data'
import axios from 'axios'
import store from '@/store'
export default {
  components: { iDrawer, card },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      queryByPageSource: null,
      messageData: {
        notice: [],
        message: [],
      },
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.initMessageData()
        this.queryByPage()
      } else {
        this.loading = false
        if (this.queryByPageSource) this.queryByPageSource.cancel()
      }
    },
  },
  computed: {
    // eslint-disable-next-line no-undef
    ...Vuex.mapState({
      userInfo: (state) => state.permission.userInfo,
    }),
  },
  methods: {
    initMessageData() {
      this.messageData = {
        notice: [],
        message: [],
      }
    },

    // 获取消息列表
    queryByPage() {
      this.loading = true
      if (this.queryByPageSource) this.queryByPageSource.cancel()
      this.queryByPageSource = axios.CancelToken.source()

      queryByPage(
        { receiverId: this.userInfo.id },
        { cancelToken: this.queryByPageSource.token }
      )
        .then((res) => {
          const source = Array.isArray(res.data) ? res.data : []

          source.forEach((item) => {
            // 4消息 5通知
            const list = this.messageData[`${messageTypeMap[item.type]}`]
            Array.isArray(list) && list.push(item)
          })

          this.$emit('updateMessageCount')
          this.loading = false
        })
        .catch(() => (this.loading = false))
    },

    unshift(data) {
      const list = this.messageData[`${messageTypeMap[data.type]}`]
      Array.isArray(list) && list.unshift(data)
    },

    // 清除消息
    handleClear(data, list) {
      readById({
        msgId: data.remark,
        readType: 1,
        userId: store.state.permission.userInfo.id,
      }).then(() => {
        for (let i = 0, item; (item = list[i++]); ) {
          if (item === data) {
            list.splice(i - 1, 1)
            break
          }
        }

        this.$emit('afterClear')
      })
    },

    // 清除消息块
    handleClearByChunk(key) {
      if (!this.messageData[key].length) return
      const inMailType = key === 'notice' ? 5 : 4

      batchReadById({
        inMailType,
        readType: 1,
        userId: store.state.permission.userInfo.id,
      }).then(() => {
        this.messageData[key] = []

        this.$emit('afterClear')
      })

      // this.batchLogicDeleteMsgById(this.messageData[key].map(item => item.remark))
      //   .then(() => {
      //     this.messageData[key] = []

      //     this.$emit('afterClear')
      //   })
    },

    // 删除请求
    // batchLogicDeleteMsgById(ids) {
    //   return new Promise(resolve => {
    //     batchLogicDeleteMsgById({ ids: ids.join(',') })
    //     .then(res => {
    //       // if (!res) {
    //       //   return iMessage.error('清除失败')
    //       // }

    //       resolve()
    //     })
    //   })
    // }
  },
}
</script>

<style lang="scss" scoped>
.messageDrawer {
  height: calc(100vh - 61px);
  min-height: auto;
  top: 61px;
  padding: 0 30px 20px;
  overflow-y: auto;
  overflow-x: hidden;

  .items-leave-active,
  .item-leave-active {
    opacity: 1;
    transition: all 0.4s ease-out;
  }

  .items-leave-to,
  .item-leave-to {
    opacity: 0;
    transform: translateX(500px);
  }

  .chunk {
    margin: 20px 0 10px;

    .header {
      position: relative;

      .title {
        color: $color-header-black;
        font-size: 20px;
        height: 28px;
        line-height: 28px;
        margin-bottom: 20px;
      }

      .clear {
        position: absolute;
        color: #67C23A;
        height: 20px;
        line-height: 20px;
        top: 50%;
        right: 0;
        transform: translate(0, -50%);
        cursor: pointer;
        user-select: none;
      }
    }

    .card {
      background: #ffffff;
      box-shadow: 0px 0px 10px rgba(93, 93, 93, 0.16);
      opacity: 1;
      border-radius: 5px;

      & + .card {
        margin-top: 10px;
      }
    }
  }
}
</style>
