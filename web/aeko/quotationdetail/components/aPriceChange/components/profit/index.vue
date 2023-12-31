<template>
  <div class="profit">
    <i class="topCutLine" v-if="topCutLine"></i>
    <div class="main">
      <div class="header">
        <span class="title">2.6 {{ language("LIRUN", "利润") }}</span>
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
            <span v-if="scope.row.originProfitId || disabled">{{ scope.row.originRatio }}</span>
            <iInput class="input-center" v-else v-model="scope.row.originRatio" @input="handleInputByNumber($event, 'originRatio', scope.row, 2, computeChangeAmount)"></iInput>
          </template>
          <template #ratio="scope">
            <span v-if="disabled" :class="{ changeClass: scope.row.ratio !== scope.row.originRatio }">{{ scope.row.ratio }}</span>
            <iInput class="input-center" v-else v-model="scope.row.ratio" :class="{ changeClass: scope.row.ratio !== scope.row.originRatio }" @input="handleInputByNumber($event, 'ratio', scope.row, 2, computeChangeAmount)"></iInput>
          </template>
          <template #changeAmount="scope">{{ floatFixNum(scope.row.changeAmount) }}</template>
        </tableList>
      </div>
    </div>
  </div>  
</template>

<script>
/* eslint-disable no-undef */

import { iButton, iInput } from "rise"
import tableList from "rise/web/quotationdetail/components/tableList"
import { profitTableTitle as tableTitle } from "../data"
import { floatFixNum } from "../../../data"
import { handleInputByNumber } from "rise/web/quotationdetail/components/data"

export default {
  components: { iButton, iInput, tableList },
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
    profitChange: {
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
    floatFixNum,
    handleInputByNumber,
    computeChangeAmount() {
      let {ratio, originRatio} = this.tableListData[0]
      let profitChange = null
      if((ratio||ratio===0)&&(originRatio||originRatio===0)){
        profitChange = math.subtract(
          math.multiply(
            math.divide(math.bignumber(ratio), 100),
            math.add(
              math.bignumber(this.sumData.newMaterialCostSumByNotSvwAssignPriceParts || 0),
              math.bignumber(this.sumData.newLaborCostSum || 0),
              math.bignumber(this.sumData.newDeviceCostSum || 0)
            )
          ),
          math.multiply(
            math.divide(math.bignumber(originRatio), 100),
            math.add(
              math.bignumber(this.sumData.originMaterialCostSumByNotSvwAssignPriceParts || 0),
              math.bignumber(this.sumData.originLaborCostSum || 0),
              math.bignumber(this.sumData.originDeviceCostSum || 0)
            )
          )
        ).toFixed(2)
      }

      this.$set(this.tableListData[0], "changeAmount", profitChange)
      this.$emit("update:profitChange", profitChange)
    }
  }
}
</script>

<style lang="scss" scoped>
.profit {
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
  }

  ::v-deep .table {
    .el-table__body-wrapper {
      height: 100px;  
      overflow: auto;
    }
  }

  ::v-deep .changeClass {
    font-style: italic;
    color: #67C23A;

    input {
      font-style: italic;
      color: #67C23A;
    }
  }
}
</style>