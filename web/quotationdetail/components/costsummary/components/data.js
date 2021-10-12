/*
 * @Author: your name
 * @Date: 2021-04-23 15:34:54
 * @LastEditTime: 2021-09-10 15:04:48
 * @LastEditors: Hao,Jiang
 * @Description: In User Settings Edit
 * @FilePath: \front-modules\web\quotationdetail\components\costsummary\components\data.js
 */

import {_getMathNumber} from '@/utils'
import {partProjTypes} from '@/config'

export function tableTilel1Fn(level, partType,partname){
  return [
    {props:'materialSummary',name:`${level}.1`,key: 'LK_YUANCRMBPC',tooltip:true,width:'150',type:'input', inputType: 'decimal'},
    {props:'productionSummary',name:`${level}.2`,key: 'LK_ZHIZHAOCB',tooltip:false,width:'',type:'input', inputType: 'decimal'},
    {props:'scrapSummary',name:`${level}.3`,key: 'LK_BAOFEICHENGBEN',tooltip:false,width:'',type:'input', inputType: 'decimal'},
    {props:'manageSummary',name:`${level}.4`,key: 'LK_GUANLIFEI',tooltip:false,width:'',type:'input', inputType: 'decimal'},
    {props:'otherSummary',name:`${level}.5`,key: 'LK_QITAFEIYONG',tooltip:false,width:'' },
    {props:'profitSummary',name:`${level}.6`,key: 'LK_LIRUN',tooltip:false,width:'',type:'input', inputType: 'decimal'},
    {props:'totalPrice',name:'A价',key: 'LK_AJIA',tooltip:false,width:'' },
    // 若某一零件的零件类型为[加工装配费]，我可以看到汇总表头上多显示两列：[LC件管理费率][CKD件管理费率]
    ...(partType === 'S' ? [
      {props:'lcManageRate',name:'LC件管理费率',key: 'LK_LCJIANGUANLIFEILV',tooltip:false,width:'',type:'inputRate' },
      {props:'ckdManageRate',name:'CKD件管理费率',key: 'LK_CKDJIANGUANLIFEILV',tooltip:false,width:'',type:'inputRate' },
    ] : []),
    // 供应商配件与附件的包装运输页面移除，报价成本汇总页面能够直接填写[原材料/散件成本][制造成本][报废成本][管理费][利润][包装费][运输费][操作费]，
    {props:'packageCost',name:'包装费',key: 'LK_BAOZHUANGFEI',tooltip:false,width:'',type: partname === partProjTypes.PEIJIAN || partname === partProjTypes.FUJIAN ? 'input': '', inputType: 'decimal' },
    {props:'transportCost',name:'运输费',key: 'LK_YUNSHUFEI',tooltip:false,width:'',type: partname === partProjTypes.PEIJIAN || partname === partProjTypes.FUJIAN ? 'input': '', inputType: 'decimal' },
    {props:'operateCost',name:'操作费',key: 'LK_CAOZUOFEI',tooltip:false,width:'',type: partname === partProjTypes.PEIJIAN || partname === partProjTypes.FUJIAN ? 'input': '', inputType: 'decimal' },
    {props:'totalPriceBprice',name:'B价',key: 'LK_BJIA',tooltip:false,width:'' },
  ]
}
/**
 * @description: 需要合并到第一个接口的数据
 * @param {*}
 * @return {*}
 */
export const needContactData = ['packageCost','transportCost','operateCost']
/**
 * @description: A价格
 * @param {*}
 * @return {*}
 */
 export const Aprice = ['materialSummary','productionSummary','scrapSummary','manageSummary','otherSummary','profitSummary']
 /**
 * @description: B价格
 * @param {*}
 * @return {*}
 */
  export const Bprice = ['materialSummary','productionSummary','scrapSummary','manageSummary','otherSummary','profitSummary','packageCost','transportCost','operateCost']
/**
 * @description: 百分比表 
 * @param {*}
 * @return {*}
 */
