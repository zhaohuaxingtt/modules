<!--
 * @Author: ldh
 * @Date: 2021-04-22 14:02:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-10 18:17:25
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\infoAndReq\components\aggregate\components\svwContact.vue
-->
<template>
  <div class="svwContact">
    <div class="header">
      <span class="title">{{ language('LK_SHANGQIDAZHONGLIANXIREN', '上汽大众联系人') }}</span>
    </div>
    <div class="body margin-top30">
      <tableList lang class="table" :selection="false" :tableData="data" :tableTitle="tableTitle" />
    </div>
  </div>
</template>

<script>
import tableList from "../../../../tableList"
import { svwContactTableTitle as tableTitle } from "../../data"

export default {
  components: {
    tableList
  },
  props: {
    data: {
      type: Array,
      default: () => ([])
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
.svwContact {
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