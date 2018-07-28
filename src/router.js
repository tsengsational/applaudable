import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login'
import Home from './components/Home'
import ProgramTest from './components/ProgramTest'
import Program from './components/Program'
import Dashboard from './components/Dashboard'
import OrgForm from './components/OrgForm'
import ProgramForm from './components/ProgramForm'
import ProgramEdit from './components/ProgramEdit'
import CreditEditForm from './components/CreditEditForm'
import ProgramEditForm from './components/ProgramEditForm'
import OrgEditForm from './components/OrgEditForm'
import QRCode from './components/QRCode'
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
      name: 'program-test',
      component: ProgramTest
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
    },
    {
      path: "/programs/:id/",
      name: "viewProgram",
      component: Program
    },
    {
      path: "/programs/:id/qr",
      name: "QRProgram",
      component: QRCode
    },
    {
      path: "/programs/:id/edit",
      name: "editProgram",
      component: ProgramEdit,
      beforeEnter: requireAuth
    },
    {
      path: "/programs/:id/edit/form",
      name: "editProgramForm",
      component: ProgramEditForm,
      beforeEnter: requireAuth
    },
    {
      path: "/programs/:programId/:creditType/:id/edit",
      name: "editCredit",
      component: CreditEditForm,
      beforeEnter: requireAuth,
      props: true
    },
    {
      path: "/users/:uid/organizations/:id/edit",
      name: "editOrg",
      component: OrgEditForm,
      beforeEnter: requireAuth,
    }
  ]
})
