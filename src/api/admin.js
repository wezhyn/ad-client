import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}

export function getAdminList(params) {
  return request({
    url: '/admin/list',
    method: 'get',
    params
  })
}

export function deleteAdmin(username) {
  return request({
    url: '/admin/delete',
    method: 'post',
    data: {
      username: username
    }
  })
}

export function updateAdmin(data) {
  return request({
    url: '/admin/update',
    method: 'post',
    data
  })
}

export function createAdmin(data) {
  return request({
    url: '/admin/create',
    method: 'post',
    data
  })
}

export function updatePassword(data) {
  return request({
    url: '/admin/password',
    method: 'post',
    data
  })
}

export function userVerify(data) {
  return request({
    url: '/admin/operate/verify/user',
    method: 'post',
    data
  })
}
