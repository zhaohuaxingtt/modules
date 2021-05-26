<!--
 * @Descripttion: 
 * @Author: Luoshuang
 * @Date: 2021-05-06 19:20:45
 * @LastEditTime: 2021-05-07 16:47:02
-->
<template>
  <div class="ptof-table">
    <el-table fit tooltip-effect='light' :height="height" :data='tableData' v-loading='tableLoading' @selection-change="handleSelectionChange" :empty-text="$t('LK_ZANWUSHUJU')" ref="moviesTable" >
      <el-table-column v-if="selection" type='selection' width="50" align='center'></el-table-column>
      <el-table-column v-if='index' type='index' width='50' align='center' :label='indexLabel'></el-table-column>
      <template v-for="(items,index) in tableTitle">
        <!----------------------图标列,“√”-已报价可跳转-------------------->
        <el-table-column :key="index" align='center' :width="items.width" :show-overflow-tooltip='items.tooltip' v-if='items.type == "icon"' :prop="items.props" :label="items.key ? $t(items.key) : items.name" >
          <template slot-scope="scope">
            <!-----该零件已经使用该模具，展示为*---------->
            <span v-if="isAssemblyPartNum(items.props, scope.row)" >*</span>
            <!-----用户点击关联该零件，展示为蓝色勾勾-------->
            <icon v-else-if="isRelationModel(items.props, scope.row)" symbol name="iconguanlianlingjian-xuanzhong" @click.native="changeStatus(items.props, scope.row, '0')" class="cursor"></icon>
            <!-----未被关联零件，展示为灰色勾勾-------->
            <icon v-else-if="!isRelationModel(items.props, scope.row)" symbol name="iconguanlianlingjian-moren" @click.native="changeStatus(items.props, scope.row, '1')" class="cursor"></icon>
            <!-----零件状态不存在或不对，则不展示--------->
          </template>
        </el-table-column>
        <!-------------------------正常列--------------------------->
        <el-table-column :key="index" align='center' :width="items.width" :show-overflow-tooltip='items.tooltip'  v-else :label="items.key ? $t(items.key) : items.name" :prop="items.props"></el-table-column>
      </template>
    </el-table>
  </div>
</template>
<script>
import {icon} from 'rise';
export default{
  components:{icon},
  props:{
    tableData:{type:Array},
    tableTitle:{type:Array},
    tableLoading:{type:Boolean,default:false},
    selection:{type:Boolean,default:true},
    height:{type:Number||String},
  },
  inject:['vm'],
  methods:{
    handleSelectionChange(val){
      this.$emit('handleSelectionChange',val)
    },
    isAssemblyPartNum(props, row) {
      return row.partList.find(item => item.fsnrGsnrNum === props)?.isAssemblyPartNum === '1'
    },
    isRelationModel(props, row) {
      return row.partList.find(item => item.fsnrGsnrNum === props)?.isRelationModel === '1'
    },
    changeStatus(props, row, status) {
      this.$emit('changeStatus', props, row, status)
    }
  }
}
</script>
<style lang='scss' scoped>
  .openLinkText{
    color:$color-blue;
    text-decoration: underline;
  }
  .radio{
    ::v-deep thead .el-table-column--selection .cell {
      display: none;
    }
  }
  .ptof-table {
    ::v-deep .openLinkText {
      text-decoration: underline;
    }
  }
</style>

<style lang="scss">
.tooltip {
  border:none !important;
  box-shadow: 0px 3px 10px rgba(27, 29, 33, 0.16);
}
</style>