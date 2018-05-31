import Vue from 'vue'
import Router from 'vue-router'

import Login  from '@/components/pages/Login'
import Dashboard from '@/components/pages/Dashboard'
import Container from '@/components/public/Container'
import Main from '@/components/public/Main'
import Welcome from '@/components/public/Welcome'

Vue.use(Router);

const personal_sys = {
    path: 'personal_sys',
    component: Container,
    redirect: 'personal_sys/welcome',
    children: [
      {
        path: 'welcome',
        component: Main
      }
    ]
};

const select_sys = {
  path: 'select_sys',
  component: Container,
  redirect: 'select_sys/welcome',
  children: [
    {
      path: 'welcome',
      component: Main
    }
  ]
};

const score_sys = {
  path: 'score_sys',
  component: Container,
  redirect: 'score_sys/welcome',
  children : [
    {
      path: 'welcome',
      component: Main
    }
  ]
};

const welcome = {
  path: 'welcome',
  component: Welcome
};

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/dashboard',
      redirect: '/dashboard/welcome',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        personal_sys,
        select_sys,
        score_sys,
        welcome
      ]
    }
  ]
})
