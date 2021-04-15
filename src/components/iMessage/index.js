/*
 * @Author: your name
 * @Date: 2021-04-15 11:30:03
 * @LastEditTime: 2021-04-15 11:31:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \front-modules\src\components\iMessage\index.js
 */
import {Message} from 'element-ui'
function message(){
  this.type = 'success';
  this.message = ''
  return this
}
message.prototype.success = (message)=>{
  Message({
    message: message || this.message,
    type: 'success',
  })
}
message.prototype.warn = (message)=>{
  Message({
    message: message || this.message,
    type: 'warning'
  })
}
message.prototype.error = (message)=>{
  Message({
    message: message || this.message,
    type: 'error'
  })
}
const iMessage = new message()
iMessage.install = Vue => Vue.component('iMessage', iMessage);
export default iMessage;