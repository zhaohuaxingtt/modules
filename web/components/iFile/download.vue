<!--
 * @Autor: Hao,Jiang
 * @Date: 2021-09-02 11:34:29
 * @LastEditors: Hao,Jiang
 * @LastEditTime: 2021-09-02 15:30:17
 * @Description: 上传组件 -> 下载按钮/下载链接
-->

<template>
  <a :class="{'file-downloadlink': true, underline}" @click="onDownloadFile" v-if="type === 'link'" href="javascript:;">{{title || language('LK_XIAZAI', '下载')}}</a>
  <iButton class="file-download" @click="onDownloadFile" v-else>{{title || language('LK_XIAZAI', '下载')}}</iButton>
</template>

<script>
import {iButton, iMessage} from 'rise'
import {downloadFile} from './lib'
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    /**
     * @description: 文件id
     * @param {*}
     * @return {*}
     */    
    fileId: {
      type: String||Array
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
    underline: Boolean, 
    callback: Function
  },
  components: {
    iButton
  },
  methods: {
    onDownloadFile() {
      if (this.callback && typeof this.callback === 'function') {
        this.callback()
        return
      }
      const fileList = typeof this.fileId === 'string' ? [this.fileId] : this.fileId
      if (!fileList.length) return iMessage.error(this.language('QINGXUANZEZHISHAOYITIAOSHUJU','请选择至少一条数据'))
      downloadFile(fileList)
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