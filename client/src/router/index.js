import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Dashboard from '../components/Dashboard'
import Profile from '../components/Profile'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/', component: Login
        },
        {
            path: '/dashboard', component: Dashboard
        },
        {
            name: 'profile', path: '/profile', component: Profile
        }
    ]
})