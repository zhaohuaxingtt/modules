export const cbdSummaryTableTitle = [
  { props: "materialChange", seq: "2.1", key: "YUANCAILIAOSANJIANCHENGBENBIANDONG", name: "原材料/散件成本变动" },
  { props: "makeCostChange", seq: "2.2", key: "ZHIZAOCHENGBENBIANDONG", name: "制造成本变动" }, 
  { props: "discardCostChange", seq: "2.3", key: "BAOFEICHENGBENBIANDONG", name: "报废成本变动" },
  { props: "manageFeeChange", seq: "2.4", key: "GUANLIFEIBIANDONG", name: "管理费变动" },
  { props: "otherFee", seq: "2.5", key: "QITAFEIYONG", name: "其他费⽤" },
  { props: "profitChange", seq: "2.6", key: "LIRUNBIANDONG", name: "利润变动" },
  { props: "apriceChange", key: "AJIABIANDONG", name: "A价变动" },
]

export const scrapCostTableTitle = [
  { props: "index", name: "#", width: "60" },
  { props: "typeNameByLang", key: "BAOFEICHENGBEN", name: "报废成本", width: "190" },
  { props: "originRatio", renderHeader(h) { return h('span', { domProps: { innerHTML: `${ this.language('YUANBAOFEILV', '原报废率') }(%)` }}) }, width: "110" },
  { props: "ratio", renderHeader(h) { return h('span', { domProps: { innerHTML: `${ this.language('XIANBAOFEILV', '现报废率') }(%)` }}) }, width: "110" },
  { props: "changeAmount", renderHeader(h) { return h('span', { domProps: { innerHTML: `${ this.language('BIANDONGJINE', '变动金额') }(RMB/Pc.)` }}) } },
]

export const manageCostTableTitle = [
  { props: "index", name: "#", width: "60" },
  { props: "typeNameByLang", key: "GUANLIFEI", name: "管理费", width: "190" },
  { props: "originRatio", renderHeader(h) { return h('span', { domProps: { innerHTML: `${ this.language('YUANBILI', '原比例') }(%)` }}) }, width: "110" },
  { props: "ratio", renderHeader(h) { return h('span', { domProps: { innerHTML: `${ this.language('XIANBILI', '现比例') }(%)` }}) }, width: "110" },
  { props: "changeAmount", renderHeader(h) { return h('span', { domProps: { innerHTML: `${ this.language('BIANDONGJINE', '变动金额') }(RMB/Pc.)` }}) } },
]

export const otherCostTableTitle = [
  { props: "index", name: "#", width: "60" },
  { props: "itemTypeNameByLang", key: "QITAFEIYONG", name: "其他费用", width: "170" },
  { props: "shareTotal", key: "JINE", name: "金额", width: "120" },
  { props: "shareQuantity", renderHeader(h) { return h('span', { domProps: { innerHTML: `${ this.language('FENTANSHULIANG', '分摊数量') }(1..n)` }}) }, width: "120" },
  { props: "shareAmount", renderHeader(h) { return h('span', { domProps: { innerHTML: `${ this.language('FENTANJINE', '分摊金额') }(RMB/Pc.)` }}) } },
]

export const profitTableTitle = [
  { props: "index", name: "#", width: "60" },
  { props: "typeNameByLang", key: "LIRUN", name: "利润", width: "190" },
  { props: "originRatio", renderHeader(h) { return h('span', { domProps: { innerHTML: `${ this.language('YUANBILI', '原比例') }(%)` }}) }, width: "110" },
  { props: "ratio", renderHeader(h) { return h('span', { domProps: { innerHTML: `${ this.language('XIANBILI', '现比例') }(%)` }}) }, width: "110" },
  { props: "changeAmount", renderHeader(h) { return h('span', { domProps: { innerHTML: `${ this.language('BIANDONGJINE', '变动金额') }(RMB/Pc.)` }}) } },
]

export const uuidv4 = function() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    let r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const originRowClass = function ({ row }) {
  return row.partCbdType == 0 || row.partCbdType == 1 ? "originRow" : ""
}

export const validateChangeKeysByRawMaterials = [
  "partName",
  "partNumber",
  "supplierName",
  "productionCountry",
  "isSvwAssignPriceParts",
  "quantityUnit",
  "unitPrice",
  "quantity",
  "materialManageCostRate"
]

export const validateChangeKeysByManufacturingCost = [
  "manufacturingMethod",
  "material",
  "machineName",
  "specialDeviceCost",
  "taktTime",
  "taktTimeNumber",
  "directLaborRate",
  "directLaborQuantity",
  "deviceRate",
  "indirectManufacturingRate"
]