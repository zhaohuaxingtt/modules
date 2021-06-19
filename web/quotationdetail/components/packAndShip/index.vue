<!--
 * @Descripttion: 供应商报价界面-报价页面-零件报价-包装运输
 * @Author: Luoshuang
 * @Date: 2021-04-22 16:53:47
 * @LastEditTime: 2021-06-19 21:59:16
-->
<template>
  <!----------------供应商报价界面-报价页面-零件报价-包装运输---------------------------------------------------->
  <!--- 先做出[包装费][运输费][操作费]三个文本输入框（只能输入数字，可以输入小数点后四位），提供给报价成本汇总使用----->
  <!----在未来BNK页面开发好后，再将该包装运输页面迁移到本系统内---------------------------------------------------->
  <iCard class="packAndShip" v-loading="loading">
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
        :label="$t(item.i18n) + '：'"
      >
          <!-------只能输入数字，可以输入小数点后四位---------->
        <iInput v-if="!disabled" v-model="params[item.props]" title="" type="number" oninput="if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"></iInput>
        <iText v-else>{{ params[item.props] }}</iText>
      </iFormItem>
    </iFormGroup>
  </iCard>
</template>

<script>
import { iCard, iFormGroup, iFormItem, iMessage, iInput, iText } from "rise";
import { savePackageTransport, getPackageTransport } from '@/api/rfqManageMent/quotationdetail'
export default {
  components: {
    iCard,
    iFormGroup,
    iFormItem,
    iInput,
    iText
  },
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
  data() {
    return {
      inputs: [
        { props: "packageCost", name: "包装费", i18n: 'LK_BAOZHUANGFEI' },
        { props: "transportCost", name: "运输费", i18n: 'LK_YUNSHUFEI' },
        { props: "operateCost", name: "操作费", i18n: 'LK_CAOZUOFEI' },
      ],
      params: {
        packageCost: "",
        transportCost: "",
        operateCost: "",
      },
      loading: false
    };
  },
  methods: {
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
          this.params = res.data
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
    save() {
      return new Promise((r,j)=>{
        this.loading = true
        savePackageTransport(this.params).then(res => {
          if (res && res.result) {
            r()
            iMessage.success(this.$i18n.locale === 'zh' ? res.desZh : res.desEn)
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