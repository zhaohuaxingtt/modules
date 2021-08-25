<!--
 * @Author: haojiang
 * @Date: 2021-02-25 16:34:49
 * @LastEditTime: 2021-08-25 17:53:06
 * @LastEditors: Please set LastEditors
 * @Description: 通过selectDictByKeyss字典接口查询的下拉值。
 * @FilePath: \rise\src\components\iDicoptions\index.vue
-->
<template>
  <iSelect
    v-model="data"
    :placeholder="language('LK_QINGXUANZE','请选择')"
    clearable
  >
    <el-option
      v-if="optionAll"
      value=""
      :label="language('all','全部') | capitalizeFilter"
    ></el-option>
    <el-option
      :value="items.code"
      :label="items.value"
      v-for="(items, index) in options"
      :key="index"
      style="max-width: 190px"
    ></el-option>
  </iSelect>
</template>
<script>
import {iSelect} from 'rise'
import {selectDictByKeyss} from '@/api/dictionary'

/**
 * @example ./README.me
*/
export default {
  name:'iDicoptions',
  components: {iSelect},
  props: {
    value: {
      type: String,
      default: ''
    },
    // 接口根据这个optionKey查option
    optionKey: {
      type: String,
      default: ''
    },
    // 第一个选项是否展示全部
    optionAll: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      options: [],
      data: this.value
    }
  },
  watch: {
    data(val) {
      if (val) {
        this.$nextTick(() => {
          this.data = val
        })
      }
      this.$emit('input', val)
    },
    optionKey(val) {
      if (val) {
        this.init()
      }
    },
    value(val) {
      this.data = val
    }
  },
  mounted(){
    this.init()
  },
  methods:{
    init() {
      if (!this.optionKey) return
      const types = [
        this.optionKey,
      ];
      selectDictByKeyss(types).then((res) => {
        this.options = res.data && res.data[this.optionKey];
      });
    }
  }
}
</script>
<style lang='scss' scoped>
</style>