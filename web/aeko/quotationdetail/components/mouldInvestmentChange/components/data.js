export const mouldCostInfos = [
  { props: "totalPrice", name: "总投资变动成本", key: "ZONGTOUZIBIANDONGCHENGBEN" },
  { props: "shareTotal", name: "分摊投资变动成本", key: "FENTANTOUZIBIANDONGCHENGBEN" },
  { props: "shareQuantity", name: "分摊数量", key: "LK_FENTANSHULIANG", require:true },
  { props: "shareAmount", name: "单件投资变动成本", key: "DANJIANTOUZICHENGBENBIANDONG" }
]

export const moduleTableTitle = [
  { props: "mouldId", key: "MUJUID", name: "模具ID", width: 120 },
  { props: "isShared", key: "SHIFOUFENTAN", name: "是否分摊", width: 120, require:true },
  { props: "changeType", key: "BIANGENGLEIXING", name: "变更类型", width: 100, require:true },
  { props: "fixedAssetsName", key: "GUDINGZICHANMINGCHENG", name: "固定资产名称", tipsLang: true, tipsKey: "GUDINGZICHANMINGCHENGTIPS", tips: "由“零件总成名称”、“散件名称”、 “工模具种类”组成", width: 150 },
  { props: "stuffType", key: "GONGYILEIXING", name: "工艺类型", tipsLang: true, tipsKey: "GONGYILEIXINGTIPS", tips: "如注塑，冲压，电镀等", width: 120, require:true },
  { props: "mouldType", key: "GONGMUJUZHONGLEI", name: "工模具种类", tipsLang: true, tipsKey: "GONGMUJUZHONGLEITIPS", tips: "如：热流道注塑模", width: 135, require:true },
  { props: "assetTypeCode", key: "ZICHANFENLEIBIANHAO", name: "资产分类编号", tipsLang: true, tipsKey: "ZICHANFENLEIBIANHAOTIPS", tips: "13：模具<br/>14：夹具<br/>15：检具<br/>16：其他工装", width: 150, require:true },
  { props: "assembledPartPrjCode", key: "FSHAO", name: "FS号", width: 120 },
  { props: "supplierPartNameList", key: "SANJIANMINGCHENG", name: "散件名称", tipsLang: true, tipsKey: "SANJIANMINGCHENGTIPS", tips: "<p style='text-align: center'>零部件名称</p>", width: 120, require:true },
  { props: "supplierPartCodeList", key: "SANJIANLINGJIANHAO", name: "散件零件号", tipsLang: true, tipsKey: "SANJIANLINGJIANHAOTIPS", tips: "<p style='text-align: center'>散件零件号<br/>(若无，则用总成号)</p>", width: 135 },
  { props: "quantity", key: "SHULIANG", name: "数量", tipsLang: true, tipsKey: "SHULIANGTIPS", tips: "<p style='text-align: center'>必须为整数</p>", width: 100, require:true },
  { props: "changeUnitPrice", key: "ZICHANBIANDONGDANJIA", name: "资产变动单价", tipsLang: true, tipsKey: "ZICHANBIANDONGDANJIATIPS", tips: "<p style='text-align: center'>不含税价格，<br/>并且保留两位小数</p>", width: 150, require:true },
  { props: "changeTotalPrice", key: "ZICHANBIANDONGZONGE", name: "资产变动总额", width: 120 },
  { props: "originTotalPrice", key: "YUANLINGJIANZICHANZONGE", name: "原零件资产总额", width: 135 },
  { props: "totalPrice", key: "XINLINGJIANZICHANZONGE", name: "新零件资产总额", width: 135 }
]

const isEmpty = (val) => val == false && 0 !== val && '0' !== val || val == null;
const validator = (rule, value, callback)=>{
    if(isEmpty(value)){
        callback(new Error())
    }else{
        callback()
    }
}
export const formRules = {
  shareQuantity:[{ validator, trigger: ["change"] }],
  isShared:[{ validator, trigger: ["blur","change"] }],
  changeType:[{ validator, trigger: ["blur","change"] }],
  stuffType:[{ validator, trigger: ["blur","change"] }],
  mouldType:[{ validator, trigger: ["blur","change"] }],
  assetTypeCode:[{ validator, trigger: ["blur","change"] }],
  supplierPartNameList:[{ validator, trigger: ["blur","change"] }],
  quantity:[{ validator, trigger: ["blur","change"] }],
  changeUnitPrice:[{ validator, trigger: ["blur","change"] }],
  shareQuantity:[{ validator, trigger: ["blur","change"] }],
}

export const sourcePartCBDTableTitle = [
  { props: "bmNum", key: "BMDANHAO", name: "BM单号" },
  { props: "moldId", key: "MUJUID", name: "模具ID" },
  { props: "isShared", key: "SHIFOUFENTAN", name: "是否分摊" },
  { props: "d", key: "BIANGENGLEIXING", name: "变更类型" },
  { props: "assetName", key: "GUDINGZICHANMINGCHENG", name: "固定资产名称", width: 135 },
  { props: "craftType", key: "GONGYILEIXING", name: "工艺类型" },
  { props: "moldType", key: "GONGMUJUZHONGLEI", name: "工模具种类" },
  { props: "assetTypeNum", key: "ZICHANFENLEIBIANHAO", name: "资产分类编号", width: 135 },
  { props: "fsNum", key: "FSHAO", name: "FS号" },
  { props: "partsName", key: "SANJIANMINGCHENG", name: "散件名称" },
  { props: "partsNum", key: "SANJIANLINGJIANHAO", name: "散件零件号" },
  { props: "count", key: "SHULIANG", name: "数量" },
  { props: "assetPrice", key: "ZICHANDANJIA", name: "资产单价" },
  { props: "assetTotal", key: "ZICHANZONGE", name: "资产总额" },
  { props: "bmSerial", key: "BMDANLIUSHUIHAO", name: "BM单流水号" }
]

export const assetTypeCodeOptions = [
  { label: "模具", value: 13 },
  { label: "夹具", value: 14 },
  { label: "检具", value: 15 },
  { label: "其他工装", value: 16 }
]