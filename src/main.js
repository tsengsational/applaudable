import Vue from 'vue'
import router from './router'
import App from './App.vue'
import VueFire from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { faComment } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'

library.add(
  faEdit,
  faTrashAlt
)

Vue.component('font-awesome-icon', FontAwesomeIcon)

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

const settings = {timestampsInSnapshots: true};
export const db = firebase.firestore()
export const auth = firebase.auth()
export const storage = firebase.storage()
db.settings(settings)


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
    user: {},
  },
  render: function (h) {
    return h('App', {props: {user: this.user}})
  },
  components: {App}
}).$mount('#app')







