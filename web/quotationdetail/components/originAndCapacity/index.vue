<!--
 * @Author: ldh
 * @Date: 2021-04-27 17:02:55
 * @LastEditors: ldh
 * @LastEditTime: 2021-05-08 10:49:38
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\originAndCapacity\index.vue
-->
<template>
  <div class="originAndCapacity">
    <origin ref="origin" :partInfo="partInfo" :disabled="disabled" />
    <capacity ref="capacity" class="margin-top20" :partInfo="partInfo" :disabled="disabled" />
  </div>
</template>

<script>
import origin from "./components/origin";
import capacity from "./components/capacity";

export default {
  components: {
    origin,
    capacity,
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
      ]);
    },
  },
};
</script>

<style>
</style>