export const persentDatalist = [
  {
    name:'原材料/散件成本',
    key:'LK_YUANCRMBPC',
    persent:'0%(0)',
    color:'rgba(23, 99, 247, 1)',
  },
  {
    name:'制造成本',
    persent:'0%(0)',
    key:'LK_ZHIZHAOCB',
    color:'rgba(22, 96, 241, 0.7)'
  },
  {
    name:'报废成本',
    persent:'0%(0)',
    key:'LK_BAOFEICHENGBEN',
    color:'rgba(22, 96, 241, 0.4)'
  },
  {
    name:'管理费',
    persent:'0%(0)',
    key:'LK_GUANLIFEI',
    color:'rgba(22, 96, 241, 0.2)'
  },{
    name:'其他费用',
    persent:'0%(0)',
    key:'LK_QITAFEIYONG',
    color:'rgba(135, 130, 191, 1)'
  },  {
    name:'利润',
    persent:'0%(0)',
    key:'LK_LIRUN',
    color:'rgba(135, 130, 191, 1)'
  }
]

/**
 * @description: 根据一个百分比列表将数据转换为UI数据
 * @param {*} persent
 * @param {*} staticData
 * @return {*}
 */
export function persentTitel(persent,staticData){
  try {
    const persentDatalistTemplate = JSON.parse(JSON.stringify(persentDatalist))
    if(persent.length !== 6) return console.warn('your persent lenght must be 6')
    persent.forEach((element,index) => {
      persentDatalistTemplate[index]['width'] = element
    });
    Aprice.forEach((l,index)=>{
      persentDatalistTemplate[index]['persent'] = `${persent[index]}(${staticData[0][l] || 0})`
    })
    return persentDatalistTemplate
  } catch (error) {
    return []
  }
} 

export const cbdlist = [
  {value:1,label:'L1'},
  {value:2,label:'L2'},
  {value:3,label:'L3'}
]

export const isorno = [
  {label:'是',value:true},
  {label:'否',value:false}
]

export const isornoNum = [
  {label:'是',value:1},
  {label:'否',value:0}
]
/**
 * @description:原材料表格 
 * @param {*}
 * @return {*}
 */
export const titleYcl = (productionCountryList = []) => [
  {props:'partName',name:'类型',key: 'LK_LEIXING',tooltip:true,width:'',type:'input'},
  {props:'partNumber',name:'原材料/散件描述',key: 'LK_YUANCLSJMS',tooltip:true,width:'150',type:'input' },
  {props:'supplierName',name:'供应商名称',key: 'LK_GONGYINGSHANGMINGCHENG',tooltip:true,width:'',type:'input' },
  {props:'productionCountry',name:'原产国',key: 'LK_YUANCHANDI',tooltip:true,width:'',type:'select',options:productionCountryList },
  {props:'isSvwAssignPriceParts',name:'是否SVW指定价格散件',key: 'LK_SHIFOUSVWZHIDINGJIAGE',tooltip:true,width:'150',type:'select',options:isorno },
  {props:'quantityUnit',name:'数量单位（UoM）',key: 'LK_SHULIANGDANWEI',tooltip:true,width:'150',type:'input' },
  {props:'unitPrice',name:'单价（RMB/UoM）',key: 'LK_DANJIARMB',tooltip:true,width:'150',type:'input', inputType: 'decimal' },
  {props:'quantity',name:'数量',key: 'LK_SHULIANG',tooltip:true,width:'',type:'input', inputType: 'decimal' },
  {props:'directMaterialCost',name:'直接原材料/散件成本（RMB/Pc.）',key: 'LK_ZHIJIEYUANCAILIAOSANJIANCHENGBEN',tooltip:true,width:'250', inputType: 'decimal' },
  {props:'tpPartID',name:'物料管理费',key: 'LK_WULAOGLF',tooltip:true,width:'' ,list:[
    {props:'materialManageCostRate',name:'(%)',key: '',tooltip:true,width:'100',type:'input', inputType: 'decimal'},
    {props:'materialManageCost',name:'(RMB/Pc.)',key: '',tooltip:true,width:''}

  ]},
  {props:'materialCost',name:'原材料/散件成本（RMB/Pc.）',key: 'LK_YUANCRMBPC',tooltip:true,width:'200' },
]

/**
 * @description: 制造成本界面
 * @param {*}
 * @return {*}
 */
