<template>
  <div class="bottom-item">
    <div class="label">
      {{ label }}
    </div>
    <div class="value">
      <span class="text" v-show="!editable || !isEdit">{{ text }}</span>
      <span
        v-show="editable && !isEdit"
        class="btn-edit"
        @click="handleSetEdit(true)"
      >
        {{ language('修改', '修改') }}
      </span>
      <!-- 
      <input
        type="text"
        v-show="editable && isEdit"
        v-model="dataValue"
        class="input-value"
      /> -->
      <div v-show="editable && isEdit" class="input-value">
        <iInput v-model="dataValue" :placeholder="placeholder" />
      </div>
      <span v-show="editable && isEdit" class="btn-edit" @click="handleSave">
        {{ language('保存', '保存') }}
      </span>
      <span
        v-show="editable && isEdit"
        class="btn-edit"
        @click="handleSetEdit(false)"
      >
        {{ language('取消', '取消') }}
      </span>
    </div>
  </div>
</template>

<script>
import { iInput } from 'rise'

export default {
  name: 'bottomItem',
  components: { iInput },
  props: {
    label: { type: String },
    text: { type: String },
    textKey: { type: String },
    editable: { type: Boolean, default: false },
    placeholder: { type: String, default: '请输入' }
  },
  inject: ['updateUser'],
  data() {
    return {
      isEdit: false,
      dataValue: ''
    }
  },
  created() {
    this.dataValue = this.text
  },
  watch: {
    text(val) {
      this.dataValue = val
    }
  },
  methods: {
    handleSetEdit(val) {
      this.isEdit = val
    },
    handleSave() {
      const data = {}
      data[this.textKey] = this.dataValue
      this.updateUser(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.bottom-item {
  display: flex;
  align-items: center;
  height: 40px;
  .label {
    width: 110px;
    font-size: 14px;
    color: #888888;
    margin-right: 32px;
  }
  .value {
    display: flex;
    align-items: center;
    font-weight: 400;
    flex-grow: 1;
    .text {
      color: #000000;
      font-size: 14px;
      min-width: 130px;
      display: block;
    }
  }
}
.btn-edit {
  color: #67C23A;
  font-size: 12px;
  margin-left: 30px;
  cursor: pointer;
}
.input-value {
  width: 170px;
  height: 31px;
}
</style>
