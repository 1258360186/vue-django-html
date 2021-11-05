import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/icon/iconfont.css'
// summernote配置
import 'summernote'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'popper.js'
import 'summernote/dist/summernote.css'
import 'summernote/lang/summernote-zh-CN.js'

//mavonEditor配置
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'


import './assets/css/mystyle.css'


Vue.use(ElementUI)
Vue.use(mavonEditor)
Vue.config.productionTip = false

Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.dataset.title
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