export const titleCbzz = [
  {props:'manufacturingMethod',name:'制造工序',key: 'LK_ZHIZAOGONGXU',tooltip:true,width:'',type:'input'},
  {props:'material',name:'对应原材料/散件（Ref.-ID）',key: 'LK_DUIYINGYUANCAILIAOSANJIAN',tooltip:true,width:'200',type:'input' },
  {props:'machineName',name:'设备名称/型号（Ref.-Name）',key: 'LK_SHEBEIMINGCHENGXINGHAO',tooltip:true,width:'200',type:'input' },
  {props:'specialDeviceCost',name:'上汽大众专用设备费（RMB）',key: 'LK_SHANGQIDAZHONGZHUANYONGSHEBEIFEI',tooltip:true,width:'200',type:'input', inputType: 'decimal' },
  {props:'taktTime',name:'生产节拍（Sec.）',key: 'LK_SHENGCHANJIEPAISEC',tooltip:true,width:'150',type:'input' },
  {props:'taktTimeNumber',name:'件数/生产节拍（1..n）',key: 'LK_JIANSHUSHENGCHANJIEPAI',tooltip:true,width:'140',type:'input', inputType: 'decimal' },
  {props:'tpPartID',name:'人工成本',key: 'LK_RENGONGCHENGBEN',tooltip:true,width:'',list:[
    {props:'directLaborRate',name:'直接人工费率（RMB/Hour）',key: 'LK_ZHIJIERENGONGFEILV',tooltip:true,width:'180',type:'input', inputType: 'decimal'},
    {props:'directLaborQuantity',name:'直接人工数量（0..n）',key: 'LK_ZHIJIERENGONGSHULIANG',tooltip:true,width:'150',type:'input', inputType: 'decimal'}
  ] },
  {props:'tpPartID',name:'设备费',key: 'LK_SHEBEIFEI',tooltip:true,width:'',list:[
    {props:'deviceRate',name:'设备费率（RMB/Hour）',key: 'LK_SHEBEIFEILV',tooltip:true,width:'180',type:'input', inputType: 'decimal'}
  ] },
  {props:'tpPartID',name:'间接制造成本',key: 'LK_JIANJIEZHIZAOCHENGBEN',tooltip:true,width:'',list:[
    {props:'indirectManufacturingRate',name:'（%）',key: '',tooltip:true,width:'80',type:'input', inputType: 'decimal'},
    {props:'indirectManufacturingAmount',name:'（RMB/Pc.）',key: '',tooltip:true,width:'150'}
  ] },
  {props:'laborCost',name:'人工成本（RMB/Pc.）',key: 'LK_RENGONGCHENGBENRMB',tooltip:true,width:'140' },
  {props:'deviceCost',name:'设备成本（RMB/Pc.）',key: 'LK_SHEBEICHENGBENRMB',tooltip:true,width:'140' },
]


/**
 * @description: 报废成本
 * @param {*}
 * @return {*}
 */
 export const titlebfcb = [
  {props:'ztbfcb',name:'报废成本',key: 'LK_BAOFEICHENGBEN',tooltip:false,width:''},
  {props:'ratio',name:'报废率（%）',key: 'LK_BAOFEILV',tooltip:false,width:'',type:'input', inputType: 'decimal'},
  {props:'amount',name:'金额（RMB/Pc.）',key: 'LK_JINERMB',tooltip:false,width:''},
]
/**
 * @description: 管理费
 * @param {*}
 * @return {*}
 */
 export const titleglf = [
  {props:'typeName',name:'管理费',key: 'LK_GUANLIFEI',tooltip:false,width:''},
  {props:'ratio',name:'比例（%）',key: 'LK_BILI',tooltip:false,width:'',type:'input', inputType: 'decimal'},
  {props:'amount',name:'金额（RMB/Pc.）',key: 'LK_JINERMB',tooltip:false,width:''},
]
/**
 * @description: 管理费
 * @param {*}
 * @return {*}
 */
 export const titleqtfy = [
  {props:'itemName',name:'其他费用',key: 'LK_QITAFEIYONG',tooltip:false,width:''},
  {props:'shareTotal',name:'金额',key: 'LK_JINGEE',tooltip:false,width:''},
  {props:'shareQuantity',name:'分摊数量（1..n）',key: 'LK_FTSULIANG',tooltip:false,width:''},
  {props:'shareAmount',name:'分摊金额（RMB/Pc.）',key: 'LK_FENTANJINE',tooltip:false,width:''}
]

