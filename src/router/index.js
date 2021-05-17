import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/login'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '仪表盘', icon: 'dashboard' }
    }]
  }
]

export const asyncRoutes = [
  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/list',
    name: 'Admin',
    meta: { title: '管理员', icon: 'user-md' },
    children: [{
      path: 'list',
      component: () => import('@/views/admin/list'),
      name: 'AdminList',
      meta: { title: '管理员列表', icon: 'user-md' }
    },
    {
      path: 'profile',
      component: () => import('@/views/admin/profile'),
      name: 'AdminProfile',
      meta: { title: '编辑资料', icon: 'edit' }
    }]
  },

  {
    path: '/config',
    component: Layout,
    redirect: '/config/guide',
    name: 'Config',
    meta: { title: '配置', icon: 'cog' },
    children: [{
      path: 'base',
      component: () => import('@/views/config/base'),
      name: 'ConfigBase',
      meta: { title: '基本配置', icon: 'cog' }
    }, {
      path: 'guide',
      component: () => import('@/views/config/guide'),
      name: 'ConfigGuide',
      meta: { title: '引导图管理', icon: 'guide' }
    },
    {
      path: 'shuffling',
      component: () => import('@/views/config/shuffling'),
      name: 'ConfigShuffling',
      meta: { title: '轮播图管理', icon: 'shuffling-banner-fill' }
    }]
  },

  {
    path: '/equipment',
    component: Layout,
    redirect: '/equipment/list',
    name: 'Equipment',
    meta: { title: '设备', icon: 'car' },
    children: [{
      path: 'list',
      component: () => import('@/views/equipment/list'),
      name: 'EquipmentList',
      meta: { title: '设备列表', icon: 'car' }
    }]
  },

  {
    path: '/bill',
    component: Layout,
    redirect: '/bill/list',
    name: 'Bill',
    meta: { title: '账单', icon: 'cny' },
    children: [{
      path: 'list',
      component: () => import('@/views/bill/list'),
      name: 'BillList',
      meta: { title: '账单列表', icon: 'cny' }
    }]
  },

  {
    path: '/activity',
    component: Layout,
    redirect: '/activity/list',
    name: 'Activity',
    meta: {
      title: '活动',
      icon: 'bullhorn'
    },
    children: [{
      path: 'list',
      component: () => import('@/views/activity/list'),
      name: 'ActivityList',
      meta: { title: '活动列表', icon: 'nested' }
    },
    {
      path: 'create',
      component: () => import('@/views/activity/create'),
      name: 'ActivityCreate',
      meta: { title: '发布活动', icon: 'edit' }
    },
    {
      path: 'edit/:id([0-9])',
      component: () => import('@/views/activity/edit'),
      name: 'ActivityEdit',
      hidden: true,
      meta: { title: '编辑活动', noCache: true, activeMenu: '/active/list' }
    }
    ]
  },

  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    name: 'Order',
    meta: { title: '订单', icon: 'shopping-bag' },
    children: [{
      path: 'list',
      component: () => import('@/views/order/list'),
      name: 'OrderList',
      meta: { title: '订单列表', icon: 'shopping-bag' }
    }]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/user',
    name: 'User',
    meta: { title: '用户', icon: 'user' },
    children: [{
      path: 'user',
      component: () => import('@/views/user/user'),
      name: 'UserList',
      meta: { title: '用户列表', icon: 'user' }
    },
    {
      path: 'partner',
      component: () => import('@/views/user/partner'),
      name: 'PartnerList',
      meta: { title: '合伙人列表', icon: 'users' }
    }]
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
