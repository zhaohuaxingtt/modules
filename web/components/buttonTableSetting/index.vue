<template>
  <span class="button-table-setting" @click="handleClick">
    <el-badge :value="hiddenCount" :max="99" class="item" type="warning">
      <icon name="iconSetting" class="font24" symbol />
    </el-badge>
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
