<!--
 * @Author: YoHo
 * @Date: 2021-10-25 16:28:45
 * @LastEditTime: 2021-10-26 17:08:26
 * @LastEditors: YoHo
 * @Description: 
-->
<template>
  <div class="cbdSummary">
    <div class="content margin-top20">
      <tableList
        lang
        class="table"
        :selection="false"
        :tableTitle="tableTitle"
        :tableData="tableListData"
        >
        <template #materialChange="scope">{{floatFixNum(scope.row.materialChange)}}</template>
        <template #makeCostChange="scope">{{floatFixNum(scope.row.makeCostChange)}}</template>
        <template #discardCostChange="scope">{{floatFixNum(scope.row.discardCostChange)}}</template>
        <template #manageFeeChange="scope">{{floatFixNum(scope.row.manageFeeChange)}}</template>
        <template #otherFee="scope">{{floatFixNum(scope.row.otherFee)}}</template>
        <template #profitChange="scope">{{floatFixNum(scope.row.profitChange)}}</template>
        <template #apriceChange="scope">{{floatFixNum(scope.row.apriceChange)}}</template>
        </tableList>
    </div>
  </div>  
</template>

<script>
/* eslint-disable no-undef */

import tableList from "rise/web/quotationdetail/components/tableList"
import { cbdSummaryTableTitle as tableTitle } from "../data"
import { floatFixNum } from "../../../data"

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
    },
    isFetch: {
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

        if (this.isFetch) {
          this.$emit("updateIsFetch", false)
          return
        }
        
        this.$emit("updateApriceChange", apriceChange)
      }, 
      deep: true
    }
  },
  methods:{
    floatFixNum
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