import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './assets/css/global.css'
import axios from 'axios'
// 导入字体图标
import './assets/fonts/iconfont.css'
axios.defaults.baseURL = 'http://localhost:9999'
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')