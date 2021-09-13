<!--
 * @Author: wentliao
 * @Date: 2021-08-25 09:56:39
 * @Description: 
-->
<template>
  <div class="developmentFee">
    <developmentCost ref="devcost" :disabled="disabled" :partInfo="basicInfo" @save="save" :isAeko="true"/>
  </div>
</template>

<script>
import {
  iMessage,
} from 'rise';
import developmentCost from 'rise/web/quotationdetail/components/mouldAndDevelopmentCost/components/developmentCost';
import { saveModuleDevFee } from "@/api/rfqManageMent/quotationdetail"
export default {
  components:{
    developmentCost,
  },
  props:{
    basicInfo:{
      type:Object,
      default:()=>{},
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  data(){
    return{
    }
  },
  methods:{
    init(){
      this.$refs.devcost.getDevFee();
    },
    // 保存
    save(value){
       if (this.$refs.devcost.tableListData.some(item => item.isShared == 1)) {
        if (!this.$refs.devcost.dataGroup.shareQuantity || this.$refs.devcost.dataGroup.shareQuantity == 0){
          const tips = this.language('LK_KAIFAFEIYONGCUNZAIFENTANSHUJUQINGTIANXIEDAYU','开发费用存在分摊数据，请填写一个大于0的分摊数量')
          return iMessage.warn(tips);
        }
       }

      return new Promise((r,j)=>{
        saveModuleDevFee({
          quotationId: this.basicInfo.quotationId,
          devFeeDTOList: this.$refs.devcost.tableListData,
          devOtherFee: {
            itemType: 1,
            shareTotal: this.$refs.devcost.dataGroup.shareDevFee, // 金额
            shareQuantity: this.$refs.devcost.dataGroup.shareQuantity || "0", // 分摊数量
            shareAmount: this.$refs.devcost.dataGroup.unitPrice, // 分摊金额 
            totalPrice: this.$refs.devcost.dataGroup.devFee  // 总投资成本/开发费⽤
          },
        })
        .then(res => {
          if (res.code == 200) {
            r()
            iMessage.success(this.$i18n.locale === "zh" ? res.desZh : res.desEn);
            this.$emit('getBasicInfo');
            this.$refs.devcost.getDevFee();
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

<style lang="scss" scoped>
  .developmentFee{
    .header{
      width: 100%;
    }
  }
</style>