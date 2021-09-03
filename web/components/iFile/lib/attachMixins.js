/*
 * @Author: haojiang
 * @Date: 2021-02-24 14:28:34
 * @LastEditTime: 2021-09-03 09:08:33
 * @LastEditors: Hao,Jiang
 * @Description: 针对所有的分页插件，实行方法混入。
 * @FilePath: \rise\src\utils\attachMixins.js
 */
import {iMessage} from 'rise'
import { lib as filelib } from './index'
export const attachMixins = {
  mixins: [ filelib ],
  filters: {
    // 日期格式化
    dateFilter(val, format = "YYYY-MM-DD HH:mm:ss") {
      return typeof val === 'string' ||  typeof val === 'number' ? window.moment(val).format(format) : val
    },
  },
  data(){
    return {
    // 加载状态
    fileTableLoading: false,
    //  选中的数据
    multipleSelection: [],
    // 列表
    fileDataList: []
    }
  },
  methods:{
    /**
     * @description: 
     * @param {*}
     * @return {*}
     */    
    clear() {
      this.fileDataList = []
      if (this.page) {
        this.page.totalCount = 0
        this.page.currPage = 1
      }
    },
    /**
     * @description: 多选
     * @param {*} list
     * @return {*}
     */    
    handleSelectionChange(list) {
      this.multipleSelection = list
    },
    /**
     * @description: 全部下载
     * @param {*} params
     * @return {*}
     */
    async downloadAll() {
      this.batchDownload({
        hostId: this.hostId,
        fileType: this.fileType,
      })
    },
    /**
     * @description: 查询分页附件列表
     * @param {*} params
     * @return {*}
     */    
    getFetchFileList(params = {}) {
      this.fileTableLoading = true
      params = Object.assign({
        hostId: this.hostId,
        fileType: this.fileType,
        sortColumn: 'sort',
        isAsc: true,
        currPage: (this.page && this.page.currPage) || 1,
        page: (this.page && this.page.pageSize) || 10
      }, params)
      this.getFiles(params).then(res => {
        if (res.code === '200') {
          this.fileDataList = res.data.records || res.data || []
          if (this.page) {
            this.page.totalCount = Number(res.total)
          }
        } else {
          iMessage.error(this.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
        this.fileTableLoading = false
        console.log(res)
      }).catch(e => {
        console.log(e)
        this.fileTableLoading = false
      })
    },
    /**
     * @description: 删除文件
     * @param {*} fileList
     * @param {*} callback
     * @return {*}
     */    
    async del(fileList = [], callback) {
      let idList = []
      if (!(fileList && fileList.length)) {
        if (!this.multipleSelection.length) {
          iMessage.error(this.language('QINGXUANZEZHISHAOYITIAOSHUJU','请选择至少一条数据'))
          return
        }
        idList = this.multipleSelection.map(o => o.id)
      } else {
        // 直接提供数组id列表删除
        idList = [...fileList]
      }
      this.deleteFile(idList, callback)
    },
    // 下载文件
    download() {
      const fileList = this.multipleSelection.map(o => o.uploadId)
      if (!fileList.length) return iMessage.error(this.language('QINGXUANZEZHISHAOYITIAOSHUJU','请选择至少一条数据'))
      try {
        if (fileList.length) {
          const params = fileList;
          this.downloadFile(params)
        }
      } catch (e) {
        console.log(e)
      }
    },
    /**
     * @description: 
     * @param {*} row 数据
     * @param {*} direction 向上还是向下
     * @return {*}
     */    
    sort(row, isUp){
      this.updateSort({
        fileId: row.id,
        isUp
      }, this.getFetchFileList)
    }
  }
} 

