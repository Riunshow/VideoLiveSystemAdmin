import Vue from 'vue'
import Router from 'vue-router'

import store from './../store'


import Login from '@/page/Login'
import FirstPage from '@/page/HomePage/FirstPage'
import Home from '@/page/Home'
import Template from '@/page/Template'

import UserManage from '@/page/User/UserManage'
import UserInfo from '@/page/User/UserInfo'

import LiveGroup from '@/page/Live/LiveGroup'
import LiveGroupInfo from '@/page/Live/LiveGroupInfo'

import Personal from '@/page/System/PersonalCenter'

import Gift from '@/page/Gift/Gift'

import Application from '@/page/Application/Application'

Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/',
      name: '主页',
      component: Home,
      meta: {
        requireAuth: true,
        adminAuth: true
      },
      children: [{
          path: 'index',
          name: '首页',
          component: FirstPage,
          meta: {
            requireAuth: true,
            adminAuth: true
          },
        },
        {
          path: 'usermanage',
          name: '用户管理',
          component: UserManage,
          meta: {
            requireAuth: true,
            adminAuth: true
          },
        },
        {
          path: 'userinfo/:userid',
          name: '用户信息详情',
          component: UserInfo,
          meta: {
            requireAuth: true,
            adminAuth: true
          },
        },
        {
          path: 'livegroup',
          name: '直播分组管理',
          component: LiveGroup,
          meta: {
            requireAuth: true,
            adminAuth: true
          },
        },
        {
          path: 'liveGroupInfo/:live_group_id',
          name: '直播分组信息详情',
          component: LiveGroupInfo,
          meta: {
            requireAuth: true,
            adminAuth: true
          },
        },
        {
          path: 'gift',
          name: '礼物管理',
          component: Gift,
          meta: {
            requireAuth: true,
            adminAuth: true
          },
        },
        {
          path: 'application',
          name: '主播申请管理',
          component: Application,
          meta: {
            requireAuth: true,
            adminAuth: true
          },
        },
        {
          path: 'personal',
          name: '个人中心',
          component: Personal,
          meta: {
            requireAuth: true,
            adminAuth: true
          },
        },
      ]
    },
    {
      path: '/404',
      name: '404',
      component: Template
    }, {
      path: '/403',
      name: '403 Forbidden',
      component: Template
    }, {
      path: '*',
      redirect: '/index'
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (sessionStorage.length === 0) {
      next({
        path: '/login'
      })
    } else {
      next()
    }
    if (to.meta.adminAuth) {
      if (JSON.parse(sessionStorage.user).role == 3) {
        next()
      } else {
        next({
          path: '/403'
        })
      }
    }
    if (to.fullPath == '/') {
      next({
        path: '/index'
      })
    }
  } else {
    next()
  }
})

export default router;