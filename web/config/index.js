
const enums = {
  "RFQ_STATE_ENUM": { // RFQ状态
    "NO_INQUIRY": "00", // 未询价
    "INQUIRY_ING": "01", // 询价中
    // "HAS_INQUIRY": "02", // 已询价
    "NEGOTIATE_ING": "03", // 谈判中
    "VEER_NEGOTIATE": "04", // 转谈判
    "VEER_ENQUIRY": "05", // 转询价
    "NEGOTIATE_END": "06", // 谈判完成
    "NON_CONFIRM_BOM": "07", // 待确认BOM
    "END_CONFIRM_BOM": "08", // 已确认BOM
    "END_RFQ": "09", // 已关闭
    "END_POINT": "10", // 已定点
  },
  "PART_QUOTATION_STATE_ENUM": { // 零件报价状态
    "NOT_QUOTED": "0", // 待接受
    "ACCEPT": "1", // 已接受
    "REFUSE": "2", // 已拒绝
    "DRAFT": "3", // 草稿
    "SUBMITTED": "4", // 已提交
    "DELEGATE_ACCEPT": "5", // 代接受报价
    "DELEGATE_REFUSE": "6", // 代拒绝
    "DELEGATE_DRAFT": "7", // 代报价草稿
    "DELEGATE_SUBMITTED": "8" // 代报价提交 
  },
  "PURCHASE_PROJECT_STATE_ENUM": { // 零件采购项目状态
    "NO_PROJECT_NUM": "10", // 无采购项目编号
    "NO_RFQ": "11", // 未加入RFQ
    "HAS_RFQ": "12", // 已加入RFQ
    "APPLICATION_DESIGNAT": "13", // 已申请定点
    "FROZEN": "14", // 已冻结
    "DESIGNATED": "15", // 已定点
    "END": "16", // 已结束
    "CANCEL": "17" // 已取消
  },
  "RFQ_ROUNDS_STATE_ENUM": { // RFQ轮次状态
    "CLOSED": "00", // 已关闭
    "RUNNING": "01" // 进行中
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