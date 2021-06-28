<template>
  <div class="material-dialog">
    <iDialog title="日志" :visible.sync="isShow" width="70%">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            {{ props.row.content }}
          </template>
        </el-table-column>
        <el-table-column label="模块" prop="module"></el-table-column>
        <el-table-column label="请求时间" prop="rqTime"></el-table-column>
        <el-table-column label="响应时间" prop="respTime"></el-table-column>
        <el-table-column label="操作人" prop="createBy"></el-table-column>
        <el-table-column label="操作类型" prop="type"></el-table-column>
        <el-table-column label="结果" prop="result"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取消</el-button>
        <el-button type="primary" @click="isShow = false">确定</el-button>
      </span>
    </iDialog>
  </div>
</template>

<script>
import iDialog from '../iDialog'
export default {
  components: { iDialog },
  props: {
    bizId: {
      type: Number,
      Default: 0
    },
    show: [Boolean]
  },
  data() {
    return {
      tableData: []
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
  mounted() {
    console.log('bizId', this.bizId)
    const http = new XMLHttpRequest()
    const url = `/bizlog/operationLog/findOperationLogsByBizId/${this.bizId}`
    http.open('GET', url, true)
    http.setRequestHeader('content-type', 'application/json')
    http.onreadystatechange = () => {
      if (http.readyState === 4) {
        this.tableData = JSON.parse(http.responseText)
      }
    }
    http.send()
  }
}
</script>
