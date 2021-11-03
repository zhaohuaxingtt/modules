<template>
  <div
    :class="['mail-card', !item.isRead ? 'unread' : 'read']"
    @click="handleRead"
    :style="{ cursor: !item.isRead || item.url ? 'pointer' : 'default' }"
  >
    <div class="mail-card-closebtn" @click.stop="handleDel">
      <i class="el-icon el-icon-close"></i>
    </div>
    <div>
      <div class="title">
        <div class="flex-between-center-center">
          <icon
            symbol
            class="icon"
            :name="
              type2Icon[tab]['title'][parseInt(item.subType)] ||
                'iconmorenxiaoxi'
            "
          ></icon>
          <div class="single-ellipsis">{{ item.title }}</div>
        </div>
        <div class="time" v-if="tab || item.subType === '2'">{{ time }}</div>
      </div>
      <div
        class="time"
        v-if="!tab && (item.subType === '1' || item.subType === '3')"
      >
        <icon
          symbol
          class="icon icon-time"
          :name="type2Icon[tab]['time'][parseInt(item.subType)]"
        ></icon>
        <span class="multi-ellipsis">{{ item | filterTime }}</span>
      </div>
      <div class="address" v-if="!tab && item.subType === '1'">
        <icon
          symbol
          class="icon icon-addr"
          :name="type2Icon[tab]['address'][parseInt(item.subType)]"
        ></icon>
        <span class="multi-ellipsis">{{ item.addr }}</span>
      </div>
      <div
        class="name"
        v-if="(!tab && item.subType === '3') || (tab && item.subType !== '2')"
      >
        <div>
          <icon
            symbol
            class="icon icon-name"
            :name="type2Icon[tab]['name'][parseInt(item.subType)]"
            v-if="type2Icon[tab]['name'][parseInt(item.subType)]"
          ></icon>
          <span class="multi-ellipsis">{{ item.topics || item.desc }}</span>
        </div>
        <div v-if="!tab && item.subType === '3'">
          {{ item.fixNum }} / {{ item.num }}
        </div>
      </div>
      <div class="person" v-if="!tab && item.subType === '3'">
        <icon
          symbol
          class="icon icon-person"
          :name="type2Icon[tab]['person'][parseInt(item.subType)]"
        ></icon>
        <span class="multi-ellipsis">{{ item.sponsor }}</span>
      </div>
      <div
        class="content"
        :class="{ expanded }"
        v-if="
          tab ||
            (!tab && item.subType === '2') ||
            (!tab && item.subType === '0') ||
            (!tab && item.subType === null)
        "
      >
        <span class="multi-ellipsis" v-html="item.content"></span>
        <div
          class="btn-expanded"
          v-if="rows > 2 && !expanded"
          @click.stop="expanded = true"
        >
          展开
        </div>
      </div>
    </div>
    <div
      :class="[
        'mail-card-tips',
        !item.state ? 'will' : item.state === 1 ? 'ongoing' : 'overdue'
      ]"
      v-if="!tab && item.subType === '1'"
    >
      <span
        v-if="
          !item.state &&
            ((item.tipBegin > 0 && item.tipBegin < 15) || item.tipBegin === 15)
        "
      >
        还有{{ item.tipBegin }}分钟开始
        <!-- {{ $t('MAIL.WILL', { tipBegin: item.tipBegin }) }} -->
      </span>
      <span v-else-if="item.state === 1">进行中</span>
      <span v-else-if="item.state === 2">已过期</span>
    </div>
  </div>
</template>

