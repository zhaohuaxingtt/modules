import axios from '@/utils/axios'
const requst = axios(process.env.VUE_APP_USER_CENTER)

export function login(data) {
  return requst({
    url: '/web/login',
    method: 'post',
    data: data
  })
}
