/*
 * @Author: ldh
 * @Date: 2021-04-23 14:30:32
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-02-28 17:26:27
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\sample\data.js
 */
export const sampleTableTitle = (isDb)=> [
	{ props: "sampleType", name: "样件", tooltip: true, key: "LK_YANGJIAN",isAeko:true },
	{ props: "requiredTime", name: "需要日期(周)", tooltip: true, key: "LK_XUYAORIQIZHOU" },
	{ props: "quantity", name: "需要数量(件)", tooltip: true, key: "LK_XUYAOSHULIANGJIAN" },
	{ props: "sampleUnitPrice",width:180,name: `${isDb?'工装样件单件费用(RMB)':"工装样件单件费用"}`, key: `${isDb?'LK_GONGZHUANGYANGJIANDANJIANFEIYONGRMB':'LK_GONGZHUANGYANGJIANDANJIANFEIYONG'}` ,isAeko:true},
	{ props: "addionalMouldCost", width:180,name: `${isDb?'附加工装样件模具价格(RMB)':'附加工装样件模具价格'}`, key: `${isDb?'LK_FUJIAGONGZHUANGYANGJIANMUJUJIAGERMB':'LK_FUJIAGONGZHUANGYANGJIANMUJUJIAGE'}` ,isAeko:true},
	{ props: "addionalMouldLife",width:180, name: "附加工装样件模具寿命(个数)", key: "LK_FUJIAGONGZHUANGYANGJIANMUJUSHOUMINGGESHU" ,isAeko:true},
	{ props: "remark", name: "备注", tooltip: true, key: "LK_BEIZHU" ,isAeko:true},
]

