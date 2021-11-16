<!--
 * @Author: YoHo
 * @Date: 2021-10-22 19:14:28
 * @LastEditTime: 2021-11-16 14:20:40
 * @LastEditors: Please set LastEditors
 * @Description: 
-->
<template>
  <div>
    <module v-permission.auto="AEKO_QUOTATION_DETAIL_MOULDLE_CBDCARD|模具投资变动_模具CBD编辑栏" ref="module" :partInfo="partInfo"  :disabled="disabled" @getBasicInfo="getBasicInfo" :editDisabled="editDisabled" />
    <sourcePartCBD v-permission.auto="AEKO_QUOTATION_DETAIL_MOULDLE_TABLE_YUANLINGJIANMOJUCBD|模具投资变动_原零件模具CBD" ref="sourcePartCBD" class="margin-top20" :partInfo="partInfo" @quote="handleQuote" :disabled="disabled" :editDisabled="editDisabled" />
  </div>
</template>

<script>
import module from "./components/module"
import sourcePartCBD from "./components/sourcePartCBD"

export default {
  components: { module, sourcePartCBD },
  inject: ["getBasicInfo"],
  props: {
    partInfo: {
      type: Object,
      required: true,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    },
    editDisabled: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    handleQuote(list) {
      this.$refs.module.addQuote(list)
    },
    init() {
      this.$refs.module.getMoulds()
      this.$refs.sourcePartCBD.getMoldCbd()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>