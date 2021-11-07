<!--
 * @Author: ldh
 * @Date: 2021-04-22 14:24:22
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-10 18:21:42
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\infoAndReq\components\bnkAttachmentByProject.vue
-->
<template>
  <div class="bnkAttachmentByProject">
    <iCard :title="$t('LK_BNKLINGJIANCAIGOUXIANGMUFUJIAN')">
      <template #header-control>
        <iButton v-loading="downloadLoading" @click="handleDownload">{{ $t('LK_XIAZAI') }}</iButton>
      </template>
      <div>
        <tableList class="table" index :tableLoading="loading" :tableData="tableListData" :tableTitle="tableTitle" @handleSelectionChange="handleSelectionChange">
          <template #fileTruename="scope">
            <span class="link-underline" @click="handlePreview(scope.row)">{{ scope.row.fileTruename }}</span>
          </template>
          <template #fileSize="scope">
            <span>{{ scope.row.fileSize | mByteFilter }}</span>
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
          :total="page.totalCount" />
      </div>
    </iCard>
  </div>
</template>

<script>
import { iCard, iButton, iPagination, iMessage } from "rise"
import tableList from "../../tableList"
import { attachmentTableTitle as tableTitle } from "./data"
import { pageMixins } from "@/utils/pageMixins"
import filters from "@/utils/filters"
import { getBnkFiles, downloadBnkFile } from "@/api/rfqManageMent/quotationdetail"

export default {
  components: {
		iCard,
    iButton,
    iPagination,
    tableList
	},
  mixins: [ pageMixins, filters ],
  props: {
    partInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      downloadLoading: false,
      tableTitle,
      tableListData: [],
      multipleSelection: []
    }
  },
  filters: {
    mByteFilter(value) {
      return value ? math.chain(math.bignumber(value || 0)).divide(1024).divide(1024).done().toFixed(6) + " MB" : value
    } 
  },
  created() {
    this.getBnkFiles()
  },
  methods: {
    getBnkFiles() {
      this.loading = true

      getBnkFiles({
        current: this.page.currPage,
        size: this.page.pageSize,
        partPrjCode: this.partInfo.fsNum,
        recId: this.partInfo.projectPartId,
        rectypeId: "1",
        rfqId: this.partInfo.rfqId,
      })
      .then(res => {
        if (res.code == 200) {
          this.tableListData = Array.isArray(res.data) ? res.data : []
          this.page.totalCount = res.total || 0
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      })
      .finally(() => this.loading = false)
    },
    handleSelectionChange(list) {
      this.multipleSelection = list
    },
    async handleDownload() {
      if (!this.multipleSelection.length) {
        return iMessage.warn(this.language("QINGXUANZEXUYAOXIAZAIDEWENJIAN", "请选择需要下载的文件"))
      }

      this.downloadLoading = true
      await downloadBnkFile(this.multipleSelection.map(item => ({ ids: item.id })))
      this.downloadLoading = false
    },
    handlePreview(row) {
      downloadBnkFile([{ ids: row.id }])
    },
    handleSizeChange(size) {
      this.page.currPage = 1
      this.page.pageSize = size

      this.getBnkFiles()
    },
    handleCurrentChange(page) {
      this.page.currPage = page

      this.getBnkFiles()
    }
  }
}
</script>

<style lang="scss" scoped>
.bnkAttachmentByProject {
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