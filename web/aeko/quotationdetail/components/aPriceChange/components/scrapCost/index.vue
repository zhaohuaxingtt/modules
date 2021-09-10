<template>
  <div class="scrapCost">
    <i class="topCutLine" v-if="topCutLine"></i>
    <div class="main">
      <div class="header">
        <span class="title">2.3 {{ language("BAOFEICHENGBEN", "报废成本") }}</span>
      </div>
      <div class="body margin-top20">
        <tableList
          lang
          class="table"
          :selection="false"
          :tableTitle="tableTitle"
          :tableData="tableListData">
          <template #typeNameByLang="scope">
            <span>{{ typeof scope.row.typeNameByLang === "function" ? scope.row.typeNameByLang() : scope.row.typeName }}</span>
          </template>
          <template #originRatio="scope">
            <span v-if="scope.row.originScrapId || disabled">{{ scope.row.originRatio }}</span>
            <iInput class="input-center" v-else v-model="scope.row.originRatio" @input="handleInputByNumber($event, 'originRatio', scope.row, 2, computeChangeAmount)"></iInput>
            <!-- <performanceInput v-model="scope.row.originRatio" /> -->
          </template>
          <template #ratio="scope">
            <span v-if="disabled" :class="{ changeClass: scope.row.ratio !== scope.row.originRatio }">{{ scope.row.ratio }}</span>
            <iInput class="input-center" v-else v-model="scope.row.ratio" :class="{ changeClass: scope.row.ratio !== scope.row.originRatio }" @input="handleInputByNumber($event, 'ratio', scope.row, 2, computeChangeAmount)"></iInput>
          </template>
        </tableList>
      </div>
    </div>
  </div>  
</template>

<script>
/* eslint-disable no-undef */

import { iButton, iInput } from "rise"
import tableList from "rise/web/quotationdetail/components/tableList"
import { scrapCostTableTitle as tableTitle } from "../data"
import { numberProcessor } from "@/utils"
import sInput from "rise/web/aeko/quotationdetail/components/sInput"

export default {
  components: { iButton, iInput, tableList, sInput },
  model: {
    prop: "tableListData",
    event: "change"
  },
  props: {
    topCutLine: {
      type: Boolean,
      default: false
    },
    tableListData: {
      type: Array,
      required: true,
      default: () => ([])
    },
    disabled: {
      type: Boolean,
      default: false
    },
    sumData: {
      type: Object,
      required: true,
      default: () => ({})
    },
    discardCostChange: {
      type: String || Number,
      default: 0
    }
  },
  data() {
    return {
      tableTitle
    }
  },
  watch: {
    sumData: {
      handler() {
        this.computeChangeAmount()
      },
      deep: true
    }
  },
  methods: {
    handleInputByNumber(value, key, row, precision, cb) {
      this.$set(row, key, numberProcessor(value, precision))

      if (typeof cb === "function") {
        cb(value, key, row)
      }
    },
    computeChangeAmount() {
      const originSum = math.evaluate(`${ this.sumData.originMaterialCostSum || 0 } + ${ this.sumData.originLaborCostSum || 0 } + ${ this.sumData.originDeviceCostSum || 0 }`)
      const newSum = math.evaluate(`${ this.sumData.newMaterialCostSum || 0 } + ${ this.sumData.newLaborCostSum || 0 } + ${ this.sumData.newDeviceCostSum || 0 }`)
      const discardCostChange = math.evaluate(`(${ newSum } / (1 - (${ this.tableListData[0].ratio || 0 } / 100)) - ${ newSum }) - (${ originSum } / (1 - (${ this.tableListData[0].originRatio || 0} / 100)) - ${ originSum })`).toFixed(2)

      this.$set(this.tableListData[0], "changeAmount", discardCostChange)
      this.$emit("update:discardCostChange", discardCostChange)
    }
  }
}
</script>

<style lang="scss" scoped>
.scrapCost {
  .topCutLine {
    display: block;
    border-top: 2px #BBC4D6 dashed;
    margin-bottom: 30px;
  }

  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    .title {
      font-size: 18px;
      color: #131523;
      font-weight: bold;
    }

    .control {}
  }

  ::v-deep .table {
    .el-table__body-wrapper {
      height: 100px;  
      overflow: auto;
    }
  }

  ::v-deep .changeClass {
    font-style: italic;
    color: #1660F1;

    .staticInputInner,
    input {
      font-style: italic;
      color: #1660F1;
    }
  }
}
</style>