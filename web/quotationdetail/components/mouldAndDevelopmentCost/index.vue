<!--
 * @Author: ldh
 * @Date: 2021-04-27 17:24:16
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-19 21:58:38
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\mouldAndDevelopmentCost\index.vue
-->
<template>
  <div class="mouldAndDevelopmentCost">
    <mould ref="mould" :partInfo="partInfo" :disabled="disabled" />
    <developmentCost ref="developmentCost" class="margin-top20" :partInfo="partInfo" :disabled="disabled" />
  </div>
</template>

<script>
import { iMessage } from "rise"
import mould from "./components/mould"
import developmentCost from "./components/developmentCost"
import { saveModuleDevFee } from "@/api/rfqManageMent/quotationdetail"

export default {
  components: {
    mould,
    developmentCost
  },
  props: {
    partInfo: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    init() {
      this.$refs.mould.getMouldFee()
      this.$refs.developmentCost.getDevFee()
    },
    save() {
      return new Promise((r,j)=>{
      saveModuleDevFee({
        quotationId: this.partInfo.quotationId,
        moduleFeeDTOList: this.$refs.mould.tableListData.map(item => ({
          ...item,
          assembledPartCode: this.partInfo.partNum,
          assembledPartName: this.partInfo.partNameZh
        })),
        moduleOtherFee: {
          itemType: 0,
          shareTotal: this.$refs.mould.dataGroup.shareInvestmentFee, // 金额 
          shareQuantity: this.$refs.mould.dataGroup.shareQuantity, // 分摊数量
          shareAmount: this.$refs.mould.dataGroup.unitInvestmentCost, // 分摊金额
          totalPrice: this.$refs.mould.dataGroup.totalInvestmentCost // 总投资成本/开发费⽤
        },
        devFeeDTOList: this.$refs.developmentCost.tableListData,
        devOtherFee: {
          itemType: 1,
          shareTotal: this.$refs.developmentCost.dataGroup.shareDevFee, // 金额
          shareQuantity: this.$refs.developmentCost.dataGroup.shareQuantity, // 分摊数量
          shareAmount: this.$refs.developmentCost.dataGroup.unitPrice, // 分摊金额 
          totalPrice: this.$refs.developmentCost.dataGroup.devFee  // 总投资成本/开发费⽤
        },
      })
      .then(res => {
        if (res.code == 200) {
          r()
          iMessage.success(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
          this.init()
        } else {
          j()
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
      .catch(() => {
        j()
      })
      })
    }
  }
}
</script>

<style>

</style>