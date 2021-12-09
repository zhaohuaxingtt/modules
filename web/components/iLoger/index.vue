<!--
 * @Author: your name
 * @Date: 2021-06-22 11:07:21
 * @LastEditTime: 2021-12-09 17:48:29
 * @LastEditors: Hao,Jiang
 * @Description: In User Settings Edit
-->
<template>
  <div class="ilog-wrapper">
    <div class="logButton" @click="open">
      <slot>
        <icon symbol name="iconrizhiwuzi" class="icon" />
        <span>{{ language("LK_RIZHI", '日志') }}</span>
      </slot>
    </div>
    <!-- 日志弹窗 -->
    <iLog :show.sync="showLogDialog" :extendParams="extParams" :isPage="isPage" :env="env" v-bind="$attrs" @onTypeChange="onTypeChange"></iLog>
  </div>
</template>

<script>
import Vuex from 'vuex'
import { iLog, icon } from 'rise';
import config from './config'

export default {
  props: {
    /**
     * @description: 日志类型，是配置在config中的数字或字符
     * @param {*}
     * @return {*}
     */    
    type: {
      type: Number || String
    },
    /**
     * @description: 日志配置，配置格式参考/congig
     * @param {*}
     * @return {*}
     */    
    config: {
      type: Object,
      default: () => ({})
    },
    /**
     * @description: 表格是否分页显示
     * @param {*}
     * @return {*}
     */    
    isPage: {
			type: Boolean,
			default: false,
		},
    /**
     * @description: 是否获取当前用户
     * @param {*}
     * @return {*}
     */    
    credentials: {
			type: Boolean,
			default: false,
		},
  },
  components: { iLog, icon },
  computed: {
    ...Vuex.mapState({
      userInfo: state => state.permission.userInfo,
    }),
    env() {
      return process.env.NODE_ENV
    }
  },
  data() {
    return {
      showLogDialog: false,
      extParams: {}
    }
  },
  watch: {
    config() {
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      // 根据type 获取日志类型
      const extParams = Object.keys(this.config).length ? this.config : config[this.type]
      if (extParams) {
        // 写入当前用户
        this.credentials && (extParams.createBy_obj_ae = this.userInfo && this.userInfo.id)

        if (extParams.queryParams && extParams.queryParams.length) {
          extParams.queryParams.forEach(key => {
            const queryString = extParams[key]
            extParams[key] = this.$attrs[queryString] !== undefined ? this.$attrs[queryString] : this.$route.query[queryString] || ''
          })
          delete extParams.queryParams
        }
        this.extParams = extParams
      }
    },
    onTypeChange(type) {
			this.$emit('onTypeChange', type)
		},
    open() {
      this.showLogDialog = true
    }
  }
};
</script>

<style lang="scss" scoped>
.ilog-wrapper {
  display: inline-block;

  .logButton {
    display: inline-block;
    user-select: none;
    cursor: pointer;
    font-size: 14px;
    height: 20px;
    line-height: 20px;
    color: $color-blue;

    .icon {
      width: 20px;
      height: 20px;
      vertical-align: top;

      & + span {
        margin-left: 4px;
      }
    }

    span {
      display: inline-block;
      font-size: 14px;
      height: 20px;
      line-height: 20px;
      color: $color-blue;
    }
  }
}
</style>