<!--
 * @Descripttion: 供应商报价界面-报价页面-零件报价-包装运输
 * @Author: Luoshuang
 * @Date: 2021-04-22 16:53:47
 * @LastEditTime: 2021-07-20 15:57:03
-->
<template>
  <div v-if="partInfo.partProjectType === partProjTypes.DBLINGJIAN || partInfo.partProjectType === partProjTypes.DBYICHIXINGCAIGOU" v-loading="loading">
    <iCard :title="language('CANKAOBAOZHUANG','参考包装')">
      <iFormGroup
        :row="4"
        inline
        class="packAndShip-form margin-top20"
      >
        <iFormItem
          v-for="item in referenceInputs"
          :key="item.props"
          :label="language(item.i18n, item.name) + '：'"
        >
          <iText></iText>
        </iFormItem>
      </iFormGroup>
    </iCard>
    <iCard :title="language('BAOZHUANGYAOQIU','包装要求')" class="margin-top20">
      <iFormGroup
        :row="4"
        inline
        class="packAndShip-form margin-top20"
      >
        <iFormItem
          v-for="item in requireInputs"
          :key="item.props"
          :label="language(item.i18n, item.name) + '：'"
        >
          <iText v-if="disabled">{{ item.type === 'select' ? getName(params[item.props]) : params[item.props] }}</iText>
          <iSelect v-else-if="item.type === 'select'" v-model="params[item.props]">
            <el-option
              v-for="item in selectOptions[item.selectOption]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </iSelect>
          <iInput v-else :value="params[item.props]" title="" type="text" @input="val => handleInput(val, params, item.props)"></iInput>
        </iFormItem>
      </iFormGroup>
    </iCard>
  </div>
  <!----------------供应商报价界面-报价页面-零件报价-包装运输---------------------------------------------------->
  <!--- 先做出[包装费][运输费][操作费]三个文本输入框（只能输入数字，可以输入小数点后四位），提供给报价成本汇总使用----->
  <!----在未来BNK页面开发好后，再将该包装运输页面迁移到本系统内---------------------------------------------------->
  <iCard v-else class="packAndShip" v-loading="loading">
    <div class="header">
      <span class="title">{{ $t('LK_BAOZHUANGYUNSHU') }}</span>
      <span class="tip margin-left10">{{ $t('LK_DANWEIYUAN') }}</span>
    </div>
    <!-------输入框区域------->
    <iFormGroup
      :row="4"
      inline
      class="packAndShip-form margin-top20"
      :rules="rules"
    >
      <iFormItem
        v-for="item in inputs"
        :key="item.props"
        :label="language(item.i18n, item.name) + '：'"
      >
          <!-------只能输入数字，可以输入小数点后四位---------->
        <iInput v-if="!disabled && item.editable" v-model="params[item.props]" title="" type="number" oninput="if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"></iInput>
        <iText v-else>{{ params[item.props] }}</iText>
      </iFormItem>
    </iFormGroup>
  </iCard>
</template>

<script>
import { iCard, iFormGroup, iFormItem, iMessage, iInput, iText, iSelect } from "rise";
import { savePackageTransport, getPackageTransport } from '@/api/rfqManageMent/quotationdetail'
import { getDictByCode } from '@/api/dictionary'
import {partProjTypes} from '@/config'
import { priceTypeMixin } from "../mixins/mixins"

