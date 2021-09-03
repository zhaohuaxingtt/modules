<!--
 * @Autor: Hao,Jiang
 * @Date: 2021-09-02 11:34:29
 * @LastEditors: Hao,Jiang
 * @LastEditTime: 2021-09-02 16:39:27
 * @Description: 上传组件 -> 下载全部
-->

<template>
  <a :class="{'file-downloadlink': true, underline}" @click="onDownloadFile" v-if="type === 'link'" href="javascript:;">{{title || language('LK_QUANBUXIAZAI', '全部下载')}}</a>
  <iButton class="file-download" @click="onDownloadFile" v-else>{{title || language('LK_QUANBUXIAZAI', '全部下载')}}</iButton>
</template>

<script>
import {iButton} from 'rise'
import {downloadAll} from './lib'
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    /**
     * @description: 组件展现形式，按钮/链接
     * @param {*} 类型，button按钮模式，link，链接模式
     * @return {*}
     */    
    type: {
      type: String,
      default: 'button'
    },
    /**
     * @description: hostId
     * @param {*}
     * @return {*}
     */ 
    hostId: {type:String||Number},
    /**
     * @description: 附件类型
     * @param {*}
     * @return {*}
     */    
    fileType: {type:String||Number},
    underline: Boolean, 
    callback: Function
  },
  components: {
    iButton
  },
  methods: {
    onDownloadFile() {
      const params = {
        fileType: this.fileType,
        hostId: this.hostId
      }
      downloadAll(params)
    }
  }
}
</script>
<style lang="scss" scoped>
.file-downloadlink {
  color: #0064C7;
  &.underline {
    text-decoration: underline;
  }
}
</style>