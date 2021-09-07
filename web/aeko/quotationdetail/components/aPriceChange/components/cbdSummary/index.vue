<template>
  <div class="cbdSummary">
    <div class="header">
      <div class="tip">{{ language("DANWEI", "单位") }}：RMB/Pc.</div>
    </div>
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

import tableList from "../../../../../quotationdetail/components/tableList"
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
        this.$set(list[0], "apriceChange", math.evaluate(`${ list[0].materialChange } + ${ list[0].makeCostChange } + ${ list[0].discardCostChange } + ${ list[0].manageFeeChange } + ${ list[0].otherFee } + ${ list[0].profitChange }`).toFixed(2))
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