<!--
 * @Author: ldh
 * @Date: 2021-04-21 17:14:24
 * @LastEditors: ldh
 * @LastEditTime: 2021-04-23 14:17:32
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\logButton.vue
-->
<template>
  <div class="logButton" @click="$emit('click')">
    <icon symbol name="iconrizhiwuzi" class="icon" />
    <span>{{ language("LK_RIZHI", "日志") }}</span>
  </div>
</template>

<script>
import { icon } from "rise";

export default {
  components: { icon },
};
</script>

<style lang="scss" scoped>
.logButton {
  display: inline-block;
  user-select: none;
  cursor: pointer;

  .icon {
    width: 20px;
    height: 20px;
    vertical-align: top;

    & + span {
      margin-left: 4px;
    }
  }

  span {
    display: inline-block;
    font-size: 14px;
    height: 20px;
    line-height: 20px;
    color: $color-blue;
  }
}
</style>