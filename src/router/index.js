import Vue from 'vue'
import Router from 'vue-router'

import store from './../store'


import Login from '@/page/Login'
import FirstPage from '@/page/HomePage/FirstPage'
import Home from '@/page/Home'
import Template from '@/page/Template'

import UserManage from '@/page/System/UserManage'
import UserGroupManage from '@/page/System/UserGroupManage'
import UserInfo from '@/page/System/UserInfo'
import Personal from '@/page/System/PersonalCenter'
import Question from '@/page/Question'

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
        requireAuth: true
      },
      children: [{
          path: 'index',
          name: '首页',
          component: FirstPage,
          meta: {
            requireAuth: true
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
          path: 'question',
          name: '用户反馈管理',
          component: Question,
          meta: {
            requireAuth: true,
            adminAuth: true
          },
        },
        {
          path: 'usergroup',
          name: '用户分组管理',
          component: UserGroupManage,
          meta: {
            requireAuth: true,
            adminAuth: true
          },
        },
        {
          path: 'userinfo/:userid',
          name: '用户详情页',
          component: UserInfo,
          meta: {
            requireAuth: true
          },
        },
        {
          path: 'personal',
          name: '个人中心',
          component: Personal,
          meta: {
            requireAuth: true
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
      if (JSON.parse(sessionStorage.user).role == 2) {
        next()
      } else {
        next({
          path: '/index'
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