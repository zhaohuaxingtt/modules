/*
 * @Author: your name
 * @Date: 2021-04-21 19:03:37
 * @LastEditTime: 2021-05-25 13:53:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \front-modules\doc\global.requires.js
 */
import Vue from 'vue'
import '../public/theme/index.css'
import '../public/theme/fonts/iconfont.css'
import './env.css'
require('../auto').init()
import element from 'element-ui'
Vue.use(element)
Vue.prototype.$t = function (params) {
  return params
}