import Vue from 'vue'
import Router from 'vue-router'

import AppView from '@/components/app-view'
import Home from '@/pages/home'

Vue.use(Router)

const page = name => () => import('@/pages/' + name)

export default new Router({
  routes: [
    {
      path: '',
      component: AppView,
      children: [
        {path: '/', name: 'home', component: Home},
        {path: '/online-tool', name: 'online-tool', component: page('online-tool')},
        {path: '/404', name: '404', component: page('404')},
        {path: '/500', name: '500', component: page('500')}
      ]
    },
    {path: '/the-garden-of-eden/online-tool-outer', name: 'online-tool-outer', component: page('online-tool')},
    {path: '/online-tool-outer', name: 'online-tool-outer', component: page('online-tool')},
    {path: '*', redirect: {name: '404'}}
  ]
})
