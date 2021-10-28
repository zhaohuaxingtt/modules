/*
 * @Author: ldh
 * @Date: 2021-04-23 09:16:55
 * @LastEditors:  
 * @LastEditTime: 2021-10-27 19:09:43
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\mouldAndDevelopmentCost\components\data.js
 */
export const mouldCostInfos = [
  { props: "rfqMouldFeeTotal", name: "RFQ模具费用总计", key: "LK_RFQMUJUFEIYONGZONGJI" },
  { props: "totalInvestmentCost", name: "总投资成本", key: "LK_ZONGTOUZICHENGBEN" },
  { props: "shareInvestmentFee", name: "分摊投资成本", key: "LK_FENTANTOUZICHENGBEN" },
  { props: "shareQuantity", name: "分摊数量", key: "LK_FENTANSHULIANG" },
  { props: "unitInvestmentCost", name: "单件投资成本", key: "LK_DANJIANTOUZICHENGBEN" }
]

export const mouldTableTitle = [
  { props: "mouldId", name: "模具ID", tooltip: true, key: "LK_MUJUID" },
  { props: "fixedAssetsName", name: "固定资产名称", tooltip: true, width: 120, key: "LK_GUDINGZICHANMINGCHENG", tipsKey: "LK_GUDINGZICHANMINGCHENGTIPS", /* tips: "<p style='text-align: center'>由“零件总成名称”、“零部件名称”、<br/>“工模具种类”组成</p>" */ },
  { props: "stuffType", name: "工艺类型", tooltip: true, width: 90, key: "LK_GONGYILEIXING", tipsKey: "LK_GONGYILEIXINGTIPS", /* tips: "如注塑，冲压，电镀等" */ },
  { props: "mouldType", name: "工模具种类", tooltip: true, width: 110, key: "LK_GONGMUJUZHONGLEI", tipsKey: "LK_GONGMUJUZHONGLEITIPS", /* tips: "如：热流道注塑模" */ },
  { props: "assetTypeCode", name: "资产分类编号", tooltip: true, width: 110, key: "LK_ZICHANFENLEIBIANHAO", tipsKey: "LK_ZICHANFENLEIBIANHAOTIPS", /* tips: "13：模具<br/>14：夹具<br/>15：检具<br/>16：其他工装" */ },
  { props: "modeTotalLife", name: "工装寿命", tooltip: true, key: "LK_GONGZHUANGSHOUMING" },
  { props: "assembledPartPrjCode", name: "FS No.", tooltip: true, key: "LK_FSNO" },
  { props: "carModeCode", name: "车型", tooltip: true, key: "LK_CHEXING" },
  { props: "supplierPartNameList", name: "散件名称", tooltip: true, width: 90, key: "LK_SANJIANMINGCHENG", tipsKey: "LK_SANJIANMINGCHENGTIPS", /* tips: "一次件总成零件号" */ },
  { props: "supplierPartCodeList", name: "散件零件号", tooltip: true, width: 110, key: "LK_SANJIANLINGJIANHAO", tipsKey: "LK_SANJIANLINGJIANHAOTIPS", /* tips: "<p style='text-align: center'>散件零件号<br/>(若无，则用总成号)</p>" */ },
  { props: "quantity", name: "数量", width: 70, tooltip: true, key: "LK_SHULIANG", tipsKey: "LK_SHULIANGTIPS", /* tips: "<p style='text-align: center'>必须为整数</p>" */ },
  { props: "assetUnitPrice", name: "资产单价", tooltip: true, width: 90, key: "LK_ZICHANDANJIA", tipsKey: "LK_ZICHANDANJIATIPS2", /* tips: "<p style='text-align: center'>不含税价格，<br/>并且保留四位小数</p>" */ },
  { props: "totalPrice", name: "资产总额", tooltip: true, key: "LK_ZICHANZONGE" },
  { props: "isShared", name: "是否分摊", width: 110, tooltip: true, key: "LK_SHIFOUFENTAN" }
]

export const assetTypeCodeOptions = [
  { label: "13", value: 13 },
  { label: "14", value: 14 },
  { label: "15", value: 15 },
  { label: "16", value: 16 }
]

export const developmentCostInfos = [
  { props: "rfqDevFeeTotal", name: "RFQ开发费用总计", key: "LK_RFQKAIFAFEIYONGZONGJI" },
  { props: "devFee", name: "开发费用", key: "LK_KAIFAFEIYONG",languageKey:'LK_AEKO_KAIFAFEIHEJI',languageName:'开发费合计' },
  { props: "shareDevFee", name: "分摊开发费用", key: "LK_FENTANKAIFAFEIYONG" },
  { props: "shareQuantity", name: "分摊数量", key: "LK_FENTANSHULIANG" },
  { props: "unitPrice", name: "单件开发成本", key: "LK_DANJIANKAIFACHENGBEN" }
]

export const developmentCostTableTitle = [
  { props: "item", name: "开发费项目", tooltip: true, key: "LK_KAIFAFEIXIANGMU" },
  { props: "itemDescription", name: "描述", tooltip: true, width: 400, key: "LK_MIAOSHU" },
  { props: "unitPrice", name: "单价", tooltip: true, key: "LK_DANJIA" },
  { props: "quantity", name: "数量", tooltip: true, key: "LK_SHULIANG" },
  { props: "total", name: "总金额", tooltip: true, key: "LK_ZONGJINE" },
  { props: 'isShared', name: '是否分摊', width: 110, tooltip: true, key: "LK_SHIFOUFENTAN" }
]

export const statesFilter = function(val) {
  const map = {
    0: "否",
    1: "是"
  }

  return map[val] ? map[val] : val
}