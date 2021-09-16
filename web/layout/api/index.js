import axios from '@/utils/axios'

const requestUSER = axios(process.env.VUE_APP_USER_CENTER)

export function updateModules(params) {
  return requestUSER({
    url: '/home/module/update',
    method: 'POST',
    data: params
  })
}
