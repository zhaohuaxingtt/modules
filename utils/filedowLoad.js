/*
 * @Author: your name
 * @Date: 2021-03-17 23:40:36
 * @LastEditTime: 2021-04-01 17:44:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \rise\src\utils\filedowLoad.js
 */

export function excelExport(data,title,name){
  var fileName;
  if(name){
    fileName= name
  }else{
    fileName= new Date().getTime()
  }
  try {
    // eslint-disable-next-line no-undef
    if (!data&&!title) return console.warn(Vue.$t('LK_MEIYOUKEYIXIAZHAIDEXINXI'))
    let worksheet = window.XLSX.utils.aoa_to_sheet(translateData(data,title))
    worksheet['!cols'] = [];
    for (let i = 0; i < title.length; i++) {
      worksheet['!cols'][i] =  //设置表格的宽度
        {
          wpx: title[i].width || title[i].minWidth || 120,
        }
    }
    // 创建工作簿
    let newWorkbook = window.XLSX.utils.book_new()
    // 将工作表附加到工作簿
    window.XLSX.utils.book_append_sheet(newWorkbook, worksheet, 'SheetJS')
      
    // 写入数据
    let s = window.XLSX.write(newWorkbook, { type: 'binary' })
    let tmpDown = new Blob([s2ab(s)], { type: '' })
    const href =  document.createElement('a')
    href.setAttribute('href',URL.createObjectURL(tmpDown))
    href.setAttribute('download',fileName+'.xlsx')
    document.body.appendChild(href)
    href.click()
    setTimeout(() => {
      // 延时释放
      URL.revokeObjectURL(tmpDown)
    }, 5000)
  } catch (error) {
    console.log(error)
  }
}

 function s2ab (s) {
      //  字符串转字符流
      var buf = new ArrayBuffer(s.length)
      var view = new Uint8Array(buf)
      for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
      return buf
}


function translateData(data,title){
  let baseName = []
  let baseKey = []
  for(let i in title){
    baseName.push(title[i].name||title[i].label)
    baseKey.push(title[i].props||title[i].prop)
  }
  baseName = [baseName]
  data.forEach(element => {
    let newArray = []
    baseKey.forEach(err=>{
      newArray.push(element[err])
    })
    baseName.push(newArray)
  });

  return baseName
}