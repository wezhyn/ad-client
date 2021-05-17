import request from '@/utils/request'

export function getActivityList(params) {
  return request({
    url: '/activity/list',
    method: 'get',
    params
  })
}

export function deleteActivity(id) {
  return request({
    url: '/activity/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function createActivity(data) {
  return request({
    url: '/activity/create',
    method: 'post',
    data
  })
}

export function editActivity(data) {
  return request({
    url: '/activity/update',
    method: 'post',
    data
  })
}

export function getActivityById(id) {
  return request({
    url: '/activity/' + id,
    method: 'get'
  })
}
