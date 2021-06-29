/*
 * @Author: your name
 * @Date: 2021-04-23 15:34:54
 * @LastEditTime: 2021-06-29 15:26:48
 * @LastEditors: Luoshuang
 * @Description: In User Settings Edit
 * @FilePath: \front-modules\web\quotationdetail\components\costsummary\components\data.js
 */

import {_getMathNumber} from '@/utils'

export function tableTilel1Fn(level, partType,partProjectType){
  return [
    {props:'materialSummary',name:`${level}.1`,key: 'LK_YUANCRMBPC',tooltip:true,width:'150',type:'input'},
    {props:'productionSummary',name:`${level}.2`,key: 'LK_ZHIZHAOCB',tooltip:false,width:'',type:'input'},
    {props:'scrapSummary',name:`${level}.3`,key: 'LK_BAOFEICHENGBEN',tooltip:false,width:'',type:'input'},
    {props:'manageSummary',name:`${level}.4`,key: 'LK_GUANLIFEI',tooltip:false,width:'',type:'input'},
    {props:'otherSummary',name:`${level}.5`,key: 'LK_QITAFEIYONG',tooltip:false,width:'' },
    {props:'profitSummary',name:`${level}.6`,key: 'LK_LIRUN',tooltip:false,width:'',type:'input'},
    {props:'totalPrice',name:'A价',key: 'LK_AJIA',tooltip:false,width:'' },
    // 若某一零件的零件类型为[加工装配费]，我可以看到汇总表头上多显示两列：[LC件管理费率][CKD件管理费率]
    ...(partType === 'S' ? [
      {props:'lcManageRate',name:'LC件管理费率',key: 'LK_LCJIANGUANLIFEILV',tooltip:false,width:'',type:'inputRate' },
      {props:'ckdManageRate',name:'CKD件管理费率',key: 'LK_CKDJIANGUANLIFEILV',tooltip:false,width:'',type:'inputRate' },
    ] : []),
    // 供应商配件与附件的包装运输页面移除，报价成本汇总页面能够直接填写[原材料/散件成本][制造成本][报废成本][管理费][利润][包装费][运输费][操作费]，
    {props:'packageCost',name:'包装费',key: 'LK_BAOZHUANGFEI',tooltip:false,width:'',type: partProjectType === 'PT17' || partProjectType === 'PT18' ? 'input': '' },
    {props:'transportCost',name:'运输费',key: 'LK_YUNSHUFEI',tooltip:false,width:'',type: partProjectType === 'PT17' || partProjectType === 'PT18' ? 'input': '' },
    {props:'operateCost',name:'操作费',key: 'LK_CAOZUOFEI',tooltip:false,width:'',type: partProjectType === 'PT17' || partProjectType === 'PT18' ? 'input': '' },
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
  {props:'unitPrice',name:'单价（RMB/UoM）',key: 'LK_DANJIARMB',tooltip:true,width:'150',type:'input' },
  {props:'quantity',name:'数量',key: 'LK_SHULIANG',tooltip:true,width:'',type:'input' },
  {props:'indirectMaterialCost',name:'直接原材料/散件成本（RMB/Pc.）',key: 'LK_ZHIJIEYUANCAILIAOSANJIANCHENGBEN',tooltip:true,width:'250' },
  {props:'tpPartID',name:'物料管理费',key: 'LK_WULAOGLF',tooltip:true,width:'' ,list:[
    {props:'materialManageCostRate',name:'(%)',key: '',tooltip:true,width:'100',type:'input'},
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
  {props:'specialDeviceCost',name:'上汽大众专用设备费（RMB）',key: 'LK_SHANGQIDAZHONGZHUANYONGSHEBEIFEI',tooltip:true,width:'200',type:'input' },
  {props:'taktTime',name:'生产节拍（Sec.）',key: 'LK_SHENGCHANJIEPAISEC',tooltip:true,width:'150',type:'input' },
  {props:'taktTimeNumber',name:'件数/生产节拍（1..n）',key: 'LK_JIANSHUSHENGCHANJIEPAI',tooltip:true,width:'140',type:'input' },
  {props:'tpPartID',name:'人工成本',key: 'LK_RENGONGCHENGBEN',tooltip:true,width:'',list:[
    {props:'directLaborRate',name:'直接人工费率（RMB/Hour）',key: 'LK_ZHIJIERENGONGFEILV',tooltip:true,width:'180',type:'input'},
    {props:'directLaborQuantity',name:'直接人工数量（0..n）',key: 'LK_ZHIJIERENGONGSHULIANG',tooltip:true,width:'150',type:'input'}
  ] },
  {props:'tpPartID',name:'设备费',key: 'LK_SHEBEIFEI',tooltip:true,width:'',list:[
    {props:'deviceRate',name:'设备费率（RMB/Hour）',key: 'LK_SHEBEIFEILV',tooltip:true,width:'180',type:'input'}
  ] },
  {props:'tpPartID',name:'间接制造成本',key: 'LK_JIANJIEZHIZAOCHENGBEN',tooltip:true,width:'',list:[
    {props:'indirectManufacturingRate',name:'（%）',key: '',tooltip:true,width:'80',type:'input'},
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
  {props:'ratio',name:'报废率（%）',key: 'LK_BAOFEILV',tooltip:false,width:'',type:'input'},
  {props:'amount',name:'金额（RMB/Pc.）',key: 'LK_JINERMB',tooltip:false,width:''},
]
/**
 * @description: 管理费
 * @param {*}
 * @return {*}
 */
 export const titleglf = [
  {props:'typeName',name:'管理费',key: 'LK_GUANLIFEI',tooltip:false,width:''},
  {props:'ratio',name:'比例（%）',key: 'LK_BILI',tooltip:false,width:'',type:'input'},
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
  {props:'ratio',name:'比例（%）',key: 'LK_BILI',tooltip:false,width:'',type:'input'},
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
export function getAallPrice(needAddPirce,data){
  try {
    let allPriceString = ''
    needAddPirce.forEach((items,index)=>{
      allPriceString += (data[items] || 0) + (index == (needAddPirce.length-1)?'':'+')
    })
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
//  export const titleYclByL3= 
// //  (productionCountryList = []) => 
//  [
//   {props:'partName',name:'类型',key: 'LK_LEIXING',tooltip:true,width:'',type:'input'},
//   {props:'partNumber',name:'原材料/散件描述',key: 'LK_YUANCLSJMS',tooltip:true,width:'150',type:'input' },
//   {props:'tradeName',name:'Trade name',key: 'LK_TRADENAME',tooltip:true,width:'130',type:'input' },
//   {props:'supplierName',name:'供应商名称',key: 'LK_GONGYINGSHANGMINGCHENG',tooltip:true,width:'120',type:'input' },
//   {props:'productionCountry',name:'原产国',key: 'LK_YUANCHANDI',tooltip:true,width:'90',type:'select'},
//   {props:'isSvwAssignPriceParts',name:'是否SVW指定价格散件',key: 'LK_SHIFOUSVWZHIDINGJIAGE',tooltip:true,width:'200',type:'select',options:isorno, labelClassName: '' },
  
  
//   {props:'quantityUnit',name:'数量单位（UoM）',key: 'LK_SHULIANGDANWEI',tooltip:true,width:'150',type:'input' },
//   {props:'unitPrice',name:'单价（RMB/UoM）',key: 'LK_DANJIARMB',tooltip:true,width:'150',type:'input' },
//   {props:'quantity',name:'数量',key: 'LK_SHULIANG',tooltip:true,width:'',type:'input' },
//   {props:'indirectMaterialCost',name:'直接原材料/散件成本（RMB/Pc.）',key: 'LK_ZHIJIEYUANCAILIAOSANJIANCHENGBEN',tooltip:true,width:'250' },
//   {props:'tpPartID',name:'物料管理费',key: 'LK_WULAOGLF',tooltip:true,width:'' ,list:[
//     {props:'materialManageCostRate',name:'(%)',key: '',tooltip:true,width:'100',type:'input'},
//     {props:'materialManageCost',name:'(RMB/Pc.)',key: '',tooltip:true,width:''}

//   ]},
//   {props:'materialCost',name:'原材料/散件成本（RMB/Pc.）',key: 'LK_YUANCRMBPC',tooltip:true,width:'200' },
// ]

export const tableTitleDB = [
  {props: 'projectType', name: '项目类型', key: 'XIANGMULEIXING', tooltip: true, width: ''},
  {props: 'fee', name: '金额', key: 'JINE', tooltip: true, width: '', children: [
    {props: 'sea', name: '海运', key: 'HAIYUN', type: 'input', editable: true},
    {props: 'sky', name: '空运', key: 'KONGYUN', type: 'input', editable: true}
  ]},
  {props: 'memo', name: '备注', key: 'BEIZHU', type: 'input', editable: true}
]

export const tableDataDB = [
  {projectType: '出厂价 Exwork', sea: '10', sky: '10', memo: ''},
  {projectType: '离岸价 FOB', sea: '10', sky: '10', memo: '原供应商 Original Supplier'},
  {projectType: '到岸价 CIF(=1+6+7+8+9+10)', sea: '10', sky: '10', memo: ''},
  {projectType: '未完税交货 DDU', sea: '10', sky: '10', memo: ''},
  {projectType: '未完税交货 DDP', sea: '10', sky: '10', memo: ''},
  {projectType: '管理费用 Management expenses', sea: '10', sky: '10', memo: ''},
  {projectType: '包装费 Packing Cost', sea: '10', sky: '10', memo: ''},
  {projectType: '运保费 Transport Cost and Ensurance', sea: '10', sky: '10', memo: ''},
  {projectType: '产品利润 Profit', sea: '10', sky: '10', memo: ''},
  {projectType: '其他费用 Others', sea: '10', sky: '10', memo: 'Audi/Skoda 许可费',memoDisabled: true},
  {projectType: '原材料补差 MTZ', noSky: true, sea: '10', type: 'select', selectOption: '', memo: ''},
  {projectType: '模具投资 Tooling investment', sea: '10', sky: '10', memo: ''},
  {projectType: '起步生产SOP (YYYY-MM-DD)', noSky: true, sea: '10', type: 'date', memo: ''},
  {projectType: '产能信息 Capacity', sea: '10', sky: '10', memo: '', allRow: true},
]