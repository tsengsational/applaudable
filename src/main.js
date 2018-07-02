import Vue from 'vue'
import router from './router'
import App from './App.vue'
import VueFire from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

Vue.config.productionTip = false

Vue.use(VueFire)
firebase.initializeApp({
  apiKey: "AIzaSyAxEOUFCIpVbh-Wevcm2WNeV0u5hOdjhWU",
  authDomain: "applaudable-4d7ad.firebaseapp.com",
  databaseURL: "https://applaudable-4d7ad.firebaseio.com",
  projectId: "applaudable-4d7ad",
  storageBucket: "applaudable-4d7ad.appspot.com",
  messagingSenderId: "552130165183"
})

new Vue({
  router,
  beforeCreate: function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        this.user = user
      }
    }.bind(this))

  },
  data: {
    user: {}
  },
  render: h => h(App)
}).$mount('#app')

const settings = {timestampsInSnapshots: true};

export const db = firebase.firestore()
db.settings(settings)
export const auth = firebase.auth()
export const storage = firebase.storage()


