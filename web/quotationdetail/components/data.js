/*
 * @Author: ldh
 * @Date: 2021-04-21 19:14:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-10-27 19:43:24
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\data.js
 */
import { numberProcessor } from "@/utils"

export const partInfoItems =(isGS) => [
  { props: "rfqId", name: "RFQ编号", key: "RFQBIANHAO" },
  { props: "supplier", name: "RFQ供应商", key: "LK_RFQGONGYINGSHANG" },
  { props: "round", name: "报价轮次", key: "LK_BAOJIALUNCI" },
  { props: "currentRoundsEndTime", name: "报价截至时间", key: "LK_BAOJIAJIEZHISHIJIAN" },
  { props: "partNum", name: "零件号", key: "LK_LINGJIANHAO" },
  { props: "partNameZh", name: "零件名（中）", key: "LK_LINGJIANMINGZHONG" },
  { props: "partNameDe", name: "零件名（德）", key: "LK_LINGJIANMINGDE" },
  { props: "unit", name: "零件单位", key: "LK_LINGJIANDANWEI" },
  { props: `${isGS}`, name: "车型", key: "LK_CHEXING" },
  { props: "cartypeProjectZh", name: "车型项目", key: "LK_CHEXINGXIANGMU" },
  { props: "procureFactoryName", name: "采购工厂", key: "LK_CAIGOUGONGCHANG" },
  { props: "referenceRate", name: "参考汇率", key: "LK_CANKAOHUILV" },
  { props: "quotationStateDesc", name: "报价状态", key: "LK_BJZT" },
  { props: "submitDate", name: "报价日期", key: "LK_BAOJIARIQI" },
  { props: "contactPerson", name: "联系人", key: "LK_LIANXIREN" },
  { props: "rejectReason", name: "拒绝理由", key: "LK_JUJUELIYOU" },
  { props: "currencyCode", name: "货币", key: "LK_HUOBI" },
  { props: "purchaseClause", name: "采购条款", key: "LK_CAIGOUTIAOKUAN" },
  { props: "payClause", name: "支付条款", key: "LK_ZHIFUTIAOKUAN" },
  { props: "memo", name: "询价备注", key: "LK_XUNJIABEIZHU" }
]

export const DBItems = [
  "currencyCode", // 货币
  "purchaseClause", // 采购条款
  "payClause" // 支付条款
]

export const handleInputByNumber = function (value, key, row, precision, cb, negative) {
  this.$set(row, key, numberProcessor(value, precision, negative))

  if (typeof cb === "function") {
    cb(value, key, row)
  }
}