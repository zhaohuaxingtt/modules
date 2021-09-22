<template>
  <div class="custom-select">
    <el-popover
      placement="bottom"
      trigger="click"
      @show="handleShow"
      @hide="handleHide"
      :popper-class="`${popoverClass} custom-select-popover`"
      :disabled="disabled"
      ref="selectPopover"
    >
      <div class="search-wrapper" v-if="typeof searchMethod === 'function'">
        <el-input v-model="query" placeholder="开始搜索吧..." @input="handleInputChange" ref="searchInput"></el-input>
      </div>
      <div class="btns-wrapper" v-if="multiple">
        <el-button-group>
          <el-button @click="handleSelect(true)" :disabled="multiple && multipleLimit">全选</el-button>
          <el-button @click="handleSelect(false)">
            全不选
          </el-button>
        </el-button-group>
      </div>
      <div class="list-container">
        <div class="selected-container" v-if="selectedData.length">
          <div class="title">已选择</div>
          <div v-for="(item, index) in selectedData" :key="index" @click="handleSelectItem(item)" class="selected">
            <div>
              {{ item[label] }}
            </div>
            <i class="el-icon-check"></i>
          </div>
          <el-divider></el-divider>
        </div>
        <div class="origin-container">
          <div class="loading" v-if="loading">
            <i class="el-icon-loading"></i>
          </div>
          <div v-else>
            <div
              v-for="(item, index) in originData"
              :key="index"
              @click="handleSelectItem(item)"
              :class="{
                disabled:
                  multiple && multipleLimit
                    ? selectedData.length === multipleLimit || selectedData.length > multipleLimit
                    : false
              }"
            >
              {{ item[label] }}
            </div>
          </div>
        </div>
      </div>
      <el-input
        :class="`${inputClass} custom-select-input`"
        v-model="inputData"
        slot="reference"
        :disabled="disabled"
        :readonly="true"
        :placeholder="placeholder"
        :title="inputData"
        ref="selectInput"
      ></el-input>
    </el-popover>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  props: {
    values: {
      type: [String, Array],
      default: function() {
        return null
      },
      required: true
    },
    multipleLimit: {
      type: Number,
      default: function() {
        return 0
      }
    },
    inputClass: {
      type: String,
      default: function() {
        return 'custom-select-input'
      }
    },
    popoverClass: {
      type: String,
      default: function() {
        return 'custom-select-popover'
      }
    },
    sortVal: {
      type: String,
      default: function() {
        return 'nameEn'
      }
    },
    data: {
      type: Array,
      default: function() {
        return []
      },
      required: true
    },
    label: {
      type: String,
      default: function() {
        return 'label'
      }
    },
    value: {
      type: String,
      default: function() {
        return 'value'
      }
    },
    multiple: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    disabled: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    searchMethod: Function,
    placeholder: {
      type: String,
      default: () => {
        return '请选择'
      }
    }
  },
  model: {
    prop: 'values',
    event: 'change'
  },
  data() {
    return {
      visable: false,
      inputData: '',
      originData: [],
      selectedData: [],
      query: '',
      timer: null,
      loading: true
    }
  },
  watch: {
    data: {
      handler(newValue) {
        this.loading = !(newValue instanceof Array)
        let originData = _.cloneDeep(newValue)
        this.originData = originData
        if (this.selectedData.length) {
          const codes = this.selectedData.map(sd => {
            return sd[this.value].toString()
          })
          originData = originData.filter(od => {
            return !codes.includes(od[this.value].toString())
          })
          this.originData = originData
        }
      },
      immediate: true
    },
    values: {
      immediate: true,
      handler(newValue) {
        this.inputData =
          newValue instanceof Array
            ? newValue
                .map(d => {
                  return d[this.label]
                })
                .join(',')
            : newValue && newValue[this.label]
      }
    }
  },
  mounted() {
    const values = _.cloneDeep(this.values)
    this.selectedData = values instanceof Array ? values : values[this.value] ? [values] : []
    this.selectedData.forEach(item => {
      this.$set(item, 'selected', true)
    })
  },
  methods: {
    handleInputChange(val) {
      this.query = val
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        typeof this.searchMethod === 'function' ? this.searchMethod(val) : ''
      }, 200)
    },
    handleHide() {
      this.query = ''
      typeof this.searchMethod === 'function' ? this.searchMethod('') : ''
      this.loading = false
    },
    handleShow() {
      let data = _.cloneDeep(this.data)
      const values = _.cloneDeep(this.values)
      this.selectedData = values instanceof Array ? values : values && values[this.value] ? [values] : []
      this.selectedData.forEach(item => {
        this.$set(item, 'selected', true)
      })
      if (this.selectedData.length) {
        const codes = this.selectedData.map(sd => {
          return sd[this.value].toString()
        })
        data = data.filter(od => {
          return !codes.includes(od[this.value].toString())
        })
        this.originData = _.cloneDeep(data)
      }
      this.$nextTick(() => {
        this.$refs['searchInput']?.focus()
      })
    },
    handleSelect(flag) {
      const array = _.cloneDeep(this.data)
      this.originData = flag ? [] : _.cloneDeep(this.data)
      array.forEach(item => {
        item.selected = flag
      })
      this.selectedData = flag ? array : []
      this.inputData = this.selectedData
        .map(d => {
          return d[this.label]
        })
        .join(',')
      this.$emit('change', this.selectedData)
    },
    handleSelectItem(item) {
      if (
        this.multiple &&
        this.multipleLimit &&
        (this.selectedData.length === this.multipleLimit || this.selectedData.length > this.multipleLimit) &&
        !item.selected
      ) {
        return
      }
      const dataCodes = this.data.map(i => {
        return i[this.value]
      })
      let selectedData = _.cloneDeep(this.selectedData)
      let originData = _.cloneDeep(this.originData)
      item.selected = !item.selected
      if (item.selected) {
        !this.multiple ? (selectedData = []) : ''
        originData = this.multiple ? originData : _.cloneDeep(this.data)
        selectedData.push(item)
        originData = originData.filter(d => {
          return d[this.value] !== item[this.value]
        })
      } else {
        selectedData = selectedData.filter(d => {
          return d[this.value] !== item[this.value]
        })

        const index = dataCodes.indexOf(item[this.value])
        index !== -1 ? originData.splice(index, 0, item) : ''
        originData.sort((a, b) => {
          const a_swname = a[this.sortVal]?.toLowerCase()
          const b_swname = b[this.sortVal]?.toLowerCase()
          if (a_swname < b_swname) return -1
          if (a_swname > b_swname) return 1
          return 0
        })
      }
      this.selectedData = _.cloneDeep(selectedData)
      this.originData = originData
      this.inputData =
        this.selectedData.length === 1
          ? this.selectedData[0][this.label]
          : this.selectedData
              .map(d => {
                return d[this.label]
              })
              .join(',')
      this.$emit('change', this.multiple ? this.selectedData : this.selectedData[0])
      !this.multiple ? this.$refs['selectPopover'].doClose() : ''
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-select-popover {
  width: 300px;
  .list-container {
    height: 600px;
    overflow-x: hidden;
    overflow-y: auto;
    font-size: 14px;
    > .selected-container,
    > .origin-container {
      > .loading {
        text-align: center;
        padding: 30px 0;
        font-size: 20px;
      }
      > div {
        line-height: 30px;
        cursor: pointer;
      }
    }
    > .selected-container {
      > .title {
        font-weight: bold;
        font-size: 16px;
        margin: 5px 0;
      }
      > .selected {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-right: 15px;
      }
    }
  }
  .btns-wrapper {
    margin-top: 15px;
    .el-button-group {
      width: 100%;
      .el-button {
        width: 50%;
      }
    }
  }
  .disabled {
    color: rgba(0, 0, 0, 0.5);
    cursor: not-allowed;
  }
}
</style>
<style lang="scss">
.custom-select-input {
  width: 100%;
  > input {
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
