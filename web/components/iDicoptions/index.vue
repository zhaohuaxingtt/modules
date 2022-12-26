<!--
 * @Author: haojiang
 * @Date: 2021-02-25 16:34:49
 * @LastEditTime: 2022-12-26 15:34:21
 * @LastEditors: 余继鹏 917955345@qq.com
 * @Description: 通过selectDictByKeyss字典接口查询的下拉值。
 * @FilePath: \rise\src\components\iDicoptions\index.vue
-->
<template>
  <iSelect
    v-model="data"
    :placeholder="language('LK_QINGXUANZE', '请选择')"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <el-option
      v-if="optionAll"
      value=""
      :label="optionAllText || language('all', '全部')"
    ></el-option>
    <el-option
      :value="items.code"
      :label="$getLabel ? $getLabel(items.value, items.nameEn) : items.value"
      v-for="(items, index) in options"
      :key="index"
    ></el-option>
  </iSelect>
</template>
<script>
import { iSelect } from "rise";
import { selectDictByKeyss } from "@/api/dictionary";

/**
 * @example ./README.me
 */
export default {
  name: "iDicoptions",
  components: { iSelect },
  props: {
    // 默认全部文案
    optionAllText: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    // 接口根据这个optionKey查option
    optionKey: {
      type: String,
      default: "",
    },
    // 第一个选项是否展示全部
    optionAll: {
      type: Boolean,
      default: true,
    },
    // 是否开启语言国际化
    lang: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      options: [],
      data: this.value,
    };
  },
  watch: {
    data(val) {
      if (val) {
        this.$nextTick(() => {
          this.data = val;
        });
      }
      this.$emit("input", val);
    },
    optionKey(val) {
      if (val) {
        this.init();
      }
    },
    value(val) {
      this.data = val;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (!this.optionKey) return;
      const types = [this.optionKey];
      selectDictByKeyss(types).then((res) => {
        const options = (res.data && res.data[this.optionKey]) || [];
        this.options = options.map((o) => {
          o.value = o.value || o.name || o.nameEn;
          o.nameEn = o.nameEn;
          if (this.lang)
            o.value = this.$i18n.locale === "zh" ? o.value : o.nameEn;
          return o;
        });
      });
    },
  },
};
</script>
<style lang='scss' scoped>
</style>