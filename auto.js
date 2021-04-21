/*
 * @Author: your name
 * @Date: 2021-02-23 14:22:16
 * @LastEditTime: 2021-02-23 15:27:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \rise\src\auto.js
 */

class SetSize{
  constructor(){
    this.size = 16;
  }
  setRem(){
    const scale = document.documentElement.clientWidth / 1920
    // 设置页面根节点字体大小（“Math.min(scale, 2)” 指最高放大比例为2，可根据实际业务需求调整）
    document.documentElement.style.fontSize = this.size * Math.min(scale, 2) + 'px'
  }
  init(){
    this.setRem()
  }
}
module.exports = new SetSize()