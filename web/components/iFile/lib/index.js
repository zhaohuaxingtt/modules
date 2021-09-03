/*
 * @Autor: Hao,Jiang
 * @Date: 2021-08-31 14:21:56
 * @LastEditors: Hao,Jiang
 * @LastEditTime: 2021-09-03 10:03:01
 * @Description: 文件处理的相关处理方法
 */

import {iMessage} from 'rise'
import { 
  // 下载文件
  downloadUdFile,
  // 删除附件
  deleteFiles,
  // 获取分页数据
  getFiles,
  // 获取不分页数据
  getFile,
  // 文件排序
  updateSort,
  // 上传文件
  // uploadfile,
} from '@/api/file'

/**
 * @description: 下载方法
 * @param {*} file
 * @return {*}
 */
export function downloadFile(file) {
  const fileList = typeof file === 'string' ? [file] : file
  try {
    downloadUdFile(fileList)
  } catch (e) {
    console.log(e)
  }
}
/**
 * @description: 删除方法
 * @param {*} file 文件id，数组/字符串
 * @param {*} callback 删除完成后回调,可选
 * @param {*} vm vue 对象，里面涉及弹窗，必传
 * @return {*}
 */
export function deleteFile(file, callback=null, vm=this) {
  const fileList = typeof file === 'string' ? [file] : file
  if (fileList && !fileList.length) return iMessage.error(vm.language('QINGXUANZEZHISHAOYITIAOSHUJU','请选择至少一条数据'))
    vm.$confirm(vm.language('deleteSure','您确定要执行删除操作吗？')).then(confirmInfo => {
    if (confirmInfo === 'confirm') {
      deleteFiles(fileList).then(res => {
        if (res.code === '200') {
          iMessage.success(vm.language('LK_CAOZUOCHENGGONG','操作成功'))
          callback && typeof callback === 'function' && (callback())
        } else {
          iMessage.error(vm.$i18n.locale === "zh" ? res.desZh : res.desEn)
        }
      }).catch(e => {
        iMessage.error(vm.$i18n.locale === "zh" ? e.desZh : e.desEn)
      })
    }
  })
}
/**
 * @description: 下载全部查询不分页的附件列表，获取文件id，调CF接口下载
 * @param {*} params 需要提供 hostId，和fileType
 * @return {*}
 */
export function downloadAll(params={}) {
  getFile(Object.assign({
    sortColumn: 'sort',
    isAsc: true,
  }, params)).then(res => {
    if (res.code === '200') {
      const list = res.data || []
      const fileList = list.map(o => o.uploadId)
      if (fileList.length) {
        console.log('批量下载', fileList)
        downloadFile(fileList)
      }
    }
  }).catch(e => {
    console.log(e)
  })
}
/**
 * @description: 文件排序
 * @param {*} params 文件参数，包含fileId 文件id，isUp 是否是向上
 * @param {*} callback
 * @return {*}
 */
export function fileSort(params,callback){
  updateSort(params).then(res => {
    if (res.code === '200') {
      callback && typeof callback === 'function' && (callback())
    }
  }).catch(e => {
    console.log(e)
  })
}

export const lib = {
  methods: {
    /**
     * @description: 下载全部查询不分页的附件列表，获取文件id，调CF接口下载
     * @param {*} params 需要提供 hostId，和fileType
     * @return {*}
     */
    async batchDownload(params = {}) {
      downloadAll(params)
    },
    /**
     * @description: 分页查询附件列表
     * @param {*} params 需要提供 hostId，和fileType
     * @return {*}
     */    
    getFiles(params = {}) {
      this.tableLoading = true
      params = Object.assign({
        sortColumn: 'sort',
        isAsc: true,
        pageNo: params.currPage || 1,
        pageSize: params.pageSize || 10
      }, params)
      return getFiles(params)
    },
    /**
     * @description: 查询附件列表不分页
     * @param {*} params 需要提供 hostId，和fileType
     * @return {*}
     */    
     getFile(params = {}) {
      this.tableLoading = true
      params = Object.assign({
        sortColumn: 'sort',
        isAsc: true,
        pageNo: params.currPage || 1,
        pageSize: params.pageSize || 10
      }, params)
      return getFile(params)
    },
    /**
     * @description: 删除文件
     * @param {*} file 支持字符串和字符串数组，字符串表示单文件下载,数组表示批量删除
     * @return {*}
     */    
    async deleteFile(file, callback) {
      deleteFile(file, callback, this)
    },
    /**
     * @description: 下载文件
     * @param {*} file 支持字符串和字符串数组，字符串表示单文件下载
     * @return {*}
     */    
    downloadFile(file) {
      downloadFile(file)
    },
    /**
     * @description: 
     * @param {*} params 排序参数，包含fileField和isUp参数
     * @param {*} callback 回调
     * @return {*}
     */    
    updateSort(params, callback) {
      fileSort(params, callback)
    }
  }
} 