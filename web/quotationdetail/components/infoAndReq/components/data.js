/*
 * @Author: ldh
 * @Date: 2021-04-22 11:44:35
 * @LastEditors: ldh
 * @LastEditTime: 2021-05-19 18:46:23
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\infoAndReq\components\data.js
 */
export const infos = [
	{ props: "partProjectTypeDesc", name: "采购项目类型", key: "LK_CAIGOUXIANGMULEIXING" },
	{ props: "categoryName", name: "材料组", key: "LK_CAILIAOZU" },
	{ props: "stuffName", name: "工艺组", key: "LK_GONGYIZU" },
	{ props: "carDosage", name: "每车用量", key: "LK_MEICHEYONGLIANG" },
	{ props: "isNew", name: "是否新件", key: "LK_SHIFOUXINJIAN" },
	{ props: "isInherit", name: "是否沿用件", key: "LK_SHIFOUYANYONGJIAN" },
	{ props: "isUpdate", name: "是否更改件", key: "LK_SHIFOUGENGGAIJIAN" },
	{ props: "drawingDate", name: "图纸日期", key: "LK_TUZHIRIQI" },
	{ props: "originalPartNum", name: "原零件号", key: "LK_YUANLINGJIANHAO" }
]

export const outputPlanTableTitle = [
	{ props: "carTypeProjectZh", name: "车型项目", tooltip: true, key: "LK_CHEXINGXIANGMU" },
	{ props: "sopDate", name: "SOP时间", tooltip: true, key: "LK_SOPSHIJIAN" },
	{ props: "lifeCycle", name: "生命周期（周）", tooltip: true, key: "LK_SHENGMINGZHOUQIZHOU" },
	{ props: "averageAnnualOutput", name: "平均年产量", tooltip: true, key: "LK_PINGJUNNIANCHANLIANG" },
	{ props: "maxAnnualOutput", name: "最大年产量", tooltip: true, key: "LK_ZUIDANIANCHANLIANG" }
]

export const svwContactTableTitle = [
	{ props: "department", name: "部门", tooltip: true, key: "LK_BUMEN" },
	{ props: "role", name: "角色", tooltip: true, key: "LK_JUESE" },
	{ props: "nameZh", name: "姓名", tooltip: true, key: "LK_XINGMING" },
	{ props: "mobile", name: "电话", tooltip: true, key: "LK_DIANHUA" },
	{ props: "email", name: "邮箱", tooltip: true, key: "LK_YOUXINAG" }
]

export const projectScheduleTableTitle = [
	{ props: "modelNameZh", name: "车型", tooltip: true, key: "LK_CHEXING" },
	{ props: "carTypeProjectZh", name: "车型项目", tooltip: true, key: "LK_CHEXINGXIANGMU" },
	{ props: "lifeCycle", name: "生命周期", tooltip: true, key: "LK_SHENGMINGZHOUQI" },
	{ props: "vff", name: "VFF", tooltip: true, key: "LK_VFF" },
	{ props: "pvs", name: "PVS", tooltip: true, key: "LK_PVS" },
	{ props: "os", name: "OS", tooltip: true, key: "LK_OS" },
	{ props: "sopDate", name: "SOP", tooltip: true, key: "LK_SOP" }
]

export const attachmentTableTitle = [
	{ props: "fileTruename", name: "文件名称", tooltip: true, key: "LK_WENJIANMINGCHENG" },
	{ props: "fileSize", name: "大小", tooltip: true, key: "LK_DAXIAO" },
	{ props: "createDate", name: "上传日期", tooltip: true, key: "LK_SHANGCHUANRIQI" },
	{ props: "createUserName", name: "上传人", tooltip: true, key: "LK_SHANGCHUANREN" }
]