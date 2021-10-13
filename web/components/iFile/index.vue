<!--
 * @Autor: Hao,Jiang
 * @Date: 2021-09-02 08:53:54
 * @LastEditors: Hao,Jiang
 * @LastEditTime: 2021-10-13 17:28:05
 * @Description: 附件管理标准表格 卡片模式
-->
<template>
  <iCard class="margin-bottom25">
    <div class="margin-bottom25 clearFloat" v-if="!hideHeader">
      <span class="font18 font-weight">
        {{ title }}</span
      >
      <div class="floatright">
        <!-- 下载全部 -->
        <downloadAll :hostId="hostId" :fileType="fileType" v-if="editControl.includes('downloadAll')" />
        <!-- 下载 -->
        <iButton @click="download" v-if="editControl.includes('download')">
          {{ language("LK_XIAZAI",'下载') }}
        </iButton>
        <!-- 删除 -->
        <iButton
          class="margin-right10"
          @click="delFile($event, getFile)"
          v-if="!readOnly && editControl.includes('delete')">
          {{ language("LK_SHANCHU",'删除') }}
        </iButton>
        <!-- 上传文件 -->
        <upload
          class="upload-trigger"
          :hideTip="true"
          :accept="accept"
          :fileType="fileType"
          :hostId="hostId"
          :sourcingCallback="!isOnSuccessCallBack"
          :buttonText="uploadButtonText || language('UPLOADFILE','上传文件')"
          @on-success="isOnSuccessCallBack? onSuccess($event, getFile) : getFile"
          v-if="!readOnly && editControl.includes('upload')"
        />
      </div>
    </div>
    <tablelist
      :index="tableTitleCol.includes('index') && tableIndex"
      :selection="!readOnly && tableTitleCol.includes('selection') && tableSelection"
      :tableData="fileDataList"
      :tableTitle="fileTableTitle"
      :fileTableLoading="fileTableLoading"
      :tableLoading="fileTableLoading"
      :activeItems="activeItems"
      :activeItemsLink="true"
      @handleSelectionChange="handleSelectionChange"
      @openPage="downloadSingleFile"
    >
    <template #uploadDate="scope">
      {{scope.row.uploadDate | dateFilter('YYYY-MM-DD')}}
    </template>
    <template #_download="scope">
      <download :fileId="scope.row.uploadId" :type="'link'" />
    </template>
    <template #_sort="scope">
      <a class="link-underline" v-if="scope.$index === 0">
        <icon symbol name="iconpaixu-xiangshangjinzhi" class="icon" />
      </a>
      <a class="link-underline" @click="sort(scope.row, true)" v-else>
        <icon symbol name="iconpaixu-xiangshang" class="icon" />
      </a>

      <a class="link-underline" v-if="scope.$index === fileDataList.length - 1">
        <icon symbol name="iconpaixu-xiangxiajinzhi" class="icon" />
      </a>
      <a class="link-underline" @click="sort(scope.row, false)" v-else>
        <icon symbol name="iconpaixu-xiangxia" class="icon" />
      </a>
    </template>
    </tablelist>
    <iPagination
      v-if="pagination"
      v-update
      @size-change="handleSizeChange($event, getFile)"
      @current-change="handleCurrentChange($event, getFile)"
      background
      :current-page="page.currPage"
      :page-sizes="page.pageSizes"
      :page-size="page.pageSize"
      :layout="page.layout"
      :total="page.totalCount"
    />
  </iCard>
</template>

<script>
import { tableTitle,} from './components/data'
import tablelist from "./tableList";
import {
  iCard,
  iButton,
  iPagination,
  icon
} from "rise";
// 下载按钮
import download from './download'
// 下载全部按钮
import downloadAll from './downloadAll'
// 上传按钮
import upload from './upload'
// 附件相关
import { attachMixins } from './lib/attachMixins'
// 分页
import { pageMixins } from './lib/pageMixins'

