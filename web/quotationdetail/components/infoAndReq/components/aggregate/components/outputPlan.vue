<!--
 * @Author: ldh
 * @Date: 2021-04-22 12:18:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-10 18:18:00
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\infoAndReq\components\aggregate\components\outputPlan.vue
-->
<template>
  <div class="outputPlan">
    <div class="header">
      <span class="title">{{ language('LK_CHANLIANGJIHUA', '产量计划') }}</span>
      <span class="tip margin-left10">{{ language('LK_CHANLIANGJIHUATIPS', '供应商保证满足上汽大众需求产量上下浮动15%的产能') }}</span>
    </div>
    <div class="body margin-top30">
      <tableList lang class="table" :selection="false" :tableData="[data]" :tableTitle="tableTitle">
        <template #sopDate="scope">
          <span>{{ scope.row.sopDate | dateFilter('YYYY-MM-DD') }}</span>
        </template>
      </tableList>
    </div>
  </div>
</template>

<script>
import tableList from "../../../../tableList"
import { outputPlanTableTitle as tableTitle } from "../../data"
import filters from "@/utils/filters"

export default {
  components: {
    tableList
  },
  mixins: [ filters ],
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      tableTitle,
      // tableListData: []
    }
  }
};
</script>

<style lang="scss" scoped>
.outputPlan {
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
      color: #86878E;
    }
  }

  .body {
    .table {
      &::before {
        display: none;
      }
    }
  }
}
</style>