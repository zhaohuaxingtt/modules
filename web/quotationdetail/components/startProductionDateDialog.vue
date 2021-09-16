<template>
  <iDialog 
    class="startProductionDateDialog" 
    v-bind="$props" 
    v-on="$listeners"
    :visible.sync="status" 
    :title="language('QIBUSHENGCHANSHIJIANXUANZE', '起步生产时间选择')"
    :close-on-click-modal="false">
    <div class="body">
      <iFormGroup class="total" :row="1" inline>
        <iFormItem class="item">
          <iDatePicker v-model="date" type="date" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :placeholder="language('QINGXUANZEQIBUSHENGCHANSHIJIAN', '请选择起步生产时间')"/>
        </iFormItem>
      </iFormGroup>
    </div>
    <div slot="footer" class="footer">
      <iButton :loading="confirmLoading" @click="handleConfirm">{{ language("QUEREN", "确认") }}</iButton>
      <iButton @click="status = false">{{ language("QUXIAO", "取消") }}</iButton>
    </div>
  </iDialog>
</template>

<script>
import { iDialog, iFormGroup, iFormItem, iButton, iMessage, iDatePicker } from 'rise'

export default {
  components: { iDialog, iFormGroup, iFormItem, iButton, iDatePicker },
  props: {
    ...iDialog.props,
    visible: {
      type: Boolean,
      default: false
    },
    userDeptType: {
      type: String,
    }
  },
  watch: {
    status(nv) {
      if (nv) {
        // eslint-disable-next-line
        this.date = moment().startOf("day").format("YYYY-MM-DD HH:mm:ss")
      } else {
        this.date = ""
      }
    },
  },
  computed: {
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
      loading: false,
      confirmLoading: false,
      date: ""
    }
  },
  methods: {
    // 确认
    handleConfirm() {
      if (!this.date) return iMessage.warn(this.language("QINGXUANZEQIBUSHENGCHANSHIJIAN", "请选择起步生产时间"))

      this.$emit("confirm", this.date)
      this.status = false
    },
    // 取消
    handleCancel() {
      this.$emit("cancel")
      this.status = false
    }
  }
}
</script>

<style lang="scss" scoped>
.startProductionDateDialog {
  @mixin pdtb($top: 0, $bottom: 0) {
    padding-top: $top;
    padding-bottom: $bottom;
  }

  .el-form-item {
    margin-bottom: 0;

    ::v-deep .el-form-item__label {
      width: auto;
      min-width: 100px;
    }
  }

  ::v-deep .el-dialog {
    width: 500px!important;
    position: absolute;
    margin: 0!important;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow-x: hidden;

    .el-dialog__header {
      @include pdtb(30px, 30px);
    }

    .el-dialog__body {
      @include pdtb(6px, 0);
    }

    .pagination {
      margin-top: 0;
    }

    .el-dialog__footer {
       @include pdtb(28px, 28px);
    }
  }
}
</style>