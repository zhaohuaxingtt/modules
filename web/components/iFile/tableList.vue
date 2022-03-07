<!--
 * @Author: haojiang
 * @Date: 2021-02-24 09:42:07
 * @LastEditTime: 2022-01-26 10:37:42
 * @LastEditors: Please set LastEditors
 * @Description: table组件
-->
<template>
<div class="iFileTableList">
  <el-table
    fit
    tooltip-effect='light'
    v-bind="treeProps"
    v-loading='tableLoading'
    :height="height"
    :data='tableData'
    :empty-text="language('ZANWUSHUJU', '暂无数据')"
    :class="{'moviesTable': true, 'radio': radio}"
    :cell-style="borderLeft"
    :span-method="spanMethod"
    @selection-change="handleSelectionChange"
    @select="handleSelect"
    @select-all="handleSelectAll"
    default-expand-all
    ref="moviesTable">
    <!----------------------复选框------------------------------------->
    <el-table-column v-if="selection" type='selection' :width="selectConfig.width || 40" :align="selectConfig.align || 'center'" :header-align="selectConfig.headerAlign || 'center'" :selectable="selectConfig.selectable || selectable"></el-table-column>
    <!----------------------支持自定义的index插槽------------------------>
    <el-table-column v-if='index' type='index' :width='indexConfig.width || 32' :align="indexConfig.width || 'center'" :header-align="indexConfig.width || 'center'" :label="indexConfig.label || indexLabel">
      <template slot-scope="scope">
        <slot :name="`_index`" :row="scope.row" :$index="scope.$index">
          {{scope.$index+1}}
        </slot>
      </template>
    </el-table-column>

    <template v-for="(items,index) in header">
      <!----------------------需要高亮的列并且带有打开详情事件------------------------>
      <el-table-column :key="`${items.props}_${index}`" align='center' :width="items.width" :min-width="items.minWidth ? items.minWidth.toString():''" :show-overflow-tooltip='items.tooltip' v-if='items.props == activeItems' :prop="items.props" :label="lang ? language(items.key, items.name) : $t(items.key)">
        <!-- slot header -->
        <!-- <template slot="header">
          <div class="slotHeader" :class="{headerRequiredLeft: items._headerRequiredLeft, headerRequiredRight:items._headerRequiredRight }">
            {{lang ? language(items.key, items.name) : $t(items.key)}}
          </div>
        </template> -->
        <!-- slot content -->
        <template slot-scope="row">
           <span class="flexRow">
            <span :class="`openLinkText cursor ${activeItemsLink}`"  @click="openPage(row.row)"> {{ row.row[activeItems]}}</span>
            <span class="icon-gray  cursor " v-if="row.row[activeItems] && !activeItemsLink"  @click="openPage(row.row)">
                <icon symbol class="show" name="icontiaozhuananniu" />
                <icon symbol class="active" name="icontiaozhuanxuanzhongzhuangtai" />
            </span>
          </span> 
          </template>
      </el-table-column>
      <!----------------------普通表格展示---------------------------------------->
      <el-table-column
        v-else
        align='center'
        :key="`${items.props}_${index}`"
        :width="items.width"
        :min-width="items.minWidth ? items.minWidth.toString():''"
        :show-overflow-tooltip='items.tooltip'
        :label="lang ? language(items.key, items.name) : $t(items.key)"
        :prop="items.props"
        :class-name="items.tree ? 'tree' : ''">
        <!-- slot header -->
        <!-- <template slot="header">
          <div class="slotHeader" :class="{headerRequiredLeft: items._headerRequiredLeft, headerRequiredRight:items._headerRequiredRight }">
            {{lang ? language(items.key, items.name) : $t(items.key)}}
          </div>
        </template> -->
        <!-- slot content -->
        <template slot-scope="scope">
          <span :class="{normal: true, child: scope.row.children}">
            <slot :name="items.props" :row="scope.row" :$index="scope.$index">
              {{scope.row[items.props]}}
            </slot>
          </span>
        </template>
      </el-table-column>
    </template>
  </el-table>
  <!-- iTableHeaderSorter -->
  <iTableHeaderSorter
      v-if="enabletableHeadersetting"
      :data="tableSettingColumns"
      :show.sync="settingVisible"
      :value="'value'"
      :label="'label'"
      :visiableKey="'hidden'"
      @callback="handleSaveSetting"
      @reset="handleResetSetting"
    />
