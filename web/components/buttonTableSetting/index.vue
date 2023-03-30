<template>
  <span class="button-table-setting" @click="handleClick">
    <el-badge v-if="showBadge" :value="hiddenCount" :max="99" class="item" type="warning">
      <icon name="iconSetting" class="font24" symbol />
    </el-badge>
    <icon v-else name="iconSetting" class="font24" symbol />
  </span>
</template>

<script>
import { Icon } from 'rise'
export default {
  name: 'buttonTableSetting',
  components: { Icon },
  props:{
    hiddenCount:{
      type: String || Number,
      default: 0
    },
    showBadge:{
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.button-table-setting {
  cursor: pointer;
  margin-left: 10px;
}
</style>
