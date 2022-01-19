/*
 * @Author: ldh
 * @Date: 2021-04-23 17:32:13
 * @LastEditors: ldh
 * @LastEditTime: 2021-05-12 19:35:18
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\mouldOffer\components\data.js
 */
export const moduleCostTableTitle = [
  { props: 'mouldId', name: '模具ID', tooltip: true, key: "LK_MUJUID" },
  { props: 'fixedAssetsName', name: '固定资产名称', tooltip: true, width: 135, key: "LK_GUDINGZICHANMINGCHENG", tipsLang: true, tipsKey: "LK_GUDINGZICHANMINGCHENGTIPS", tips: "<p style='text-align: center'>由“零件总成名称”、“零部件名称”、<br/>“工模具种类”组成</p>" },
  { props: 'assembledPartPrjCode', name: 'FS No.', width: 150, tooltip: true, key: "LK_FSNO" },
  { props: 'priceType', name: '价格类型', width: 90, tooltip: true, key: "JIAGELEIXING" },
  { props: 'stuffType', name: '工艺类型', tooltip: true, width: 100, key: "LK_GONGYILEIXING", tipsLang: true, tipsKey: "LK_GONGYILEIXINGTIPS", tips: "如注塑，冲压，电镀等" },
  { props: 'mouldType', name: '工模具种类', tooltip: true, width: 115, key: "LK_GONGMUJUZHONGLEI", tipsLang: true, tipsKey: "LK_GONGMUJUZHONGLEITIPS", tips: "如：热流道注塑模" },
  { props: 'assetTypeCode', name: '资产分类编号', tooltip: true, width: 110, key: "LK_ZICHANFENLEIBIANHAO", tipsLang: true, tipsKey: "LK_ZICHANFENLEIBIANHAOTIPS", tips: "13：模具<br/>14：夹具<br/>15：检具<br/>16：其他工装" },
  { props: 'assembledPartName', name: '零件总成名称', tooltip: true, width: 110, key: "LK_LINGJIANZONGCHENGMINGCHENG", tipsLang: true, tipsKey: "LK_LINGJIANZONGCHENGMINGCHENGTIPS", tips: "<p style='text-align: center'>一次件总成零件名称</p>" },
  { props: 'assembledPartCode', name: '零件总成零件号', tooltip: true, width: 150, key: "LK_LINGJIANZONGCHENGLINGJIANHAO", tipsLang: true, tipsKey: "LK_LINGJIANZONGCHENGLINGJIANHAOTIPS", tips: "<p style='text-align: center'>一次件总成零件号</p>" },
  { props: 'modeTotalLife', name: '工装寿命', tooltip: true, key: "LK_GONGZHUANGSHOUMING" },
  { props: 'carModeCode', name: '车型', tooltip: true, key: "LK_CHEXING" },
  { props: 'supplierPartNameList', name: '零部件名称', tooltip: true, width: 90, key: "LK_LINGBUJIANMINGCHENG", tipsKey: "LK_LINGBUJIANMINGCHENGTIPS", tips: "<p style='text-align: center'>散件名称</p>" },
  { props: 'supplierPartCodeList', name: '零部件零件号', tooltip: true, width: 110, key: "LK_LINGBUJIANLINGJIANHAO", tipsLang: true, tipsKey: "LK_LINGBUJIANLINGJIANHAOTIPS", tips: "<p style='text-align: center'>散件零件号<br/>(若无，则用总成号)</p>" },
  { props: 'quantity', name: '数量', width: 80, tooltip: true, key: "LK_SHULIANG", tipsLang: true, tipsKey: "LK_SHULIANGTIPS", tips: "<p style='text-align: center'>必须为整数</p>" },
  { props: 'assetUnitPrice', name: '资产单价', tooltip: true, width: 100, key: "LK_ZICHANDANJIA", tipsLang: true, tipsKey: "ZICHANBIANDONGDANJIATIPS", tips: "<p style='text-align: center'>不含税价格，<br/>并且保留两位小数</p>" },
  { props: 'totalPrice', name: '资产总额', tooltip: true, key: "LK_ZICHANZONGE" },
  { props: 'isShared', name: '是否分摊', width: 110, tooltip: true, key: "LK_SHIFOUFENTAN" }
]
