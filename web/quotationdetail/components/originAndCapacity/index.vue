<!--
 * @Author: ldh
 * @Date: 2021-04-27 17:02:55
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-09 17:49:40
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\originAndCapacity\index.vue
-->
<template>
  <div class="originAndCapacity">
    <origin ref="origin" :partInfo="partInfo" :disabled="disabled" />
    <capacity ref="capacity" class="margin-top20" :partInfo="partInfo" :disabled="disabled" />
    <!-- 扩产能计划 -->
    <capacityExpan ref="capacityExpan" class="margin-top20" :partInfo="partInfo" :disabled="disabled" />
  </div>
</template>

<script>
import origin from "./components/origin";
import capacity from "./components/capacity";
import capacityExpan from "./components/capacityExpan";

export default {
  components: {
    origin,
    capacity,
    capacityExpan
  },
  props: {
    partInfo: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    init() {
      this.$refs.origin.getSupplierPartLocation();
      this.$refs.capacity.getSupplierPlantCaps();
    },
    save() {
      return Promise.all([
        this.$refs.origin.saveSupplierPartAddLocation(),
        this.$refs.capacity.saveSupplierPlantCap(),
        this.$refs.capacityExpan.save(),
      ]);
    },
  },
};
</script>

<style>
</style>