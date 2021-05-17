import request from '@/utils/request'

export function getGuideList() {
  return request({
    url: '/config/guideList',
    method: 'get',
    params: {
      limit: 3,
      page: 1
    }
  })
}

export function deleteGuide(id) {
  return request({
    url: '/config/deleteGuide',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function getShuffingList() {
  return request({
    url: '/config/shuffingList',
    method: 'get'
  })
}

export function deleteShuffing(id) {
  return request({
    url: '/config/deleteShuffing',
    method: 'post',
    data: {
      id: id
    }
  })
}
