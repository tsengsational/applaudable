import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login'
import Home from './components/Home'
import Program from './components/Program'
import Dashboard from './components/Dashboard'
import OrgForm from './components/OrgForm'
import ProgramForm from './components/ProgramForm'

Vue.use(Router)

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
      component: Dashboard
    },
    {
      path: "/organizations/new",
      name: "newOrganizations",
      component: OrgForm
    },
    {
      path: "/programs/new",
      name: "newPrograms",
      component: ProgramForm
    }
  ]
})
