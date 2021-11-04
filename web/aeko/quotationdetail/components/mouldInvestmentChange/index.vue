<!--
 * @Author: YoHo
 * @Date: 2021-10-22 19:14:28
 * @LastEditTime: 2021-11-01 11:47:56
 * @LastEditors: YoHo
 * @Description: 
-->
<template>
  <div>
    <module ref="module" :partInfo="partInfo"  :disabled="disabled" @getBasicInfo="getBasicInfo" :editDisabled="editDisabled" />
    <sourcePartCBD ref="sourcePartCBD" class="margin-top20" :partInfo="partInfo" @quote="handleQuote" :disabled="disabled" :editDisabled="editDisabled" />
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