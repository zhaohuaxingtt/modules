/*
 * @Author: ldh
 * @Date: 2021-05-28 22:44:04
 * @LastEditTime: 2021-05-28 22:47:58
 * @LastEditors: ldh
 * @Description: In User Settings Edit
 * @FilePath: \front-modules\src\components\iEditor\index.js
 */
import components from './index.vue';
components.install = Vue => Vue.component(components.name, components);
export default components;