import request from '@/utils/request'

export function getBillList(params) {
  return request({
    url: '/billinfo/list',
    method: 'get',
    params
  })
}
