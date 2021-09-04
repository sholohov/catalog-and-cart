import Vue from 'vue'
import App from './App.vue'
import apiPlugin from "@/plugins/api"
import "@/assets/styles/vendors.scss"
import "@/assets/styles/main.scss"

Vue.config.productionTip = false
Vue.use(apiPlugin)

new Vue({
  render: h => h(App),
}).$mount('#app')