<script>
import { icon } from 'rise'
import { removeMailById, readMailById } from '@/api/mail'
export default {
  components: {
    icon
  },
  props: {
    tab: {
      type: String,
      default: function() {
        return 'notification'
      }
    },
    item: {
      type: Object,
      default: function() {
        return {}
      }
    },
    mapping: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  filters: {
    filterTime: function(item) {
      const bDate = item.beginDate.split(' ')[0] || ''
      const bTime = item.beginDate.split(' ')[1] || ''
      const eDate = item.endDate.split(' ')[0] || ''
      const eTime = item.endDate.split(' ')[1] || ''
      return bDate === eDate
        ? `${bDate} ${bTime}-${eTime}`
        : `${item.beginDate}-${item.endDate}`
    },
    removeTag: function(text) {
      text = text || ''
      const regex = /(<([^>]+)>)/gi
      return text.replace(regex, '')
    }
  },
  data() {
    return {
      time: '',
      type2Icon: [
        {
          title: [
            '',
            'iconhuiyixiaoxiliebiao',
            'iconxinwenxiaoxiliebiao',
            'iconyiti',
            ''
          ],
          time: [
            '',
            'iconshijianxiaoxiliebiao',
            '',
            'iconshijianxiaoxiliebiao'
          ],
          address: ['', 'icondidianxiaoxiliebiao', '', ''],
          name: ['', '', '', 'iconhuiyix'],
          person: ['', '', '', 'iconrenwuxiaoxiliebiao']
        },
        {
          title: [
            'iconrenwutixingxiaoxiliebiao',
            'iconrenwutixingxiaoxiliebiao',
            'iconxinwenxiaoxiliebiao',
            'iconshenpitubiao',
            'iconrenwutixingxiaoxiliebiao'
          ],
          name: ['', '', '', '']
        }
      ],
      rows: 0,
      expanded: false
    }
  },
  mounted() {
    this.time = moment(this.item.sendTime).fromNow()
    this.getContentRows()
  },
  updated() {
    this.time = moment(this.item.sendTime).fromNow()
  },
  methods: {
    handleRedirect() {
      if (!this.item.url) {
        console.log('url为空')
      } else {
        this.$emit('hide-drawer')
        setTimeout(() => {
          if (
            this.item.url.indexOf('http://') !== -1 ||
            this.item.url.indexOf('https://') !== -1
          ) {
            location.href = this.item.url
          } else {
            if (this.item.url.indexOf('#') === -1) {
              this.$router.replace(this.item.url)
            } else {
              location.href = this.item.url
            }
          }
        }, 200)
      }
    },
    async handleDel() {
      const result = await removeMailById({ ids: this.item.id })
      if (result?.code === '200') {
        this.$emit('delCallback', { tab: this.tab })
      }
    },
    async handleRead() {
      if (this.item.isRead) {
        this.handleRedirect()
      } else {
        const result = await readMailById({ ids: this.item.id })
        if (result?.code === '200') {
          this.$emit('readCallback', { tab: this.tab })
          this.handleRedirect()
        }
      }
    },
    getContentRows() {
      const div = document.createElement('div')
      div.style.width = '240px'
      div.style.lineHeight = '16px'
      div.style.fontSize = '12px'
      div.innerHTML = this.item.content || ''
      document.body.append(div)
      const divRows = div.clientHeight / 16
      this.rows = divRows
      document.body.removeChild(div)
    },
    removeHtmlTag(text) {
      text = text || ''
      const regex = /(<([^>]+)>)/gi
      return text.replace(regex, '')
    }
  }
}
</script>

<style lang="scss" scoped>
.mail-card {
  position: relative;
  padding: 10px 15px;
  box-shadow: 0px 0px 16px rgba(147, 147, 147, 0.16);
  border-radius: 5px;
  margin-bottom: 12px;
  min-height: 120px;
  // cursor: pointer;
  > div {
    > div:last-child {
    }
  }
  > .mail-card-closebtn {
    position: absolute;
    right: 15px;
    width: 20px;
    height: 20px;
    background: #a0bffc;
    border-radius: 50%;
    text-align: center;
    > i {
      color: #fff;
      line-height: 20px;
      height: 20px;
    }
  }
  > .mail-card-tips {
    position: absolute;
    bottom: 12px;
    right: 15px;
    &.ongoing {
      color: #ffb04d;
    }
    &.overdue {
      color: #707070;
    }
    &.will {
      color: #00a378;
    }
  }
  &:last-child {
    margin-bottom: 0;
  }
  &.unread {
    border-left: 10px solid #cad9f8;
  }
  &.read {
    border-left: 10px solid #dedede;
  }
  .title {
    font-size: 16px;
    color: #0d2451;
    line-height: 30px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // cursor: pointer;
  }
  .title .single-ellipsis {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 135px;
  }
  .address,
  .name,
  .person,
  .time,
  .content,
  .title {
    .icon {
      margin-right: 5px;
      &.icon-time,
      &.icon-addr,
      &.icon-name,
      &.icon-person {
        width: 17px;
        height: 14px;
      }
    }
    > .time {
      font-size: 12px;
      font-weight: normal;
      color: #4b5c7d;
      margin-right: 25px;
    }
    i {
      color: #1660f1;
      margin-right: 5px;
    }
  }
  .address,
  .name,
  .person,
  .time,
  .content {
    line-height: 20px;
    color: #4b5c7d;
    font-size: 14px;
  }
  .content {
    .multi-ellipsis {
      margin: 0 auto;
      width: 300px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    &.expanded .multi-ellipsis {
      overflow: visible;
      -webkit-line-clamp: unset;
    }
  }
  .name {
    display: flex;
    justify-content: space-between;
  }
  .btn-expanded {
    color: #1763f7;
    text-align: right;
    font-weight: bold;
    margin-top: 10px;
  }
}
</style>
