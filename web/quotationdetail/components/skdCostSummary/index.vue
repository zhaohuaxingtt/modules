<template>
  <iCard class="skdCostSummary" v-loading="copyLoading" :title="showTitle ? this.language('SKDBAOJIA', 'SKD报价') : ''">
    <iFormGroup row="4" class="formGroup" :class="{ 'formGroupDisabled': disabled, 'formGroup': !disabled }">
      <iFormItem v-if="!disabled" :label="language('FUZHIBAOJIAZHI', '复制报价至')">
        <iSelect v-model="copyParts" :placeholder="language('QINGXUANZELINGJIAN', '请选择零件')" multiple collapse-tags @visible-change="visibleChange">
          <el-option 
            v-for="item in parts" 
            :key="item.key" 
            :label="item.label" 
            :value="item.value">
          </el-option>
        </iSelect>
      </iFormItem>
      <iFormItem :label="language('SKDQIBUSHENGCHANRIQI', 'SKD起步生产日期')">
        <div class="startProductDate">
          <iText v-if="disabled">{{ skdStartProductDate }}</iText>
          <iDatePicker v-else v-model="skdStartProductDate" :disabled="isAutoCal"></iDatePicker>
          <el-popover
            placement="top"
            width="200"
            trigger="hover"
            :content="language('SHIFOUZIDONGJISUAN', '是否自动计算')">
              <el-checkbox class="isAutoCal" slot="reference" :disabled="disabled" v-model="isAutoCal" @change="handleChangeIsAutoCal"></el-checkbox>
          </el-popover>
        </div>
      </iFormItem>
      <iFormItem :label="language('HUOBI', '货币')">
        <iText v-if="disabled">{{ currencyText }}</iText>
        <iSelect v-else v-model="currency" @change="handleChangeByCurrency">
          <el-option 
            v-for="item in currencyOptions" 
            :key="item.key" 
            :label="$i18n.locale === 'zh' ? item.label : item.value" 
            :value="item.value">
          </el-option>
        </iSelect>
      </iFormItem>
      <iFormItem v-if="exchangeRate" :label="language('HUILV', '汇率')">
        <span>1.00 {{ currency }}={{ exchangeRate }} RMB</span>
      </iFormItem>
    </iFormGroup>
    <tableList
      lang
      ref="table"
      class="table"
      v-loading="loading"
      :selection="false"
      :tableTitle="tableTitle"
      :tableData="tableListData">
      <template #overseasFactoryPrice="scope">
        <iInput v-if="!disabled" class="input" v-model="scope.row.overseasFactoryPrice" @input="handleInputByNumber($event, 'overseasFactoryPrice', scope.row, 2, value => { computeTotalPrice(value, 'overseasFactoryPrice', scope.row) })"></iInput>
        <span v-else>{{ scope.row.overseasFactoryPrice }}</span>
      </template>
      <template #overseasBnkPrice="scope">
        <iInput v-if="!disabled" class="input" v-model="scope.row.overseasBnkPrice" @input="handleInputByNumber($event, 'overseasBnkPrice', scope.row, 2, value => { computeTotalPrice(value, 'overseasBnkPrice', scope.row) })"></iInput>
        <span v-else>{{ scope.row.overseasBnkPrice }}</span>
      </template>
      <template #tariff="scope">
        <iInput v-if="!disabled" class="input" v-model="scope.row.tariff" @input="handleInputByNumber($event, 'tariff', scope.row, 2, value => { computeTotalPrice(value, 'tariff', scope.row) })"></iInput>
        <span v-else>{{ scope.row.tariff }}</span>
      </template>
      <template #domesticFreight="scope">
        <iInput v-if="!disabled" class="input" v-model="scope.row.domesticFreight" @input="handleInputByNumber($event, 'domesticFreight', scope.row, 2, value => { computeTotalPrice(value, 'domesticFreight', scope.row) })"></iInput>
        <span v-else>{{ scope.row.domesticFreight }}</span>
      </template>
      <template #manageSummary="scope">
        <iInput v-if="!disabled" class="input" v-model="scope.row.manageSummary" @input="handleInputByNumber($event, 'manageSummary', scope.row, 2, value => { computeTotalPrice(value, 'manageSummary', scope.row) })"></iInput>
        <span v-else>{{ scope.row.manageSummary }}</span>
      </template>
      <template #profitSummary="scope">
        <iInput v-if="!disabled" class="input" v-model="scope.row.profitSummary" @input="handleInputByNumber($event, 'profitSummary', scope.row, 2, value => { computeTotalPrice(value, 'profitSummary', scope.row) })"></iInput>
        <span v-else>{{ scope.row.profitSummary }}</span>
      </template>
      <!-- <template #otherSummary="scope">
        <iInput v-if="!disabled" class="input" v-model="scope.row.otherSummary" @input="handleInputByNumber($event, 'otherSummary', scope.row, 2, value => { computeTotalPrice(value, 'otherSummary', scope.row) })"></iInput>
        <span v-else>{{ scope.row.otherSummary }}</span>
      </template> -->
    </tableList>
    <percentage lang :data="percentageData" />
  </iCard>
