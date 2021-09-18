import axios from '@/utils/axios'

const requst = axios(process.env.VUE_APP_BASE_INFO)

/* 获取周末及法定节假日API */
export function queryCalendar(data) {
  return requst({
    url: '/web/queryCalendar',
    method: 'post',
    data: data
  })
}
