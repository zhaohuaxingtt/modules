/*
 * @Autor: Hao,Jiang
 * @Date: 2021-11-23 10:54:46
 * @LastEditors: Hao,Jiang
 * @LastEditTime: 2021-11-23 13:53:38
 * @Description: queryParams 数组存放着 待获取的key值
 * 获取途径： 先从$attrs绑定获取，后从query获取
 */

export default {
  // aeko 管理
  '1': {module_obj_ae: 'AEKO管理',menuName_obj_ae: 'AEKO管理-列表'},
  '2': {module_obj_ae: 'AEKO表态', bizId_obj_ae: 'bizId_obj_ae',createBy_obj_ae: 'createBy_obj_ae',queryParams: ['bizId_obj_ae', 'createBy_obj_ae']}
}