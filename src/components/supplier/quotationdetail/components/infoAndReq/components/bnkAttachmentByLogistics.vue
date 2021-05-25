<!--
 * @Author: ldh
 * @Date: 2021-04-22 14:55:51
 * @LastEditors: ldh
 * @LastEditTime: 2021-05-13 20:59:50
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\infoAndReq\components\bnkAttachmentByLogistics.vue
-->
<template>
  <div class="bnkAttachmentByLogistics">
    <iCard :title="$t('LK_WULIUXIANGGUANBNKFUJIAN')">
      <template #header-control>
        <iButton @click="download" disabled>{{ $t('LK_XIAZAI') }}</iButton>
      </template>
      <div>
        <tableList class="table" index :tableData="data.slice(( page.currPage -1 ) * page.pageSize, page.currPage * page.pageSize)" :tableTitle="tableTitle">
          <template #fileTruename="scope">
            <span class="link-underline-disabled" @click="preview(scope.row)">{{ scope.row.fileTruename }}</span>
          </template>
          <template #createDate="scope">
            <span>{{ scope.row.createDate | dateFilter('YYYY-MM-DD') }}</span>
          </template>
        </tableList>
        <iPagination
          class="pagination margin-top30"
          v-update
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          :current-page="page.currPage"
          :page-sizes="page.pageSizes"
          :page-size="page.pageSize"
          :layout="page.layout"
          :total="data.length" />
      </div>
    </iCard>
  </div>
</template>

<script>
import { iCard, iButton, iPagination } from "rise"
import tableList from "@/views/rfqManageMent/quotationdetail/components/tableList"
import { attachmentTableTitle as tableTitle } from "./data"
import { pageMixins } from "@/utils/pageMixins"
import filters from "@/utils/filters"

export default {
  components: {
		iCard,
    iButton,
    iPagination,
    tableList
	},
  mixins: [ pageMixins, filters ],
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
  },
  methods: {
    getTableList() {},
    download() {},
    preview() {},
    handleSizeChange(size) {
      this.page.currPage = 1
      this.page.pageSize = size
    },
    handleCurrentChange(page) {
      this.page.currPage = page
    }
  }
}
</script>

<style lang="scss" scoped>
.bnkAttachmentByLogistics {
  ::v-deep .cardHeader {
		.title {
			font-size: 18px;
			color: #131523;
			font-weight: bold;
		}
	}

  .table {
    &::before {
      display: none;
    }
  }
}
</style>