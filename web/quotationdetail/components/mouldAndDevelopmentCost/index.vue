<!--
 * @Author: ldh
 * @Date: 2021-04-27 17:24:16
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-12 19:22:29
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\mouldAndDevelopmentCost\index.vue
-->
<template>
  <div class="mouldAndDevelopmentCost">
    <div v-if="isSkd">
      <mould ref="mould" :partInfo="partInfo" :disabled="disabled || isOriginprice" isSkd showMode />
      <developmentCost ref="developmentCost" class="margin-top20" :partInfo="partInfo" isSkd :disabled="disabled || isOriginprice" showMode />
    </div>
    <div v-else-if="isSkdLc">
      <mould ref="skdMould" :partInfo="partInfo" :disabled="disabled || isOriginprice" isSkd showMode />
      <developmentCost ref="skdDevelopmentCost" class="margin-top20" :partInfo="partInfo" :disabled="disabled || isOriginprice" isSkd showMode />
      <mould ref="lcMould" :partInfo="partInfo" class="margin-top20" :disabled="disabled || isOriginprice" showMode />
      <developmentCost ref="lcDevelopmentCost" class="margin-top20" :partInfo="partInfo" :disabled="disabled || isOriginprice" showMode />
    </div>
    <div v-else>
      <mould ref="mould" :partInfo="partInfo" :disabled="disabled || isOriginprice" />
      <developmentCost ref="developmentCost" class="margin-top20" :partInfo="partInfo" :disabled="disabled || isOriginprice" />
    </div>
  </div>
</template>

<script>
import { iMessage } from "rise"
import mould from "./components/mould"
import developmentCost from "./components/developmentCost"
import { saveModuleDevFee, saveModuleDevFeeSkd } from "@/api/rfqManageMent/quotationdetail"
import { priceStatusMixin } from "../mixins"

