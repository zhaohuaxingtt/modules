<!--
 * @Author: wentliao
 * @Date: 2021-08-27 09:39:40
 * @Description: 
-->

<template>
  <!-- 终止费 -->
  <iCard class="damages">
      <template #header>
        <div class="header">
          <div>
            <span class="title">{{ language('LK_DAMAGES_ZHONGZHIFEI','终⽌费') }}</span>
          </div>
          <div class="control">
            <iButton :loading="btnLoading" v-permission.auto="AEKO_BAOJIADAN_TAB_ZHONGZHIFEI_BUTTON_SAVE|保存"  @click="handleSave">{{language('LK_BAOCUN','保存')}}</iButton>
          </div>
        </div>
      </template>
      <div class="contain">
        <span class="contain-label">{{ language('LK_DAMAGES_ZHONGZHIFEI','终⽌费') }}:</span>
        <iInput class="contain-input" @input="handleInputBySampleUnitPrice" v-model.trim="value"></iInput>
      </div>
  </iCard>
</template>

<script>
import {
  iCard,
  iButton,
  iInput,
  iMessage,
} from 'rise'
import { saveTerminationPrice } from '@/api/aeko/quotationdetail'
import { cloneDeep } from "lodash"
import { numberProcessor } from '@/utils'
export default {
  components:{
    iCard,
    iButton,
    iInput,
  },
  props:{
    basicInfo:{
      type:Object,
      default:()=>{},
    }
  },
  data(){
    return{
      value:'',
      btnLoading:false,
    }
  },
  methods:{
    init(){
      const {basicInfo={}} = this; 
      const {quotationPriceSummaryInfo={}} = basicInfo;
      const terminationPrice = quotationPriceSummaryInfo.terminationPrice;
      this.value = terminationPrice ? cloneDeep(terminationPrice)  : '';
    },
    save() {
      return this.saveTerminationPrice(
        () => this.btnLoading = true,
        () => this.btnLoading = false
      )
    },
    handleSave() {
      this.save()
      .then(res => {
        if(res.code == 200){
          iMessage.success(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
          this.$emit('getBasicInfo');
        }else{
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
    },
    saveTerminationPrice(beforeHook, afterHook) {
      const {value} = this;
      if(!value) return iMessage.warn(this.language('LK_AEKO_TAB_DAMAGES_TIPS','请填写后提交'));
      const {basicInfo={}} = this;
      const {quotationId=""} = basicInfo;
      const data = {
        terminationPrice:value,
        quotationId,
      }

      if (typeof beforeHook === "function") beforeHook()

      return saveTerminationPrice(data).finally(() => {
        if (typeof afterHook === "function") afterHook()
      })
    },
    handleInputBySampleUnitPrice(){
      const {value} = this;
      this.value = numberProcessor(value, 2)
    },
  }
}
</script>

<style lang="scss" scoped>
  .damages{
    .header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        height: 25px;
        line-height: 25px;
        font-size: 18px;
        font-weight: bold;
        color: #131523;
      }
    }
    .contain{
      display: flex;
      align-items: center;
      .contain-label{
        flex-shrink: 0;
        margin-right: 30px;
      }
      .contain-input{
        width: 300px;
      }
    }

  }
</style>