export default {
  components: {
    iCard,
    iButton,
    iPagination,
    icon,
    tablelist,
    upload,
    download,
    downloadAll
  },
  props: {
    /**
     * @description: 标题
     * @param {*}
     * @return {*}
     */    
    title: {type: String, default: ''},
    /**
     * @description: 配置表头
     * @param {*}
     * @return {*}
     */    
    tableTitleCol: {
      type: Array, 
      default: () => (['index', 'selection', 'fileName', 'uploadDate', 'uploadBy'])},
    /**
     * @description: 自定义表头，参数格式参考tabList
     * @param {*}
     * @return {*}
     */    
    customizeTableTitle: {
      type: Array, 
      default: () => ([])},
    /**
     * @description: 是否显示英文表头
     * @param {*}
     * @return {*}
     */    
    enTabTitleCol: {type: Boolean, default: false},
    /**
     * @description: 表头右边按钮
     * @param {*} 'download','delete','downloadAll','upload'
     * @return {*}
     */      
    editControl: {
      type: Array, 
      default: () => (['download','delete','upload']),
    },
    /**
     * @description: 只读模式，只支持下载
     * @param {*}
     * @return {*}
     */    
    readOnly: {type: Boolean, default: false},
    /**
     * @description: 是否支持选择
     * @param {*}
     * @return {*}
     */    
    tableSelection: {type: Boolean, default: true},
    /**
     * @description: 是否显示表头编号
     * @param {*}
     * @return {*}
     */    
    tableIndex: {type: Boolean, default: true},
    /**
     * @description: 是否初始化加载数据
     * @param {*}
     * @return {*}
     */    
    init: {type: Boolean, default: true},
    /**
     * @description: 是否支持分页
     * @param {*}
     * @return {*}
     */    
    pagination: {type: Boolean, default: true},
    /**
     * @description: hostId
     * @param {*}
     * @return {*}
     */    
    hostId: {type:String||Number},
    /**
     * @description: 附件类型
     * @param {*}
     * @return {*}
     */    
    fileType: {type:String||Number},
    /**
     * @description: 上传按钮接受类型
     * @param {*}
     * @return {*}
     */
    accept: {type: String, default: '.jpg,.jpeg,.png,.pdf,.tif'},
    /**
     * @description: 上传按钮文本
     * @param {*}
     * @return {*}
     */    
    uploadButtonText: {type: String},
    activeItems: {type: String,default:'b'},
    callback: Function,
    // 自定义获取文件列表回调
    getFileCallBack: Function,
    // 自定义上传成功后回调
    onSuccessCallBack: Function,
    // 自定义删除回调
    deleteFileCallBack: Function

  },
  computed: {
    fileTableTitle() {
      // 英文表头
      this.enTabTitleCol && (this.tableTitle.map(f => {
        f.name = f.nameEN || ''
        return f
      }))
      const tableTitle = this.tableTitle.filter(f => this.tableTitleCol.includes(f.props))
      return this.customizeTableTitle.length ? this.customizeTableTitle : tableTitle
    },
    isGetFileCallBack() {
      return (this.getFileCallBack && typeof this.getFileCallBack === 'function')
    },
    isOnSuccessCallBack() {
      return (this.onSuccessCallBack && typeof this.onSuccessCallBack === 'function')
    },
    isDelFileCallBack() {
      return (this.deleteFileCallBack && typeof this.deleteFileCallBack === 'function')
    }
  },
  mixins: [ attachMixins, pageMixins ],
  data() {
    return {
      tableTitle,
    }
  },
  mounted() {
    this.getFetchFileList()
  },
  methods: {
    getFile() {
      return this.isGetFileCallBack ? this.getFileCallBack(this.updateData) : this.getFetchFileList()
    },
    onSuccess($event, cb) {
      return this.isOnSuccessCallBack ? this.onSuccessCallBack($event, cb) : this.getFetchFileList()
    },
    delFile($event, cb) {
      return this.isDelFileCallBack ? this.deleteFileCallBack(this.multipleSelection, cb) : this.del($event, cb)
    },
    updateData(data={}) {
      if (data.fileTableLoading !== undefined) {
        this.fileTableLoading = data.fileTableLoading
      }
      if (data.fileDataList !== undefined && data.fileDataList instanceof Array) {
        this.fileDataList = data.fileDataList
      }
      if (data.totalCount !== undefined) {
        this.page.totalCount = data.totalCount
      }
    }
  },
}
</script>
<style lang="scss" scoped>
.link-underline {
  display: inline-block;
  margin-right: 15px;
}
</style>