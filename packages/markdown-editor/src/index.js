import { createApp } from 'vue'
import VueRouter from 'vue-router'
import { store } from './store'

import Main from './Main.vue'

import ElementUI from 'element-plus'
import 'element-plus/theme-chalk/index.css'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import "./styles/boot.css"


var routes = [
  {
    path: '/',
    component: Main,
    meta: {
      index: 1,
    },
  },
]

// var winBackgroundPage = chrome.extension.getBackgroundPage()
// var db = winBackgroundPage.db
// window.db = db
var router = new VueRouter({
  routes,
})
const app = createApp({
  router,
  store,
})
app.use(ElementUI)

// use
app.use(mavonEditor)

app.use(VueRouter)

app.mount('#app')
