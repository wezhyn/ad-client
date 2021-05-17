import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/delete',
    method: 'post',
    data: {
      id: id
    }
  })
}

export function createUser(data) {
  return request({
    url: '/user/create',
    method: 'post',
    data
  })
}
