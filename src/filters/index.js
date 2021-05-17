export { parseTime, formatTime } from '@/utils'

export function adminRoleStatus(val) {
  let adminRoleStatus = ''
  switch (val) {
    case 'developer': {
      adminRoleStatus = '开发'
      break
    }
    case 'customer': {
      adminRoleStatus = '客服'
      break
    }
    case 'finance': {
      adminRoleStatus = '财务'
      break
    }
  }
  return adminRoleStatus
}

export function verifyStatus(val) {
  let verifyStatus = ''
  switch (val) {
    case 'pass': {
      verifyStatus = '通过'
      break
    }
    case 'fail': {
      verifyStatus = '不通过'
      break
    }
    case 'wait': {
      verifyStatus = '待审核'
      break
    }
    case 'modify': {
      verifyStatus = '待修改'
      break
    }
  }
  return verifyStatus
}

export function userRoleStatus(val) {
  let userRoleStatus = ''
  switch (val) {
    case 'user': {
      userRoleStatus = '用户'
      break
    }
    case 'partner': {
      userRoleStatus = '合伙人'
      break
    }
  }
  return userRoleStatus
}

export function userStatus(val) {
  let userStatus = ''
  switch (val) {
    case 'forbed': {
      userStatus = '禁用'
      break
    }
    case 'normal': {
      userStatus = '正常'
      break
    }
    case 'authentication': {
      userStatus = '待实名'
      break
    }
    case 'modify': {
      userStatus = '待修改'
      break
    }
  }
  return userStatus
}

export function equipmentStatus(val) {
  let equipmentStatus = ''
  switch (val) {
    case false: {
      equipmentStatus = '关闭'
      break
    }
    case true: {
      equipmentStatus = '运行'
      break
    }
  }
  return equipmentStatus
}

export function genderStatus(val) {
  let genderStatus = ''
  switch (val) {
    case 'male': {
      genderStatus = '男'
      break
    }
    case 'female': {
      genderStatus = '女'
      break
    }
    case 'unknown': {
      genderStatus = '不详'
      break
    }
  }
  return genderStatus
}

export function html(str) {
  return str.replace(/<[^>]*>/g, '')
}

function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
