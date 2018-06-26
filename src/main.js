import Vue from 'vue'
import router from './router'
import App from './App.vue'
import VueFire from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'

Vue.config.productionTip = false

Vue.use(VueFire)
firebase.initializeApp({
  projectId: 'applaudable-4d7ad',
  databaseURL: 'https://applaudable-4d7ad.firebaseio.com'
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

export const db = firebase.firestore()
