<template>
  <iCard class="card">
    <template #header class="cardHeader">
      <icon class="icon" symbol name="iconxinwenxiaoxiliebiao" />
      <p class="title font-size16 font-weight">{{ data.title }}</p>
      <div class="header-control">
        <span class="time">{{ dateFormat(data.sendTime) }}</span>
        <icon class="delete" name="iconguanbixiaoxiliebiaokapiannei" @click.native="handleClear" />
      </div>
    </template>
    <template #default class="cardBody">
      <!-- <p class="title font-weight">公司名称变更通知函</p> -->
      <div class="main">
        <mainContent class="margin-top4" :data="data.content" />
        <!-- <div class="tag margin-top10">
          <icon class="icon" symbol name="iconrenwutixingxiaoxiliebiao" />
          <p class="font-size14 margin-left10">03-12 14:00-15:30</p>
        </div> -->
      </div>
      <!-- <span class="hint font-size14">还有3小时开始</span> -->
    </template>
  </iCard>
</template>

<script>
import { iCard, icon } from 'rise'
import mainContent from './mainContent'

export default {
  components: { iCard, icon, mainContent },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return { }
  },
  methods: {
    handleClear() {
      this.$emit('handleClear')
    },
    dateFormat(val) {
      return window.moment(val).locale(this.$i18n.locale === 'zh' ? 'zh-cn' : 'en').fromNow()
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  ::v-deep .cardHeader {
    padding: 10px;
    display: inherit;
    position: relative;

    .icon {
      width: 24px;
      height: 24px;
      vertical-align: top;
    }

    .title {
      display: inline-block;
      height: 24px;
      line-height: 24px;
      margin-left: 6px;
    }

    .header-control {
      position: absolute;
      top: 50%;
      right: 12px;
      transform: translate(0, -50%);

      .time {
        display: inline-block;
        font-size: 12px;
        color: #4B5C7D;
      }

      .delete {
        margin-left: 10px;
        font-size: 20px;
        color: #DFE7FA;
        cursor: pointer;
        transition: color .2s;
        vertical-align: middle;

        &:hover {
          color: $color-blue;
        }
      }
    }
  }

  ::v-deep .cardBody {
    position: relative;
    padding: 0 14px 11px;

    .title {
      font-size: 14px;
      color: #404B5F;
      height: 20px;
      line-height: 20px;
    }

    .content {}

    .tag {
      .icon {
        width: 16px;
        height: 16px;
        vertical-align: top;
      }
      
      p {
        display: inline-block;
        color: #4B5C7D;
        height: 16px;
        line-height: 16px;
      }
    }

    .hint {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translate(0, -50%);
      height: 20px;
      line-height: 20px;
      color: #00A378;
    }
  }
}
</style>