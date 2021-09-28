// 校验定点申请状态
export const getNominateDisabled = function(data) {
    const isPriceConsistent = data.isPriceConsistent // 一次性校验
    const applicationStatus = data.applicationStatus // 定点申请状态
    if (!applicationStatus) return false

    switch(data.designateType) {
    case "MEETING": // 上会
        const disabledCodes = ["FREERE", "M_CHECK_INPROCESS", "M_CHECK_FAIL", "NOMINATE"] // 冻结, M审批中, M退回, 定点
        if (isPriceConsistent) return disabledCodes.concat(["PASS", "CHECK_INPROCESS", "CHECK_PASS", "CHECK_FAIL"]).includes(applicationStatus) // 通过一致性校验 已通过, 复核中, 复核通过, 复核未通过

        return disabledCodes.includes(applicationStatus)
    case "TRANFORM": // 流转
        return ["FREERE", "ONFLOW", "FINISHFLOW", "NOMINATE"].includes(applicationStatus) // 冻结, 流转中, 流转完成, 定点
    case "RECORD": // 备案
        return ["FREERE", "NOMINATE"].includes(applicationStatus) // 冻结, 定点
    default:
        return true
    }
}