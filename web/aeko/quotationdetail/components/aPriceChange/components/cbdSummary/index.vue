<template>
  <div class="cbdSummary">
    <div class="content margin-top20">
      <tableList
        lang
        class="table"
        :selection="false"
        :tableTitle="tableTitle"
        :tableData="tableListData" />
    </div>
  </div>  
</template>

<script>
/* eslint-disable no-undef */

import tableList from "rise/web/quotationdetail/components/tableList"
import { cbdSummaryTableTitle as tableTitle } from "../data"

export default {
  components: { tableList },
  model: {
    prop: "tableListData"
  },
  props: {
    tableListData: {
      type: Array,
      required: true,
      default: () => ([{ materialChange: "0.00", makeCostChange: "0.00", discardCostChange: "0.00", manageFeeChange: "0.00", otherFee: "0.00", profitChange: "0.00", apriceChange: "0.00" }])
    }
  },
  data() {
    return {
      tableTitle
    }
  },
  watch: {
    tableListData: {
      handler(list) {
        const apriceChange = math.add(
          math.bignumber(list[0].materialChange || 0),
          math.bignumber(list[0].makeCostChange || 0),
          math.bignumber(list[0].discardCostChange || 0),
          math.bignumber(list[0].manageFeeChange || 0),
          math.bignumber(list[0].otherFee || 0),
          math.bignumber(list[0].profitChange || 0)
        ).toFixed(2)
        
        this.$set(list[0], "apriceChange", apriceChange)
        this.$emit("updateApriceChange", apriceChange)
      }, 
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.cbdSummary {
  position: relative;

  .header {
    position: absolute;
    top: -34px;
    right: 0;

    .tip {
      font-size: 12px;
      line-height: 14px;
      font-weight: 400;
      color: #485465;
      font-weight: 400;
    }
  }
}
</style>