</div>

</template>
<script>
import {cloneDeep} from 'lodash'
import {icon} from "rise"
// import iTableHeaderSorter from './iTableHeaderSort'
import {iTableHeaderSorter} from "rise"
export default{
  props:{
    /**
     * @description: 表格数据
     * @param {*} 数组
     * @return {*}
     */    
    tableData:{type:Array},
    /**
     * @description: 表格表头
     * @param {*} 数组
     * @return {*}
     */    
    tableTitle:{type:Array},
    /**
     * @description: 表格加载状态
     * @param {*}
     * @return {*}
     */    
    tableLoading:{type:Boolean,default:false},
    /**
     * @description: 是否显示复选框
     * @param {*}
     * @return {*}
     */    
    selection:{type:Boolean,default:true},
    /**
     * @description: 是否支持选中逻辑
     * @param {*}
     * @return {*}
     */    
    selectable: {type:Function},
    selectConfig: {type: Object, default: () => ({})},
    /**
     * @description: 表格索引
     * @param {*}
     * @return {*}
     */    
    index:{type:Boolean,default:false},
    indexConfig: {type: Object, default: () => ({})},
    /**
     * @description: 表格索引表头文本
     * @param {*}
     * @return {*}
     */    
    indexLabel:{type:String,default:'#'},
    /**
     * @description: 高度
     * @param {*}
     * @return {*}
     */    
    height:{type:Number||String},
    /**
     * @description: 用于高亮带链接的列
     * @param {*}
     * @return {*}
     */    
    activeItems:{type:String,default:'b'},
    /**
     * @description: 用于高亮带链接的列的样式是否带箭头
     * @param {*} false 标识带箭头
     * @return {*}
     */
    activeItemsLink:{type:String||Boolean,default: false},
    /**
     * @description: 是否单选
     * @param {*}
     * @return {*}
     */  
    radio:{type:Boolean,default:false},
    /**
     * @description: 是否支持树形展示
     * @param {*}
     * @return {*}
     */    
    treeProps: {type:Object},
    /**
     * @description: 支持国际化
     * @param {*}
     * @return {*}
     */    
    lang: {type: Boolean},
    /**
     * @description: 表格合并
     * @param {*}
     * @return {*}
     */    
    spanMethod: { type: Function },
    enabletableHeadersetting: {type: Boolean, default: false},
  },
  inject:['vm'],
  components:{iTableHeaderSorter, icon},
  data() {
    return {
      settingVisible: false,
      header: this.tableTitle,
      cacheNewHeader: this.tableTitle,
    }
  },
  computed: {
    tableSettingColumns() {
      const tableSettingColumns = cloneDeep(this.header)
      return tableSettingColumns.map(o => {
        !o.prop && o.props && (o.prop = o.props)
        !o.label && o.name && (o.label = o.name)
        o.i18n = o.i18n || o.key
        return o
      })
    }
  },
  methods:{
    /**
     * @description: 单选的实现
     * @param {*} val
     * @return {*}
     */    
    handleSelectionChange(val){
      if (this.radio) {
        if (val.length > 1) {
          //取出最后val的最后一个返回出来
          var duoxuans=val.pop();
          this.handleSelectArr=val.pop();
          //清除所有选中
          this.$refs.moviesTable.clearSelection()
          //给最后一个加上选中
          this.$refs.moviesTable.toggleRowSelection(duoxuans)
        } else {
          this.$emit('handleSelectionChange',val)
        }
      }else{
        this.$emit('handleSelectionChange',val)
      }
      this.$emit('selection-change',val)
    },
    /**
     * @description: 打开页面回调方法
     * @param {*} e
     * @return {*}
     */    
    openPage(e){
      this.$emit('openPage',e)
    },
    /**
     * @description: 选中回调
     * @param {*} selection
     * @param {*} row
     * @return {*}
     */    
    handleSelect(selection,row){
      const selectdBorder = row.selectedBorder
      this.$set(row,'selectedBorder',!selectdBorder)
      this.$emit('selection-change',{selection,row})
    },
    /**
     * @description: 全选回调
     * @param {*} selection
     * @param {*} row
     * @return {*}
     */    
    handleSelectAll(selection){  
      const flag = selection.length
      for(let i= 0  ; i<flag;i++){
        this.$set(selection[i],'selectedBorder',!!flag)
      }
      !flag? this.tableData.forEach(i=>{i.selectedBorder=!i.selectedBorder}):''
      this.$emit('select-all',selection)
    },
    /**
     * @description: 自定义样式
     * @param {*} row
     * @param {*} columnIndex
     * @return {*}
     */    
    borderLeft({row, columnIndex}){
      const style = `border-left:2px solid #1660F1;`
      return columnIndex === 0 && row.selectedBorder === true ? style : ''
    },
    renewTableHeader() {
      const data = cloneDeep(this.cacheNewHeader)
      const header = cloneDeep(data).filter(o => !o.isHidden)
      this.header = header.map(o => {
        !o.prop && o.props && (o.prop = o.props)
        !o.label && o.name && (o.label = o.name)
        o.i18n = o.i18n || o.key
        return o
      })
    },
    handleSaveSetting(data) {
      // console.log('handleSaveSetting',data)
      this.cacheNewHeader = cloneDeep(data)
      if (this.$attrs.handleSaveSetting && typeof this.$attrs.handleSaveSetting === 'function') {
        this.$attrs.handleSaveSetting({data, done: this.renewTableHeader})
      }
    },
    handleResetSetting(data) {
      console.log('handleSaveSetting',data)
      this.cacheNewHeader = this.tableTitle
      if (this.$attrs.handleResetSetting && typeof this.$attrs.handleResetSetting === 'function') {
        this.$attrs.handleResetSetting({data: this.cacheNewHeader, done: this.renewTableHeader})
      }
    },
  }
}
</script>
<style lang='scss' scoped>
.iFileTableList {
  ::v-deep.el-table__body-wrapper {
    height: auto!important;
  }
}
  .openLinkText{
    color:$color-blue;
    &.underline {
      text-decoration: underline;
    }
  }
  .radio {
    ::v-deep thead .el-table-column--selection .cell {
      display: none;
    }
  }
  ::v-deep.el-table.moviesTable {
    .tree {
      text-align: right;
      box-sizing: border-box;
      padding-right: 40px;
      .normal {
        width: 270px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        margin-right: 20px;
        &.child {
          margin-right: 0px;
        }
      }
      .el-table__expand-icon {
        float: right;
        transform: rotate(180deg);
        &.el-table__expand-icon--expanded {
          transform: rotate(0deg);
        }
        i::before {
          content: '\e78f';
        }
      }
    }
  }
  .icon-gray{
    cursor: pointer;
    .active{
      display: none;
    }
    .show{
      display: block;
    }
  }
  .flexRow{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .icon-gray:hover{
    cursor: pointer;
    .show{
      display: none;
    }
    .active{
      display: block;
    }
  }
  .slotHeader {
    text-align: center;
    &:after, &:before {
      // display: inline-block;
      content: '*';
      color: #f56c6c;
      display: none;
    }
    &.headerRequiredLeft:before {
      display: inline-block;
      margin-right: 2px;
    }
    &.headerRequiredRight:after {
      display: inline-block;
      margin-left: 2px;
    }
  }
</style>