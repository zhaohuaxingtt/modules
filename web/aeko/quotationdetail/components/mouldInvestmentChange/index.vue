<template>
  <div>
    <module ref="module" :partInfo="partInfo" :disabled="disabled" />
    <sourcePartCBD ref="sourcePartCBD" class="margin-top20" :partInfo="partInfo" @quote="handleQuote" :disabled="disabled" />
  </div>
</template>

<script>
import module from "./components/module"
import sourcePartCBD from "./components/sourcePartCBD"

export default {
  components: { module, sourcePartCBD },
  props: {
    partInfo: {
      type: Object,
      required: true,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    }
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