/**
 * @description: 利润
 * @param {*}
 * @return {*}
 */
 export const titlelr = [
  {props:'lr',name:'利润',key: 'LK_LIRUN',tooltip:false,width:''},
  {props:'ratio',name:'比例（%）',key: 'LK_BILI',tooltip:false,width:'',type:'input', inputType: 'decimal'},
  {props:'amount',name:'金额（RMB/Pc.）',key: 'LK_JINERMB',tooltip:false,width:''}
]

/**
 * @description: 利润
 * @param {*}
 * @return {*}
 */
 export const titleCBD = [
  {props:'fileName',name:'文件名称',key: 'LK_WENJIANMINGCHENG',tooltip:false,width:''},
  {props:'fileSize',name:'大小',key: 'LK_WENJIANDAXIAO',tooltip:false,width:''},
  {props:'uploadDate',name:'上传日期',key: 'LK_SHANGCHUANRIQI',tooltip:false,width:''},
  {props:'uploadBy',name:'上传人',key: 'LK_SHANGCHUANREN',tooltip:false,width:''},
]

/**
 * @description: 请求详情需要的数据。
 * @param {*}
 * @return {*}
 */
export const allpagefrom = {
  "quotationId":'12',
  "queryMakeCostDTO": {
    "current": 1,
    "size": 10
  },
  "queryRawMaterialDTO": {
    "current": 1,
    "size": 10
  }
}

/**
 * @description: 获取总价格。
 * @param {*} //Bprice B价 Aprice A价  
 * @return {*}
 */
export function getAallPrice(needAddPirce,data, type, aprice){
  try {
    let allPriceString = ''
    needAddPirce.forEach((items,index)=>{
      allPriceString += (data[items] || 0) + (index == (needAddPirce.length-1)?'':'+')
    })

    if (type === "B" && aprice) {
      allPriceString += "+" + aprice
    }
    
    return _getMathNumber(allPriceString)
  } catch (error) {
    console.warn(error)
  }
}

export function getPersent(total,listData,data) {
  try {
    const persent = []
    listData.forEach((element) => {
      const parsendata = (data[element] || 0)/(total || 0)>0
      if(parsendata){
        persent.push(parseInt(_getMathNumber(`${(data[element] || 0)+'/'+(total || 0)}*100`))+'%') 
      }else{
        persent.push(0)
      }
    });
    return persent
  } catch (error) {
    console.warn(error)
  }
}

/**
 * @description: L3原材料/散件成本
 * @param {*}
 * @return {*}
 */
export const titleYclByL3 = (productionCountryList = []) => 
[
  {props:'partName',name:'类型',key: 'LK_LEIXING',tooltip:true,width:'',type:'input'},
  {props:'partNumber',name:'原材料/散件描述',key: 'LK_YUANCLSJMS',tooltip:true,width:'150',type:'input' },
  {props:'materialBrand',name:'原材料牌号',key: 'LK_YUANCAILIAOPAIHAO',tooltip:true,width:'130',type:'input' },
  {props:'supplierName',name:'供应商名称',key: 'LK_GONGYINGSHANGMINGCHENG',tooltip:true,width:'120',type:'input' },
  {props:'productionCountry',name:'原产国',key: 'LK_YUANCHANDI',tooltip:true,width:'120',type:'select',options:productionCountryList},
  {props:'isSvwAssignPriceParts',name:'是否SVW指定价格散件',key: 'LK_SHIFOUSVWZHIDINGJIAGE',tooltip:true,width:'200',type:'select',options:isorno, labelClassName: '' },
  {props:'quantityUnit',name:'数量单位（UoM）',key: 'LK_SHULIANGDANWEI',tooltip:true,width:'150',type:'input' },
  {props:'unitPrice',name:'单价（RMB/UoM）',key: 'LK_DANJIARMB',tooltip:true,width:'150',type:'input', inputType: 'decimal' },
  {props:'roughWeight',name:'毛重',key: 'LK_MAOZHONG',tooltip:true,type:'input', inputType: 'decimal' },
  {props:'suttleWeight',name:'净重',key: 'LK_JINGZHONG',tooltip:true,type:'input', inputType: 'decimal' },
  {props:'recycleUnitPrice',name:'回收单价（RMB/UoM）',key: 'LK_HUISHOUDANJIARMBUOM',width:'150',tooltip:true,type:'input', inputType: 'decimal' },
  {props:'directMaterialCost',name:'直接原材料/散件成本（RMB/PC.）',key: 'LK_ZHIJIEYUANCAILIAOSANJIANCHENGBENRMBPC',width:'180',tooltip:true },
  {props:'lossCostGroup',name:'废损',key: 'LK_FEISUN',tooltip:true,width:'' ,list:[
    {props:'lossCostRate',name:'(%)',key: '',tooltip:true,width:'100',type:'input', inputType: 'decimal'},
    {props:'lossCost',name:'(RMB/PC.)',key: '',tooltip:true,width:''}
  ]},
  {props:'earlierLogisticsCost',name:'前期物流费用（RMB/PC.）',width: '200' ,key: 'LK_QIANQIWULIUFEIYONGRMBPC',tooltip:true,type:'input' , inputType: 'decimal'},
  {props:'indirectMaterialCostGroup',name:'间接原材料/散件成本',key: 'LK_JIANJIEYUANCAILIAOSANJIANCHENGBEN',tooltip:true,width:'' ,list:[
    {props:'indirectMaterialCostRatio',name:'(%)',key: '',tooltip:true,width:'100',type:'input', inputType: 'decimal'},
    {props:'indirectMaterialCost',name:'(RMB/PC.)',key: '',tooltip:true,width:''}
  ]},
  {props:'materialCost',name:'原材料/散件成本（RMB/PC.）',key: 'LK_YUANCRMBPCUP',tooltip:true,width:'200' },
]

