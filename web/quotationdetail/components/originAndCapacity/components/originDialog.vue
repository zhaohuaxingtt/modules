<!--
 * @Author: ldh
 * @Date: 2021-04-28 19:12:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-16 19:14:52
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\originAndCapacity\components\originDialog.vue
-->
<template>
  <iDialog
    class="dialog"
    v-bind="$props"
    :visible.sync="visible"
    v-on="$listeners"
  >
    <template #title>
      <p class="title">选择⽣产⼯⼚</p>
      <div class="control" id="control">
        <iButton @click="handleConfirm">{{ $t('LK_QUEREN') }}</iButton>
        <iButton @click="handleAdd">{{ $t('LK_TIANJIA') }}</iButton>
      </div>
    </template>
    <div class="body">
      <tableList
        index
        height="100%"
        v-show="visible"
        class="table"
        :tableData="tableListData"
        :tableTitle="tableTitle"
        :tableLoading="loading"
        @handleSelectionChange="handleSelectionChange"
      />
    </div>
  </iDialog>
</template>

<script>
import { iDialog, iButton, iMessage } from "rise"
import tableList from "../../tableList"
import { originDialogTableTitle as tableTitle } from "./data"
import { getSupplierInfo, getSupplierToken } from "@/api/rfqManageMent/quotationdetail"

export default {
  components: { iDialog, iButton, tableList },
  props: {
    ...iDialog.props,
    visible: {
      type: Boolean,
      default: false,
    },
    quotationId: {
      type: String,
      require: true
    }
  },
  watch: {
    visible(nv) {
      if (nv) this.getSupplierInfo()

      this.$emit("update:visible", nv)
    },
  },
  computed: {
    // eslint-disable-next-line no-undef
    ...Vuex.mapState({
      userInfo: state => state.permission.userInfo,
    }),
  },
  data() {
    return {
      loading: false,
      tableTitle,
      tableListData: [],
      multipleSelection: []
    };
  },
  methods: {
    getSupplierInfo() {
      this.loading = true

      getSupplierInfo({
        quotationId: this.quotationId,
        supplierId: this.userInfo.supplierId || this.$route.query.supplierId
      })
      .then(res => {
        if (res.code == 200) {
          this.tableListData = Array.isArray(res.data) ? res.data : []
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }

        this.loading = false
      })
      .catch(() => this.loading = false)
    },
    handleSelectionChange(list) {
      this.multipleSelection = list
    },
    handleConfirm() {
      if (this.multipleSelection.length !== 1) {
        return iMessage.warn(this.$t("LK_QINGXUANZEYIGEGONGYINGSHANGGONGCHANG"))
      }

      this.$emit("confirm", this.multipleSelection[0])
      this.$emit("update:visible", false)
    },
    handleAdd() {
      getSupplierToken({ supplierId: this.userInfo.supplierId || this.$route.query.supplierId })
      .then(res => {
        if (res.code == 200) {
          window.open(`${ window.origin }/supplier/#/supplier/supplierDetail?supplierToken=${ res.data }&supplierType=4`,'_blank')
        }
      })
      .catch(() => {})
      
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog {
  @mixin pdtb($top: 0, $bottom: 0) {
    padding-top: $top !important;
    padding-bottom: $bottom !important;
  }

  .title {
    font-size: 18px;
    font-weight: bold;
    line-height: 25px;
  }

  ::v-deep .el-dialog__header {
    position: relative;
  }

  .control {
    position: absolute;
    top: 50%;
    right: 94px;
    transform: translate(0, -50%);
  }

  ::v-deep .el-dialog {
    width: 1745px !important;
    position: absolute;
    margin: 0 !important;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow-x: hidden;

    .body {
      height: 580px;
    }

    .el-dialog__header {
      @include pdtb(30px, 30px);
    }

    .el-dialog__body {
      @include pdtb(6px, 28px);
    }

    .pagination {
      margin-top: 0;
    }

    // .el-dialog__footer {
    //   @include pdtb(28px, 28px);
    // }
  }
}
</style>