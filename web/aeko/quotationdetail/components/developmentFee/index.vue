<!--
 * @Author: wentliao
 * @Date: 2021-08-25 09:56:39
 * @Description: 
-->
<template>
  <div class="developmentFee">
    <developmentCost ref="devcost" :disabled="disabled" :editDisabled="editDisabled" :partInfo="basicInfo" @save="handleSave" :isAeko="true"/>
  </div>
</template>

<script>
import {
  iMessage,
} from 'rise';
import developmentCost from 'rise/web/quotationdetail/components/mouldAndDevelopmentCost/components/developmentCost';
import { saveModuleDevFee } from "@/api/aeko/detail"
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
    editDisabled: {
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
    save(){
      return this.saveModuleDevFee(
        () => this.$refs.devcost.updateSaveLoading(true),
        () => this.$refs.devcost.updateSaveLoading(false)
      )
    },
    handleSave() {
      // 校验下维护的数据 若一行中只维护了部分数据 无法保存 
      const tableListData = this.$refs.devcost.tableListData;
      let flag = false;
      tableListData.map((item)=>{
        let arr = Object.keys(item);
        let newArr = [];
        arr.map((arrItem)=>{
          if(item[arrItem]) newArr.push(arrItem);
        })
        if(newArr.length > 0 && (!item.item || !item.itemDescription || !item.unitPrice || !item.quantity || item.isShared==null)) flag = true;
      })
      if (flag) return iMessage.warn(this.language('LK_AEKO_QINGWEIHUZHENGHANGSHUJUHOUZAIBAOCUN','请维护整行数据后，再保存'));
      this.save()
      .then(res => {
        if (res.code == 200) {
          iMessage.success(this.$i18n.locale === "zh" ? res.desZh : res.desEn);
          this.$emit('getBasicInfo');
          this.$refs.devcost.getDevFee();
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
    },
    saveModuleDevFee(beforeHook, afterHook) {
      if (this.$refs.devcost.tableListData.some(item => item.isShared == 1)) {
        if (!this.$refs.devcost.dataGroup.shareQuantity || this.$refs.devcost.dataGroup.shareQuantity == 0){
          const tips = this.language('LK_KAIFAFEIYONGCUNZAIFENTANSHUJUQINGTIANXIEDAYU','开发费用存在分摊数据，请填写一个大于0的分摊数量')
          return iMessage.warn(tips);
        }
      }

      if (typeof beforeHook === "function") beforeHook()

      return saveModuleDevFee({
        quotationId: this.basicInfo.quotationId,
        devFeeDTOList: this.$refs.devcost.tableListData,
        devOtherFee: {
          itemType: 1,
          shareTotal: this.$refs.devcost.dataGroup.shareDevFee, // 金额
          shareQuantity: this.$refs.devcost.dataGroup.shareQuantity || "0", // 分摊数量
          shareAmount: this.$refs.devcost.dataGroup.unitPrice, // 分摊金额 
          totalPrice: this.$refs.devcost.dataGroup.devFee  // 总投资成本/开发费⽤
        }
      })
      .finally(() => {
        if (typeof afterHook === "function") afterHook()
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