/**
 * @description: L3制造成本
 * @param {*}
 * @return {*}
 */
export const titleCbzzByL3 = [
  {props:'manufacturingMethod',name:'制造工序',key: 'LK_ZHIZAOGONGXU',tooltip:true,width:'',type:'input'},
  {props:'material',name:'对应原材料/散件（Ref.-ID）',key: 'LK_DUIYINGYUANCAILIAOSANJIAN',tooltip:true,width:'200',type:'input' },
  {props:'machineName',name:'设备名称/型号',key: 'LK_SHEBEIMINGCHENGXINGHAOOTHER',tooltip:true,width:'200',type:'input' },
  {props:'machineInvestInstall',name:'设备投资+安装（RMB）',key: 'LK_SHEBEITOUZIANZHUANGRMB',tooltip:true,width:'200',type:'input', inputType: 'decimal' },
  {props:'specialDeviceCost',name:'是否上汽大众专用设备费',key: 'LK_SHIFOUSHANGQIDAZHONGZHUANYONGSHEBEIFEI',tooltip:true,width:'200',type:'select',options:isornoNum, labelClassName: '' },
  {props:'perHourMachineCost',name:'设备费率（RMB/Hour）',key: 'LK_SHEBEIFEILV',tooltip:true,width:'180',type:'input', inputType: 'decimal'},
  {props:'perHourLaborCost',name:'直接人工费率（RMB/Hour）',key: 'LK_ZHIJIERENGONGFEILV',tooltip:true,width:'180',type:'input', inputType: 'decimal'},
  {props:'workerCount',name:'直接人工数量（0..n）',key: 'LK_ZHIJIERENGONGSHULIANG',tooltip:true,width:'150',type:'input', inputType: 'decimal'},
  {props:'perProduceTime',name:'每件生产时间（sec.）',key: 'LK_MEIJIANSHNEGCHANSHIJIAN',tooltip:true,width:'150',type:'input', inputType: 'decimal'},
  {props:'perCycleCount',name:'每模生产零件数',key: 'LK_MEIMUSHENGCHANLINGJIANSHU',tooltip:true,width:'150',type:'input', inputType: 'decimal'},
  {props:'directProduceCost',name:'直接制造成本（RMB/PC.）',key: 'LK_ZHIJIEZHIZAOCHENGBENRMBPC',tooltip:true,width:'150', inputType: 'decimal'},
  {props:'lossCostGroup',name:'废损',key: 'LK_FEISUN',tooltip:true,width:'' ,list:[
    {props:'lossCostRate',name:'(%)',key: '',tooltip:true,width:'100',type:'input', inputType: 'decimal'},
    {props:'lossCost',name:'(RMB/PC.)',key: '',tooltip:true,width:''}
  ]},
  {props:'produceSwitchCost',name:'生产切换成本（RMB/PC.）',key: 'LK_SHENGCHANQIEHUANCHENGBEN',tooltip:true,width:'150',type:'input', inputType: 'decimal'},
  {props:'indirectMaterialCostGroup',name:'间接制造成本',key: 'LK_JIANJIEZHIZAOCHENGBEN',tooltip:true,width:'' ,list:[
    {props:'indirectProduceCostRate',name:'(%)',key: '',tooltip:true,width:'100',type:'input', inputType: 'decimal'},
    {props:'indirectProduceCost',name:'(RMB/PC.)',key: '',tooltip:true,width:''}
  ]},
  {props:'totalCost',name:'总制造成本（RMB/PC.）',key: 'LK_ZONGZHIZAOCHENGBENRMBPC',tooltip:true,width:'200' },
]

