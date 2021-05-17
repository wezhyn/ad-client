import request from '@/utils/request'

export function getEquipmentList(params) {
  return request({
    url: '/equipment/list',
    method: 'get',
    params
  })
}

export function deleteEquipment(id) {
  return request({
    url: '/equipment/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function verifyEquipment(data) {
  return request({
    url: '/equipment/verify',
    method: 'post',
    data
  })
}
