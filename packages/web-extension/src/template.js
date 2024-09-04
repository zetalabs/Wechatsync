import Vue from 'vue'
import VueRouter from 'vue-router'
import { store } from './store/store'

import Main from './tempalte/App.vue'

import ElementUI from 'element-plus'
import 'element-plus/theme-chalk/index.css'

Vue.use(ElementUI)
import JsonViewer from 'vue-json-viewer'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

Vue.use(JsonViewer)
// use
Vue.use(mavonEditor)

Vue.use(VueRouter)

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

var router = new VueRouter({
  routes,
})
const app = new Vue({
  router,
  store,
})
app.$mount('#app')
