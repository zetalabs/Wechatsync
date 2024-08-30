import Vue from 'vue'
import { createRouter } from 'vue-router'
import VueMoment from 'vue-moment'
import { store } from './store/store'

import Main from './editor/Main.vue'

import ElementUI from 'element-plus'
import 'element-plus/theme-chalk/index.css'

Vue.use(ElementUI)

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// use
Vue.use(mavonEditor)

Vue.use(createRouter)
Vue.use(VueMoment)

var routes = [
  {
    path: '/',
    component: Main,
    meta: {
      index: 1,
    },
  },
]

var winBackgroundPage = chrome.extension.getBackgroundPage()
var db = winBackgroundPage.db
window.db = db

var router = createRouter({
  routes,
})
const app = new Vue({
  router,
  store,
})
app.$mount('#app')