export default {
  components: {
    mould,
    developmentCost
  },
  mixins: [ priceStatusMixin ],
  props: {
    partInfo: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isOriginprice: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    init() {
      if (this.isSkd) {
        this.$refs.mould.getMouldFeeSKD()
        this.$refs.developmentCost.getDevFeeSKD()
      } else if (this.isSkdLc) {
        this.$refs.skdMould.getMouldFeeSKD()
        this.$refs.skdDevelopmentCost.getDevFeeSKD()
        this.$refs.lcMould.getMouldFee()
        this.$refs.lcDevelopmentCost.getDevFee()
      } {
        this.$refs.mould.getMouldFee()
        this.$refs.developmentCost.getDevFee()
      }
    },
    getParams(type, moduleRefName, devCostRefName) {
      console.log("bbbbbbbbb", this.$refs[type !== "SKDLC" ? "mould" : moduleRefName])

      return {
        quotationId: this.partInfo.quotationId,
        moduleFeeDTOList: this.$refs[type !== "SKDLC" ? "mould" : moduleRefName].tableListData.map(item => ({
          ...item,
          assembledPartCode: this.partInfo.partNum,
          assembledPartName: this.partInfo.partNameZh
        })),
        moduleOtherFee: {
          itemType: 0,
          shareTotal: this.$refs[type !== "SKDLC" ? "mould" : moduleRefName].dataGroup.shareInvestmentFee, // 金额 
          shareQuantity: this.$refs[type !== "SKDLC" ? "mould" : moduleRefName].dataGroup.shareQuantity || "0", // 分摊数量
          shareAmount: this.$refs[type !== "SKDLC" ? "mould" : moduleRefName].dataGroup.unitInvestmentCost, // 分摊金额
          totalPrice: this.$refs[type !== "SKDLC" ? "mould" : moduleRefName].dataGroup.totalInvestmentCost // 总投资成本/开发费⽤
        },
        devFeeDTOList: this.$refs[type !== "SKDLC" ? "developmentCost" : devCostRefName].tableListData,
        devOtherFee: {
          itemType: 1,
          shareTotal: this.$refs[type !== "SKDLC" ? "developmentCost" : devCostRefName].dataGroup.shareDevFee, // 金额
          shareQuantity: this.$refs[type !== "SKDLC" ? "developmentCost" : devCostRefName].dataGroup.shareQuantity || "0", // 分摊数量
          shareAmount: this.$refs[type !== "SKDLC" ? "developmentCost" : devCostRefName].dataGroup.unitPrice, // 分摊金额 
          totalPrice: this.$refs[type !== "SKDLC" ? "developmentCost" : devCostRefName].dataGroup.devFee  // 总投资成本/开发费⽤
        },
      }
    },
    save(type) {
      if (!this.isSkdLc) {
        if (this.$refs.mould.tableListData.some(item => item.isShared == 1)) {
          if (!this.$refs.mould.dataGroup.shareQuantity || this.$refs.mould.dataGroup.shareQuantity == 0)
            throw iMessage.warn("模具费用存在分摊数据，请填写一个大于0的分摊数量")
        }

        if (this.$refs.developmentCost.tableListData.some(item => item.isShared == 1)) {
          if (!this.$refs.developmentCost.dataGroup.shareQuantity || this.$refs.developmentCost.dataGroup.shareQuantity == 0)
            throw iMessage.warn("开发费用存在分摊数据，请填写一个大于0的分摊数量")
        }
      } else {
        if (this.$refs.skdMould.tableListData.some(item => item.isShared == 1)) {
          if (!this.$refs.skdMould.dataGroup.shareQuantity || this.$refs.skdMould.dataGroup.shareQuantity == 0)
            throw iMessage.warn("SKD模具费用存在分摊数据，请填写一个大于0的分摊数量")
        }

        if (this.$refs.skdDevelopmentCost.tableListData.some(item => item.isShared == 1)) {
          if (!this.$refs.skdDevelopmentCost.dataGroup.shareQuantity || this.$refs.skdDevelopmentCost.dataGroup.shareQuantity == 0)
            throw iMessage.warn("SKD开发费用存在分摊数据，请填写一个大于0的分摊数量")
        }

        if (this.$refs.lcMould.tableListData.some(item => item.isShared == 1)) {
          if (!this.$refs.lcMould.dataGroup.shareQuantity || this.$refs.lcMould.dataGroup.shareQuantity == 0)
            throw iMessage.warn("LC模具费用存在分摊数据，请填写一个大于0的分摊数量")
        }

        if (this.$refs.lcDevelopmentCost.tableListData.some(item => item.isShared == 1)) {
          if (!this.$refs.lcDevelopmentCost.dataGroup.shareQuantity || this.$refs.lcDevelopmentCost.dataGroup.shareQuantity == 0)
            throw iMessage.warn("LC开发费用存在分摊数据，请填写一个大于0的分摊数量")
        }
      }
      
      return new Promise((r,j)=>{
        const params = {}

        if (this.isSkd) {
          saveModuleDevFeeSkd(this.getParams("SKD"))
          .then(res => {
            if (res.code == 200) {
              r()
              if (type !== "submit") iMessage.success(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
              this.init()
            } else {
              j()
              iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
            }
          })
          .catch(() => {
            j()
          })
        } else if (this.isSkdLc) {
          Promise.all([
            saveModuleDevFeeSkd(this.getParams("SKDLC", "skdMould", "skdDevelopmentCost")),
            saveModuleDevFee(this.getParams("SKDLC", "lcMould", "lcDevelopmentCost"))
          ])
          .then(([res1, res2]) => {
            if (res1 && res1.code == 200 && res2 && res2.code == 200) {
              if (type !== "submit") iMessage.success(this.$i18n.locale === "zh" ? res1.desZh : res1.desEn)
              this.init()
              r()
            } else {
              iMessage.error(this.language("CAOZUOSHIBAI", "操作失败"))
            }
          })
          .catch(() => {
            j()
          })
        } else {
          saveModuleDevFee(this.getParams("LC"))
          .then(res => {
            if (res.code == 200) {
              r()
              if (type !== "submit") iMessage.success(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
              this.init()
            } else {
              j()
              iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
            }
          })
          .catch(() => {
            j()
          })
        }
      })
    }
  }
}
</script>

<style>

</style>