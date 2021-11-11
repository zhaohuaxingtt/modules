<template>
  <div class="manageCost">
    <i class="topCutLine" v-if="topCutLine"></i>
    <div class="main">
      <div class="header">
        <span class="title">2.4 {{ language("GUANLIFEI", "管理费") }}</span>
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
            <span v-if="scope.row.originManageId || disabled || editDisabled">{{ scope.row.originRatio }}</span>
            <iInput class="input-center" v-else v-model="scope.row.originRatio" @input="handleInputByNumber($event, 'originRatio', scope.row, 2, computeChangeAmount)"></iInput>
          </template>
          <template #ratio="scope">
            <span v-if="disabled || editDisabled" :class="{ changeClass: scope.row.ratio !== scope.row.originRatio }">{{ scope.row.ratio }}</span>
            <iInput class="input-center" v-else v-model="scope.row.ratio" :class="{ changeClass: scope.row.ratio !== scope.row.originRatio }" @input="handleInputByNumber($event, 'ratio', scope.row, 2, computeChangeAmount)"></iInput>
          </template>
          <template #changeAmount="scope">{{ floatFixNum(scope.row.changeAmount) | thousandsFilter }}</template>
        </tableList>
      </div>
    </div>
  </div>  
</template>

<script>
/* eslint-disable no-undef */

import { iButton, iInput } from "rise"
import tableList from "rise/web/quotationdetail/components/tableList"
import { manageCostTableTitle as tableTitle } from "../data"
import { floatFixNum } from "../../../data"
import { numberProcessor } from "@/utils"
import { handleInputByNumber } from "rise/web/quotationdetail/components/data"
import filters from "@/utils/filters"

export default {
  components: { iButton, iInput, tableList },
  mixins: [ filters ],
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
    manageFeeChange: {
      type: String,
      default: 0
    },
		editDisabled:{
			type: Boolean,
			default: false
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
    floatFixNum,
    handleInputByNumber,
    computeChangeAmount() {
      const rawMaterialManageChangeAmount = math.subtract(
        math.multiply(
          math.bignumber(this.sumData.newMaterialCostSumByNotSvwAssignPriceParts || 0),
          math.divide(math.bignumber(this.tableListData[0].ratio || 0), 100)
        ),
        math.multiply(
          math.bignumber(this.sumData.originMaterialCostSumByNotSvwAssignPriceParts || 0),
          math.divide(math.bignumber(this.tableListData[0].originRatio || 0), 100)
        )
      ).toFixed(2)

      const makeManageChangeAmount = math.subtract(
        math.multiply(
          math.divide(math.bignumber(this.tableListData[1].ratio || 0), 100),
          math.add(
            math.bignumber(this.sumData.newLaborCostSum || 0),
            math.bignumber(this.sumData.newDeviceCostSum || 0)
          )
        ),
        math.multiply(
          math.divide(math.bignumber(this.tableListData[1].originRatio || 0), 100),
          math.add(
            math.bignumber(this.sumData.originLaborCostSum || 0),
            math.bignumber(this.sumData.originDeviceCostSum || 0)
          )
        )
      ).toFixed(2)

      const manageFeeChange = math.add(math.bignumber(rawMaterialManageChangeAmount), math.bignumber(makeManageChangeAmount)).toFixed(2)

      this.$set(this.tableListData[0], "changeAmount", rawMaterialManageChangeAmount)
      this.$set(this.tableListData[1], "changeAmount", makeManageChangeAmount)
      this.$emit("update:manageFeeChange", manageFeeChange)
    }
  }
}
</script>

<style lang="scss" scoped>
.manageCost {
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
      // height: 100px;  
      // overflow: auto;
    }
  }

  ::v-deep .changeClass {
    font-style: italic;
    color: #1660F1;

    input {
      font-style: italic;
      color: #1660F1;
    }
  }
}
</style>