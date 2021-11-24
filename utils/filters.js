export default {
  filters: {
    // 日期格式化
    dateFilter(val, format = "YYYY-MM-DD HH:mm:ss") {
      return typeof val === 'string' ||  typeof val === 'number' ? window.moment(val).format(format) : val
    },
    numberStatusFilter(val) {
      const map = {
        0: '否',
        1: '是'
      }

      return map[val] ? map[val] : val
    }
  }
}