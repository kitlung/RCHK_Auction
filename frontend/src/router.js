import Vue from 'vue'
import Router from 'vue-router'
import Axios from 'axios';

import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Item from './views/Item.vue'
import Unauthorized from './views/Unauthorized.vue'
import PageNotFound from './views/PageNotFound.vue'
import Profile from './views/Profile.vue'
import YourItems from './views/YourItems.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: (to,from,next) => {
        if(localStorage.getItem('jwtKey') && localStorage.getItem('user') && localStorage.getItem('weblogin')){
          next('/')
        }else{
          next()
        }
      }
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: (to,from,next) => {
        Axios.post('/api/rcapps/app-permission', {'jwtKey': localStorage.getItem('jwtKey'), 'url': 'auction.rchk.edu.hk'})
          .then(res => {
              if(res.data.result != 'Success' || res.data.permission == false){
                alert(res.data.message)
                next('/unauthorized')
              }else{
                next()
              }
          })
          .catch(() => {
            next('/unauthorized')
          })
      }
    },
    {
      path: '/item/:id',
      component: Item,
      props: true,
      beforeEnter: (to,from,next) => {
        if (to.params.id) {
          next()
        } else {
          next('/page-not-found')
        }
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      beforeEnter: (to,from,next) => {
        Axios.post('/api/rcapps/app-permission', {'jwtKey': localStorage.getItem('jwtKey'), 'url': 'auction.rchk.edu.hk'})
          .then(res => {
              if(res.data.result != 'Success' || res.data.permission == false){
                alert(res.data.message)
                next('/unauthorized')
              }else{
                next()
              }
          })
          .catch(() => {
            next('/unauthorized')
          })
      }
    },
    {
      path: '/your-items',
      name: 'Your Items',
      component: YourItems,
      beforeEnter: (to,from,next) => {
        Axios.post('/api/rcapps/app-permission', {'jwtKey': localStorage.getItem('jwtKey'), 'url': 'auction.rchk.edu.hk'})
          .then(res => {
              if(res.data.result != 'Success' || res.data.permission == false){
                alert(res.data.message)
                next('/unauthorized')
              }else{
                next()
              }
          })
          .catch(() => {
            next('/unauthorized')
          })
      }
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: Unauthorized
    },
    {
      path: '/page-not-found',
      component: PageNotFound
    },
    {
      path: "*",
      component: PageNotFound
    }
  ]
})
