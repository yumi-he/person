// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible/flexible.js'
import ElementUI from 'element-ui'
import '../node_modules/element-ui/lib/theme-chalk/index.css'
import {InfiniteScroll,Picker} from 'mint-ui'
import VueClipboard from 'vue-clipboard2'
import 'mint-ui/lib/style.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueClipboard)
Vue.component(Picker.name, Picker)
Vue.use(InfiniteScroll)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
