/*
 * @Author: your name
 * @Date: 2021-09-14 20:31:03
 * @LastEditTime: 2021-10-28 21:42:11
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \front-modules\web\config\index.js
 */
const enums = {
  "RFQ_STATE_ENUM": { // RFQ状态
    "NO_INQUIRY": "NOT_REQ", // 未询价
    "INQUIRY_ING": "IN_REQ", // 询价中
    // "HAS_INQUIRY": "02", // 已询价
    "NEGOTIATE_ING": "IN_NEGO_PROC", // 谈判中
    "VEER_NEGOTIATE": "TO_NEGO", // 转谈判
    "VEER_ENQUIRY": "TO_REQ", // 转询价
    "NEGOTIATE_END": "NEGO_COMPLETE", // 谈判完成
    "NON_CONFIRM_BOM": "TO_CONFIRMED", // 待确认BOM
    "END_CONFIRM_BOM": "CONFIRMED", // 已确认BOM
    "END_RFQ": "CLOSED", // 已关闭
    "END_POINT": "NOMINATED", // 已定点
  },
  "PART_QUOTATION_STATE_ENUM": { // 零件报价状态
    "NOT_QUOTED": "WAITING", // 待接受
    "ACCEPT": "ACCEPT", // 已接受
    "REFUSE": "REFUSE", // 已拒绝
    "DRAFT": "DRAFT", // 草稿
    "SUBMITTED": "SUBMITTED", // 已提交
    "DELEGATE_ACCEPT": "DELEGATE_ACCEPT", // 代接受报价
    "DELEGATE_REFUSE": "DELEGATE REFUSE", // 代拒绝
    "DELEGATE_DRAFT": "DELGATE DRAFT", // 代报价草稿
    "DELEGATE_SUBMITTED": "DELGATE SUBMITTED" // 代报价提交 
  },
  "PURCHASE_PROJECT_STATE_ENUM": { // 零件采购项目状态
    "NO_PROJECT_NUM": "NO_NR", // 无采购项目编号
    "NO_RFQ": "NOT_IN_RFQ", // 未加入RFQ
    "HAS_RFQ": "IN_RFQ", // 已加入RFQ
    "APPLICATION_DESIGNAT": "APPLIED_NOM", // 已申请定点
    "FROZEN": "FROZEN_NOM", // 已冻结
    "DESIGNATED": "NOMINATED", // 已定点
    "END": "CANCELED", // 已结束
    "CANCEL": "STOP" // 已取消
  },
  "RFQ_ROUNDS_STATE_ENUM": { // RFQ轮次状态
    "CLOSED": "CLOSED", // 已关闭
    "RUNNING": "RUNNING" // 进行中
  }
}

Object.freeze(enums)

export const getEnumValue = function(fullKey) {
  try {
    const keys = fullKey.split(/\./)

    const result = keys.reduce((acc, cur) => {
      return acc[cur] ? acc[cur] : undefined
    }, enums)

    return typeof result === "object" ? "" : result
  } catch {
    return ""
  }
}
export const roundsType = {
  zxjjys:'biddingRound'
}