<!--
 * @Author: ldh
 * @Date: 2021-04-22 14:10:14
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-14 22:57:47
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\infoAndReq\components\aggregate\components\projectSchedule.vue
-->
<template>
  <div class="projectSchedule">
    <div class="header">
      <span class="title">{{ language('LK_XIANGMUJINDU', '项目进度') }}</span>
    </div>
    <div class="body margin-top30">
      <tableList lang class="table" :selection="false" :tableData="[data]" :tableTitle="tableTitle">
        <template #vff="scope">
          <span>{{ scope.row.vff | dateFilter('YYYY-MM-DD') }}</span>
        </template>
        <template #pvs="scope">
          <span>{{ scope.row.pvs | dateFilter('YYYY-MM-DD') }}</span>
        </template>
        <template #os="scope">
          <span>{{ scope.row.os | dateFilter('YYYY-MM-DD') }}</span>
        </template>
        <template #sopDate="scope">
          <span>{{ scope.row.sopDate | dateFilter('YYYY-MM-DD') }}</span>
        </template>
      </tableList>
    </div>
  </div>
</template>

<script>
import tableList from "../../../../tableList"
import { projectScheduleTableTitle as tableTitle } from "../../data"
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
.projectSchedule {
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