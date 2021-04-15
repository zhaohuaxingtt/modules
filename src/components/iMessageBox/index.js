/*
 * @Author: your name
 * @Date: 2021-04-15 11:30:16
 * @LastEditTime: 2021-04-15 11:33:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \front-modules\src\components\iMessageBox\index.js
 */
import {MessageBox} from 'element-ui'
const iMessageBox = (content='',title='温馨提示',options={}) => {
  return MessageBox.confirm(content,title,Object.assign({zIndex:20000},options))
}

iMessageBox.install = Vue => Vue.component('iMessageBox', iMessageBox);
export default iMessageBox;
