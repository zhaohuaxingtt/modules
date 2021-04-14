/*
 * @Author: your name
 * @Date: 2021-04-11 16:00:06
 * @LastEditTime: 2021-04-11 16:01:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \front-modules\src\components\iCard\index.js
 */
import components from './index.vue';
components.install = Vue => Vue.component(components.name, components);
export default components;