<template>
  <span class="button-table-setting" @click="handleClick">
    <icon name="iconSetting" class="font24" symbol />
  </span>
</template>

<script>
import { Icon } from 'rise'
export default {
  name: 'buttonTableSetting',
  components: { Icon },
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
