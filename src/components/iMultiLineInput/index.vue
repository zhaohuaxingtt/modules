<template>
  <div class="iMultiLineInput">
    <iInput type="text" v-model.trim="value" @input="handleInput" :placeholder="placeholder">
      <template slot="append">
        <el-button slot="append" @click.native="showMultiLineInputDialog">
          <icon symbol name="iconbianji" />
        </el-button>
      </template>
    </iInput>
    <iDialog class="multiLineInputDialog" :visible.sync="visible" :title="title">
      <div class="body">
        <iInput type="textarea" v-model="text" :rows="9" :placeholder="language('QINGSHURU', '请输入')" />
      </div>
      <template #footer class="footer">
        <iButton @click="handleConfirm">{{ language("QUEREN", "确认") }}</iButton>
      </template>
    </iDialog>
  </div>
</template>

<script>
import iInput from '../iInput'
import iDialog from '../iDialog'
import iButton from '../iButton'
import icon from '../icon'

export default {
  name: 'iMultiLineInput',
  components: { iInput, iDialog, iButton, icon },
  model: {
    event: 'input'
  },
  props: {
    value: String,
    title: String,
    placeholder: String
  },
  data() {
    return {
      visible: false,
      text: ''
    }
  },
  watch: {
    visible(status) {
      if(!status) this.text = ''
    }
  },
  methods: {
    handleInput(value) {
      const str = value || ''
      this.$emit('input', str.replace(/\n|\r|\s/g, ',').split(',').filter(item => item || item === 0).map(item => item.trim()).join(','))
    },
    showMultiLineInputDialog() {
      this.text = this.value ? (this.value + "").replace(/,/g, '\n') : ''

      this.visible = true
    },
    handleConfirm() {
      if (!this.text) this.text = ''
      this.$emit('input', this.text.replace(/\n|\r/g, ',').split(',').filter(item => item || item === 0).map(item => item.trim()).join(','))

      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.iMultiLineInput {
  ::v-deep .el-input-group__append {
    box-shadow: 0 0 0.1875rem rgb(0 38 98 / 15%);
    border: 0;
    width: 36px;
    padding-left: 0;
    padding-right: 0;
    box-sizing: border-box;
    text-align: center;

    .el-button {
      width: 36px;
      padding-left: 10px;
      padding-right: 10px;
      border: 0;
      box-sizing: border-box;
      text-align: center;
    }
  }

  .multiLineInputDialog {
    ::v-deep .el-dialog {
      width: 450px;
    }

    ::v-deep .el-dialog__footer {
      padding-top: 25px;
    }
  }
}
</style>