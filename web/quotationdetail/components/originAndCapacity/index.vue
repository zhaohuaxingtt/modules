<!--
 * @Author: ldh
 * @Date: 2021-04-27 17:02:55
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-12 11:07:20
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\originAndCapacity\index.vue
-->
<template>
  <div class="originAndCapacity">
    <origin ref="origin" :partInfo="partInfo" :disabled="disabled" />
    <capacity ref="capacity" class="margin-top20" :partInfo="partInfo" :disabled="disabled" />
    <!-- 扩产能计划 -->
    <capacityExpan v-if="partInfo && partInfo.partProjectType === 'PT15'" ref="capacityExpan" class="margin-top20" :partInfo="partInfo" :disabled="disabled" />
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
      this.$refs.capacityExpan.getFetchData()
    },
    async save() {
      // 扩产能提交&&校验
      if (this.partInfo && this.partInfo.partProjectType === 'PT15') {
        const state = await this.$refs.capacityExpan.save()
        if (!state) return
      }
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