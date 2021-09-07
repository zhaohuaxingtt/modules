<template>
  <div class="performanceInput">
    <div class="staticInput" v-if="staticStatus">{{ value }}</div>
    <iInput v-else v-bind="$props" v-on="$listeners" />
  </div>  
</template>

<script>
import { iInput } from "rise"

export default {
  components: { iInput },
  model: {
    prop: "value",
    event: "input"
  },
  data() {
    return {
      staticStatus: true
    }
  }
}
</script>

<style lang="scss" scoped>
.performanceInput {
  .staticInput {
    display: inline-block;
    height: 28px;
    line-height: 28px;
    -webkit-appearance: none;
    background-color: #FFFFFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid transparent;
    box-sizing: border-box;
    color: #606266;
    font-size: inherit;
    outline: none;
    padding: 0 15px;
    width: 100%;
    box-shadow: 0px 0px 3px rgba(0, 38, 98, 0.15);;
  }
}
</style>