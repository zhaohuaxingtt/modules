<template>
  <i-dialog
    title="表头设置"
    :visible.sync="isShow"
    width="30%"
    class="i-table-header-modal"
    @opened="handleOpened"
    :before-close="handleBeforeClose"
  >
    <div class="header-wrapper" ref="header-wrapper">
      <div
        class="flex-align-center header-col"
        v-for="(item, index) in data"
        :key="index"
        :id="item[value]"
        :data-id="item[value]"
      >
        <div><icon symbol class="icon" name="iconshunxubiaoqian" /></div>
        <el-switch v-model="item[visiableKey]" active-color="#CDD4E2" inactive-color="#1660F1"></el-switch>
        <div>{{ item[label] }}</div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <i-button @click="handleSave">保存</i-button>
      <i-button @click="handleReset">重置</i-button>
      <!-- <i-button @click="handleCancel">退出</i-button> -->
    </span>
  </i-dialog>
</template>

<script>
import Sortable from 'sortablejs'
import iButton from '../iButton/index.vue'
import iDialog from '../iDialog/index.vue'
import icon from '../icon/index.vue'
export default {
  components: {
    iButton,
    iDialog,
    icon
  },
  props: {
    visiableKey: {
      type: String,
      default: function() {
        return 'isHidden'
      }
    },
    label: {
      type: String,
      default: function() {
        return 'name'
      }
    },
    value: {
      type: String,
      default: function() {
        return 'id'
      }
    },
    data: {
      type: Array,
      default: function() {
        return []
      }
    },
    show: [Boolean]
  },
  data() {
    return {
      newData: [],
      originData: [],
      sortObj: null,
      originSort: []
    }
  },
  computed: {
    isShow: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('update:show', val)
      }
    }
  },
  methods: {
    handleBeforeClose(done) {
      this.handleReset()
      done()
    },
    handleSave() {
      const newData = _.cloneDeep(this.newData)
      const hiddenMenus = this.data.filter(item => {
        return item[this.visiableKey]
      })
      const hiddenMenusIds = hiddenMenus.map(menu => {
        return menu[this.value]
      })
      newData.forEach(nd => {
        if (hiddenMenusIds.includes(nd[this.value])) {
          nd[this.visiableKey] = true
        }
      })
      this.isShow = false
      this.$emit('callback', newData)
    },
    handleCancel() {
      this.handleReset()
      this.isShow = false
    },
    handleReset() {
      this.sortObj.sort(this.originSort, true)
      this.data = _.cloneDeep(this.originData)
    },
    handleOpened() {
      this.originData = _.cloneDeep(this.data)
      const el = document.getElementsByClassName('header-wrapper')[0]
      this.sortObj = new Sortable(el, {
        animation: 150,
        onEnd: evt => {
          const children = evt.to.children
          const data = _.cloneDeep(this.data)
          const arr = Array.from(children).map(c => {
            return c.id
          })
          const newData = []
          arr.forEach(a => {
            const obj = data.find(item => {
              return parseInt(item[this.value]) === parseInt(a)
            })
            newData.push(obj)
          })
          this.newData = _.cloneDeep(newData)
        }
      })
      this.originSort = this.sortObj.toArray()
    }
  }
}
</script>

<style lang="scss" scoped>
.i-table-header-modal {
  .header-wrapper {
    .header-col {
      background: #f9fafe;
      padding: 10px 10px;
      margin-bottom: 20px;
      cursor: move;
      > div {
        &:first-child {
          margin-right: 20px;
        }
        &:last-child {
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.i-table-header-modal {
  .el-dialog__body {
    max-height: 465px;
    overflow-y: scroll;
    overflow-x: auto;
  }
}
</style>
