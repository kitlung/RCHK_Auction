import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import { globalFunction } from './mixin.js'


import VueSocketIO from 'vue-socket.io'
import axios from 'axios'
import xdLocalStorage from 'xdlocalstorage'
import Notifications from 'vue-notification'
import VueMq from 'vue-mq'
import store from './store'
import moment from 'moment'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.moment = moment

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'https://auction.rchk.edu.hk',
  // connection: 'http://localhost:7082',
  vuex: {
    store,
    actionPrefix: "SOCKET_"
  }
}))

Vue.use(VueMq, {
  breakpoints: {
    'mobile-portrait': 481,
    'mobile-landscape': 740,
    'tablet-portrait': 769,
    'tablet-landscape': 1025,
    'laptop': Infinity,
  }
})

Vue.use(xdLocalStorage)
Vue.use(Notifications)
Vue.mixin(globalFunction)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
