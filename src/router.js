import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login'
import Home from './components/Home'
import Program from './components/Program'
import Dashboard from './components/Dashboard'
import OrgForm from './components/OrgForm'
import ProgramForm from './components/ProgramForm'
import firebase from 'firebase/app'
import 'firebase/auth'

Vue.use(Router)

function requireAuth(to, from, next) {
  if (!firebase.auth().currentUser) {
    console.log("User is not logged in")
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    console.log("User is logged in:", firebase.auth().currentUser.uid);
    next()
  }
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: "/test",
      name: 'program',
      component: Program
    },
    {
      path: "/dashboard",
      name: 'dashboard',
      component: Dashboard,
      beforeEnter: requireAuth
    },
    {
      path: "/organizations/new",
      name: "newOrganizations",
      component: OrgForm,
      beforeEnter: requireAuth
    },
    {
      path: "/programs/new",
      name: "newPrograms",
      component: ProgramForm,
      beforeEnter: requireAuth
    }
  ]
})
