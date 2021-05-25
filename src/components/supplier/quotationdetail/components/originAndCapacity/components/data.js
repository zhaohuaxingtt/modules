/*
 * @Author: ldh
 * @Date: 2021-04-22 15:28:33
 * @LastEditors: ldh
 * @LastEditTime: 2021-05-06 19:25:35
 * @Description: In User Settings Edit
 * @FilePath: \front-supplier\src\views\rfqManageMent\quotationdetail\components\originAndCapacity\components\data.js
 */
export const originTableTitle = [
  { props: "factoryCode", name: "工厂编号", tooltip: true, key: "LK_GONGCHANGBIANHAO" },
  { props: "factoryName", name: "工厂名称", tooltip: true, key: "LK_GONGCHANGMINGCHENG" },
  { props: "factoryAbbrName", name: "工厂简称", tooltip: true, key: "LK_GONGCHANGJIANCHENG" },
  { props: "country", name: "国家", tooltip: true, key: "LK_GONGJIA" },
  { props: "province", name: "省份", tooltip: true, key: "LK_SHENGFEN" },
  { props: "city", name: "城市", tooltip: true, key: "LK_CHENGSHI" },
  { props: "address", name: "地址", tooltip: true, key: "LK_DIZHI" },
  { props: "postcode", name: "邮编", tooltip: true, key: "LK_YOUBIAN" },
  { props: "isNominate", name: "是否定点", tooltip: true, key: "LK_SHIFOUDINGDIAN" },
  { props: "effectFlag", name: "是否生效", tooltip: true, key: "LK_SHIFOUSHENGXIAO" }
]

export const originDialogTableTitle = [
  { props: "factoryCode", name: "工厂编号", tooltip: true, key: "LK_GONGCHANGBIANHAO" },
  { props: "factoryName", name: "工厂名称", tooltip: true, key: "LK_GONGCHANGMINGCHENG" },
  // { props: "c", name: "工厂库存", tooltip: true, key: "" },
  { props: "country", name: "国家", tooltip: true, key: "LK_GONGJIA" },
  { props: "province", name: "省份", tooltip: true, key: "LK_SHENGFEN" },
  { props: "city", name: "城市", tooltip: true, key: "LK_CHENGSHI" }
]

export const capacityTableTitle = [
  { props: "leadTime", name: "提前准备期(周)", require: true, tooltip: true, key: "LK_TIQIANZHUNBEIQIZHOU" },
  { props: "workDayWeek", name: "每周工作天数", require: true, tooltip: true, key: "LK_MEIZHOUGONGZUOTIANSHU" },
  { props: "weekDailyShift", name: "每天班数", require: true, tooltip: true, key: "LK_MEITIANBANSHU" },
  { props: "weekManufactureCapability", name: "周正常产能", require: true, tooltip: true, key: "LK_ZHOUZHENGCHANGCHANNENG" },
  { props: "maxWeekManufactureCapability", name: "周最大产能", require: true, tooltip: true, key: "LK_ZHOUZUIDACHANNENG" },
  { props: "maxWorkDayYear", name: "年最大工作天数", require: true, tooltip: true, key: "LK_NIANZUIDAGONGZUOTIANSHU" },
  { props: "startWeek", name: "起始周", require: true, tooltip: true, key: "LK_QISHIZHOU" },
  { props: 'endWeek', name: '截止周', tooltip: true, key: "LK_JIEZHIZHOU" }
]