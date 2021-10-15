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
        <iSelect v-model="currency">
          <el-option 
            v-for="item in []" 
            :key="item.key" 
            :label="item.label" 
            :value="item.value">
          </el-option>
        </iSelect>
      </iFormItem>
      <iFormItem :label="language('HUILV', '汇率')">
        <span>5.11 EUR=1.12 RMB</span>
      </iFormItem>
    </iFormGroup>
    <tableList
      lang
      class="table"
      :selection="false"
      :tableTitle="tableTitle"
      :tableData="tableListData">
      <template #overseasFactoryPrice="scope">
        <iInput class="a" v-model="scope.row.overseasFactoryPrice"></iInput>
      </template>
      <template #overseasBnkPrice="scope">
        <iInput class="a" v-model="scope.row.overseasBnkPrice"></iInput>
      </template>
      <template #tariff="scope">
        <iInput class="a" v-model="scope.row.tariff"></iInput>
      </template>
      <template #domesticFreight="scope">
        <iInput class="a" v-model="scope.row.domesticFreight"></iInput>
      </template>
      <template #manageSummary="scope">
        <iInput class="a" v-model="scope.row.manageSummary"></iInput>
      </template>
      <template #profitSummary="scope">
        <iInput class="a" v-model="scope.row.profitSummary"></iInput>
      </template>
    </tableList>
    <percentage lang :data="percentageData" />
  </iCard>
</template>

<script>
import { iCard, iFormGroup, iFormItem, iSelect, iDatePicker, iInput, iMessage } from "rise"
import tableList from "rise/web/quotationdetail/components/tableList"
import percentage from "./components/percentage"
import { tableTitle } from "./components/data"
import { getSkdCostSummary, saveSkdCostSummary } from "@/api/rfqManageMent/quotationdetail"

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
      tableTitle,
      tableListData: [{}]
    }
  },
  computed: {
    percentageData() {
      const data = this.tableListData[0]
      return {
        overseasFactoryPrice: data.overseasFactoryPrice,
        overseasBnkPrice: data.overseasBnkPrice,
        domesticFreight: data.domesticFreight,
        manageSummary: data.manageSummary,
        otherSummary: data.otherSummary,
        profitSummary: data.profitSummary
      }
    },
  },
  methods: {
    init() {
      this.loading = true

      getSkdCostSummary({
        quotationId: this.partInfo.quotationId
      })
      .then(res => {
        if (res.code == 200) {
          this.tableListData = [res.data]
          this.skdStartProductDate = res.data.skdStartProductDate
          this.currency = res.data.currency
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
      .finally(() => this.loading = false)
    },
    save() {

    },
    saveSkdCostSummary() {
      return saveSkdCostSummary({
        ...this.tableListData[0],
        skdStartProductDate: this.skdStartProductDate,
        currency: this.currency,
        quotationId: this.partInfo.quotationId
      })
    },
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

    .a {
      max-width: 120px !important;
    }
  }
}
</style>