export default {
  components: {
    iCard,
    iFormGroup,
    iFormItem,
    iInput,
    iText,
    iSelect
  },
  mixins: [ priceTypeMixin ],
  props: {
    partInfo:{
      type:Object,
      default:()=>{
        return {
          quotationId:'',
        }
      }
    },
    disabled: {type: Boolean}
  },
  computed: {
    inputs() {
      if (this.isSkd || this.isSkdLc) {
        this.params.logisticsQuotationStatus = undefined
        return this.sourceInputs.filter(item => item.props !== "logisticsQuotationStatus")
      } else {
        return this.sourceInputs
      }
    }
  },
  data() {
    return {
      // 零件项目类型
      partProjTypes,
      sourceInputs: [
        { props: "packageCost", name: "包装费", i18n: 'LK_BAOZHUANGFEI', editable: true },
        { props: "transportCost", name: "运输费", i18n: 'LK_YUNSHUFEI', editable: true },
        { props: "operateCost", name: "操作费", i18n: 'LK_CAOZUOFEI', editable: true },
        { props: "logisticsQuotationStatus", name: "BNK审核状态", i18n: 'LK_BNKSHENMHEZHUANGTAI' },
      ],
      params: {
        packageCost: "",
        transportCost: "",
        operateCost: "",
      },
      loading: false,
      referenceInputs: [
        { props: "packageCost", name: "参考类型", i18n: 'CAOKAOLEIXING' },
        { props: "transportCost", name: "参考包装长(mm)", i18n: 'CANKAOBAOZHUANGCHANG_MM' },
        { props: "transportCost", name: "参考包装宽(mm)", i18n: 'CANKAOBAOZHUANGKUAN_MM' },
        { props: "transportCost", name: "参考包装高(mm)", i18n: 'CANKAOBAOZHUANGGAO_MM' },
        { props: "packageCost", name: "LS(PC)", i18n: 'LS_PC' },
        { props: "packageCost", name: "Stack", i18n: 'STACK' },
      ],
      requireInputs: [
        { props: "packageType", name: "参考类型", i18n: 'CAOKAOLEIXING', type: 'select', selectOption: 'PACKAGETYPE' },
        { props: "packageLength", name: "参考包装长(mm)", i18n: 'CANKAOBAOZHUANGCHANG_MM' },
        { props: "packageWidth", name: "参考包装宽(mm)", i18n: 'CANKAOBAOZHUANGKUAN_MM' },
        { props: "packageHeight", name: "参考包装高(mm)", i18n: 'CANKAOBAOZHUANGGAO_MM' },
        { props: "packageLs", name: "LS(PC)", i18n: 'LS_PC' },
        { props: "packageStack", name: "Stack", i18n: 'STACK' },
      ],
      selectOptions: {}
    };
  },
  created() {
    this.getPackageOptions()
  },
  methods: {
    getName(val) {
      return this.selectOptions.PACKAGETYPE?.find(item => item.value === val)?.label
    },
    handleInput(val, params, type){
      if(/^\d*\.?\d*$/.test(val)) {
        this.$set(params, type, val.indexOf('.')>0 ? val.slice(0,val.indexOf('.')+3) : val)
      }
    },
    getPackageOptions() {
      getDictByCode('PACKAGETYPE').then(res => {
        if (res?.result) {
          this.selectOptions = {
            ...this.selectOptions,
            PACKAGETYPE: (res.data[0]?.subDictResultVo || []).map(item => {
              return {
                ...item,
                value: item.code,
                label: this.$i18n.locale === 'zh' ? item.name: item.nameEn
              }
            })
          }
        }
      })
    },
    /**
     * @description: 初始化界面方法,父界面会在存在参数的情况下来调用
     * @param {*}
     * @return {*}
     */    
    init(){
      this.getPackageTransport()
    },
    /**
     * 获取包装运输初始数据
     */
    getPackageTransport() {
      const params = {
        quotationId: this.partInfo.quotationId
      }
      this.loading = true
      getPackageTransport(params).then(res => {
        if (res && res.result) {
          this.params = {
            ...res.data,
            quotationId: this.partInfo.quotationId
          }
        } else {
          iMessage.error(this.$i18n.locale === 'zh' ? res.desZh : res.desEn)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    /**
     * 保存修改的包装运输数据
     */
    save(type) {
      return new Promise((r,j)=>{
        this.loading = true
        savePackageTransport(this.params).then(res => {
          if (res && res.result) {
            r()
            if (type !== "submit") iMessage.success(this.$i18n.locale === 'zh' ? res.desZh : res.desEn)
            this.init()
          } else {
           j()
            iMessage.error(this.$i18n.locale === 'zh' ? res.desZh : res.desEn)
          }
        }).finally(() => {
          j()
          this.loading = false
        })
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.packAndShip {
  .header {
    .title {
      height: 25px;
      line-height: 25px;
      font-size: 18px;
      font-weight: bold;
      color: #131523;
    }

    .tip {
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      color: #86878e;
    }
  }
  .packAndShip-form {
    ::v-deep .el-form-item__label {
      width: 140px;
      font-size: 16px;
    }
  }
}
</style>