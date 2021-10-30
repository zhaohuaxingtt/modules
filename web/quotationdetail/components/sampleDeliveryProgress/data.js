/*
 * @Author: Luoshuang
 * @Date: 2021-05-27 16:06:57
 * @LastEditors: ldh
 * @LastEditTime: 2021-06-08 19:50:57
 * @Description: 
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\sampleDeliveryProgress\data.js
 */

export const tableTitle = [
  { props: "sampleDeliverType", name: "具体进度", key: "LK_JUTIJINDU" },
	{ props: "requiredTime", name: "SAIC VOLKSWGEN要求(周)", key: "LK_SAICVOLKSWGENZHOU" },
	{ props: "supplierTime", name: "供应商周期(周)", key: "LK_GONGYINGSHANGZHOUQIZHOU", type: 'input' },
	{ props: "remark", name: "备注", key: "LK_BEIZHU", type: 'input' },
]

export const dateTemplate = [
  { sampleDeliverType: '1st Tryout送样周期', requiredTime: '4', supplierTime: '', remark: '' },
  { sampleDeliverType: 'OTS送样周期', requiredTime: '8', supplierTime: '', remark: '' },
  { sampleDeliverType: 'EM送样周期', requiredTime: '8', supplierTime: '', remark: '' },
]