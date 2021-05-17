import request from '@/utils/request'

export function getOrderList(params) {
  return request({
    url: '/order/list',
    method: 'get',
    params
  })
}

export function deleteOrder(id) {
  return request({
    url: '/order/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function queryDeleteOrder(idList) {
  return request({
    url: '/admin/order/queryDelete',
    method: 'post',
    data: {
      idList: idList
    }
  })
}

export function verifyOrder(data) {
  return request({
    url: '/order/verify',
    method: 'post',
    data
  })
}

export function getPrice() {
  return request({
    url: '/system/revenue',
    method: 'get'
  })
}

export function postPrice(priceList) {
  return request({
    url: '/system/revenue',
    method: 'post',
    data: {
      revenue: priceList
    }
  })
}
