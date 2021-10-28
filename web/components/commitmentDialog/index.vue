<template>
  <iDialog 
    class="commitmentDialog"
    v-bind="$props"
    v-on="$listeners"
    :title="title || defaultTitle"
    :visible.sync="status">
    <div class="body">
      <div class="commitment" v-loading="loading">
        <div v-if="content.length" class="content" v-html="content"></div>
        <div v-else class="blank">{{ language("ZANWUNEIRONG", "暂无内容") }}</div>
      </div>
    </div>
    <template v-if="!disabled" #footer class="footer">
      <el-checkbox class="reviewed" v-model="reviewed">{{ language("WOYIYUEDUBINGJIESHOUYISHANGTIAOKUAN", "我已阅读并接受以上条款") }}</el-checkbox>
      <iButton :disabled="!reviewed" :loading="confirmLoading" @click="handleConfirm(1)">{{ language("JIESHOU", "接受") }}</iButton>
      <iButton :loading="confirmLoading" @click="handleConfirm(0)">{{ language("JUJUE", "拒绝") }}</iButton>
    </template>
  </iDialog>
</template>

<script>
import { iDialog, iSelect, iButton, iMessage } from "rise"
import { getNoticeDetail, signNotice } from "@/api/rfqManageMent/quotationdetail"

export default {
  components: { iDialog, iSelect, iButton},
  props: {
    ...iDialog.props,
    type: {
      type: String,
      default: "RFQ"
    },
    title: {
      type: String,
      default: ""
    },
    visible: {
      type: Boolean,
      default: false,
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    closeOnPressEscape: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    status(nv) {
      if (nv) {
        switch(this.type) {
          case "RFQ":
            this.defaultTitle = this.language("XUNJIACHENGNUOSHU", "询价承诺书")
            break
          case "CARBON":
            this.defaultTitle = this.language("KEZAISHENGNENGYUANSHIYONGCHENGNUOSHU", "可再生能源使用承诺书")
            break
          default:
            this.defaultTitle = this.language("CHENGNUOSHU", "承诺书")
        }

        this.getNoticeDetail()
      } else {
        this.defaultTitle = ""
        this.content = ""
        this.disabled = true
        this.reviewed = false
        this.loading = false
        this.confirmLoading = false
      }
    },
  },
  computed: {
    // eslint-disable-next-line no-undef
    ...Vuex.mapState({
      userInfo: state => state.permission.userInfo,
    }),
    status: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit("update:visible", value)
      }
    }
  },
  data() {
    return {
      supplierId: "",
      defaultTitle: "",
      loading: false,
      content: "",
      disabled: true,
      reviewed: false,
      confirmLoading: false
    }
  },
  created() {
    this.supplierId = this.userInfo.supplierId || this.$route.query.supplierId
  },
  methods: {
    getNoticeDetail() {
      this.loading = true
      
      // RFQ 询价承诺书
      // CARBON 可再生能源使用承诺书
      getNoticeDetail({
        supplierId: this.supplierId,
        type: this.type
      })
      .then(res => {
        if (res.code == 200) {
          this.content = res.data.content
          this.disabled = false
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
          this.disabled = true
        }
      })
      .finally(() => this.loading = false)
    },
    // 1 接受 / 0 拒绝
    handleConfirm(status = 0) {
      this.confirmLoading = true

      signNotice({
        status,
        supplierId: this.supplierId,
        type: this.type
      })
      .then(res => {
        if (res.code == 200) {
          const message = this.$i18n.locale === "zh" ? res.desZh : res.desEn

          iMessage.success(message)

          if (status === 1) this.$emit("accept") 
          else this.$emit("reject")
          
          this.status = false
        } else {
          iMessage.error(message)
        }
      })
      .finally(() => {
        this.confirmLoading = false
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.commitmentDialog {
  @mixin pdtb($top: 0, $bottom: 0) {
    padding-top: $top !important;
    padding-bottom: $bottom !important;
  }

  .title {
    height: 25px;
  }

  ::v-deep .el-dialog__header {
    position: relative;
  }

  ::v-deep .el-dialog {
    width: 60vw !important;
    position: absolute;
    margin: 0 !important;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow-x: hidden;

    .body {
      // height: 580px;
    }

    .el-dialog__header {
      @include pdtb(30px, 30px);
    }

    .el-dialog__body {
      @include pdtb(0, 40px);
    }

    .pagination {
      margin-top: 0;
    }

    .el-dialog__footer {
      margin-top: -40px;
      @include pdtb(30px, 30px);
    }
  }

  .commitment {
    height: 65vh;
    border: 1px solid #333;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: content-box;

    .blank {
      text-align: center;
      font-size: 20px;
      color: #ccc;
      line-height: 65vh;
      user-select: none;
    }

    .content {
      padding: 10px 25px;
    }
  }

  .reviewed {
    margin-right: 40px;
  }
}
</style>