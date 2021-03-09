import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
console.log(Vuex);

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
