import Vue from 'vue'
import Router from 'vue-router'

import Login  from '@/components/pages/Login'
import UserPanel from '@/components/pages/UserPanel'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/UserPanel',
      name: 'UserPanel',
      component: UserPanel
    }
  ]
});
