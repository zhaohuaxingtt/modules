<template>
  <div class="text">
    <p>{{ data }}</p>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: String || Number,
      default: ''
    }
  },
  mounted() {
    const ellipsis = new window.Ellipsis(this.$el);
    ellipsis.calc();
    ellipsis.set();
  }
}
</script>

<style lang="scss" scoped>
.text {
  font-size: 14px;
  color: #4B5C7D;
  line-height: 20px;
  max-height: 60px;
}
</style>