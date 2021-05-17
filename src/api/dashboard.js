import request from '@/utils/request'

export function getDashboard(type) {
  return request({
    url: '/dashboard/' + type,
    method: 'get'
  })
}