/**
 * @description: L3报废成本
 * @param {*}
 * @return {*}
 */
export const titlebfcbByL3 = [
  {props:'ztbfcb',name:'报废成本',key: 'LK_BAOFEICHENGBEN',tooltip:false,width:''},
  {props:'ratio',name:'报废率（%）',key: 'LK_BAOFEILV',tooltip:false,width:''},
  {props:'amount',name:'金额（RMB/Pc.）',key: 'LK_JINERMB',tooltip:false,width:''},
]

/**
 * @description: L3管理费
 * @param {*}
 * @return {*}
 */
 export const titleglfByL3 = [
  {props:'typeName',name:'管理费',key: 'LK_GUANLIFEI',tooltip:false,width:''},
  {props:'ratio',name:'比例（%）',key: 'LK_BILI',tooltip:false,width:'',type:'input', inputType: 'decimal'},
  {props:'amount',name:'金额（RMB/Pc.）',key: 'LK_JINERMB',tooltip:false,width:''},
  {props:'blockAmount',name:'模块金额（RMB/block）',key: 'LK_MUKUAIJINERMBBLOCK',tooltip:false,width:''},
]

/**
 * @description: L3其他费用
 * @param {*}
 * @return {*}
 */
 export const titleqtfyByL3 = [
  {props:'itemType',name:'其他费用',key: 'LK_QITAFEIYONG',tooltip:false,width:''},
  {props:'shareTotal',name:'金额',key: 'LK_JINGEE',tooltip:false,width:''},
  {props:'shareQuantity',name:'分摊数量（1..n）',key: 'LK_FTSULIANG',tooltip:false,width:''},
  {props:'shareAmount',name:'分摊金额（RMB/Pc.）',key: 'LK_FENTANJINE',tooltip:false,width:''}
]

/**
 * @description: L3利润
 * @param {*}
 * @return {*}
 */
 export const titlelrByL3 = [
  {props:'typeName',name:'利润',key: 'LK_LIRUN',tooltip:false,width:''},
  {props:'ratio',name:'比例（%）',key: 'LK_BILI',tooltip:false,width:'',type:'input', inputType: 'decimal'},
  {props:'amount',name:'金额（RMB/Pc.）',key: 'LK_JINERMB',tooltip:false,width:''},
  {props:'blockAmount',name:'模块金额（RMB/block）',key: 'LK_MUKUAIJINERMBBLOCK',tooltip:false,width:''},
]

export const tableTitleDB = [
  {props: 'name', name: '项目类型', key: 'XIANGMULEIXING', tooltip: true, width: ''},
  {props: 'fee', name: '金额', key: 'JINE', tooltip: true, width: '', children: [
    {props: 'seaPrice', name: '海运', key: 'HAIYUN', type: 'input', editable: true},
    {props: 'airPrice', name: '空运', key: 'KONGYUN', type: 'input', editable: true}
  ]},
  {props: 'remark', name: '备注', key: 'BEIZHU', type: 'input', editable: true}
]

