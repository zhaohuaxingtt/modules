/*
 * @Author: wentliao
 * @Date: 2021-08-25 09:56:39
 * @Description: 
 */
export const infoItems = [
  { props: "partNum", key: "LINGJIANHAO", name: "零件号", permissionKey: "AEKO_QUOTATION_DETAIL_TEXT_LINGJIANHAO|零件号" },
  { props: "originalPartNum", key: "YUANLINGJIANHAO", name: "原零件号", permissionKey: "AEKO_QUOTATION_DETAIL_TEXT_YUANLINGJIANHAO|原零件号" },
  { props: "partName", key: "LINGJIANMINGCHENG", name: "零件名称", permissionKey: "AEKO_QUOTATION_DETAIL_TEXT_LINGJIANMINGCHENG|零件名称" },
  { props: "supplierCode", key: "GONGYINGSHANGSAPHAO", name: "供应商SAP号", permissionKey: "AEKO_QUOTATION_DETAIL_TEXT_GONGYINGSHANGSAPHAO|供应商SAP号" },
  { props: "supplierShortName", key: "GONGYINGSHANGJIANCHENG", name: "供应商简称", permissionKey: "AEKO_QUOTATION_DETAIL_TEXT_GONGYINGSHANGJIANCHENG|供应商简称" },
  { props: "procureFactory", key: "CAIGOUGONGCHANG", name: "采购工厂", permissionKey: "AEKO_QUOTATION_DETAIL_TEXT_CAIGOUGONGCHANG|采购工厂" },
  { props: "quotationStatus", key: "BAOJIAZHUANGTAI", name: "报价状态", permissionKey: "AEKO_QUOTATION_DETAIL_TEXT_BAOJIAZHUANGTAI|报价状态" },
  { props: "hasDelegateQuotation", key: "DAIBAOJIA", name: "代报价", permissionKey: "AEKO_QUOTATION_DETAIL_TEXT_DAIBAOJIA|代报价" }
]

export const tableTitle = [
  { props: "originalAPrice", key: "YUANAJIA", name: "原A价", tooltip: true },
  { props: "apriceChange", key: "AJIABIANDONGHANFENTAN", name: "A价变动(含分摊)", tooltip: true },
  { props: "aprice", key: "XINAJIA", name: "新A价", tooltip: true },
  { props: "originBnkFee", key: "YUANBNKJIA", name: "原BNK价", tooltip: true },
  { props: "bnkFee", key: "XINBNKJIA", name: "新BNK价", tooltip: true },
  { props: "toolingCost", key: "MUJUTOUZIBIANDONG", name: "模具投资变动", tooltip: true },
  { props: "developmentCost", key: "KAIFAFEI", name: "开发费", tooltip: true },
  { props: "terminationPrice", key: "ZHONGZHIFEI", name: "终止费", tooltip: true },
  { props: "sampleCost", key: "YANGJIANFEI", name: "样件费", tooltip: true },
  { props: "currency", key: "HUOBI", name: "货币", tooltip: true },
  { props: "measureUnit", key: "JILIANGDANWEI", name: "计量单位", tooltip: true }
]