</template>

<script>
/* eslint-disable no-undef */

import { iCard, iFormGroup, iFormItem, iSelect, iText, iDatePicker, iInput, iMessage, iMessageBox } from "rise"
import tableList from "rise/web/quotationdetail/components/tableList"
import percentage from "./components/percentage"
import { tableTitle } from "./components/data"
import { getSkdCostSummary, saveSkdCostSummary, getPartsQuotationsSkd, copyPartsQuotationSkd, getIsAutoCal,copyPartsQuotation } from "@/api/rfqManageMent/quotationdetail"
import { handleInputByNumber } from "../data"
import { uuidv4 } from "rise/web/aeko/quotationdetail/components/aPriceChange/components/data"

export default {
  components: { iCard, iFormGroup, iFormItem, iSelect, iText, iDatePicker, iInput, tableList, percentage },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    partInfo: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showTitle: {
      type: Boolean,
      default: false
    },
    isSkd:{
      type:Boolean,
      default:false,
    }
  },
  data() {
    return {
      loading: false,
      skdStartProductDate: "",
      exchangeRateVos: [],
      currency: "",
      currencyOptions: [],
      exchangeRate: "",
      tableTitle: _.cloneDeep(tableTitle),
      tableListData: [{}], 
      supplierId: "",
      parts: [],
      copyParts: [],
      copyLoading: false,
      // updateStartProductDateLoading: false,
      isAutoCal: false
    }
  },
  computed: {
    ...Vuex.mapState({
      userInfo: state => state.permission.userInfo,
    }),
    percentageData() {
      const data = this.tableListData[0]
      return {
        overseasFactoryPrice:math.multiply( math.bignumber(data.overseasFactoryPrice || 0 ) , math.bignumber(this.exchangeRate || 0 )).toFixed(2),
        overseasPrice: 
        math.chain(math.bignumber(data.overseasBnkPrice || 0))
        .multiply(math.bignumber(this.exchangeRate || 0 ))
        .add(math.bignumber(data.tariff || 0))
        .done()
        .toFixed(2),
        domesticFreight: data.domesticFreight,
        manageSummary: data.manageSummary,
        otherSummary: data.otherSummary,
        profitSummary: data.profitSummary
      }
    },
    currencyText() {
      const currency = this.currencyOptions.find(item => item.value === this.currency)

      if (currency) {
        return this.$i18n.locale === "zh" ? currency.label : currency.value
      }

      return this.currency
    },
  },
  created() {
    this.supplierId = this.$route.query.supplierId || this.userInfo.supplierId
  },
  methods: {
    handleInputByNumber,
    getPartsQuotationsSkd() {
      getPartsQuotationsSkd({
        rfqId: this.$route.query.rfqId,
        round: this.$route.query.round,
        supplierId: this.supplierId
      })
      .then(res => {
        if (res.code == 200) {
          this.parts = 
            Array.isArray(res.data) ? 
            res.data.map(item => ({
              key: item.fsNum,
              label: `${ item.partNum }_${ item.fsNum }`,
              value: item.fsNum
            })) : 
            []
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
    },
    getSkdCostSummary() {
      this.loading = true

      getSkdCostSummary({
        quotationId: this.partInfo.quotationId
      })
      .then(res => {
        if (res.code == 200) {
          this.tableListData = [res.data]
          this.exchangeRateVos = res.data.exchangeRateVos
          this.currencyOptions =
            Array.isArray(res.data.exchangeRateVos) ?
            res.data.exchangeRateVos.map(item => ({
              key: item.currencyCode,
              label: item.currencyName,
              value: item.currencyCode,
              exchangeRate: item.exchangeRate
            })) :
            []

          this.computeSalesPrice("", "", this.tableListData[0])
          this.skdStartProductDate = res.data.skdStartProductDate
          this.currency = res.data.currency || "RMB"
          this.isAutoCal = res.data.isAutoCal
          this.handleChangeByCurrency()
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
      .finally(() => this.loading = false)
    },
    init() {
      this.getPartsQuotationsSkd()
      this.getSkdCostSummary()
    },
    handleChangeByCurrency() {
      this.exchangeRate = "0.00"

      if (this.currency) {
        const currentCurrency = this.currencyOptions.find(item => item.value === this.currency)

        const currencyZh = currentCurrency.label
        this.exchangeRate = this.currency === "RMB" ? "1.00" : currentCurrency.exchangeRate
        this.computeTotalPrice(null, null, this.tableListData[0])

        this.$set(this.tableTitle[0], "renderHeader", () => (<div>{ this.language( tableTitle[0].key, tableTitle[0].name ) }（{ this.$i18n.locale === "zh" ? currencyZh : this.currency }）</div>))
        this.tableTitle[0].updateKey = uuidv4()
        this.$set(this.tableTitle[1], "renderHeader", () => (<div>{ this.language( tableTitle[1].key, tableTitle[1].name ) }（{ this.$i18n.locale === "zh" ? currencyZh : this.currency }）</div>))
        this.tableTitle[1].updateKey = uuidv4()
      }
    },
    save(beforeHook, afterHook) {
      if (!this.skdStartProductDate) throw iMessage.warn(this.language("QINGXUANZESKDQIBUSHENGCHANRIQI", "请选择SKD起步生产日期"))

      if (typeof beforeHook === "function") beforeHook()

      return saveSkdCostSummary({
        ...this.tableListData[0],
        skdStartProductDate: this.skdStartProductDate,
        isAutoCal: this.isAutoCal,
        currency: this.currency,
        quotationId: this.partInfo.quotationId,
        exchangeRateVos: this.exchangeRateVos
      })
      .finally(() => {
				if (typeof afterHook === "function") afterHook()
			})
    },
    computeTotalPrice(originValue, originKey, row) {
      const totalPrice = math.chain(math.bignumber(row.overseasFactoryPrice || 0))
      .add(math.bignumber(row.overseasBnkPrice || 0))
      .multiply(math.bignumber(this.exchangeRate || 0))
      .add(math.bignumber(row.tariff || 0))
      .add(math.bignumber(row.domesticFreight || 0))
      .add(math.bignumber(row.manageSummary || 0))
      .add(math.bignumber(row.profitSummary || 0))
      .add(math.bignumber(row.otherSummary || 0))
      .done()
      .toFixed(2)

      this.$set(row, "totalPrice", totalPrice)
      this.computeSalesPrice(originValue, originKey, row)
    },
    computeSalesPrice(originValue, originKey, row) {
      const salesPrice = math.add(
        math.bignumber(row.totalPrice || 0),
        math.bignumber(row.packageCost || 0),
        math.bignumber(row.transportCost || 0),
        math.bignumber(row.operateCost || 0)
      ).toFixed(2)

      this.$set(row, "salesPrice", salesPrice)
    },
    visibleChange(list) {
      if (this.copyParts.length) {
        iMessageBox(this.language("NINQUEDINGYAOJIANGBAOJIADANFUZHIDAOXUANZHONGDELINGJIANZHONGMA", "您确定要将报价单复制到选中的零件中吗？")).then(() => {
           this.copyPartsQuotationSkd()
        }).catch(() => {
          this.copyParts = []
        })
      }
    },
    copyPartsQuotationSkd() {
      this.copyLoading = true
      
      const {isSkd = false} = this;

      copyPartsQuotationSkd({
        partNums: this.copyParts,
        quotationId: this.partInfo.quotationId
      })
      .then(res => {
        const message = this.$i18n.locale === "zh" ? res.desZh : res.desEn
        
        if (res.code == 200) {
          if(!isSkd){
            this.copyLoading = false;
            this.copyPartsQuotation();
          }else{
            this.copyParts = []
            iMessage.success(message)
          }
          
        } else {
          iMessage.error(message)
        }
      })
      .finally(() => this.copyLoading = false)
    },

    //LC
    copyPartsQuotation(){
      this.copyLoading = true
      copyPartsQuotation({
        partNums: this.copyParts,
        quotationId: this.partInfo.quotationId
      }).then(res => {
        const message = this.$i18n.locale === "zh" ? res.desZh : res.desEn
        
        if (res.code == 200) {
          this.copyParts = []
          iMessage.success(message)
        } else {
          iMessage.error(message)
        }
      })
      .finally(() => this.copyLoading = false)
    },
    // updateStartProductDate() {
    //   this.updateStartProductDateLoading = true

    //   getIsAutoCal({
    //     isAutoCal: true,
    //     quotationId: this.partInfo.quotationId,
    //     supplierId: this.supplierId
    //   })
    //   .then(res => {
    //     if (res.code == 200) {
    //       this.skdStartProductDate = res.data.startProductDate
    //       iMessage.success(this.language("HUOQUCHENGGONG", "获取成功"))
    //     } else {
    //       iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
    //     }
    //   })
    //   .finally(() => this.updateStartProductDateLoading = false)
    // }
    handleChangeIsAutoCal(value) {
      if (value) {
        this.getIsAutoCal()
      }
    },
    getIsAutoCal() {
      getIsAutoCal({
        isAutoCal: true,
        quotationId: this.partInfo.quotationId,
        supplierId: this.userInfo.supplierId ? this.userInfo.supplierId : this.$route.query.supplierId
      })
      .then(res => {
        if (res.code == 200) {
          this.skdStartProductDate = res.data.startProductDate
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.skdCostSummary {
  .formGroup {
    ::v-deep .el-form-item {
      &:first-of-type {
        width: 340px!important;

        label {
          width: 110px;
        }
      }

      &:nth-of-type(2) {
        width: 350px!important;

        label {
          width: 150px;
        }
      }

      &:nth-of-type(3),
      &:last-of-type {
        width: 280px!important;

        label {
          width: 55px;
        }
      }

      &:last-of-type {
        .el-form-item__content {
          text-align: left;
          font-weight: bold;
        }
      }
    }
  }

  .formGroupDisabled {
    ::v-deep .el-form-item {
      &:first-of-type {
        width: 350px!important;

        label {
          width: 150px;
        }
      }

      &:nth-of-type(2),
      &:last-of-type {
        width: 280px!important;

        label {
          width: 55px;
        }
      }

      &:last-of-type {
        .el-form-item__content {
          text-align: left;
          font-weight: bold;
        }
      }
    }
  }

  .startProductDate {
    display: flex;
    align-items: center;

    .isAutoCal {
      margin-left: 8px;
      width: 0 !important;
    }
  }

  .table {
    &::before {
      height: 0;
    }

    .input {
      max-width: 120px !important;
    }
  }
}
</style>