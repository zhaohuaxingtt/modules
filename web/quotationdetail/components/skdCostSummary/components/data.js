import { uuidv4 } from "rise/web/aeko/quotationdetail/components/aPriceChange/components/data"

export const tableTitle = [
  { props: "overseasFactoryPrice", name: "境外出厂价", key: "JINGWAICHUCHANGJIAFIX", minWidth: "140", updateKey: uuidv4() },
  { props: "overseasBnkPrice", name: "境外包装费、运输费、保险费", key: "JINGWAIBAOZHUANGFEIYUNSHUFEIBAOXIANFEI", minWidth: "200", updateKey: uuidv4() },
  { props: "tariff", name: "关税", key: "GUANSHUI", minWidth: "140" },
  { props: "domesticFreight", name: "境内运费（RMB）", key: "JINGNEIYUNFEIRMB", minWidth: "140" },
  { props: "manageSummary", name: "管理费", key: "GUANLIFEI" },
  { props: "profitSummary", name: "利润", key: "LIRUN" },
  { props: "otherSummary", name: "其他费用", key: "QITAFEIYONG", minWidth: "140" },
  { props: "totalPrice", name: "出厂价", key: "CHUCHANGJIA" },
  { props: "packageCost", name: "包装费", key: "BAOZHUANGFEI" },
  { props: "transportCost", name: "运输费", key: "YUNSHUFEI" },
  { props: "operateCost", name: "操作费", key: "CAOZUOFEI" },
  { props: "salesPrice", name: "销售价", key: "XIAOSHOUJIA" }
]

export const skdPercentageTemplate = [
  {
    props: "overseasFactoryPrice",
    name: "境外出厂价",
    key: "JINGWAICHUCHANGJIAFIX",
    persent: "0%(0)",
    width: "calc(100% / 6)",
    color: "rgba(23, 99, 247, 1)",
  },
  {
    props: "overseasPrice",
    name: "境外包装费、运输费、保险费、关税",
    key: "JINGWAIBAOZHUANGFEIYUNSHUFEIBAOXIANFEIGUANSHUI",
    persent: "0%(0)",
    width: "calc(100% / 6)",
    color: "rgba(22, 96, 241, 0.7)",
  },
  {
    props: "domesticFreight",
    name: "境内运费（RMB）",
    key: "JINGNEIYUNFEIRMB",
    persent: "0%(0)",
    width: "calc(100% / 6)",
    color: "rgba(22, 96, 241, 0.4)",
  },
  {
    props: "manageSummary",
    name: "管理费",
    key: "GUANLIFEI",
    persent: "0%(0)",
    width: "calc(100% / 6)",
    color: "rgba(22, 96, 241, 0.2)"
  },
  {
    props: "otherSummary",
    name: "其他费用",
    key: "QITAFEIYONG",
    persent: "0%(0)",
    width: "calc(100% / 6)",
    color: "rgba(135, 130, 191, 1)"
  },
  {
    props: "profitSummary",
    name: "利润",
    key: "LIRUN",
    persent: "0%(0)",
    width: "calc(100% / 6)",
    color: "rgba(135, 130, 191, 1)"
  }
]

export const percentageBalance = function(data, precision = 4) {
  const dataMap = {}

  const _data = data.filter(item => isFinite(+item) && ((item || item === 0) && !isNaN(+item)))
  _data.forEach(item => {
    if (Reflect.has(dataMap, item)) {
      dataMap[item] += 1
    } else {
      dataMap[item] = 1
    }
  })

  const sortData = [ ...new Set(_data) ].sort((a, b) => b - a)
  let max = sortData.find(item => dataMap[item] === 1)
  max = max ? max : sortData[0]

  const sum = _data.reduce((acc, cur) => math.add(acc, math.bignumber(cur || 0)), 0)
  const percentage = _data.map(item => math.round(math.divide(math.bignumber(item || 0), !+sum ? 1 : sum), precision).toString())
  const errorValue = math.subtract(1, percentage.reduce((acc, cur) => math.add(acc, math.bignumber(cur || 0)), 0))

  if (percentage.length) {
    percentage[_data.indexOf(max)] = math.add(percentage[_data.indexOf(max)], errorValue).toString()
  }

  return { data: _data, percentage }
}

export const getPercentage = function(data, template) {
  if (Array.isArray(template) && typeof data === "object") {
    const keys = template.map(item => item.props).filter(key => +data[key])
    const result = _.cloneDeep(template).filter(item => keys.includes(item.props))

    const percentage = percentageBalance(result.map(item => data[item.props]), 2).percentage

    result.forEach((item, index) => {
      item.width = `${ math.multiply(math.bignumber(percentage[index]), 100) }%`
      item.persent = `${ item.width }(${ data[item.props] || 0 })`
    })

    return result
  }

  return []
}