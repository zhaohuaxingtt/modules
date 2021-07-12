<template>
  <div class="imail-filter">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-select v-model="status" @change="handleStatusChange">
          <el-option v-for="item in statusOptions" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-select v-model="type" @change="handleTypeChange">
          <el-option v-for="item in typeOptions" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    typeOptions: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      status: 0,
      type: '',
      statusOptions: [
        { name: '未读', code: 0 },
        { name: '已读', code: 1 }
      ]
    }
  },
  methods: {
    handleStatusChange() {
      this.$emit('filterCallback', { status: this.status, type: this.type })
    },
    handleTypeChange() {
      this.$emit('filterCallback', { status: this.status, type: this.type })
    }
  }
}
</script>

<style lang="scss" scoped></style>
