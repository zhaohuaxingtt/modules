<!--
 * @Author: your name
 * @Date: 2021-02-24 10:12:06
 * @LastEditTime: 2021-03-08 10:29:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \rise\src\layout\components\topLayout\input.vue
-->
<template>
  <iInput class="search" :placeholder="placeholder" v-model="keywords" @keyup.enter.native="handleSearch">
    <icon symbol class="icon" slot="prefix" name="iconsousudingbu" @click.native="handleSearch"/>
  </iInput>
</template>

<script>
import { iInput, icon } from 'rise'

export default {
  components: {
    iInput,
    icon
  },
  props: {
    value: {
      type: String || Number,
      default: ''
    },
    placeholder: {
      type: String || Number,
      default: ''
    }
  },
  data() {
    return {
      keywords: ''
    }
  },
  methods: {
    handleSearch(e) {
      if (this.keywords) {
        const url = window.location.origin + '/portal/#' + '/search?q=' + this.keywords
        this.openUrl(url)
      }
    },
    openUrl(url, target) {
      if (url.indexOf('http') === -1) {
        url = process.env.VUE_APP_PUBLICPATH + url
      }
      target = target || '_blank'
      const a = document.createElement('a')
      a.setAttribute('href', url)
      a.setAttribute('style', 'display:none')
      a.setAttribute('target', target)
      document.body.appendChild(a)
      a.click()
      a.parentNode.removeChild(a)
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  width: 667px;
  height: 40px;
  line-height: 40px;
  background: #f8f8fa;
  border-radius: 10px;

  .icon {
    height: 100%;
    margin-right: 20px;
    cursor:pointer;
    font-size: 22px;
  }

  ::v-deep .el-input__prefix {
    width: 76px;
    text-align: right;
  }

  ::v-deep .el-input__inner {
    height: 40px;
    padding: 0 40px 0 76px;
    background: transparent;
    box-shadow: 0 0 0 0;

    &::placeholder {
      color: $color-header-black;
      opacity: 0.3;
    }
  }
}
</style>
