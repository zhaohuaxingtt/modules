<template>
  <div class="middle-item">
    <div class="label">
      {{ label }}
    </div>
    <div class="value">
      {{ value }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'middleItem',
  props: {
    label: {
      type: String
    },
    value: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
.middle-item {
  /* margin-right: 130px; */
  .label {
    color: #888888;
    font-size: 14px;
    margin-bottom: 10px;
  }
  .value {
    font-size: 14px;
    font-weight: 400;
    line-height: 0px;
    color: #000000;
    line-height: 20px;
  }
}
</style>