export const tableDataDB = [
  {name: '出厂价 Ex-work', seaPrice: '10', airPrice: '10', remark: ''},
  {name: '离岸价 FOB', seaPrice: '10', airPrice: '10', remark: '原供应商 Original Supplier'},
  {name: '到岸价 CIF(=1+6+7+8+9+10)', seaPrice: '10', airPrice: '10', remark: ''},
  {name: '未完税交货 DDU', seaPrice: '10', airPrice: '10', remark: ''},
  {name: '完税交货 DDP', seaPrice: '10', airPrice: '10', remark: ''},
  {name: '管理费用 Management expenses', seaPrice: '10', airPrice: '10', remark: ''},
  {name: '包装费 Packing Cost', seaPrice: '10', airPrice: '10', remark: ''},
  {name: '运保费 Transport Cost and Ensurance', seaPrice: '10', airPrice: '10', remark: ''},
  {name: '产品利润 Profit', seaPrice: '10', airPrice: '10', remark: ''},
  {name: '其他费用 Others', seaPrice: '10', airPrice: '10', remark: 'Audi/Skoda 许可费',remarkDisabled: true},
  {name: '原材料补差 MTZ', noairPrice: true, seaPrice: '10', type: 'select', selectOption: '', remark: ''},
  {name: '模具投资 Tooling investment', seaPrice: '10', airPrice: '10', remark: ''},
  {name: '起步生产SOP (YYYY-MM-DD)', sopDate: '', noairPrice: true, seaPrice: '10', type: 'date', remark: ''},
  {name: '产能信息 Capacity', capacity: '', seaPrice: '10', airPrice: '10', remark: '', allRow: true},
]

