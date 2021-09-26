<!--
 * @Author: ldh
 * @Date: 2021-04-27 17:02:55
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-14 18:37:36
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\originAndCapacity\index.vue
-->
<template>
  <div class="originAndCapacity">
    <origin ref="origin" :partInfo="partInfo" :disabled="disabled" />
    <capacity ref="capacity" class="margin-top20" :partInfo="partInfo" :disabled="disabled" />
    <!-- 扩产能计划 -->
    <capacityExpan v-if="partInfo && String(partInfo.partProjectType) === String(partProjTypes.KUOCHANNENG)" ref="capacityExpan" class="margin-top20" :partInfo="partInfo" :disabled="disabled" />
  </div>
</template>

<script>
import origin from "./components/origin";
import capacity from "./components/capacity";
import capacityExpan from "./components/capacityExpan";
import {partProjTypes} from '@/config'
import { iMessage } from "rise"

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
  data() {
    return {
      // 零件项目类型
      partProjTypes
    }
  },
  methods: {
    init() {
      this.$refs.origin.getSupplierPartLocation();
      this.$refs.capacity.getSupplierPlantCaps();
      this.$refs.capacityExpan && this.$refs.capacityExpan.getFetchData()
    },
    async save(type) {
      // 扩产能提交&&校验
      if (this.partInfo && String(this.partInfo.partProjectType) === String(partProjTypes.KUOCHANNENG)) {
        const state = await this.$refs.capacityExpan.save()
        if (!state) return
      }

      return await Promise.all([
        this.$refs.origin.saveSupplierPartAddLocation(),
        this.$refs.capacity.saveSupplierPlantCap(),
      ]).then(([saveOriginRes, saveCapacityRes]) => {
        let flag = true
        if (saveOriginRes.code == 200) {
          this.$refs.origin.getSupplierPartLocation()
        } else {
          flag = false
          iMessage.error(this.$i18n.locale === "zh" ? saveOriginRes.desZh : saveOriginRes.desEn)
        }

        if (saveCapacityRes.code == 200) {
          this.$refs.capacity.getSupplierPlantCaps()
        } else {
          flag = false
          iMessage.error(this.$i18n.locale === "zh" ? saveCapacityRes.desZh : saveCapacityRes.desEn)
        }

        if (flag) {
          if (type !== "submit") {
            iMessage.success(this.$i18n.locale === "zh" ? saveOriginRes.desZh : saveOriginRes.desEn) 
          }
        } else throw [saveOriginRes, saveCapacityRes]
      });
    },
  },
};
</script>

<style>
</style>