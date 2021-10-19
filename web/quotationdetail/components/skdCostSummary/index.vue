<template>
  <iCard class="skdCostSummary">
    <iFormGroup row="4" class="formGroup">
      <iFormItem :label="language('FUZHIBAOJIAZHI', '复制报价至')">
        <iSelect v-model="a" :placeholder="language('QINGXUANZELINGJIAN', '请选择零件')">
          <el-option 
            v-for="item in []" 
            :key="item.key" 
            :label="item.label" 
            :value="item.value">
          </el-option>
        </iSelect>
      </iFormItem>
      <iFormItem :label="language('SKDQIBUSHENGCHANRIQI', 'SKD起步生产日期')">
        <iDatePicker v-model="skdStartProductDate" type="date" />
      </iFormItem>
      <iFormItem :label="language('HUOBI', '货币')">
        <iSelect v-model="currency" @change="handleChangeByCurrency">
          <el-option 
            v-for="item in currencyOptions" 
            :key="item.key" 
            :label="item.label" 
            :value="item.value">
          </el-option>
        </iSelect>
      </iFormItem>
      <iFormItem v-if="exchangeRate" :label="language('HUILV', '汇率')">
        <span>{{ exchangeRate }} {{ currency }}=1.00 RMB</span>
      </iFormItem>
    </iFormGroup>
    <tableList
      lang
      class="table"
      :selection="false"
      :tableTitle="tableTitle"
      :tableData="tableListData">
      <template #overseasFactoryPrice="scope">
        <iInput class="input" v-model="scope.row.overseasFactoryPrice" @input="handleInputByNumber($event, 'overseasFactoryPrice', scope.row, 2, updateOverseasFactoryPrice)"></iInput>
      </template>
      <template #overseasBnkPrice="scope">
        <iInput class="input" v-model="scope.row.overseasBnkPrice" @input="handleInputByNumber($event, 'overseasBnkPrice', scope.row, 2, updateOverseasBnkPrice)"></iInput>
      </template>
      <template #tariff="scope">
        <iInput class="input" v-model="scope.row.tariff" @input="handleInputByNumber($event, 'tariff', scope.row, 2, updateTariff)"></iInput>
      </template>
      <template #domesticFreight="scope">
        <iInput class="input" v-model="scope.row.domesticFreight" @input="handleInputByNumber($event, 'domesticFreight', scope.row, 2)"></iInput>
      </template>
      <template #manageSummary="scope">
        <iInput class="input" v-model="scope.row.manageSummary" @input="handleInputByNumber($event, 'manageSummary', scope.row, 2)"></iInput>
      </template>
      <template #profitSummary="scope">
        <iInput class="input" v-model="scope.row.profitSummary" @input="handleInputByNumber($event, 'profitSummary', scope.row, 2)"></iInput>
      </template>
    </tableList>
    <percentage lang :data="percentageData" />
  </iCard>
</template>

<script>
/* eslint-disable no-undef */

import { iCard, iFormGroup, iFormItem, iSelect, iDatePicker, iInput, iMessage } from "rise"
import tableList from "rise/web/quotationdetail/components/tableList"
import percentage from "./components/percentage"
import { tableTitle } from "./components/data"
import { getCurrency, getExchangeRate, getSkdCostSummary, saveSkdCostSummary } from "@/api/rfqManageMent/quotationdetail"
import { handleInputByNumber } from "../data"

export default {
  components: { iCard, iFormGroup, iFormItem, iSelect, iDatePicker, iInput, tableList, percentage },
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
  data() {
    return {
      loading: false,
      skdStartProductDate: "",
      currency: "",
      currencyOptions: [],
      exchangeRate: "",
      tableTitle,
      tableListData: [{}]
    }
  },
  computed: {
    percentageData() {
      const data = this.tableListData[0]
      return {
        overseasFactoryPrice: data.overseasFactoryPrice,
        overseasPrice: math.add(math.bignumber(data.overseasBnkPrice || 0), math.bignumber(data.tariff || 0)).toFixed(2),
        domesticFreight: data.domesticFreight,
        manageSummary: data.manageSummary,
        otherSummary: data.otherSummary,
        profitSummary: data.profitSummary
      }
    },
  },
  methods: {
    handleInputByNumber,
    getCurrency() {
      getCurrency()
      .then(res => {
        if (res.code == 200) {
          this.currencyOptions =
            Array.isArray(res.data) ?
            res.data.map(item => ({
              key: item.code,
              label: item.name,
              value: item.code
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
          this.computeSalesPrice("", "", this.tableListData[0])
          this.skdStartProductDate = res.data.skdStartProductDate
          this.currency = res.data.currency
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
      .finally(() => this.loading = false)
    },
    init() {
      this.getCurrency()
      this.getSkdCostSummary()      
    },
    handleChangeByCurrency() {
      this.exchangeRate = "0.00"
      
      getExchangeRate({
        currency: this.currency
      })
      .then(res => {
        if (res.code == 200) {
          this.exchangeRate = res.data || (this.currency === "RMB" ? "1.00" : "0.00")
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
    },
    save(beforeHook, afterHook) {
      if (!this.skdStartProductDate) throw iMessage.warn(this.language("QINGXUANZESKDQIBUSHENGCHANRIQI", "请选择SKD起步生产日期"))

      if (typeof beforeHook === "function") beforeHook()

      return saveSkdCostSummary({
        ...this.tableListData[0],
        skdStartProductDate: this.skdStartProductDate,
        currency: this.currency,
        quotationId: this.partInfo.quotationId
      })
      .finally(() => {
				if (typeof afterHook === "function") afterHook()
			})
    },
    updateOverseasFactoryPrice(value, key, row) {
      this.computeTotalPrice(value, key, row)
    },
    updateOverseasBnkPrice(value, key, row) {
      this.computeTotalPrice(value, key, row)
    },
    updateTariff(value, key, row) {
      this.computeTotalPrice(value, key, row)
    },
    computeTotalPrice(originValue, originKey, row) {
      const totalPrice = math.chain(math.bignumber(row.overseasFactoryPrice || 0))
      .add(math.bignumber(row.overseasBnkPrice || 0))
      .multiply(math.bignumber(this.exchangeRate || 0))
      .add(math.bignumber(row.tariff || 0))
    },
    computeSalesPrice(originValue, originKey, row) {
      // const salesPrice = math.add(
      //   math.bignumber(row.overseasFactoryPrice || 0),
      //   math.bignumber(row.overseasBnkPrice || 0),
      //   math.bignumber(row.tariff || 0)
      // ).toFixed(2)

      // this.$set(row, "salesPrice", salesPrice)
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
        width: 210px!important;

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