export const mockData = [
  {
    "id": "1410545871969640449",
    "quotationId": null,
    "name": "出⼚价 Ex-work",
    "isRequire": false,
    "remark": null,
    "isReduce": null,
    "sopDate": null,
    "seaPrice": null,
    "airPrice": null,
    "capacity": null,
    "createBy": null,
    "createDate": "2021-07-01T18:28:37.209",
    "updateBy": null,
    "updateDate": "2021-07-01T18:28:37.209",
    "isDelete": false,
    "sortOrder": 1
  },
  {
    "id": "1410545871969640450",
    "quotationId": null,
    "name": "离岸价FOB",
    "isRequire": false,
    "remark": null,
    "isReduce": null,
    "sopDate": null,
    "seaPrice": null,
    "airPrice": null,
    "capacity": null,
    "createBy": null,
    "createDate": "2021-07-01T18:28:37.209",
    "updateBy": null,
    "updateDate": "2021-07-01T18:28:37.209",
    "isDelete": false,
    "sortOrder": 2
  },
  {
    "id": "1410545871978029057",
    "quotationId": null,
    "name": "到岸价 CIF(=1+6+7+8+9+10)",
    "isRequire": false,
    "remark": null,
    "isReduce": null,
    "sopDate": null,
    "seaPrice": null,
    "airPrice": null,
    "capacity": null,
    "createBy": null,
    "createDate": "2021-07-01T18:28:37.209",
    "updateBy": null,
    "updateDate": "2021-07-01T18:28:37.209",
    "isDelete": false,
    "sortOrder": 3
  },
  {
    "id": "1410545871978029058",
    "quotationId": null,
    "name": "未完税交货 DDU",
    "isRequire": false,
    "remark": null,
    "isReduce": null,
    "sopDate": null,
    "seaPrice": null,
    "airPrice": null,
    "capacity": null,
    "createBy": null,
    "createDate": "2021-07-01T18:28:37.209",
    "updateBy": null,
    "updateDate": "2021-07-01T18:28:37.209",
    "isDelete": false,
    "sortOrder": 4
  },
  {
    "id": "1410545871978029059",
    "quotationId": null,
    "name": "完税交货DDP",
    "isRequire": false,
    "remark": null,
    "isReduce": null,
    "sopDate": null,
    "seaPrice": null,
    "airPrice": null,
    "capacity": null,
    "createBy": null,
    "createDate": "2021-07-01T18:28:37.209",
    "updateBy": null,
    "updateDate": "2021-07-01T18:28:37.209",
    "isDelete": false,
    "sortOrder": 5
  },
  {
    "id": "1410545871978029060",
    "quotationId": null,
    "name": "管理费⽤ Management expenses",
    "isRequire": false,
    "remark": null,
    "isReduce": null,
    "sopDate": null,
    "seaPrice": null,
    "airPrice": null,
    "capacity": null,
    "createBy": null,
    "createDate": "2021-07-01T18:28:37.209",
    "updateBy": null,
    "updateDate": "2021-07-01T18:28:37.209",
    "isDelete": false,
    "sortOrder": 6
  },
  {
    "id": "1410545871978029061",
    "quotationId": null,
    "name": "包装费 Packing Cost",
    "isRequire": false,
    "remark": null,
    "isReduce": null,
    "sopDate": null,
    "seaPrice": null,
    "airPrice": null,
    "capacity": null,
    "createBy": null,
    "createDate": "2021-07-01T18:28:37.209",
    "updateBy": null,
    "updateDate": "2021-07-01T18:28:37.209",
    "isDelete": false,
    "sortOrder": 7
  },
  {
    "id": "1410545871978029062",
    "quotationId": null,
    "name": "运保费 Transport Cost and Ensurance",
    "isRequire": false,
    "remark": null,
    "isReduce": null,
    "sopDate": null,
    "seaPrice": null,
    "airPrice": null,
    "capacity": null,
    "createBy": null,
    "createDate": "2021-07-01T18:28:37.209",
    "updateBy": null,
    "updateDate": "2021-07-01T18:28:37.209",
    "isDelete": false,
    "sortOrder": 8
  },
  {
    "id": "1410545871978029063",
    "quotationId": null,
    "name": "产品利润 Profit",
    "isRequire": false,
    "remark": null,
    "isReduce": null,
    "sopDate": null,
    "seaPrice": null,
    "airPrice": null,
    "capacity": null,
    "createBy": null,
    "createDate": "2021-07-01T18:28:37.209",
    "updateBy": null,
    "updateDate": "2021-07-01T18:28:37.209",
    "isDelete": false,
    "sortOrder": 9
  },
  {
    "id": "1410545871986417665",
    "quotationId": null,
    "name": "其他费⽤ Others",
    "isRequire": false,
    "remark": null,
    "isReduce": null,
    "sopDate": null,
    "seaPrice": null,
    "airPrice": null,
    "capacity": null,
    "createBy": null,
    "createDate": "2021-07-01T18:28:37.209",
    "updateBy": null,
    "updateDate": "2021-07-01T18:28:37.209",
    "isDelete": false,
    "sortOrder": 10
  },
  {
    "id": "1410545871986417666",
    "quotationId": null,
    "name": "原材料补差 MTZ",
    "isRequire": false,
    "remark": null,
    "isReduce": true,
    "sopDate": null,
    "seaPrice": null,
    "airPrice": null,
    "capacity": null,
    "createBy": null,
    "createDate": "2021-07-01T18:28:37.209",
    "updateBy": null,
    "updateDate": "2021-07-01T18:28:37.209",
    "isDelete": false,
    "sortOrder": 11
  },
  {
    "id": "1410545871986417667",
    "quotationId": null,
    "name": "模具投资 Tooling investment",
    "isRequire": false,
    "remark": null,
    "isReduce": true,
    "sopDate": null,
    "seaPrice": null,
    "airPrice": null,
    "capacity": null,
    "createBy": null,
    "createDate": "2021-07-01T18:28:37.209",
    "updateBy": null,
    "updateDate": "2021-07-01T18:28:37.209",
    "isDelete": false,
    "sortOrder": 12
  },
  {
    "id": "1410545871986417668",
    "quotationId": null,
    "name": "起步⽣产SOP (YYYY-MM-DD)",
    "isRequire": false,
    "remark": null,
    "isReduce": true,
    "sopDate": null,
    "seaPrice": null,
    "airPrice": null,
    "capacity": null,
    "createBy": null,
    "createDate": "2021-07-01T18:28:37.209",
    "updateBy": null,
    "updateDate": "2021-07-01T18:28:37.209",
    "isDelete": false,
    "sortOrder": 13
  },
  {
    "id": "1410545871994806274",
    "quotationId": null,
    "name": "产能信息 Capacity",
    "isRequire": null,
    "remark": null,
    "isReduce": null,
    "sopDate": null,
    "seaPrice": null,
    "airPrice": null,
    "capacity": null,
    "createBy": null,
    "createDate": "2021-07-01T18:28:37.209",
    "updateBy": null,
    "updateDate": "2021-07-01T18:28:37.209",
    "isDelete": null,
    "sortOrder": 14
  }
]