/*
 * @Autor: Hao,Jiang
 * @Date: 2021-09-01 16:17:44
 * @LastEditors: Hao,Jiang
 * @LastEditTime: 2021-09-03 09:55:02
 * @Description: 附件管理表
 */

// 附件表头
export const tableTitle = [
  {
    props: 'fileName',
    name: '文件名',
    nameEN: 'File Name',
    key: 'LK_WENJIANMING',
    tooltip: false
  },
  {
    props: 'fileSize',
    name: '大小',
    nameEN: 'File Size',
    key: 'DAXIAO',
    tooltip: false
  },
  {
    props: 'uploadDate',
    name: '上传日期',
    nameEN: 'Upload Date',
    key: 'LK_SHANGCHUANRIQI',
    tooltip: false
  },
  {
    props: 'uploadBy',
    name: '上传人',
    nameEN: 'Upload Person',
    key: 'LK_SHANGCHUANREN',
    tooltip: false
  },
  // 排序，可选
  {
    props: '_sort',
    name: '',
    key: '',
    width: 150,
    tooltip: false
  },
  // 下载列，可选
  {
    props: '_download',
    name: '',
    key: '',
    tooltip: false
  }
]